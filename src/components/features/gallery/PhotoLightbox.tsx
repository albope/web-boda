"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import type { GalleryPhoto } from "@/lib/gallery";

interface PhotoLightboxProps {
  photo: GalleryPhoto | null;
  photos: GalleryPhoto[];
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (photo: GalleryPhoto) => void;
  onLike?: (photoId: string) => void;
  likedPhotos?: Set<string>;
}

export function PhotoLightbox({
  photo,
  photos,
  isOpen,
  onClose,
  onNavigate,
  onLike,
  likedPhotos,
}: PhotoLightboxProps) {
  const currentIndex = photo ? photos.findIndex((p) => p.id === photo.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;
  const isLiked = photo ? likedPhotos?.has(photo.id) : false;

  const navigatePrev = useCallback(() => {
    if (hasPrev) {
      onNavigate(photos[currentIndex - 1]);
    }
  }, [hasPrev, currentIndex, photos, onNavigate]);

  const navigateNext = useCallback(() => {
    if (hasNext) {
      onNavigate(photos[currentIndex + 1]);
    }
  }, [hasNext, currentIndex, photos, onNavigate]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          navigatePrev();
          break;
        case "ArrowRight":
          navigateNext();
          break;
      }
    },
    [isOpen, onClose, navigatePrev, navigateNext]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AnimatePresence>
      {isOpen && photo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/90" />

          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10"
            aria-label="Cerrar"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navegación izquierda */}
          {hasPrev && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigatePrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>
          )}

          {/* Navegación derecha */}
          {hasNext && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10"
              aria-label="Foto siguiente"
            >
              <ChevronRight className="w-10 h-10" />
            </button>
          )}

          {/* Contenido */}
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Imagen */}
            <img
              src={photo.url}
              alt={photo.caption || `Foto de ${photo.uploaded_by}`}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />

            {/* Info de la foto */}
            <div className="mt-4 text-center text-white max-w-lg">
              <div className="flex items-center justify-center gap-4 mb-2">
                <span className="font-medium">{photo.uploaded_by}</span>
                {onLike && (
                  <button
                    onClick={() => onLike(photo.id)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all ${
                      isLiked
                        ? "bg-red-500 text-white"
                        : "bg-white/20 hover:bg-white/30"
                    }`}
                    aria-label={isLiked ? "Quitar me gusta" : "Me gusta"}
                  >
                    <Heart
                      className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
                    />
                    <span>{photo.likes}</span>
                  </button>
                )}
              </div>
              {photo.caption && (
                <p className="text-white/90 text-sm mb-2">{photo.caption}</p>
              )}
              <p className="text-white/60 text-xs">
                {formatDate(photo.created_at)}
              </p>
            </div>

            {/* Contador */}
            <div className="mt-4 text-white/60 text-sm">
              {currentIndex + 1} / {photos.length}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
