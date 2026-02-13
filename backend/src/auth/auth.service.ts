// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private supabase: SupabaseService,
    private prisma: PrismaService,
  ) {}

  async register(email: string, pass: string, username: string) {
    // 1. Sign up in Supabase
    const { data, error } = await this.supabase.getClient().auth.signUp({
      email,
      password: pass,
      options: {
        data: { full_name: username }, // Store username in Supabase metadata
      },
    });

    if (error) throw new UnauthorizedException(error.message);

    // 2. Safety Check: Ensure data.user exists before Prisma creation
    if (!data || !data.user) {
      throw new UnauthorizedException('User creation failed in Supabase');
    }

    // 3. Create the user in your Prisma Database
    return this.prisma.user.create({
      data: {
        id: data.user.id, // This matches Supabase Auth UID
        email,
        username,
        password: '', // Passwords are NOT stored in Prisma
        isEmailVerified: false,
      },
    });
  }

  async login(email: string, pass: string) {
    const { data, error } = await this.supabase
      .getClient()
      .auth.signInWithPassword({
        email,
        password: pass,
      });

    if (error) throw new UnauthorizedException(error.message);

    // Safety check for null data
    if (!data || !data.user) {
      throw new UnauthorizedException('Invalid login session');
    }

    return data; // Returns the session and access_token (JWT)
  }

  async getGoogleLoginUrl() {
    const { data, error } = await this.supabase
      .getClient()
      .auth.signInWithOAuth({
        provider: 'google',
        options: {
          // This is where Google sends the user AFTER they login
          // It should match what you set in Supabase Redirect URLs
          redirectTo: 'http://localhost:4400/auth/callback',
        },
      });

    if (error) throw new UnauthorizedException(error.message);
    return data.url;
  }

  // 2. This method will be called by our JWT Strategy to keep Prisma in sync
  async syncUserWithPrisma(payload: any) {
    return this.prisma.user.upsert({
      where: { id: payload.sub }, // payload.sub is the Supabase UID
      update: {
        email: payload.email,
        // Update verification status from the JWT
        isEmailVerified: !!payload.email_confirmed_at,
      },
      create: {
        id: payload.sub,
        email: payload.email,
        // For Google users, we take their name from metadata or use email prefix
        username:
          payload.user_metadata?.full_name || payload.email.split('@')[0],
        password: '', // OAuth users don't have a password in our DB
        isEmailVerified: !!payload.email_confirmed_at,
        avatarUrl: payload.user_metadata?.avatar_url || null,
      },
    });
  }
  // NEW METHOD: Verify the 6-digit code
  async verifyOtp(email: string, token: string) {
    const { data, error } = await this.supabase.getClient().auth.verifyOtp({
      email,
      token,
      type: 'signup',
    });

    if (error) throw new UnauthorizedException('Invalid or expired code');

    // SUCCESS: Now update Prisma immediately
    const user = await this.prisma.user.update({
      where: { email },
      data: {
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });

    return { user, session: data.session };
  }
}
