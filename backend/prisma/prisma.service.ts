// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // 1. Create a connection pool using the DATABASE_URL
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    // 2. Create the Prisma Adapter
    const adapter = new PrismaPg(pool);

    // 3. Pass the adapter to the PrismaClient constructor
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ Prisma 7 connected to Supabase via PG Adapter');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
