'use client'

import { motion } from 'framer-motion'
import { Users, UserCheck, UserX, Utensils } from 'lucide-react'
import type { RSVPStats } from '@/app/actions/admin'

interface RSVPStatsProps {
  stats: RSVPStats
}

const statCards = [
  {
    key: 'total',
    label: 'Total respuestas',
    icon: Users,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    key: 'confirmados',
    label: 'Confirmados',
    icon: UserCheck,
    color: 'bg-green-100 text-green-600',
  },
  {
    key: 'noAsisten',
    label: 'No asisten',
    icon: UserX,
    color: 'bg-red-100 text-red-600',
  },
  {
    key: 'conMenuEspecial',
    label: 'Menú especial',
    icon: Utensils,
    color: 'bg-amber-100 text-amber-600',
  },
] as const

export function RSVPStats({ stats }: RSVPStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, index) => {
        const Icon = card.icon
        const value = stats[card.key]

        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-xl p-5 shadow-sm"
          >
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${card.color} mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-semibold text-stone-800">{value}</p>
            <p className="text-sm text-stone-500">{card.label}</p>
          </motion.div>
        )
      })}
    </div>
  )
}
