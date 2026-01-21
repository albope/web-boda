"use client";

import { motion } from "framer-motion";
import {
  Car,
  Bus,
  Hotel,
  MapPin,
  ExternalLink,
  Phone,
  Star
} from "lucide-react";

interface TransportOption {
  icon: React.ReactNode;
  title: string;
  description: string;
  details?: string[];
}

interface AccommodationOption {
  name: string;
  category: string;
  distance: string;
  priceRange: string;
  phone?: string;
  website?: string;
  recommended?: boolean;
}

const transportOptions: TransportOption[] = [
  {
    icon: <Car className="w-6 h-6" />,
    title: "En coche",
    description: "Fácil acceso por autopista. Hay amplio aparcamiento gratuito en el lugar de la celebración.",
    details: [
      "Desde Valencia: ~1h 45min por A-7",
      "Desde Madrid: ~4h por A-3 y A-30"
    ]
  },
  {
    icon: <Bus className="w-6 h-6" />,
    title: "En autobús",
    description: "Conexión en autobús disponible desde Valencia.",
    details: [
      "Desde Valencia: líneas regulares disponibles",
      "Consulta horarios en la estación de autobuses"
    ]
  },
];

const accommodations: AccommodationOption[] = [
  {
    name: "Hotel Pío XII",
    category: "2 estrellas",
    distance: "A 6 min de la iglesia y 6 min del salón",
    priceRange: "€",
    phone: "+34 968 78 01 32",
    website: "https://hotelpioxii.com/",
  },
  {
    name: "Hotel Monreal",
    category: "3 estrellas",
    distance: "A 3 min de la iglesia y 7 min del salón",
    priceRange: "€€",
    phone: "+34 968 78 18 16",
    website: "https://hotelmonreal.net/",
  },
];

export function TravelStay() {
  return (
    <section id="como-llegar" className="py-16 sm:py-24 bg-cream-50" aria-labelledby="travel-stay-title">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-gold-300" />
            <Car className="w-5 h-5 text-gold-400" aria-hidden="true" />
            <div className="h-px w-12 bg-gold-300" />
          </div>
          <h2
            id="travel-stay-title"
            className="font-display text-3xl sm:text-4xl text-stone-800 mb-4"
          >
            Información Práctica
          </h2>
          <p className="text-stone-700 max-w-2xl mx-auto">
            Para los que venís de fuera, aquí tenéis todo lo necesario
          </p>
        </motion.div>

        {/* Transport Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="font-display text-2xl text-stone-800 mb-8 text-center">
            Llegar a Jumilla
          </h3>
          <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            {transportOptions.map((option, index) => (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-3 bg-gold-50 rounded-full w-fit text-gold-400 mb-4">
                  {option.icon}
                </div>
                <h4 className="font-display text-lg text-stone-800 mb-2">
                  {option.title}
                </h4>
                <p className="text-stone-600 text-sm mb-4">
                  {option.description}
                </p>
                {option.details && (
                  <ul className="space-y-1">
                    {option.details.map((detail, i) => (
                      <li key={i} className="text-stone-500 text-sm flex items-start gap-2">
                        <span className="text-gold-400 mt-1">•</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Accommodations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="font-display text-2xl text-stone-800 mb-8 text-center flex items-center justify-center gap-3">
            <Hotel className="w-6 h-6 text-gold-400" />
            Alojamiento
          </h3>
          <p className="text-stone-700 text-center mb-8 max-w-2xl mx-auto">
            Hemos recopilado algunas opciones de alojamiento cercanas al lugar de la celebración para que puedas elegir la que mejor se adapte a ti.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {accommodations.map((hotel, index) => (
              <motion.div
                key={hotel.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                viewport={{ once: true }}
                className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative ${
                  hotel.recommended ? "ring-2 ring-gold-300" : ""
                }`}
              >
                {hotel.recommended && (
                  <span className="absolute -top-3 left-4 inline-flex items-center gap-1 px-3 py-1 bg-gold-400 text-white text-xs font-medium rounded-full">
                    <Star className="w-3 h-3 fill-current" />
                    Recomendado
                  </span>
                )}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-display text-lg text-stone-800">
                      {hotel.name}
                    </h4>
                    <p className="text-stone-500 text-sm">{hotel.category}</p>
                  </div>
                  <span className="text-gold-500 font-medium">{hotel.priceRange}</span>
                </div>
                <p className="text-stone-600 text-sm mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold-300" />
                  {hotel.distance}
                </p>
                <div className="flex flex-wrap gap-2">
                  {hotel.phone && (
                    <a
                      href={`tel:${hotel.phone}`}
                      className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-gold-500 hover:bg-gold-50 transition-colors min-h-[44px] min-w-[44px] px-3 py-2 -ml-3 rounded-lg"
                    >
                      <Phone className="w-4 h-4" />
                      Llamar
                    </a>
                  )}
                  {hotel.website && (
                    <a
                      href={hotel.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-gold-500 hover:bg-gold-50 transition-colors min-h-[44px] min-w-[44px] px-3 py-2 rounded-lg"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Ver web
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-stone-500 text-sm bg-cream-100 rounded-xl p-4 inline-block">
            Si necesitas ayuda con el transporte o el alojamiento, no dudes en contactarnos.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
