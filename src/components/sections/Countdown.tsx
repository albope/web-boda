"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { WEDDING_CONFIG } from "@/config/wedding";
import { cn } from "@/lib/utils";

type WeddingState = "countdown" | "wedding-day" | "married";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface TimeInfo {
  timeLeft: TimeLeft;
  state: WeddingState;
  daysSinceWedding: number;
}

function calculateTimeInfo(): TimeInfo {
  const weddingDate = new Date(WEDDING_CONFIG.date.iso);
  const now = new Date();
  const difference = weddingDate.getTime() - now.getTime();

  // Check if it's the wedding day (same calendar day)
  const isWeddingDay =
    weddingDate.toDateString() === now.toDateString();

  // Check if wedding has passed
  const weddingHasPassed = difference < 0 && !isWeddingDay;

  // Calculate days since wedding
  const daysSinceWedding = weddingHasPassed
    ? Math.floor(Math.abs(difference) / (1000 * 60 * 60 * 24))
    : 0;

  let state: WeddingState = "countdown";
  if (isWeddingDay) {
    state = "wedding-day";
  } else if (weddingHasPassed) {
    state = "married";
  }

  if (difference <= 0) {
    return {
      timeLeft: { days: 0, hours: 0, minutes: 0, seconds: 0 },
      state,
      daysSinceWedding,
    };
  }

  return {
    timeLeft: {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    },
    state,
    daysSinceWedding,
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

function fireConfetti() {
  const duration = 3000;
  const end = Date.now() + duration;

  const colors = ["#D4AF37", "#F5E6D3", "#ffffff", "#B8860B"];

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

export function Countdown() {
  const [timeInfo, setTimeInfo] = useState<TimeInfo | null>(null);
  const confettiFired = useRef(false);

  const currentState = timeInfo?.state ?? "countdown";

  // Fire confetti on wedding day
  useEffect(() => {
    if (currentState === "wedding-day" && !confettiFired.current) {
      confettiFired.current = true;
      fireConfetti();
    }
  }, [currentState]);

  useEffect(() => {
    const initial = calculateTimeInfo();
    setTimeInfo(initial);

    const timer = setInterval(() => {
      setTimeInfo(calculateTimeInfo());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Show skeleton while loading on client
  if (timeInfo === null) {
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

  // Wedding day state
  if (currentState === "wedding-day") {
    return (
      <>
                <section className="py-20 sm:py-28 bg-gradient-to-b from-cream-50 to-cream-100/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block text-7xl sm:text-8xl"
              >
                💒
              </motion.div>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-stone-800">
                ¡Hoy es el gran día!
              </h2>
              <p className="text-stone-600 text-lg sm:text-xl max-w-md mx-auto">
                {WEDDING_CONFIG.date.day}, {WEDDING_CONFIG.date.display}
              </p>
              <motion.button
                onClick={fireConfetti}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 px-6 py-3 bg-gold-400 text-white rounded-full font-medium hover:bg-gold-500 transition-colors"
              >
                🎉 ¡Celebrar!
              </motion.button>
            </motion.div>
          </div>
        </section>
      </>
    );
  }

  // Married state (after wedding)
  if (currentState === "married") {
    return (
      <>
                <section className="py-20 sm:py-28 bg-gradient-to-b from-cream-50 to-cream-100/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block text-7xl sm:text-8xl"
              >
                💍
              </motion.div>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-stone-800">
                Ya somos marido y mujer 💍
              </h2>
              <p className="text-stone-600 text-lg sm:text-xl max-w-md mx-auto">
                Gracias por acompañarnos en este día tan especial
              </p>
              {timeInfo.daysSinceWedding > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-gold-100 shadow-sm"
                >
                  <span className="text-stone-600 text-sm font-medium">
                    {timeInfo.daysSinceWedding} {timeInfo.daysSinceWedding === 1 ? "día" : "días"} casados
                  </span>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>
      </>
    );
  }

  // Countdown state (default)
  return (
    <>
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
            <CountdownUnit value={timeInfo.timeLeft.days} label="Días" delay={0.1} />
            <CountdownUnit value={timeInfo.timeLeft.hours} label="Horas" delay={0.15} />
            <CountdownUnit value={timeInfo.timeLeft.minutes} label="Minutos" delay={0.2} />
            <CountdownUnit value={timeInfo.timeLeft.seconds} label="Segundos" delay={0.25} isSeconds />
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
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-400" />
              </span>
              <span className="text-stone-600 text-sm font-medium">
                {WEDDING_CONFIG.date.day}, {WEDDING_CONFIG.date.display}
              </span>
            </span>
          </motion.div>
        </div>
      </section>
    </>
  );
}
