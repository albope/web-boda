'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LogOut, Download, RefreshCw, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { RSVPStats } from '@/components/features/admin/RSVPStats'
import { RSVPTable } from '@/components/features/admin/RSVPTable'
import { GalleryManager } from '@/components/features/admin/GalleryManager'
import { logout } from '@/app/actions/admin'
import type { RSVPResponse, RSVPStats as RSVPStatsType } from '@/app/actions/admin'
import type { GalleryPhoto } from '@/lib/gallery'

interface DashboardClientProps {
  responses: RSVPResponse[]
  stats: RSVPStatsType
  galleryPhotos: GalleryPhoto[]
}

function exportToCSV(responses: RSVPResponse[]) {
  const headers = ['Nombre', 'Email', 'Teléfono', 'Asiste', 'Alergias', 'Menú especial', 'Mensaje', 'Fecha']

  const rows = responses.map(r => [
    r.nombre,
    r.email || '',
    r.telefono || '',
    r.asiste ? 'Sí' : 'No',
    r.alergias || '',
    r.menu_especial || '',
    r.mensaje || '',
    new Date(r.created_at).toLocaleDateString('es-ES'),
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
  ].join('\n')

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `rsvp_boda_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
}

export function DashboardClient({ responses, stats, galleryPhotos }: DashboardClientProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/admin')
  }

  const handleRefresh = () => {
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-cream-100">
      {/* Header */}
      <header className="bg-white border-b border-stone-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl text-stone-800">Panel de Admin</h1>
            <p className="text-sm text-stone-500">Alberto & Carmen · Boda 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              title="Actualizar datos"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Stats */}
          <section>
            <h2 className="font-display text-lg text-stone-800 mb-4">Resumen</h2>
            <RSVPStats stats={stats} />
          </section>

          {/* Actions */}
          <section className="flex items-center justify-between">
            <h2 className="font-display text-lg text-stone-800">
              Respuestas ({responses.length})
            </h2>
            {responses.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportToCSV(responses)}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
            )}
          </section>

          {/* Table */}
          <RSVPTable responses={responses} />

          {/* Gallery Section */}
          <section className="pt-8 border-t border-stone-200">
            <div className="flex items-center gap-3 mb-4">
              <ImageIcon className="w-5 h-5 text-gold-400" />
              <h2 className="font-display text-lg text-stone-800">
                Galería de Fotos ({galleryPhotos.length})
              </h2>
            </div>
            <GalleryManager initialPhotos={galleryPhotos} />
          </section>
        </motion.div>
      </div>
    </main>
  )
}
