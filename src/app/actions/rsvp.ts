'use server'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface RSVPFormData {
  nombre: string
  email?: string
  telefono?: string
  asiste: boolean
  alergias?: string
  menuEspecial?: string
  mensaje?: string
}

export interface RSVPResult {
  success: boolean
  error?: string
}

export async function submitRSVP(data: RSVPFormData): Promise<RSVPResult> {
  try {
    const { error } = await supabase.from('rsvp_responses').insert({
      nombre: data.nombre,
      email: data.email || null,
      telefono: data.telefono || null,
      asiste: data.asiste,
      alergias: data.alergias || null,
      menu_especial: data.menuEspecial || null,
      mensaje: data.mensaje || null,
    })

    if (error) {
      console.error('Error al guardar RSVP:', error)
      return { success: false, error: 'Error al guardar la confirmación' }
    }

    return { success: true }
  } catch (err) {
    console.error('Error inesperado:', err)
    return { success: false, error: 'Error inesperado al procesar la solicitud' }
  }
}
