import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipo para las respuestas del formulario RSVP
export interface RSVPResponse {
  id?: string
  nombre: string
  email?: string
  telefono?: string
  asiste: boolean
  alergias?: string
  menu_especial?: string
  mensaje?: string
  created_at?: string
}
