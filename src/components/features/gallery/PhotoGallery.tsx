"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Camera, Clock } from "lucide-react";
import {
  getGalleryPhotos,
  likePhoto,
  unlikePhoto,
} from "@/app/actions/gallery";
import {
  isGalleryEnabled,
  type GalleryPhoto,
  type GalleryEnabledResult,
} from "@/lib/gallery";
import { PhotoUpload } from "./PhotoUpload";
import { PhotoLightbox } from "./PhotoLightbox";
import { WEDDING_CONFIG } from "@/config/wedding";

const LIKED_PHOTOS_KEY = "wedding_gallery_liked_photos";

function getLikedPhotosFromStorage(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const stored = localStorage.getItem(LIKED_PHOTOS_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

function saveLikedPhotosToStorage(likedPhotos: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LIKED_PHOTOS_KEY, JSON.stringify(Array.from(likedPhotos)));
  } catch {
    // Ignorar errores de localStorage
  }
}

export function PhotoGallery() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [galleryStatus, setGalleryStatus] = useState<GalleryEnabledResult | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Cargar estado de la galería y fotos
    const status = isGalleryEnabled();
    setGalleryStatus(status);

    if (status.enabled) {
      loadPhotos();
    } else {
      setIsLoading(false);
    }

    // Cargar likes del localStorage
    setLikedPhotos(getLikedPhotosFromStorage());
  }, []);

  const loadPhotos = async () => {
    setIsLoading(true);
    const result = await getGalleryPhotos();

    if (!result.success) {
      setError(result.error || "Error al cargar las fotos");
    } else {
      setPhotos(result.data || []);
    }

    setIsLoading(false);
  };

  const handlePhotoUploaded = useCallback((newPhoto: GalleryPhoto) => {
    setPhotos((prev) => [newPhoto, ...prev]);
  }, []);

  const handleLike = useCallback(
    async (photoId: string) => {
      const isCurrentlyLiked = likedPhotos.has(photoId);

      // Actualización optimista
      setLikedPhotos((prev) => {
        const newSet = new Set(prev);
        if (isCurrentlyLiked) {
          newSet.delete(photoId);
        } else {
          newSet.add(photoId);
        }
        saveLikedPhotosToStorage(newSet);
        return newSet;
      });

      setPhotos((prev) =>
        prev.map((photo) =>
          photo.id === photoId
            ? { ...photo, likes: photo.likes + (isCurrentlyLiked ? -1 : 1) }
            : photo
        )
      );

      // Actualizar en servidor
      const result = isCurrentlyLiked
        ? await unlikePhoto(photoId)
        : await likePhoto(photoId);

      if (!result.success) {
        // Revertir si hay error
        setLikedPhotos((prev) => {
          const newSet = new Set(prev);
          if (isCurrentlyLiked) {
            newSet.add(photoId);
          } else {
            newSet.delete(photoId);
          }
          saveLikedPhotosToStorage(newSet);
          return newSet;
        });

        setPhotos((prev) =>
          prev.map((photo) =>
            photo.id === photoId
              ? { ...photo, likes: photo.likes + (isCurrentlyLiked ? 1 : -1) }
              : photo
          )
        );
      }
    },
    [likedPhotos]
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    });
  };

  // Si la galería no está habilitada, mostrar mensaje de espera
  if (galleryStatus && !galleryStatus.enabled) {
    const enabledDate = new Date(WEDDING_CONFIG.gallery.enabledFrom);
    const formattedDate = enabledDate.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return (
      <section className="py-16 sm:py-20 bg-gradient-to-b from-cream-50 to-cream-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mx-auto w-20 h-20 rounded-full bg-gold-100 flex items-center justify-center mb-6">
              <Clock className="w-10 h-10 text-gold-400" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-stone-800 mb-4">
              Galería de Fotos
            </h2>
            <p className="text-stone-600 text-lg mb-6">
              La galería colaborativa estará disponible a partir del
            </p>
            <p className="text-2xl font-serif text-gold-400">{formattedDate}</p>
            <p className="text-stone-500 mt-6 max-w-md mx-auto">
              Podrás compartir tus fotos del día de la boda con todos los
              invitados. ¡No olvides traer tu cámara o móvil!
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-cream-50 to-cream-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="mx-auto w-16 h-16 rounded-full bg-gold-100 flex items-center justify-center mb-4">
            <Camera className="w-8 h-8 text-gold-400" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-stone-800 mb-4">
            Galería de Fotos
          </h2>
          <p className="text-stone-600 max-w-md mx-auto">
            Comparte tus mejores momentos de la boda con todos los invitados
          </p>
        </motion.div>

        {/* Formulario de subida */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-md mx-auto mb-12"
        >
          <PhotoUpload onPhotoUploaded={handlePhotoUploaded} />
        </motion.div>

        {/* Grid de fotos */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-gold-300 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-stone-500">Cargando fotos...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <button
              onClick={loadPhotos}
              className="mt-4 text-gold-400 hover:text-gold-500 underline"
            >
              Reintentar
            </button>
          </div>
        ) : photos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-2xl shadow-sm"
          >
            <Camera className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-500">
              Aún no hay fotos. ¡Sé el primero en compartir!
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {photos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="relative group aspect-square bg-stone-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img
                    src={photo.url}
                    alt={photo.caption || `Foto de ${photo.uploaded_by}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Overlay con info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-sm font-medium truncate">
                        {photo.uploaded_by}
                      </p>
                      <p className="text-white/70 text-xs">
                        {formatDate(photo.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Botón de like */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(photo.id);
                    }}
                    className={`absolute top-2 right-2 p-2 rounded-full transition-all ${
                      likedPhotos.has(photo.id)
                        ? "bg-red-500 text-white"
                        : "bg-black/30 text-white hover:bg-black/50"
                    }`}
                    aria-label={
                      likedPhotos.has(photo.id)
                        ? "Quitar me gusta"
                        : "Me gusta"
                    }
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        likedPhotos.has(photo.id) ? "fill-current" : ""
                      }`}
                    />
                  </button>

                  {/* Contador de likes */}
                  {photo.likes > 0 && (
                    <div className="absolute top-2 left-2 bg-black/30 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Heart className="w-3 h-3 fill-current" />
                      {photo.likes}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Lightbox */}
        <PhotoLightbox
          photo={selectedPhoto}
          photos={photos}
          isOpen={!!selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onNavigate={setSelectedPhoto}
          onLike={handleLike}
          likedPhotos={likedPhotos}
        />
      </div>
    </section>
  );
}
