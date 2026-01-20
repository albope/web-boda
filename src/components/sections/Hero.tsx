"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import { WEDDING_CONFIG } from "@/config/wedding";

export function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Static Image for Desktop */}
      <div
        className="absolute inset-0 hidden md:block bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero.jpg')" }}
      />

      {/* Video Background for Mobile only */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover md:hidden"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 text-center px-4 sm:px-6 py-16 max-w-3xl mx-auto">
        {/* "Nos casamos" label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-gold-300 font-medium tracking-widest uppercase text-sm mb-6"
        >
          ¡Nos casamos!
        </motion.p>

        {/* Couple Names */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-display-sm sm:text-display-md md:text-display-lg text-white mb-6"
        >
          {WEDDING_CONFIG.couple.partner1}
          <span className="text-gold-300 mx-2 sm:mx-4">&</span>
          {WEDDING_CONFIG.couple.partner2}
        </motion.h1>

        {/* Date */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center gap-2 text-white/90 mb-4"
        >
          <Calendar className="w-5 h-5 text-gold-300" aria-hidden="true" />
          <p className="text-lg sm:text-xl">
            {WEDDING_CONFIG.date.day}, {WEDDING_CONFIG.date.display}
          </p>
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-center gap-2 text-white/80 mb-10"
        >
          <MapPin className="w-5 h-5 text-gold-300" aria-hidden="true" />
          <p className="text-base sm:text-lg">
            {WEDDING_CONFIG.location.city}, {WEDDING_CONFIG.location.region}
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            href="/confirmar"
            className="inline-flex items-center justify-center bg-gold-300 hover:bg-gold-400 text-white font-medium px-8 py-4 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Confirmar Asistencia
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 flex flex-col items-center gap-2"
        >
          <span className="text-white/60 text-xs uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white/60"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
