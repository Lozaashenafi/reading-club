import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

interface AuthenticatedUser {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  isEmailVerified: boolean;
}

// 2. Extend the Express Request
interface RequestWithUser extends Request {
  user: AuthenticatedUser;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('google')
  async googleLogin() {
    const url = await this.authService.getGoogleLoginUrl();
    return { url };
  }

  // This is a simple endpoint to handle the redirect from Supabase
  @Get('callback')
  callback() {
    return { message: 'Login successful! You can now use your access token.' };
  }

  @Post('register')
  register(@Body() body: any) {
    return this.authService.register(body.email, body.password, body.username);
  }

  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body.email, body.password);
  }
  @Post('verify')
  async verify(@Body() body: { email: string; code: string }) {
    return this.authService.verifyOtp(body.email, body.code);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@Req() req: RequestWithUser) {
    // 3. Use your custom interface here
    return req.user;
  }
}
