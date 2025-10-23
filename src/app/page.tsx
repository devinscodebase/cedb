import { redirect } from 'next/navigation'

/**
 * Root Page
 * 
 * Redirects to the dashboard
 */
export default function HomePage() {
  redirect('/dashboard')
}
