'use client'

import { motion } from 'framer-motion'
import { Check, X, AlertTriangle } from 'lucide-react'
import type { RSVPResponse } from '@/app/actions/admin'

interface RSVPTableProps {
  responses: RSVPResponse[]
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function RSVPTable({ responses }: RSVPTableProps) {
  if (responses.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-stone-100 rounded-full mb-4">
          <AlertTriangle className="w-6 h-6 text-stone-400" />
        </div>
        <p className="text-stone-600">No hay respuestas todavía</p>
        <p className="text-stone-400 text-sm mt-1">
          Las confirmaciones aparecerán aquí cuando los invitados respondan
        </p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden"
    >
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-100">
              <th className="text-left px-4 py-3 text-sm font-medium text-stone-600">Nombre</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-stone-600">Contacto</th>
              <th className="text-center px-4 py-3 text-sm font-medium text-stone-600">Asiste</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-stone-600">Alergias / Menú</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-stone-600">Mensaje</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-stone-600">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {responses.map((response, index) => (
              <tr
                key={response.id}
                className={`border-b border-stone-50 hover:bg-stone-50/50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-stone-50/30'
                }`}
              >
                <td className="px-4 py-3">
                  <span className="font-medium text-stone-800">{response.nombre}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm">
                    {response.email && (
                      <p className="text-stone-600">{response.email}</p>
                    )}
                    {response.telefono && (
                      <p className="text-stone-500">{response.telefono}</p>
                    )}
                    {!response.email && !response.telefono && (
                      <span className="text-stone-400">—</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  {response.asiste ? (
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                      <Check className="w-4 h-4 text-green-600" />
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                      <X className="w-4 h-4 text-red-600" />
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm max-w-xs">
                    {response.alergias && (
                      <p className="text-stone-600">
                        <span className="text-stone-400">Alergias:</span> {response.alergias}
                      </p>
                    )}
                    {response.menu_especial && (
                      <p className="text-stone-600">
                        <span className="text-stone-400">Menú:</span> {response.menu_especial}
                      </p>
                    )}
                    {!response.alergias && !response.menu_especial && (
                      <span className="text-stone-400">—</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {response.mensaje ? (
                    <p className="text-sm text-stone-600 max-w-xs truncate" title={response.mensaje}>
                      {response.mensaje}
                    </p>
                  ) : (
                    <span className="text-stone-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-stone-500">
                    {formatDate(response.created_at)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-stone-100">
        {responses.map((response) => (
          <div key={response.id} className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-medium text-stone-800">{response.nombre}</p>
                {response.email && (
                  <p className="text-sm text-stone-500">{response.email}</p>
                )}
                {response.telefono && (
                  <p className="text-sm text-stone-500">{response.telefono}</p>
                )}
              </div>
              {response.asiste ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  <Check className="w-3 h-3" /> Asiste
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                  <X className="w-3 h-3" /> No asiste
                </span>
              )}
            </div>

            {(response.alergias || response.menu_especial) && (
              <div className="text-sm text-stone-600 mb-2 bg-stone-50 rounded-lg p-2">
                {response.alergias && <p><span className="text-stone-400">Alergias:</span> {response.alergias}</p>}
                {response.menu_especial && <p><span className="text-stone-400">Menú:</span> {response.menu_especial}</p>}
              </div>
            )}

            {response.mensaje && (
              <p className="text-sm text-stone-600 italic mb-2">"{response.mensaje}"</p>
            )}

            <p className="text-xs text-stone-400">{formatDate(response.created_at)}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
