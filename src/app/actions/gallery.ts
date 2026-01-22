'use server'

import { createClient } from '@supabase/supabase-js'
import { WEDDING_CONFIG } from '@/config/wedding'
import { isGalleryEnabled } from '@/lib/gallery'
import type {
  UploadPhotoData,
  GalleryResult,
  GetPhotosResult,
  LikeResult,
  DeleteResult,
} from '@/lib/gallery'
import { isAuthenticated } from './admin'

// Re-exportar tipos para uso en componentes
export type { GalleryPhoto, UploadPhotoData, GalleryResult, GetPhotosResult, LikeResult, DeleteResult } from '@/lib/gallery'

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables not configured')
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

export async function uploadPhoto(data: UploadPhotoData): Promise<GalleryResult> {
  try {
    // Verificar que la galería está habilitada
    const galleryStatus = isGalleryEnabled()
    if (!galleryStatus.enabled) {
      return { success: false, error: galleryStatus.message }
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase no está configurado. Faltan variables de entorno.')
      return { success: false, error: 'El sistema no está configurado. Por favor, contacta a los novios.' }
    }

    const supabase = getSupabase()

    // Decodificar base64 a Buffer
    const base64Data = data.fileBase64.split(',')[1] || data.fileBase64
    const buffer = Buffer.from(base64Data, 'base64')

    // Generar nombre único para el archivo
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 8)
    const extension = data.mimeType.split('/')[1] || 'jpg'
    const storagePath = `photos/${timestamp}-${randomId}.${extension}`

    // Subir archivo a Storage
    const { error: uploadError } = await supabase.storage
      .from(WEDDING_CONFIG.gallery.storageBucket)
      .upload(storagePath, buffer, {
        contentType: data.mimeType,
        cacheControl: '31536000', // 1 año de caché
      })

    if (uploadError) {
      console.error('Error al subir imagen:', uploadError)
      return { success: false, error: 'Error al subir la imagen. Inténtalo de nuevo.' }
    }

    // Obtener URL pública
    const { data: publicUrlData } = supabase.storage
      .from(WEDDING_CONFIG.gallery.storageBucket)
      .getPublicUrl(storagePath)

    const publicUrl = publicUrlData.publicUrl

    // Insertar registro en la base de datos
    const { data: insertedData, error: insertError } = await supabase
      .from('gallery_photos')
      .insert({
        storage_path: storagePath,
        url: publicUrl,
        caption: data.caption?.trim() || null,
        uploaded_by: data.uploadedBy.trim(),
        likes: 0,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error al guardar en base de datos:', insertError)
      // Intentar eliminar el archivo subido si falla la inserción
      await supabase.storage
        .from(WEDDING_CONFIG.gallery.storageBucket)
        .remove([storagePath])

      if (insertError.code === '42501') {
        return { success: false, error: 'No tienes permisos para subir fotos. Contacta a los novios.' }
      }
      return { success: false, error: 'Error al guardar la foto. Inténtalo de nuevo.' }
    }

    return { success: true, data: insertedData }
  } catch (err) {
    console.error('Error inesperado:', err)
    return { success: false, error: 'Error inesperado al procesar la imagen. Inténtalo de nuevo más tarde.' }
  }
}

export async function getGalleryPhotos(): Promise<GetPhotosResult> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return { success: false, error: 'El sistema no está configurado.' }
    }

    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('gallery_photos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error al obtener fotos:', error)
      return { success: false, error: 'Error al cargar las fotos.' }
    }

    return { success: true, data: data || [] }
  } catch (err) {
    console.error('Error inesperado:', err)
    return { success: false, error: 'Error inesperado al cargar las fotos.' }
  }
}

export async function likePhoto(photoId: string): Promise<LikeResult> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return { success: false, error: 'El sistema no está configurado.' }
    }

    const supabase = getSupabase()

    // Obtener likes actuales
    const { data: currentData, error: fetchError } = await supabase
      .from('gallery_photos')
      .select('likes')
      .eq('id', photoId)
      .single()

    if (fetchError) {
      console.error('Error al obtener foto:', fetchError)
      return { success: false, error: 'Error al procesar el like.' }
    }

    const newLikes = (currentData?.likes || 0) + 1

    // Actualizar likes
    const { error: updateError } = await supabase
      .from('gallery_photos')
      .update({ likes: newLikes })
      .eq('id', photoId)

    if (updateError) {
      console.error('Error al actualizar likes:', updateError)
      return { success: false, error: 'Error al guardar el like.' }
    }

    return { success: true, newLikes }
  } catch (err) {
    console.error('Error inesperado:', err)
    return { success: false, error: 'Error inesperado al procesar el like.' }
  }
}

export async function unlikePhoto(photoId: string): Promise<LikeResult> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return { success: false, error: 'El sistema no está configurado.' }
    }

    const supabase = getSupabase()

    // Obtener likes actuales
    const { data: currentData, error: fetchError } = await supabase
      .from('gallery_photos')
      .select('likes')
      .eq('id', photoId)
      .single()

    if (fetchError) {
      console.error('Error al obtener foto:', fetchError)
      return { success: false, error: 'Error al procesar el unlike.' }
    }

    const newLikes = Math.max(0, (currentData?.likes || 0) - 1)

    // Actualizar likes
    const { error: updateError } = await supabase
      .from('gallery_photos')
      .update({ likes: newLikes })
      .eq('id', photoId)

    if (updateError) {
      console.error('Error al actualizar likes:', updateError)
      return { success: false, error: 'Error al guardar el unlike.' }
    }

    return { success: true, newLikes }
  } catch (err) {
    console.error('Error inesperado:', err)
    return { success: false, error: 'Error inesperado al procesar el unlike.' }
  }
}

export async function deletePhoto(photoId: string): Promise<DeleteResult> {
  try {
    // Verificar autenticación de admin
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return { success: false, error: 'No tienes permisos para eliminar fotos.' }
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return { success: false, error: 'El sistema no está configurado.' }
    }

    const supabase = getSupabase()

    // Obtener la foto para conseguir el storage_path
    const { data: photoData, error: fetchError } = await supabase
      .from('gallery_photos')
      .select('storage_path')
      .eq('id', photoId)
      .single()

    if (fetchError) {
      console.error('Error al obtener foto:', fetchError)
      return { success: false, error: 'Foto no encontrada.' }
    }

    // Eliminar del Storage
    const { error: storageError } = await supabase.storage
      .from(WEDDING_CONFIG.gallery.storageBucket)
      .remove([photoData.storage_path])

    if (storageError) {
      console.error('Error al eliminar de storage:', storageError)
      // Continuamos para eliminar de la base de datos de todas formas
    }

    // Eliminar de la base de datos
    const { error: deleteError } = await supabase
      .from('gallery_photos')
      .delete()
      .eq('id', photoId)

    if (deleteError) {
      console.error('Error al eliminar de base de datos:', deleteError)
      return { success: false, error: 'Error al eliminar la foto.' }
    }

    return { success: true }
  } catch (err) {
    console.error('Error inesperado:', err)
    return { success: false, error: 'Error inesperado al eliminar la foto.' }
  }
}
