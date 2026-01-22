import { redirect } from 'next/navigation'
import { isAuthenticated, getRSVPResponses, getRSVPStats } from '@/app/actions/admin'
import { getGalleryPhotos } from '@/app/actions/gallery'
import { DashboardClient } from './DashboardClient'

export default async function AdminDashboardPage() {
  const authenticated = await isAuthenticated()

  if (!authenticated) {
    redirect('/admin')
  }

  const [responses, stats, galleryResult] = await Promise.all([
    getRSVPResponses(),
    getRSVPStats(),
    getGalleryPhotos(),
  ])

  const galleryPhotos = galleryResult.success ? galleryResult.data || [] : []

  return <DashboardClient responses={responses} stats={stats} galleryPhotos={galleryPhotos} />
}
