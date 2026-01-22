"use client";

import { useState, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image as ImageIcon, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { uploadPhoto } from "@/app/actions/gallery";
import type { GalleryPhoto } from "@/lib/gallery";
import { WEDDING_CONFIG } from "@/config/wedding";

const uploadSchema = z.object({
  uploadedBy: z
    .string()
    .min(2, "Introduce tu nombre (mínimo 2 caracteres)")
    .max(100, "El nombre es demasiado largo"),
  caption: z.string().max(500, "La descripción es demasiado larga").optional(),
});

type UploadFormData = z.infer<typeof uploadSchema>;

interface PhotoUploadProps {
  onPhotoUploaded?: (photo: GalleryPhoto) => void;
}

async function resizeImage(
  file: File,
  maxDimension: number
): Promise<{ blob: Blob; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("No se pudo crear el contexto del canvas"));
      return;
    }

    img.onload = () => {
      let { width, height } = img;

      // Calcular nuevas dimensiones manteniendo proporción
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = (height / width) * maxDimension;
          width = maxDimension;
        } else {
          width = (width / height) * maxDimension;
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Dibujar imagen redimensionada
      ctx.drawImage(img, 0, 0, width, height);

      // Exportar como JPEG con buena calidad
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve({ blob, mimeType: "image/jpeg" });
          } else {
            reject(new Error("Error al procesar la imagen"));
          }
        },
        "image/jpeg",
        0.85
      );
    };

    img.onerror = () => {
      reject(new Error("Error al cargar la imagen"));
    };

    img.src = URL.createObjectURL(file);
  });
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function PhotoUpload({ onPhotoUploaded }: PhotoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
  });

  const validateFile = useCallback((file: File): string | null => {
    const { maxFileSizeMB, allowedFormats } = WEDDING_CONFIG.gallery;

    if (file.size > maxFileSizeMB * 1024 * 1024) {
      return `El archivo es demasiado grande. Máximo ${maxFileSizeMB}MB.`;
    }

    if (!(allowedFormats as readonly string[]).includes(file.type)) {
      return "Formato no permitido. Usa JPEG, PNG o WebP.";
    }

    return null;
  }, []);

  const handleFileSelect = useCallback(
    (file: File) => {
      const error = validateFile(file);
      if (error) {
        setUploadError(error);
        return;
      }

      setUploadError(null);
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    },
    [validateFile]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const files = e.dataTransfer.files;
      if (files && files[0]) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files[0]) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const clearSelection = useCallback(() => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [previewUrl]);

  const onSubmit = async (formData: UploadFormData) => {
    if (!selectedFile) {
      setUploadError("Selecciona una imagen primero");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Redimensionar imagen
      const { blob, mimeType } = await resizeImage(
        selectedFile,
        WEDDING_CONFIG.gallery.maxDimension
      );

      // Convertir a base64
      const base64 = await blobToBase64(blob);

      // Subir imagen
      const result = await uploadPhoto({
        fileName: selectedFile.name,
        fileBase64: base64,
        mimeType,
        caption: formData.caption,
        uploadedBy: formData.uploadedBy,
      });

      if (!result.success) {
        setUploadError(result.error || "Error al subir la foto");
        return;
      }

      setUploadSuccess(true);
      clearSelection();
      reset();

      if (result.data && onPhotoUploaded) {
        onPhotoUploaded(result.data);
      }

      setTimeout(() => setUploadSuccess(false), 4000);
    } catch (err) {
      console.error("Error al procesar la imagen:", err);
      setUploadError("Error al procesar la imagen. Inténtalo de nuevo.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
      <h3 className="text-xl font-serif text-stone-800 mb-6 text-center">
        Comparte tus fotos
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Área de arrastrar y soltar */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
            transition-all duration-200
            ${
              dragActive
                ? "border-gold-300 bg-gold-50"
                : "border-stone-300 hover:border-gold-300 hover:bg-cream-50"
            }
            ${previewUrl ? "pb-4" : ""}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={WEDDING_CONFIG.gallery.allowedFormats.join(",")}
            onChange={handleInputChange}
            className="hidden"
          />

          <AnimatePresence mode="wait">
            {previewUrl ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative"
              >
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded-lg shadow-md"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearSelection();
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  aria-label="Eliminar imagen"
                >
                  <X className="w-4 h-4" />
                </button>
                <p className="mt-4 text-sm text-stone-500">
                  Haz clic para cambiar la imagen
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="mx-auto w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center">
                  {dragActive ? (
                    <Upload className="w-8 h-8 text-gold-400" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gold-300" />
                  )}
                </div>
                <div>
                  <p className="text-stone-700 font-medium">
                    Arrastra una foto aquí
                  </p>
                  <p className="text-stone-500 text-sm mt-1">
                    o haz clic para seleccionar
                  </p>
                </div>
                <p className="text-xs text-stone-400">
                  JPEG, PNG o WebP. Máximo {WEDDING_CONFIG.gallery.maxFileSizeMB}
                  MB
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Campo de nombre */}
        <Input
          {...register("uploadedBy")}
          label="Tu nombre"
          placeholder="¿Quién eres?"
          error={errors.uploadedBy?.message}
          required
        />

        {/* Campo de descripción */}
        <Input
          {...register("caption")}
          label="Descripción (opcional)"
          placeholder="Añade un comentario sobre la foto..."
          error={errors.caption?.message}
        />

        {/* Mensajes de error y éxito */}
        <AnimatePresence>
          {uploadError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
            >
              {uploadError}
            </motion.div>
          )}

          {uploadSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              ¡Foto subida correctamente!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botón de subir */}
        <Button
          type="submit"
          disabled={!selectedFile || isUploading}
          isLoading={isUploading}
          className="w-full"
        >
          {isUploading ? "Subiendo..." : "Subir foto"}
        </Button>
      </form>
    </div>
  );
}
