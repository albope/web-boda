"use client";

import { motion } from "framer-motion";
import { Shirt } from "lucide-react";
import { WEDDING_CONFIG } from "@/config/wedding";
import { WeatherWidget } from "@/components/ui/WeatherWidget";

export function DressCode() {
  return (
    <section className="py-16 sm:py-20 bg-cream-50" aria-labelledby="dresscode-title">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-50 rounded-full mb-6">
            <Shirt className="w-8 h-8 text-gold-400" aria-hidden="true" />
          </div>

          <h2
            id="dresscode-title"
            className="font-display text-2xl sm:text-3xl text-stone-800 mb-4"
          >
            {WEDDING_CONFIG.dressCode.title}
          </h2>

          <p className="text-gold-400 font-medium text-lg mb-4">
            {WEDDING_CONFIG.dressCode.style}
          </p>

          <p className="text-stone-700 max-w-md mx-auto">
            {WEDDING_CONFIG.dressCode.description}
          </p>
        </motion.div>

        <WeatherWidget className="mt-6" />
      </div>
    </section>
  );
}
