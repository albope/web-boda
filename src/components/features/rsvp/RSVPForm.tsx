"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Heart, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/utils";
import { submitRSVP } from "@/app/actions/rsvp";

const rsvpSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre es demasiado largo"),
  email: z
    .string()
    .email("Por favor, introduce un email válido")
    .optional()
    .or(z.literal("")),
  telefono: z
    .string()
    .regex(/^[+]?[\d\s-]{9,15}$/, "Por favor, introduce un teléfono válido")
    .optional()
    .or(z.literal("")),
  asiste: z.enum(["si", "no"], {
    message: "Por favor, indica si asistirás",
  }),
  traeNinos: z.enum(["si", "no"]).optional(),
  numeroNinos: z.coerce.number().min(1).max(10).optional(),
  menuInfantil: z.enum(["si", "no"]).optional(),
  alergias: z.string().max(500, "El texto es demasiado largo").optional(),
  menuEspecial: z.string().max(200, "El texto es demasiado largo").optional(),
  mensaje: z.string().max(500, "El mensaje es demasiado largo").optional(),
});

type RSVPFormData = z.infer<typeof rsvpSchema>;

export function RSVPForm() {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<RSVPFormData | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RSVPFormData>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      asiste: undefined,
    },
  });

  const asiste = watch("asiste");
  const traeNinos = watch("traeNinos");

  const onSubmit = async (data: RSVPFormData) => {
    setSubmitError(null);

    const result = await submitRSVP({
      nombre: data.nombre,
      email: data.email || undefined,
      telefono: data.telefono || undefined,
      asiste: data.asiste === "si",
      traeNinos: data.traeNinos === "si",
      numeroNinos: data.traeNinos === "si" ? data.numeroNinos : undefined,
      menuInfantil: data.traeNinos === "si" ? data.menuInfantil === "si" : undefined,
      alergias: data.alergias || undefined,
      menuEspecial: data.menuEspecial || undefined,
      mensaje: data.mensaje || undefined,
    });

    if (!result.success) {
      setSubmitError(result.error || "Ha ocurrido un error. Por favor, inténtalo de nuevo.");
      return;
    }

    setSubmittedData(data);
    setIsSubmitted(true);
  };

  if (isSubmitted && submittedData) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm text-center max-w-lg mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6"
        >
          <Check className="w-10 h-10 text-green-600" aria-hidden="true" />
        </motion.div>

        <h2 className="font-display text-2xl sm:text-3xl text-stone-800 mb-4">
          {submittedData.asiste === "si"
            ? "¡Gracias por confirmar!"
            : "Gracias por avisarnos"}
        </h2>

        <p className="text-stone-600 mb-6">
          {submittedData.asiste === "si" ? (
            <>
              Hemos registrado tu confirmación, <strong>{submittedData.nombre}</strong>.
              <br />
              ¡Te esperamos con mucha ilusión!
            </>
          ) : (
            <>
              Lamentamos que no puedas acompañarnos, <strong>{submittedData.nombre}</strong>.
              <br />
              ¡Gracias por hacérnoslo saber!
            </>
          )}
        </p>

        <div className="flex items-center justify-center gap-2 text-gold-400 mb-6">
          <Heart className="w-5 h-5 fill-gold-300" aria-hidden="true" />
          <span className="font-medium">Alberto & Carmen</span>
        </div>

        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Volver al inicio
        </Button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm max-w-lg mx-auto"
    >
      <div className="space-y-6">
        {/* Nombre */}
        <Input
          label="Nombre completo"
          placeholder="Tu nombre y apellidos"
          required
          error={errors.nombre?.message}
          {...register("nombre")}
        />

        {/* Email */}
        <Input
          label="Email"
          type="email"
          placeholder="tu@email.com"
          helperText="Para enviarte un recordatorio (opcional)"
          error={errors.email?.message}
          {...register("email")}
        />

        {/* Teléfono */}
        <Input
          label="Teléfono"
          type="tel"
          placeholder="+34 600 000 000"
          helperText="Para cualquier comunicación de última hora (opcional)"
          error={errors.telefono?.message}
          {...register("telefono")}
        />

        {/* Asistencia */}
        <div>
          <p className="block text-sm font-medium text-stone-700 mb-3">
            ¿Asistirás a la boda?
            <span className="text-red-500 ml-1" aria-hidden="true">
              *
            </span>
          </p>
          <div className="grid grid-cols-2 gap-4">
            <label
              className={cn(
                "relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                asiste === "si"
                  ? "border-gold-300 bg-gold-50"
                  : "border-stone-200 hover:border-stone-300"
              )}
            >
              <input
                type="radio"
                value="si"
                className="sr-only"
                {...register("asiste")}
              />
              <span
                className={cn(
                  "text-2xl mb-1",
                  asiste === "si" ? "grayscale-0" : "grayscale"
                )}
                aria-hidden="true"
              >
                🎉
              </span>
              <span
                className={cn(
                  "font-medium",
                  asiste === "si" ? "text-gold-500" : "text-stone-600"
                )}
              >
                ¡Sí, asistiré!
              </span>
            </label>

            <label
              className={cn(
                "relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                asiste === "no"
                  ? "border-stone-400 bg-stone-50"
                  : "border-stone-200 hover:border-stone-300"
              )}
            >
              <input
                type="radio"
                value="no"
                className="sr-only"
                {...register("asiste")}
              />
              <span
                className={cn(
                  "text-2xl mb-1",
                  asiste === "no" ? "grayscale-0" : "grayscale"
                )}
                aria-hidden="true"
              >
                😢
              </span>
              <span
                className={cn(
                  "font-medium",
                  asiste === "no" ? "text-stone-700" : "text-stone-600"
                )}
              >
                No podré asistir
              </span>
            </label>
          </div>
          {errors.asiste && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {errors.asiste.message}
            </p>
          )}
        </div>

        {/* Campos adicionales si asiste */}
        <AnimatePresence>
          {asiste === "si" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 overflow-hidden"
            >
              {/* ¿Vienes con niños? */}
              <div>
                <p className="block text-sm font-medium text-stone-700 mb-3">
                  ¿Vienes con niños?
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <label
                    className={cn(
                      "relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                      traeNinos === "si"
                        ? "border-gold-300 bg-gold-50"
                        : "border-stone-200 hover:border-stone-300"
                    )}
                  >
                    <input
                      type="radio"
                      value="si"
                      className="sr-only"
                      {...register("traeNinos")}
                    />
                    <span
                      className={cn(
                        "text-2xl mb-1",
                        traeNinos === "si" ? "grayscale-0" : "grayscale"
                      )}
                      aria-hidden="true"
                    >
                      👶
                    </span>
                    <span
                      className={cn(
                        "font-medium",
                        traeNinos === "si" ? "text-gold-500" : "text-stone-600"
                      )}
                    >
                      Sí
                    </span>
                  </label>

                  <label
                    className={cn(
                      "relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                      traeNinos === "no"
                        ? "border-stone-400 bg-stone-50"
                        : "border-stone-200 hover:border-stone-300"
                    )}
                  >
                    <input
                      type="radio"
                      value="no"
                      className="sr-only"
                      {...register("traeNinos")}
                    />
                    <span
                      className={cn(
                        "text-2xl mb-1",
                        traeNinos === "no" ? "grayscale-0" : "grayscale"
                      )}
                      aria-hidden="true"
                    >
                      🙅
                    </span>
                    <span
                      className={cn(
                        "font-medium",
                        traeNinos === "no" ? "text-stone-700" : "text-stone-600"
                      )}
                    >
                      No
                    </span>
                  </label>
                </div>
              </div>

              {/* Campos adicionales si trae niños */}
              <AnimatePresence>
                {traeNinos === "si" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 overflow-hidden"
                  >
                    {/* Número de niños */}
                    <Input
                      label="¿Cuántos niños?"
                      type="number"
                      min={1}
                      max={10}
                      placeholder="1"
                      error={errors.numeroNinos?.message}
                      {...register("numeroNinos")}
                    />

                    {/* ¿Necesitan menú infantil? */}
                    <div>
                      <p className="block text-sm font-medium text-stone-700 mb-3">
                        ¿Necesitan menú infantil?
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <label
                          className={cn(
                            "relative flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200",
                            watch("menuInfantil") === "si"
                              ? "border-gold-300 bg-gold-50"
                              : "border-stone-200 hover:border-stone-300"
                          )}
                        >
                          <input
                            type="radio"
                            value="si"
                            className="sr-only"
                            {...register("menuInfantil")}
                          />
                          <span
                            className={cn(
                              "font-medium",
                              watch("menuInfantil") === "si" ? "text-gold-500" : "text-stone-600"
                            )}
                          >
                            Sí, por favor
                          </span>
                        </label>

                        <label
                          className={cn(
                            "relative flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200",
                            watch("menuInfantil") === "no"
                              ? "border-stone-400 bg-stone-50"
                              : "border-stone-200 hover:border-stone-300"
                          )}
                        >
                          <input
                            type="radio"
                            value="no"
                            className="sr-only"
                            {...register("menuInfantil")}
                          />
                          <span
                            className={cn(
                              "font-medium",
                              watch("menuInfantil") === "no" ? "text-stone-700" : "text-stone-600"
                            )}
                          >
                            No es necesario
                          </span>
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Alergias */}
              <Input
                label="Alergias o intolerancias"
                placeholder="Ej: Gluten, lactosa, frutos secos..."
                helperText="Indícanos si tienes alguna alergia alimentaria"
                error={errors.alergias?.message}
                {...register("alergias")}
              />

              {/* Menú especial */}
              <Input
                label="Menú especial"
                placeholder="Ej: Vegetariano, vegano, sin gluten..."
                helperText="Si necesitas un tipo de menú especial"
                error={errors.menuEspecial?.message}
                {...register("menuEspecial")}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mensaje */}
        <Textarea
          label="¿Quieres dejarnos algún mensaje?"
          placeholder="Escríbenos lo que quieras..."
          rows={4}
          error={errors.mensaje?.message}
          {...register("mensaje")}
        />

        {/* Error message */}
        {submitError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700"
            role="alert"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
            <p className="text-sm">{submitError}</p>
          </motion.div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          isLoading={isSubmitting}
        >
          Confirmar asistencia
        </Button>
      </div>
    </form>
  );
}
