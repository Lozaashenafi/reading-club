// src/auth/supabase.service.ts
import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabaseClient: SupabaseClient;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error('Supabase URL or Key is missing in .env');
    }

    this.supabaseClient = createClient(url, key);
  }

  // Use a method to avoid private property leakage errors
  getClient() {
    return this.supabaseClient;
  }
}
