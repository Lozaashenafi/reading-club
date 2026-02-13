// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SupabaseService } from './supabase.service';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [AuthService, SupabaseService, JwtStrategy, PrismaService],
  controllers: [AuthController],
})
export class AuthModule {}
