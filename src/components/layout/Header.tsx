"use client";

import { useState, useEffect, useRef, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { WEDDING_CONFIG } from "@/config/wedding";
import { cn } from "@/lib/utils";

// Desktop: sin "Confirmar Asistencia" (ya está el botón CTA)
const navLinksDesktop = [
  { href: "/", label: "Inicio" },
  { href: "/detalles", label: "Detalles" },
  { href: "/#como-llegar", label: "Ubicación" },
];

// Mobile: con "Confirmar Asistencia" en el menú lateral
const navLinksMobile = [
  { href: "/", label: "Inicio" },
  { href: "/detalles", label: "Detalles" },
  { href: "/#como-llegar", label: "Ubicación" },
  { href: "/confirmar", label: "Confirmar Asistencia" },
];

// Colores del monograma extraídos para evitar recreación en cada render
const MONOGRAM_COLORS = {
  white: { color: "#FFFFFF", colorIntense: "#FFFFFF" },
  gold: { color: "#D4AF37", colorIntense: "#C9A227" },
  dark: { color: "#78716c", colorIntense: "#57534e" },
} as const;

// Elegant Monogram Component - Memoizado para evitar re-renders innecesarios
const Monogram = memo(function Monogram({
  className,
  variant = "gold"
}: {
  className?: string;
  variant?: keyof typeof MONOGRAM_COLORS;
}) {
  const { color, colorIntense } = MONOGRAM_COLORS[variant];

  return (
    <svg
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle - elegant line */}
      <circle
        cx="30"
        cy="30"
        r="28"
        stroke={colorIntense}
        strokeWidth="1.5"
      />

      {/* Inner decorative circle */}
      <circle
        cx="30"
        cy="30"
        r="23"
        stroke={color}
        strokeWidth="0.75"
        opacity="0.5"
      />

      {/* Letter A - bold elegant */}
      <text
        x="14"
        y="39"
        fontFamily="'Playfair Display', Georgia, serif"
        fontSize="22"
        fontWeight="600"
        fill={colorIntense}
      >
        A
      </text>

      {/* Ampersand - elegant italic */}
      <text
        x="26"
        y="36"
        fontFamily="'Playfair Display', Georgia, serif"
        fontSize="12"
        fontStyle="italic"
        fill={color}
        opacity="0.7"
      >
        &
      </text>

      {/* Letter C - bold elegant */}
      <text
        x="33"
        y="39"
        fontFamily="'Playfair Display', Georgia, serif"
        fontSize="22"
        fontWeight="600"
        fill={colorIntense}
      >
        C
      </text>

      {/* Decorative dots */}
      <circle cx="30" cy="10" r="1.5" fill={color} opacity="0.6" />
      <circle cx="30" cy="50" r="1.5" fill={color} opacity="0.6" />
    </svg>
  );
});

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hasAnimatedDots, setHasAnimatedDots] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Reducir tamaño del logo en páginas con títulos que se solapan
  const isCompactLogo = pathname === "/detalles" || pathname === "/confirmar";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Detener animación de dots después de algunas repeticiones para ahorrar batería
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimatedDots(true);
    }, 6000); // 3 ciclos de animación (2s cada uno)
    return () => clearTimeout(timer);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* INITIAL STATE - Only logo centered over the hero - ultra clean */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isScrolled ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 pointer-events-none",
          isScrolled && "pointer-events-none"
        )}
        style={{ pointerEvents: isScrolled ? "none" : "auto" }}
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className={cn(
              "flex items-center justify-center",
              isCompactLogo ? "h-14 lg:h-16" : "h-20 lg:h-24"
            )}>
            {/* Solo el logo centrado - SIN hamburguesa ni CTA */}
            <Link href="/" className="group pointer-events-auto">
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
              >
                <Monogram
                  className={isCompactLogo ? "w-10 h-10 lg:w-12 lg:h-12" : "w-14 h-14 lg:w-16 lg:h-16"}
                  variant="gold"
                />
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* SCROLLED STATE - Editorial Luxury header with cream background */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: isScrolled ? 0 : -100,
          opacity: isScrolled ? 1 : 0
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        {/* Full width container - no padding on mobile for edge-to-edge */}
        <div className="bg-white/95 backdrop-blur-xl shadow-[0_2px_8px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.06)] border-b border-gold-200/30">
          <div className="px-4 sm:px-6 lg:px-12">
              <div className="flex items-center justify-between h-16">
                {/* Logo - solo icono en desktop */}
                <Link href="/" className="group" onClick={closeMenu}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Monogram className="w-10 h-10" variant="gold" />
                  </motion.div>
                </Link>

                {/* Desktop Navigation - Editorial style with gold underline */}
                <nav className="hidden md:flex items-center gap-1" aria-label="Navegación principal">
                  {navLinksDesktop.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-800 transition-colors relative after:absolute after:bottom-1 after:left-4 after:right-4 after:h-px after:bg-gold-300 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
                    >
                      {link.label}
                    </Link>
                  ))}

                  {/* CTA Button - Gold with white text */}
                  <Link
                    href="/confirmar"
                    className="ml-3 px-5 py-2 bg-gradient-to-r from-gold-300 to-gold-400 text-white text-sm font-semibold rounded-full shadow-sm hover:shadow-lg hover:shadow-gold-400/25 hover:scale-[1.02] transition-all duration-300"
                  >
                    Confirmar Asistencia
                  </Link>
                </nav>

                {/* Mobile Menu Button - Three Dots Wave → X Animation */}
                <button
                  type="button"
                  onClick={toggleMenu}
                  className="md:hidden flex items-center justify-center w-12 h-12 rounded-full hover:bg-stone-100/30 transition-colors"
                  aria-expanded={isMenuOpen}
                  aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
                >
                  <div className="relative w-6 h-6 flex items-center justify-center">
                    {/* Dot 1 (left) → transforms to top-left of X */}
                    <motion.span
                      className="absolute bg-gold-400"
                      animate={
                        isMenuOpen
                          ? {
                              width: 18,
                              height: 2,
                              borderRadius: 2,
                              rotate: 45,
                              x: 0,
                              y: 0,
                            }
                          : {
                              width: 6,
                              height: 6,
                              borderRadius: 6,
                              rotate: 0,
                              x: -8,
                              y: hasAnimatedDots ? 0 : [0, -4, 0],
                            }
                      }
                      transition={{
                        duration: isMenuOpen ? 0.3 : 0.5,
                        delay: isMenuOpen ? 0 : 0,
                        repeat: (isMenuOpen || hasAnimatedDots) ? 0 : 2,
                        repeatDelay: 2,
                        ease: "easeInOut",
                      }}
                    />
                    {/* Dot 2 (center) → fades out for X */}
                    <motion.span
                      className="absolute bg-gold-400 rounded-full"
                      animate={
                        isMenuOpen
                          ? {
                              width: 0,
                              height: 0,
                              opacity: 0,
                            }
                          : {
                              width: 6,
                              height: 6,
                              opacity: 1,
                              y: hasAnimatedDots ? 0 : [0, -4, 0],
                            }
                      }
                      transition={{
                        duration: isMenuOpen ? 0.2 : 0.5,
                        delay: isMenuOpen ? 0 : 0.1,
                        repeat: (isMenuOpen || hasAnimatedDots) ? 0 : 2,
                        repeatDelay: 2,
                        ease: "easeInOut",
                      }}
                    />
                    {/* Dot 3 (right) → transforms to bottom-right of X */}
                    <motion.span
                      className="absolute bg-gold-400"
                      animate={
                        isMenuOpen
                          ? {
                              width: 18,
                              height: 2,
                              borderRadius: 2,
                              rotate: -45,
                              x: 0,
                              y: 0,
                            }
                          : {
                              width: 6,
                              height: 6,
                              borderRadius: 6,
                              rotate: 0,
                              x: 8,
                              y: hasAnimatedDots ? 0 : [0, -4, 0],
                            }
                      }
                      transition={{
                        duration: isMenuOpen ? 0.3 : 0.5,
                        delay: isMenuOpen ? 0 : 0.2,
                        repeat: (isMenuOpen || hasAnimatedDots) ? 0 : 2,
                        repeatDelay: 2,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </motion.header>

      {/* Mobile Menu - Editorial Luxury side panel */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop - lighter, more elegant */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={closeMenu}
            />

            {/* Menu panel - Right side slide, cream background */}
            <motion.nav
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-cream-50 border-l border-gold-200/30 shadow-[-20px_0_60px_rgba(0,0,0,0.1)]"
              aria-label="Navegación móvil"
            >
              {/* Header with monogram - Editorial style */}
              <div className="pt-20 px-6 pb-6 border-b border-gold-100/50">
                <div className="flex items-center gap-4">
                  <Monogram className="w-14 h-14" variant="gold" />
                  <div>
                    <p className="font-display text-xl text-stone-800">
                      {WEDDING_CONFIG.couple.partner1} & {WEDDING_CONFIG.couple.partner2}
                    </p>
                    <p className="text-sm text-gold-400">{WEDDING_CONFIG.date.display}</p>
                  </div>
                </div>
              </div>

              {/* Navigation links - Editorial numbered index style */}
              <div
                ref={menuRef}
                className="py-8 px-6"
                onTouchMove={(e) => {
                  const touch = e.touches[0];
                  const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
                  const linkElement = elements.find(el => el.getAttribute('data-nav-index'));
                  if (linkElement) {
                    const idx = parseInt(linkElement.getAttribute('data-nav-index') || '-1');
                    setHoveredIndex(idx);
                  } else {
                    setHoveredIndex(null);
                  }
                }}
                onTouchEnd={() => setHoveredIndex(null)}
                onTouchCancel={() => setHoveredIndex(null)}
              >
                {navLinksMobile.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <motion.div
                      data-nav-index={index}
                      animate={{
                        backgroundColor: hoveredIndex === index ? "rgba(212, 175, 55, 0.15)" : "rgba(0, 0, 0, 0)",
                        x: hoveredIndex === index ? 4 : 0
                      }}
                      whileHover={{
                        backgroundColor: "rgba(212, 175, 55, 0.1)",
                        x: 4
                      }}
                      whileTap={{
                        backgroundColor: "rgba(212, 175, 55, 0.15)",
                        x: 4
                      }}
                      transition={{ duration: 0.15 }}
                      className="rounded-lg -mx-2"
                      onTouchStart={() => setHoveredIndex(index)}
                    >
                      <Link
                        href={link.href}
                        data-nav-index={index}
                        className={cn(
                          "flex items-baseline gap-3 py-4 px-2 border-b border-gold-100/50 transition-colors duration-150",
                          hoveredIndex === index ? "text-gold-500" : "text-stone-700",
                          "hover:text-gold-500 active:text-gold-500"
                        )}
                        onClick={closeMenu}
                      >
                        <span className={cn(
                          "font-display text-xs tabular-nums transition-colors duration-150",
                          hoveredIndex === index ? "text-gold-500" : "text-gold-300/70"
                        )}>
                          {String(index + 1).padStart(2, '0')}.
                        </span>
                        <span className="font-display text-2xl transition-colors duration-150">
                          {link.label}
                        </span>
                      </Link>
                    </motion.div>
                  </motion.div>
                ))}
              </div>

            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}
