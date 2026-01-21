"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { WEDDING_CONFIG } from "@/config/wedding";
import { cn } from "@/lib/utils";

// Variantes de animación - Stagger orquestado con blur
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const, // easeOutQuint
    },
  },
};

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* ===== FONDOS ===== */}

      {/* Desktop: Imagen optimizada con next/image */}
      <div className="absolute inset-0 hidden md:block">
        <Image
          src="/images/hero.jpg"
          alt="Alberto y Carmen - Boda 14 de Noviembre de 2026"
          fill
          priority
          quality={85}
          className="object-cover object-center scale-[1.15]"
          sizes="100vw"
        />
      </div>

      {/* Mobile: Video autoplay - optimizado con preload metadata y poster */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/hero-poster.jpg"
        aria-label="Video de fondo mostrando a Alberto y Carmen"
        className="absolute inset-0 w-full h-full object-cover md:hidden"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* ===== OVERLAYS - Sistema de capas premium ===== */}

      {/* Capa 1: Vignette radial - centro más luminoso */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      {/* Capa 2: Gradiente vertical - mejor contraste en CTA */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />

      {/* Capa 3: Grain cinematográfico sutil */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ===== CONTENIDO ===== */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-6 sm:px-8 py-20 max-w-4xl mx-auto"
      >
        {/* Línea decorativa */}
        <motion.div
          variants={itemVariants}
          className="w-16 h-px bg-gradient-to-r from-transparent via-gold-300/70 to-transparent mx-auto mb-8"
        />

        {/* Eyebrow */}
        <motion.p
          variants={itemVariants}
          className={cn(
            "text-white/80 font-body font-normal",
            "text-[11px] sm:text-xs",
            "tracking-[0.25em] uppercase",
            "mb-6"
          )}
        >
          Nos casamos
        </motion.p>

        {/* Nombres */}
        <motion.h1
          variants={itemVariants}
          className={cn(
            "font-display font-normal",
            "text-[2.75rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem]",
            "leading-[1] tracking-tight",
            "text-white",
            "mb-12 sm:mb-16"
          )}
        >
          {WEDDING_CONFIG.couple.partner1}
          <span className="inline-block text-gold-300/90 mx-3 sm:mx-4 italic font-light text-[0.7em]">
            &
          </span>
          {WEDDING_CONFIG.couple.partner2}
        </motion.h1>

        {/* Fecha y Ubicación */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0 mb-16 sm:mb-20"
        >
          <span
            className="text-white/90 font-body font-light text-base sm:text-lg"
            style={{ letterSpacing: "0.05em" }}
          >
            {WEDDING_CONFIG.date.display}
          </span>
          <span className="hidden sm:inline text-white/30 mx-4">&middot;</span>
          <span
            className="text-white/70 font-body font-light text-sm sm:text-base"
            style={{ letterSpacing: "0.03em" }}
          >
            {WEDDING_CONFIG.location.city}, {WEDDING_CONFIG.location.region}
          </span>
        </motion.div>

        {/* CTA - Outline elegante con destello dorado que recorre el borde */}
        <motion.div variants={itemVariants}>
          <Link
            href="/confirmar"
            className={cn(
              "group relative inline-flex items-center justify-center",
              "px-10 py-4 sm:px-12 sm:py-5",
              "text-sm sm:text-base font-medium tracking-wide",
              "text-white",
              "rounded-full",
              "bg-white/10 backdrop-blur-sm",
              "border border-white/40",
              "transition-all duration-500 ease-out",
              "hover:bg-white/20 hover:border-white/60",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black/20"
            )}
          >
            {/* Destello dorado que recorre el borde - usando animación CSS optimizada */}
            <span
              className="absolute -inset-px rounded-full pointer-events-none overflow-hidden"
              style={{
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "exclude",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                padding: "1px",
              }}
            >
              <span
                className="absolute inset-[-50%] animate-borderSpin will-change-transform"
                style={{
                  background: "conic-gradient(from 0deg, transparent 0%, transparent 70%, #D4AF37 80%, transparent 90%, transparent 100%)",
                }}
              />
            </span>

            <span className="relative">Confirmar Asistencia</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* ===== SCROLL INDICATOR - CSS animation para mejor rendimiento ===== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2"
      >
        <div className="w-px h-10 bg-gradient-to-b from-white/50 to-transparent animate-scroll-hint will-change-transform origin-top" />
      </motion.div>
    </section>
  );
}
