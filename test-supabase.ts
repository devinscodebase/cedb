/**
 * Supabase Connection Test Script
 * 
 * Run with: bun run test-supabase.ts
 */

import { createClient } from '@supabase/supabase-js'

console.log('🔍 Testing Supabase Connection...\n')

// Check environment variables
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

console.log('Environment Variables:')
console.log('  URL:', url ? `${url.substring(0, 30)}...` : '❌ NOT SET')
console.log('  Key:', key ? `${key.substring(0, 20)}...` : '❌ NOT SET')
console.log('  Key length:', key?.length || 0)
console.log('')

if (!url || !key) {
  console.error('❌ Missing environment variables!')
  console.log('\nMake sure .env.local exists and contains:')
  console.log('  NEXT_PUBLIC_SUPABASE_URL=your-url')
  console.log('  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-key')
  process.exit(1)
}

// Test connection
console.log('🔗 Attempting to connect...\n')

try {
  const supabase = createClient(url, key)
  
  console.log('✅ Client created successfully')
  
  // Test basic query
  console.log('📡 Testing database query...')
  const { data, error } = await supabase
    .from('_test_table_that_does_not_exist')
    .select('*')
    .limit(1)
  
  if (error) {
    console.log('Error code:', error.code)
    console.log('Error message:', error.message)
    
    // Expected errors that indicate successful connection:
    if (error.code === 'PGRST116' || error.code === 'PGRST205' || error.message.includes('does not exist') || error.message.includes('schema cache')) {
      console.log('\n✅ CONNECTION SUCCESSFUL!')
      console.log('(Table not found is expected - this confirms we can reach the database)')
    } else if (error.message.includes('API key')) {
      console.log('\n❌ AUTHENTICATION FAILED')
      console.log('Your API key may be invalid or expired')
    } else {
      console.log('\n❌ UNEXPECTED ERROR')
      console.log('Details:', error)
    }
  } else {
    console.log('\n✅ CONNECTION SUCCESSFUL!')
  }
} catch (err) {
  console.error('\n❌ CONNECTION FAILED')
  console.error('Error:', err instanceof Error ? err.message : err)
}

