"use client";

import { motion } from "framer-motion";
import { Church, Wine, UtensilsCrossed, Music } from "lucide-react";
import { WEDDING_CONFIG } from "@/config/wedding";

const iconMap: Record<string, React.ReactNode> = {
  church: <Church className="w-5 h-5" />,
  wine: <Wine className="w-5 h-5" />,
  utensils: <UtensilsCrossed className="w-5 h-5" />,
  music: <Music className="w-5 h-5" />,
};

export function Timeline() {
  return (
    <section className="py-16 sm:py-20" aria-labelledby="timeline-title">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2
            id="timeline-title"
            className="font-display text-2xl sm:text-3xl text-stone-800 mb-4"
          >
            Programa del día
          </h2>
          <p className="text-stone-600">
            Así será nuestra celebración
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-cream-300 hidden sm:block" />

          <div className="space-y-8">
            {WEDDING_CONFIG.schedule.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative flex items-start gap-4 sm:gap-6"
              >
                {/* Icon circle */}
                <div className="relative z-10 flex-shrink-0 w-12 h-12 bg-gold-300 rounded-full flex items-center justify-center text-white shadow-md">
                  {iconMap[item.icon] || <Church className="w-5 h-5" />}
                </div>

                {/* Content */}
                <div className="flex-1 bg-white rounded-xl p-4 sm:p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <h3 className="font-display text-lg text-stone-800">
                      {item.event}
                    </h3>
                    <span className="text-gold-400 font-medium text-sm">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-stone-500 text-sm">{item.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
