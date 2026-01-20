"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

// ============================================
// CONFIGURACIÓN PERSONALIZABLE
// ============================================
interface BackToTopProps {
  /** Pixels de scroll antes de mostrar el botón (default: 400) */
  threshold?: number
  /** Variante visual: 'solid' | 'glass' (default: 'solid') */
  variant?: "solid" | "glass"
  /** Posición horizontal: 'left' | 'right' (default: 'right') */
  position?: "left" | "right"
  /** Tamaño del botón: 'sm' | 'md' | 'lg' (default: 'md') */
  size?: "sm" | "md" | "lg"
  /** Clase adicional para personalización */
  className?: string
}

// Mapeo de tamaños → dimensiones y iconos
const sizeConfig = {
  sm: { button: "w-10 h-10", icon: "w-4 h-4" },
  md: { button: "w-12 h-12", icon: "w-5 h-5" },
  lg: { button: "w-14 h-14", icon: "w-6 h-6" },
}

// Mapeo de variantes → estilos visuales
const variantConfig = {
  // Fondo sólido elegante: stone oscuro con borde gold sutil
  solid: cn(
    "bg-stone-800/90 text-cream-50",
    "border border-gold-200/20",
    "hover:bg-stone-700 hover:border-gold-300/30",
    "shadow-sm shadow-stone-900/10"
  ),
  // Efecto glass/translúcido: fondo blur con tinte gold
  glass: cn(
    "bg-cream-50/70 text-stone-800",
    "backdrop-blur-md",
    "border border-gold-200/40",
    "hover:bg-cream-50/90 hover:border-gold-300/60",
    "shadow-sm shadow-gold-500/5"
  ),
}

export function BackToTop({
  threshold = 400,
  variant = "solid",
  position = "right",
  size = "md",
  className,
}: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Detectar preferencia de movimiento reducido
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  // Controlar visibilidad según scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsVisible(scrollY > threshold)
    }

    // Throttle para performance
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    handleScroll() // Check inicial

    return () => window.removeEventListener("scroll", onScroll)
  }, [threshold])

  // Scroll suave hacia arriba
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    })
  }, [prefersReducedMotion])

  // Animaciones adaptadas a preferencias de movimiento
  const motionVariants = {
    hidden: prefersReducedMotion
      ? { opacity: 0 }
      : { opacity: 0, scale: 0.8, y: 20 },
    visible: prefersReducedMotion
      ? { opacity: 1 }
      : { opacity: 1, scale: 1, y: 0 },
    exit: prefersReducedMotion
      ? { opacity: 0 }
      : { opacity: 0, scale: 0.8, y: 20 },
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className={cn(
            // Base: posición fija, forma circular, cursor
            "fixed z-50 rounded-full cursor-pointer",
            "flex items-center justify-center",
            // Transiciones suaves para hover (Tailwind)
            "transition-colors duration-300 ease-out",
            // Focus accesible
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50",
            // Posición vertical (mobile-first)
            "bottom-6 sm:bottom-8",
            // Posición horizontal
            position === "right" ? "right-6 sm:right-8" : "left-6 sm:left-8",
            // Tamaño según prop
            sizeConfig[size].button,
            // Variante visual
            variantConfig[variant],
            // Clase adicional
            className
          )}
          // Animaciones Framer Motion
          variants={motionVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{
            duration: prefersReducedMotion ? 0.15 : 0.4,
            ease: [0.25, 0.46, 0.45, 0.94], // Ease-out suave
          }}
          // Hover/tap effects (solo si no hay reduced motion)
          whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
          // Accesibilidad
          aria-label="Volver arriba"
          title="Volver arriba"
        >
          <ChevronUp
            className={cn(
              sizeConfig[size].icon,
              "transition-transform duration-300",
              // Pequeño movimiento del icono en hover
              "group-hover:-translate-y-0.5"
            )}
            strokeWidth={2}
          />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

// ============================================
// VARIANTES PRE-CONFIGURADAS (opcional)
// ============================================

/** Variante sólida elegante - ideal para fondos claros */
export function BackToTopSolid(props: Omit<BackToTopProps, "variant">) {
  return <BackToTop {...props} variant="solid" />
}

/** Variante glass translúcida - ideal para fondos con imagen */
export function BackToTopGlass(props: Omit<BackToTopProps, "variant">) {
  return <BackToTop {...props} variant="glass" />
}
