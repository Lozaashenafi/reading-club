// src/app.module.ts
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module'; // Import your AuthModule
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [PrismaService], // <--- IMPORTANT
})
export class AppModule {}
