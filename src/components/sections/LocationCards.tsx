"use client";

import { motion } from "framer-motion";
import { MapPin, ExternalLink } from "lucide-react";
import { WEDDING_CONFIG } from "@/config/wedding";

interface LocationCardProps {
  title: string;
  name: string;
  address: string;
  time: string;
  mapsUrl: string;
  delay: number;
}

function LocationCard({
  title,
  name,
  address,
  time,
  mapsUrl,
  delay,
}: LocationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl p-6 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gold-50 rounded-full">
          <MapPin className="w-5 h-5 text-gold-400" aria-hidden="true" />
        </div>
        <div>
          <span className="text-sm text-gold-400 font-medium">{title}</span>
          <span className="text-stone-400 mx-2">·</span>
          <span className="text-sm text-stone-500">{time}</span>
        </div>
      </div>

      <h3 className="font-display text-xl text-stone-800 mb-2">{name}</h3>
      <p className="text-stone-500 text-sm mb-4">{address}</p>

      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-500 font-medium text-sm transition-colors"
      >
        <span>Cómo llegar</span>
        <ExternalLink className="w-4 h-4" aria-hidden="true" />
      </a>
    </motion.div>
  );
}

export function LocationCards() {
  return (
    <section
      className="py-16 sm:py-20 bg-cream-50"
      aria-labelledby="locations-title"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2
            id="locations-title"
            className="font-display text-2xl sm:text-3xl text-stone-800 mb-4"
          >
            Ubicaciones
          </h2>
          <p className="text-stone-600">
            Dónde tendrá lugar nuestra celebración
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          <LocationCard
            title="Ceremonia"
            name={WEDDING_CONFIG.ceremony.name}
            address={WEDDING_CONFIG.ceremony.address}
            time={WEDDING_CONFIG.ceremony.time}
            mapsUrl={WEDDING_CONFIG.ceremony.googleMapsUrl}
            delay={0.1}
          />
          <LocationCard
            title="Banquete"
            name={WEDDING_CONFIG.reception.name}
            address={WEDDING_CONFIG.reception.address}
            time={WEDDING_CONFIG.reception.time}
            mapsUrl={WEDDING_CONFIG.reception.googleMapsUrl}
            delay={0.2}
          />
        </div>
      </div>
    </section>
  );
}
