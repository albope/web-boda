'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { verifyAdminPassword } from '@/app/actions/admin'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const result = await verifyAdminPassword(password)

    if (result.success) {
      router.push('/admin/dashboard')
    } else {
      setError(result.error || 'Error al iniciar sesión')
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-cream-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-100 rounded-full mb-4">
              <Lock className="w-8 h-8 text-gold-400" />
            </div>
            <h1 className="font-display text-2xl text-stone-800 mb-2">
              Panel de Administración
            </h1>
            <p className="text-stone-500 text-sm">
              Introduce la contraseña para acceder
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="password"
              label="Contraseña"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error || undefined}
              required
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              Acceder
            </Button>
          </form>
        </div>

        <p className="text-center text-stone-400 text-sm mt-6">
          Alberto & Carmen · Boda 2026
        </p>
      </motion.div>
    </main>
  )
}
