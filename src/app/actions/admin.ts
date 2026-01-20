'use server'

import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const SESSION_COOKIE_NAME = 'admin_session'
const SESSION_VALUE = 'authenticated'

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables not configured')
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

export interface RSVPResponse {
  id: string
  nombre: string
  email: string | null
  telefono: string | null
  asiste: boolean
  alergias: string | null
  menu_especial: string | null
  mensaje: string | null
  created_at: string
}

export interface LoginResult {
  success: boolean
  error?: string
}

export async function verifyAdminPassword(password: string): Promise<LoginResult> {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

  if (password === adminPassword) {
    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, SESSION_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 horas
      path: '/',
    })
    return { success: true }
  }

  return { success: false, error: 'Contraseña incorrecta' }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE_NAME)
  return session?.value === SESSION_VALUE
}

export async function getRSVPResponses(): Promise<RSVPResponse[]> {
  const authenticated = await isAuthenticated()

  if (!authenticated) {
    return []
  }

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('rsvp_responses')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error al obtener RSVPs:', error)
    return []
  }

  return data || []
}

export interface RSVPStats {
  total: number
  confirmados: number
  noAsisten: number
  conAlergias: number
  conMenuEspecial: number
}

export async function getRSVPStats(): Promise<RSVPStats> {
  const responses = await getRSVPResponses()

  return {
    total: responses.length,
    confirmados: responses.filter(r => r.asiste).length,
    noAsisten: responses.filter(r => !r.asiste).length,
    conAlergias: responses.filter(r => r.asiste && r.alergias).length,
    conMenuEspecial: responses.filter(r => r.asiste && r.menu_especial).length,
  }
}
