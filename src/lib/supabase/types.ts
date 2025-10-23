/**
 * Database type definitions
 * 
 * This file contains TypeScript types for your Supabase database schema.
 * These types should be generated from your actual database schema using:
 * 
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/types.ts
 * 
 * Or if using Supabase CLI:
 * supabase gen types typescript --local > src/lib/supabase/types.ts
 * 
 * For now, we'll define a basic structure that can be replaced with
 * generated types once your database schema is finalized.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

/**
 * Database schema interface
 * Replace this with generated types from your Supabase project
 */
export interface Database {
  public: {
    Tables: {
      contacts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          company_name: string
          industry: string
          state: string
          status: string
          first_name: string | null
          last_name: string | null
          job_title: string | null
          phone: string | null
          website: string | null
          notes: string | null
          deleted_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          email: string
          company_name: string
          industry: string
          state: string
          status?: string
          first_name?: string | null
          last_name?: string | null
          job_title?: string | null
          phone?: string | null
          website?: string | null
          notes?: string | null
          deleted_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          company_name?: string
          industry?: string
          state?: string
          status?: string
          first_name?: string | null
          last_name?: string | null
          job_title?: string | null
          phone?: string | null
          website?: string | null
          notes?: string | null
          deleted_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

/**
 * Helper type for typed Supabase client
 * 
 * @example
 * ```tsx
 * import { SupabaseClient } from '@supabase/supabase-js'
 * import { Database } from '@/lib/supabase/types'
 * 
 * const supabase: SupabaseClient<Database> = createClient()
 * ```
 */
export type TypedSupabaseClient = import('@supabase/supabase-js').SupabaseClient<Database>

