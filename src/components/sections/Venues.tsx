"use client";

import { motion } from "framer-motion";
import { MapPin, ExternalLink } from "lucide-react";
import { WEDDING_CONFIG } from "@/config/wedding";

interface VenueCardProps {
  type: "ceremony" | "reception";
  name: string;
  address: string;
  time: string;
  mapsUrl: string;
  embedUrl: string;
  description?: string;
  delay: number;
}

function VenueCard({
  type,
  name,
  address,
  time,
  mapsUrl,
  embedUrl,
  description,
  delay,
}: VenueCardProps) {
  const label = type === "ceremony" ? "Ceremonia" : "Banquete";

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="group bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_12px_32px_rgba(0,0,0,0.08)] transition-shadow duration-500"
    >
      {/* Mapa embebido con contenedor estilizado */}
      <div className="relative aspect-[4/3] bg-cream-100">
        <div className="absolute inset-0 rounded-t-xl overflow-hidden">
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Mapa de ${name}`}
            className="w-full h-full"
          />
        </div>
        {/* Borde sutil superior para integración */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-stone-200/50 to-transparent" />
      </div>

      {/* Contenido de la card */}
      <div className="p-6 sm:p-8">
        {/* Badge: Tipo + Hora */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-medium text-gold-500 uppercase tracking-wider">
            {label}
          </span>
          <span className="w-1 h-1 rounded-full bg-stone-300" />
          <span className="text-xs text-stone-500">{time}</span>
        </div>

        {/* Nombre del lugar - protagonista */}
        <h3 className="font-display text-xl sm:text-2xl text-stone-800 mb-2 group-hover:text-stone-900 transition-colors duration-300">
          {name}
        </h3>

        {/* Dirección */}
        <p className="text-stone-500 text-sm mb-2">{address}</p>

        {/* Descripción opcional */}
        {description && (
          <p className="text-stone-400 text-xs mb-4 italic">{description}</p>
        )}

        {/* Espaciador si no hay descripción */}
        {!description && <div className="mb-4" />}

        {/* CTA: Cómo llegar */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group/link inline-flex items-center gap-2 text-gold-500 hover:text-gold-600 font-medium text-sm transition-colors"
        >
          <span>Cómo llegar</span>
          <ExternalLink
            className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-0.5"
            aria-hidden="true"
          />
        </a>
      </div>
    </motion.article>
  );
}

export function Venues() {
  return (
    <section
      id="venues"
      className="py-16 sm:py-24 bg-white"
      aria-labelledby="venues-title"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header con decorador */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          {/* Decorador: líneas gold con icono */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-gold-300" />
            <MapPin className="w-5 h-5 text-gold-400" aria-hidden="true" />
            <div className="h-px w-12 bg-gold-300" />
          </div>

          {/* Título evocador */}
          <h2
            id="venues-title"
            className="font-display text-2xl sm:text-3xl md:text-4xl text-stone-800 mb-3"
          >
            Donde nos diremos &ldquo;Sí, quiero&rdquo;
          </h2>

          {/* Subtítulo: ubicación general */}
          <p className="text-stone-600">
            {WEDDING_CONFIG.location.city}, {WEDDING_CONFIG.location.region}
          </p>
        </motion.div>

        {/* Grid de cards */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
          <VenueCard
            type="ceremony"
            name={WEDDING_CONFIG.ceremony.name}
            address={WEDDING_CONFIG.ceremony.address}
            time={WEDDING_CONFIG.ceremony.time}
            mapsUrl={WEDDING_CONFIG.ceremony.googleMapsUrl}
            embedUrl={WEDDING_CONFIG.ceremony.embedUrl}
            delay={0.1}
          />
          <VenueCard
            type="reception"
            name={WEDDING_CONFIG.reception.name}
            address={WEDDING_CONFIG.reception.address}
            time={WEDDING_CONFIG.reception.time}
            mapsUrl={WEDDING_CONFIG.reception.googleMapsUrl}
            embedUrl={WEDDING_CONFIG.reception.embedUrl}
            description="Aperitivo, banquete y fiesta"
            delay={0.2}
          />
        </div>

        {/* Nota contextual */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center text-stone-500 text-sm mt-10 sm:mt-12"
        >
          Ambos lugares están a 10 minutos en coche entre sí
        </motion.p>
      </div>
    </section>
  );
}
