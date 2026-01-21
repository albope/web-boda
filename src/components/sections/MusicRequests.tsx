"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Send, Check, AlertCircle, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  submitMusicRequest,
  getMusicRequests,
  type MusicRequest,
} from "@/app/actions/music";

const musicSchema = z.object({
  songTitle: z
    .string()
    .min(1, "Introduce el título de la canción")
    .max(200, "El título es demasiado largo"),
  artist: z
    .string()
    .min(1, "Introduce el artista")
    .max(200, "El nombre del artista es demasiado largo"),
  requestedBy: z
    .string()
    .min(2, "Introduce tu nombre")
    .max(100, "El nombre es demasiado largo"),
});

type MusicFormData = z.infer<typeof musicSchema>;

export function MusicRequests() {
  const [requests, setRequests] = useState<MusicRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MusicFormData>({
    resolver: zodResolver(musicSchema),
  });

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    const result = await getMusicRequests();
    if (result.success && result.data) {
      setRequests(result.data);
    }
    setIsLoadingRequests(false);
  }

  const onSubmit = async (data: MusicFormData) => {
    setSubmitError(null);
    setSubmitSuccess(false);

    const result = await submitMusicRequest(data);

    if (!result.success) {
      setSubmitError(result.error || "Ha ocurrido un error. Inténtalo de nuevo.");
      return;
    }

    setSubmitSuccess(true);
    reset();

    // Añadir la nueva canción al principio de la lista
    if (result.data) {
      setRequests((prev) => [result.data!, ...prev]);
    }

    // Ocultar mensaje de éxito después de 3 segundos
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  return (
    <section
      id="musica"
      className="py-16 sm:py-20 bg-gradient-to-b from-cream-50 to-cream-100"
      aria-labelledby="music-title"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-50 rounded-full mb-6">
            <Music className="w-8 h-8 text-gold-400" aria-hidden="true" />
          </div>

          <h2
            id="music-title"
            className="font-display text-2xl sm:text-3xl text-stone-800 mb-3"
          >
            Peticiones Musicales
          </h2>

          <p className="text-stone-600 max-w-md mx-auto">
            ¿Qué canción no puede faltar en nuestra fiesta? Sugiere tus favoritas
            y ayúdanos a crear la playlist perfecta.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm mb-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Canción"
                placeholder="Nombre de la canción"
                required
                error={errors.songTitle?.message}
                {...register("songTitle")}
              />
              <Input
                label="Artista"
                placeholder="Nombre del artista"
                required
                error={errors.artist?.message}
                {...register("artist")}
              />
            </div>

            <Input
              label="Tu nombre"
              placeholder="¿Quién sugiere esta canción?"
              required
              error={errors.requestedBy?.message}
              {...register("requestedBy")}
            />

            {/* Mensajes de estado */}
            <AnimatePresence mode="wait">
              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700"
                  role="alert"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  <p className="text-sm">{submitError}</p>
                </motion.div>
              )}

              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700"
                  role="status"
                >
                  <Check className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  <p className="text-sm">¡Canción añadida! Gracias por tu sugerencia.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              className="w-full sm:w-auto"
              isLoading={isSubmitting}
            >
              <Send className="w-4 h-4 mr-2" aria-hidden="true" />
              Sugerir canción
            </Button>
          </form>
        </motion.div>

        {/* Lista de canciones sugeridas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-medium text-stone-800 mb-4 flex items-center gap-2">
            <Music className="w-5 h-5 text-gold-400" aria-hidden="true" />
            Canciones sugeridas
            {requests.length > 0 && (
              <span className="text-sm font-normal text-stone-500">
                ({requests.length})
              </span>
            )}
          </h3>

          {isLoadingRequests ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cream-100 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-cream-100 rounded w-3/4" />
                      <div className="h-3 bg-cream-100 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <p className="text-stone-500">
                Aún no hay canciones sugeridas. ¡Sé el primero en añadir una!
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="max-h-80 overflow-y-auto divide-y divide-cream-100 scrollbar-thin scrollbar-thumb-cream-200 scrollbar-track-transparent">
                <AnimatePresence initial={false}>
                  {requests.map((request, index) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, delay: index === 0 ? 0.1 : 0 }}
                      className="p-4 sm:p-5"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-gold-50 rounded-full flex items-center justify-center">
                          <Music className="w-5 h-5 text-gold-400" aria-hidden="true" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-stone-800 truncate">
                            {request.song_title}
                          </p>
                          <p className="text-sm text-stone-600 truncate">
                            {request.artist}
                          </p>
                          <p className="text-xs text-stone-400 mt-1 flex items-center gap-1">
                            <User className="w-3 h-3" aria-hidden="true" />
                            Sugerida por {request.requested_by}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
