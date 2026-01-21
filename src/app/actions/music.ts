'use server'

import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables not configured')
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

export interface MusicRequest {
  id: string
  song_title: string
  artist: string
  requested_by: string
  created_at: string
}

export interface MusicRequestFormData {
  songTitle: string
  artist: string
  requestedBy: string
}

export interface MusicRequestResult {
  success: boolean
  error?: string
  data?: MusicRequest
}

export interface GetMusicRequestsResult {
  success: boolean
  error?: string
  data?: MusicRequest[]
}

export async function submitMusicRequest(data: MusicRequestFormData): Promise<MusicRequestResult> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase no está configurado. Faltan variables de entorno.')
      return { success: false, error: 'El sistema no está configurado. Por favor, contacta a los novios.' }
    }

    const supabase = getSupabase()
    const { data: insertedData, error } = await supabase
      .from('music_requests')
      .insert({
        song_title: data.songTitle.trim(),
        artist: data.artist.trim(),
        requested_by: data.requestedBy.trim(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error al guardar petición musical:', error)
      if (error.code === '42501') {
        return { success: false, error: 'No tienes permisos para enviar la petición. Contacta a los novios.' }
      }
      return { success: false, error: 'Error al guardar la petición. Inténtalo de nuevo.' }
    }

    return { success: true, data: insertedData }
  } catch (err) {
    console.error('Error inesperado:', err)
    return { success: false, error: 'Error inesperado al procesar la solicitud. Inténtalo de nuevo más tarde.' }
  }
}

export async function getMusicRequests(): Promise<GetMusicRequestsResult> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return { success: false, error: 'El sistema no está configurado.' }
    }

    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('music_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error al obtener peticiones musicales:', error)
      return { success: false, error: 'Error al cargar las canciones.' }
    }

    return { success: true, data: data || [] }
  } catch (err) {
    console.error('Error inesperado:', err)
    return { success: false, error: 'Error inesperado al cargar las canciones.' }
  }
}
