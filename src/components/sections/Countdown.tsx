"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { WEDDING_CONFIG } from "@/config/wedding";

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
}

function CountdownUnit({ value, label, delay }: CountdownUnitProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="flex flex-col items-center"
    >
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 min-w-[70px] sm:min-w-[90px]">
        <span
          className="font-display text-3xl sm:text-4xl md:text-5xl text-stone-800 tabular-nums"
          aria-live="polite"
        >
          {value.toString().padStart(2, "0")}
        </span>
      </div>
      <span className="text-stone-500 text-xs sm:text-sm mt-2 uppercase tracking-wide">
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

  // Show nothing while loading on client
  if (timeLeft === null) {
    return (
      <section className="py-16 sm:py-20 bg-cream-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="h-32 flex items-center justify-center">
            <div className="animate-pulse text-stone-400">Cargando...</div>
          </div>
        </div>
      </section>
    );
  }

  if (isWeddingDay) {
    return (
      <section className="py-16 sm:py-20 bg-cream-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-display-sm sm:text-display-md text-stone-800 mb-4">
              ¡Hoy es el gran día!
            </h2>
            <p className="text-stone-600 text-lg">
              ¡Celebremos juntos este momento tan especial!
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 bg-cream-50" aria-label="Cuenta atrás para la boda">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="font-display text-2xl sm:text-3xl text-stone-800 mb-8"
        >
          Cuenta atrás
        </motion.h2>

        <div className="flex justify-center gap-3 sm:gap-6">
          <CountdownUnit value={timeLeft.days} label="Días" delay={0.1} />
          <CountdownUnit value={timeLeft.hours} label="Horas" delay={0.2} />
          <CountdownUnit value={timeLeft.minutes} label="Minutos" delay={0.3} />
          <CountdownUnit value={timeLeft.seconds} label="Segundos" delay={0.4} />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-stone-500 text-sm mt-8"
        >
          para el {WEDDING_CONFIG.date.display}
        </motion.p>
      </div>
    </section>
  );
}
