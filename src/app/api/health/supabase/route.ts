import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Supabase Connection Health Check
 * 
 * This endpoint tests the Supabase connection and returns:
 * - Connection status
 * - Environment variables status
 * - Database connectivity
 * 
 * Access at: http://localhost:3000/api/health/supabase
 */
export async function GET() {
  try {
    // Check if environment variables are set
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

    if (!hasUrl || !hasKey) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Missing Supabase environment variables',
          details: {
            hasUrl,
            hasKey,
          },
        },
        { status: 500 }
      )
    }

    // Create Supabase client
    const supabase = await createClient()

    // Test database connection by checking auth status
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    // Try to query the database (this will work even without a session)
    // We're just checking if we can connect, not if tables exist yet
    const { error: healthError } = await supabase
      .from('_supabase_health_check')
      .select('*')
      .limit(1)

    // If we get a "relation does not exist" error, that's actually good - it means we connected!
    const isConnected = !healthError || 
      healthError.code === 'PGRST116' || 
      healthError.code === 'PGRST205' || 
      healthError.message?.includes('does not exist') ||
      healthError.message?.includes('schema cache')

    return NextResponse.json({
      status: isConnected ? 'healthy' : 'error',
      message: isConnected ? 'Supabase connection successful' : 'Failed to connect to Supabase',
      environment: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
        keyConfigured: hasKey,
      },
      connection: {
        connected: isConnected,
        authenticated: !!session,
      },
      debug: healthError ? {
        code: healthError.code,
        message: healthError.message,
      } : null,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Unexpected error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

