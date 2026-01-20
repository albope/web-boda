import { redirect } from 'next/navigation'
import { isAuthenticated, getRSVPResponses, getRSVPStats } from '@/app/actions/admin'
import { DashboardClient } from './DashboardClient'

export default async function AdminDashboardPage() {
  const authenticated = await isAuthenticated()

  if (!authenticated) {
    redirect('/admin')
  }

  const [responses, stats] = await Promise.all([
    getRSVPResponses(),
    getRSVPStats(),
  ])

  return <DashboardClient responses={responses} stats={stats} />
}
