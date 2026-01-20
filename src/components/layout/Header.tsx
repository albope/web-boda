"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { WEDDING_CONFIG } from "@/config/wedding";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/detalles", label: "Detalles" },
  { href: "/#como-llegar", label: "Ubicación" },
];

// Elegant Monogram Component - Luxury brand style with intense gold
function Monogram({ className, variant = "gold" }: { className?: string; variant?: "gold" | "white" }) {
  const color = variant === "white" ? "#FFFFFF" : "#D4AF37";
  const colorIntense = variant === "white" ? "#FFFFFF" : "#C9A227";

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
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* INITIAL STATE - Only logo and hamburger over the hero */}
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
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo only */}
            <Link href="/" className="group pointer-events-auto">
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
              >
                <Monogram className="w-14 h-14 lg:w-16 lg:h-16" variant="white" />
              </motion.div>
            </Link>

            {/* Mobile hamburger only */}
            <button
              type="button"
              className={cn(
                "md:hidden pointer-events-auto relative w-12 h-12 rounded-full transition-all duration-300",
                "flex items-center justify-center",
                "bg-black/20 backdrop-blur-sm hover:bg-black/30",
                isMenuOpen && "bg-black/40"
              )}
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              <div className="relative w-5 h-4">
                <span
                  className={cn(
                    "absolute left-0 w-5 h-[2px] bg-white rounded-full transition-all duration-300 ease-out origin-center",
                    isMenuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 w-5 h-[2px] bg-white rounded-full transition-all duration-300 ease-out",
                    isMenuOpen ? "opacity-0 scale-x-0" : "opacity-100"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 w-5 h-[2px] bg-white rounded-full transition-all duration-300 ease-out origin-center",
                    isMenuOpen ? "bottom-1/2 translate-y-1/2 -rotate-45" : "bottom-0"
                  )}
                />
              </div>
            </button>

            {/* Desktop - minimal nav visible on hero */}
            <div className="hidden md:flex items-center gap-3 pointer-events-auto">
              <Link
                href="/confirmar"
                className="px-5 py-2.5 bg-white/15 backdrop-blur-sm text-white border border-white/40 rounded-full text-sm font-medium hover:bg-white/25 transition-all duration-300"
              >
                Confirmar Asistencia
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* SCROLLED STATE - Full header with subtle background */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: isScrolled ? 0 : -100,
          opacity: isScrolled ? 1 : 0
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="mt-3 mx-auto max-w-5xl px-4">
          <div className="bg-stone-900/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-stone-700/30 rounded-full">
            <div className="px-5 lg:px-6">
              <div className="flex items-center justify-between h-14">
                {/* Logo - intense gold */}
                <Link href="/" className="group flex items-center gap-3" onClick={closeMenu}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Monogram className="w-10 h-10" variant="gold" />
                  </motion.div>

                  {/* Names on larger screens */}
                  <span className="hidden lg:block font-display text-lg text-white/90">
                    {WEDDING_CONFIG.couple.partner1}
                    <span className="text-gold-300 mx-1.5">&</span>
                    {WEDDING_CONFIG.couple.partner2}
                  </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-1" aria-label="Navegación principal">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="px-4 py-2 text-sm font-medium text-stone-300 hover:text-white rounded-full hover:bg-white/10 transition-all duration-200"
                    >
                      {link.label}
                    </Link>
                  ))}

                  {/* CTA Button - Gold */}
                  <Link
                    href="/confirmar"
                    className="ml-2 px-5 py-2 bg-gradient-to-r from-gold-300 to-gold-400 text-stone-900 text-sm font-semibold rounded-full shadow-lg shadow-gold-400/20 hover:shadow-gold-400/40 hover:scale-[1.02] transition-all duration-300"
                  >
                    Confirmar
                  </Link>
                </nav>

                {/* Mobile Menu Button */}
                <button
                  type="button"
                  className={cn(
                    "md:hidden relative w-10 h-10 rounded-full transition-all duration-300",
                    "flex items-center justify-center",
                    "hover:bg-white/10",
                    isMenuOpen && "bg-white/10"
                  )}
                  onClick={toggleMenu}
                  aria-expanded={isMenuOpen}
                  aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
                >
                  <div className="relative w-5 h-4">
                    <span
                      className={cn(
                        "absolute left-0 w-5 h-[1.5px] bg-white rounded-full transition-all duration-300 ease-out origin-center",
                        isMenuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                      )}
                    />
                    <span
                      className={cn(
                        "absolute left-0 top-1/2 -translate-y-1/2 w-5 h-[1.5px] bg-white rounded-full transition-all duration-300 ease-out",
                        isMenuOpen ? "opacity-0 scale-x-0" : "opacity-100"
                      )}
                    />
                    <span
                      className={cn(
                        "absolute left-0 w-5 h-[1.5px] bg-white rounded-full transition-all duration-300 ease-out origin-center",
                        isMenuOpen ? "bottom-1/2 translate-y-1/2 -rotate-45" : "bottom-0"
                      )}
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu - Elegant dark overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              onClick={closeMenu}
            />

            {/* Menu panel */}
            <motion.nav
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-24 left-4 right-4 bg-stone-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-stone-700/50 overflow-hidden"
              aria-label="Navegación móvil"
            >
              {/* Header with monogram */}
              <div className="px-6 pt-6 pb-4 border-b border-stone-700/50">
                <div className="flex items-center gap-3">
                  <Monogram className="w-12 h-12" variant="gold" />
                  <div>
                    <p className="font-display text-white">
                      {WEDDING_CONFIG.couple.partner1} & {WEDDING_CONFIG.couple.partner2}
                    </p>
                    <p className="text-xs text-gold-300/80">{WEDDING_CONFIG.date.display}</p>
                  </div>
                </div>
              </div>

              {/* Navigation links */}
              <div className="p-3">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className="flex items-center px-4 py-4 text-stone-200 hover:text-white hover:bg-white/5 rounded-2xl transition-colors font-medium"
                      onClick={closeMenu}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <div className="p-4 pt-2">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <Link
                    href="/confirmar"
                    className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-gradient-to-r from-gold-300 to-gold-400 text-stone-900 font-semibold rounded-2xl transition-all hover:shadow-lg hover:shadow-gold-400/30"
                    onClick={closeMenu}
                  >
                    Confirmar Asistencia
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </motion.div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}
