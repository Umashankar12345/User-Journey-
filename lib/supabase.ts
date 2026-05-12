import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Service role client for server-side operations
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export type Database = {
  public: {
    Tables: {
      audits: {
        Row: {
          id: string;
          inputs: any;
          findings: any;
          created_at: string;
          total_current_spend: number;
          total_potential_savings: number;
        };
        Insert: {
          id?: string;
          inputs: any;
          findings: any;
          created_at?: string;
          total_current_spend: number;
          total_potential_savings: number;
        };
        Update: {
          id?: string;
          inputs?: any;
          findings?: any;
          created_at?: string;
          total_current_spend?: number;
          total_potential_savings?: number;
        };
      };
      leads: {
        Row: {
          id: string;
          email: string;
          company_name: string | null;
          role: string | null;
          audit_id: string;
          total_savings: number;
          high_savings_flag: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          company_name?: string | null;
          role?: string | null;
          audit_id: string;
          total_savings: number;
          high_savings_flag?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          company_name?: string | null;
          role?: string | null;
          audit_id?: string;
          total_savings?: number;
          high_savings_flag?: boolean;
          created_at?: string;
        };
      };
    };
  };
};
