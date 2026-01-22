"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Image as ImageIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { deletePhoto } from "@/app/actions/gallery";
import type { GalleryPhoto } from "@/lib/gallery";

interface GalleryManagerProps {
  initialPhotos: GalleryPhoto[];
}

export function GalleryManager({ initialPhotos }: GalleryManagerProps) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(initialPhotos);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (photoId: string) => {
    if (!confirm("¿Seguro que quieres eliminar esta foto?")) {
      return;
    }

    setDeletingId(photoId);
    setError(null);

    const result = await deletePhoto(photoId);

    if (result.success) {
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    } else {
      setError(result.error || "Error al eliminar la foto");
    }

    setDeletingId(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (photos.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center">
        <ImageIcon className="w-12 h-12 text-stone-300 mx-auto mb-4" />
        <p className="text-stone-500">No hay fotos en la galería</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-stone-600">
                  Foto
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-stone-600">
                  Subida por
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-stone-600">
                  Caption
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-stone-600">
                  Likes
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-stone-600">
                  Fecha
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-stone-600">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              <AnimatePresence>
                {photos.map((photo) => (
                  <motion.tr
                    key={photo.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="hover:bg-stone-50"
                  >
                    <td className="px-4 py-3">
                      <a
                        href={photo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-16 h-16 rounded-lg overflow-hidden bg-stone-100"
                      >
                        <img
                          src={photo.url}
                          alt={photo.caption || "Foto"}
                          className="w-full h-full object-cover"
                        />
                      </a>
                    </td>
                    <td className="px-4 py-3 text-sm text-stone-700">
                      {photo.uploaded_by}
                    </td>
                    <td className="px-4 py-3 text-sm text-stone-500 max-w-xs truncate">
                      {photo.caption || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-stone-700">
                      {photo.likes}
                    </td>
                    <td className="px-4 py-3 text-sm text-stone-500">
                      {formatDate(photo.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(photo.id)}
                        disabled={deletingId === photo.id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        {deletingId === photo.id ? (
                          <span className="animate-spin">⏳</span>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
