import { WEDDING_CONFIG } from '@/config/wedding'

export interface GalleryPhoto {
  id: string
  storage_path: string
  url: string
  caption: string | null
  uploaded_by: string
  likes: number
  created_at: string
}

export interface UploadPhotoData {
  fileName: string
  fileBase64: string
  mimeType: string
  caption?: string
  uploadedBy: string
}

export interface GalleryResult {
  success: boolean
  error?: string
  data?: GalleryPhoto
}

export interface GetPhotosResult {
  success: boolean
  error?: string
  data?: GalleryPhoto[]
}

export interface LikeResult {
  success: boolean
  error?: string
  newLikes?: number
}

export interface DeleteResult {
  success: boolean
  error?: string
}

export interface GalleryEnabledResult {
  enabled: boolean
  enabledFrom: string
  message?: string
}

export function isGalleryEnabled(): GalleryEnabledResult {
  const now = new Date()
  const enabledFrom = new Date(WEDDING_CONFIG.gallery.enabledFrom)
  const enabled = now >= enabledFrom

  if (!enabled) {
    return {
      enabled: false,
      enabledFrom: WEDDING_CONFIG.gallery.enabledFrom,
      message: 'La galería estará disponible a partir del 13 de noviembre de 2026',
    }
  }

  return {
    enabled: true,
    enabledFrom: WEDDING_CONFIG.gallery.enabledFrom,
  }
}
