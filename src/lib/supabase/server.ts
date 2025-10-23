import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Creates a Supabase client for use in Server Components
 * 
 * This client properly handles cookies in the Next.js App Router environment
 * and should be used in Server Components, Server Actions, and Route Handlers.
 * 
 * @returns Supabase client instance for server-side usage
 * 
 * @example
 * // Server Component
 * import { createClient } from '@/lib/supabase/server'
 * 
 * export default async function MyPage() {
 *   const supabase = await createClient()
 *   const { data } = await supabase.from('contacts').select()
 *   return data
 * }
 * 
 * @example
 * // Server Action
 * 'use server'
 * 
 * import { createClient } from '@/lib/supabase/server'
 * 
 * export async function createContact(formData: FormData) {
 *   const supabase = await createClient()
 *   const { data, error } = await supabase
 *     .from('contacts')
 *     .insert({ name: formData.get('name') })
 *   return { data, error }
 * }
 */
export async function createClient() {
  const cookieStore = await cookies()

  // Validate environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Missing Supabase environment variables. ' +
      'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local'
    )
  }

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

