"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Church, UtensilsCrossed, Clock, MapPin } from "lucide-react";
import { WEDDING_CONFIG } from "@/config/wedding";

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  time: string;
  location: string;
  delay: number;
}

function InfoCard({ icon, title, time, location, delay }: InfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-gold-50 rounded-full text-gold-400">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-display text-lg text-stone-800 mb-2">{title}</h3>
          <div className="flex items-center gap-2 text-stone-600 text-sm mb-1">
            <Clock className="w-4 h-4 text-gold-300" aria-hidden="true" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2 text-stone-500 text-sm">
            <MapPin className="w-4 h-4 text-gold-300" aria-hidden="true" />
            <span>{location}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function QuickInfo() {
  return (
    <section className="py-16 sm:py-20 bg-cream-100" aria-labelledby="quick-info-title">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2
            id="quick-info-title"
            className="font-display text-2xl sm:text-3xl text-stone-800 mb-4"
          >
            El día de la boda
          </h2>
          <p className="text-stone-600 max-w-xl mx-auto">
            Todo lo que necesitas saber sobre nuestra celebración
          </p>
        </motion.div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <InfoCard
            icon={<Church className="w-6 h-6" aria-hidden="true" />}
            title="Ceremonia"
            time={WEDDING_CONFIG.ceremony.time}
            location={WEDDING_CONFIG.ceremony.name}
            delay={0.1}
          />
          <InfoCard
            icon={<UtensilsCrossed className="w-6 h-6" aria-hidden="true" />}
            title="Banquete"
            time={WEDDING_CONFIG.reception.time}
            location={WEDDING_CONFIG.reception.name}
            delay={0.2}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            href="/detalles"
            className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-500 font-medium transition-colors"
          >
            Ver todos los detalles
            <span aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
