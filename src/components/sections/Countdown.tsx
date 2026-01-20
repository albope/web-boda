"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WEDDING_CONFIG } from "@/config/wedding";
import { cn } from "@/lib/utils";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(): TimeLeft {
  const weddingDate = new Date(WEDDING_CONFIG.date.iso);
  const now = new Date();
  const difference = weddingDate.getTime() - now.getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

interface CountdownUnitProps {
  value: number;
  label: string;
  delay: number;
  isSeconds?: boolean;
}

function CountdownUnit({ value, label, delay, isSeconds = false }: CountdownUnitProps) {
  const prevValueRef = useRef(value);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    if (prevValueRef.current !== value) {
      setIsChanging(true);
      const timer = setTimeout(() => setIsChanging(false), 300);
      prevValueRef.current = value;
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="flex flex-col items-center group"
    >
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "relative bg-white rounded-2xl p-4 sm:p-6 md:p-8 min-w-[72px] sm:min-w-[100px] md:min-w-[120px]",
          "border border-gold-100/50",
          "transition-shadow duration-300 ease-out",
          "shadow-[0_1px_2px_rgba(0,0,0,0.02),0_4px_8px_rgba(0,0,0,0.04),0_12px_24px_rgba(0,0,0,0.05)]",
          "hover:shadow-[0_4px_8px_rgba(0,0,0,0.04),0_12px_24px_rgba(0,0,0,0.08),0_24px_48px_rgba(0,0,0,0.06)]",
          "hover:border-gold-200",
          isSeconds && "ring-1 ring-gold-200/50"
        )}
      >
        {/* Gold accent line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-gold-300 to-transparent rounded-full" />

        {/* Number with slide animation */}
        <div className="relative overflow-hidden h-[40px] sm:h-[52px] md:h-[64px] flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={value}
              initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className={cn(
                "font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-stone-800 tabular-nums",
                isSeconds && "bg-gradient-to-br from-gold-400 via-gold-300 to-gold-400 bg-clip-text text-transparent"
              )}
              aria-live="polite"
            >
              {value.toString().padStart(2, "0")}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Pulse effect for seconds */}
        {isSeconds && (
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gold-300/10"
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </motion.div>

      <span className={cn(
        "text-stone-500 text-xs sm:text-sm mt-3 uppercase tracking-widest font-medium",
        "transition-colors duration-200 group-hover:text-stone-700"
      )}>
        {label}
      </span>
    </motion.div>
  );
}

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isWeddingDay, setIsWeddingDay] = useState(false);

  useEffect(() => {
    // Initial calculation
    const initial = calculateTimeLeft();
    setTimeLeft(initial);

    if (
      initial.days === 0 &&
      initial.hours === 0 &&
      initial.minutes === 0 &&
      initial.seconds === 0
    ) {
      setIsWeddingDay(true);
    }

    // Update every second
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        setIsWeddingDay(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Show skeleton while loading on client
  if (timeLeft === null) {
    return (
      <section className="py-20 sm:py-28 bg-gradient-to-b from-cream-50 to-cream-100/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="h-48 flex items-center justify-center">
            <div className="flex gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-20 h-28 sm:w-28 sm:h-36 bg-white/50 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isWeddingDay) {
    return (
      <section className="py-20 sm:py-28 bg-gradient-to-b from-cream-50 to-cream-100/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block text-6xl mb-4"
            >
              💍
            </motion.div>
            <h2 className="font-display text-display-sm sm:text-display-md text-stone-800">
              ¡Hoy es el gran día!
            </h2>
            <p className="text-stone-600 text-lg max-w-md mx-auto">
              ¡Celebremos juntos este momento tan especial!
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-20 sm:py-28 bg-gradient-to-b from-cream-50 to-cream-100/50 relative overflow-hidden"
      aria-label="Cuenta atrás para la boda"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #D4AF37 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }} />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="text-gold-400 text-sm font-medium tracking-widest uppercase mb-3"
        >
          Faltan
        </motion.p>

        {/* Main Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="font-display text-3xl sm:text-4xl md:text-5xl text-stone-800 mb-12"
        >
          Cuenta atrás
        </motion.h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-3xl mx-auto">
          <CountdownUnit value={timeLeft.days} label="Días" delay={0.1} />
          <CountdownUnit value={timeLeft.hours} label="Horas" delay={0.15} />
          <CountdownUnit value={timeLeft.minutes} label="Minutos" delay={0.2} />
          <CountdownUnit value={timeLeft.seconds} label="Segundos" delay={0.25} isSeconds />
        </div>

        {/* Date Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-gold-100 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-gold-300 animate-pulse" />
            <span className="text-stone-600 text-sm font-medium">
              {WEDDING_CONFIG.date.day}, {WEDDING_CONFIG.date.display}
            </span>
          </span>
        </motion.div>
      </div>
    </section>
  );
}
