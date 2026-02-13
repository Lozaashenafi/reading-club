// src/main.ts
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // <--- CHECK IF THIS EXISTS
  // Update CORS to allow your Frontend (3000)
  app.enableCors({
    origin: 'http://localhost:3000', // This MUST be your Next.js URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  await app.listen(4400); // Your backend is on 4400
  console.log(`Backend is running on: http://localhost:4400`);
}
bootstrap();
