"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Church, Wine, Utensils, Music, Heart, PartyPopper } from "lucide-react";
import { WEDDING_CONFIG } from "@/config/wedding";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  church: Church,
  wine: Wine,
  utensils: Utensils,
  music: Music,
  heart: Heart,
};

interface EventStatus {
  index: number;
  status: "past" | "current" | "upcoming";
  timeUntil?: { hours: number; minutes: number; seconds: number };
}

function getEventStatuses(): EventStatus[] {
  const now = new Date();
  const events = WEDDING_CONFIG.schedule;
  const statuses: EventStatus[] = [];

  for (let i = 0; i < events.length; i++) {
    const eventTime = new Date(events[i].isoTime);
    const nextEventTime = i < events.length - 1 ? new Date(events[i + 1].isoTime) : null;

    if (now < eventTime) {
      // Evento aún no ha empezado
      const diff = eventTime.getTime() - now.getTime();
      statuses.push({
        index: i,
        status: "upcoming",
        timeUntil: {
          hours: Math.floor(diff / (1000 * 60 * 60)),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        },
      });
    } else if (nextEventTime && now < nextEventTime) {
      // Evento actual (ya empezó pero el siguiente no)
      statuses.push({ index: i, status: "current" });
    } else if (!nextEventTime && now >= eventTime) {
      // Último evento y ya empezó
      statuses.push({ index: i, status: "current" });
    } else {
      // Evento pasado
      statuses.push({ index: i, status: "past" });
    }
  }

  return statuses;
}

function formatTimeUntil(time: { hours: number; minutes: number; seconds: number }): string {
  if (time.hours > 0) {
    return `${time.hours}h ${time.minutes}m`;
  }
  if (time.minutes > 0) {
    return `${time.minutes}m ${time.seconds}s`;
  }
  return `${time.seconds}s`;
}

interface TimelineEventProps {
  event: (typeof WEDDING_CONFIG.schedule)[number];
  status: EventStatus;
  index: number;
  isLast: boolean;
}

function TimelineEvent({ event, status, index, isLast }: TimelineEventProps) {
  const Icon = iconMap[event.icon] || Heart;
  const isCurrent = status.status === "current";
  const isPast = status.status === "past";
  const isUpcoming = status.status === "upcoming";
  const isNext = isUpcoming && index === WEDDING_CONFIG.schedule.findIndex((_, i) =>
    getEventStatuses()[i]?.status === "upcoming"
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={cn(
        "relative flex gap-4",
        isPast && "opacity-50"
      )}
    >
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-5 top-12 bottom-0 w-px">
          <div
            className={cn(
              "h-full w-full",
              isPast ? "bg-gold-300" : "bg-stone-200"
            )}
          />
          {isCurrent && (
            <motion.div
              className="absolute top-0 left-0 w-full bg-gold-400"
              initial={{ height: 0 }}
              animate={{ height: "100%" }}
              transition={{ duration: 2, ease: "linear" }}
            />
          )}
        </div>
      )}

      {/* Icon circle */}
      <div
        className={cn(
          "relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
          isCurrent
            ? "bg-gold-400 text-white shadow-lg shadow-gold-400/30 scale-110"
            : isPast
            ? "bg-gold-200 text-gold-600"
            : "bg-cream-100 text-stone-400 border border-stone-200"
        )}
      >
        <Icon className="w-5 h-5" />
        {isCurrent && (
          <motion.div
            className="absolute inset-0 rounded-full bg-gold-400"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>

      {/* Content */}
      <div className={cn("flex-1 pb-8", isLast && "pb-0")}>
        <div
          className={cn(
            "rounded-xl p-4 transition-all duration-300",
            isCurrent
              ? "bg-white shadow-md border border-gold-200"
              : "bg-white/50"
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p
                className={cn(
                  "font-display text-lg",
                  isCurrent ? "text-stone-800" : isPast ? "text-stone-500" : "text-stone-700"
                )}
              >
                {event.event}
              </p>
              <p className="text-sm text-stone-500">{event.location}</p>
            </div>
            <div className="text-right">
              <p
                className={cn(
                  "font-mono text-sm font-medium",
                  isCurrent ? "text-gold-500" : "text-stone-400"
                )}
              >
                {event.time}
              </p>
              {isCurrent && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="inline-flex items-center gap-1 text-xs text-gold-500 font-medium"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500" />
                  </span>
                  Ahora
                </motion.span>
              )}
              {isNext && status.timeUntil && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-gold-400 font-medium"
                >
                  en {formatTimeUntil(status.timeUntil)}
                </motion.p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface WeddingDayTimelineProps {
  onCelebrate: () => void;
}

export function WeddingDayTimeline({ onCelebrate }: WeddingDayTimelineProps) {
  const [eventStatuses, setEventStatuses] = useState<EventStatus[]>([]);

  useEffect(() => {
    setEventStatuses(getEventStatuses());

    const timer = setInterval(() => {
      setEventStatuses(getEventStatuses());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentEvent = eventStatuses.find((s) => s.status === "current");
  const nextEvent = eventStatuses.find((s) => s.status === "upcoming");

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-cream-50 to-cream-100/50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block text-5xl sm:text-6xl mb-4"
          >
            💒
          </motion.div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-stone-800 mb-2">
            ¡Hoy es el gran día!
          </h2>
          <p className="text-stone-600">
            {WEDDING_CONFIG.date.day}, {WEDDING_CONFIG.date.display}
          </p>
        </motion.div>

        {/* Current/Next event highlight */}
        {(currentEvent || nextEvent) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-8 p-4 sm:p-6 bg-white rounded-2xl shadow-sm border border-gold-100"
          >
            {currentEvent ? (
              <div className="text-center">
                <p className="text-xs uppercase tracking-wider text-gold-400 font-medium mb-1">
                  Ahora mismo
                </p>
                <p className="font-display text-xl sm:text-2xl text-stone-800">
                  {WEDDING_CONFIG.schedule[currentEvent.index].event}
                </p>
                <p className="text-sm text-stone-500 mt-1">
                  {WEDDING_CONFIG.schedule[currentEvent.index].location}
                </p>
              </div>
            ) : nextEvent?.timeUntil ? (
              <div className="text-center">
                <p className="text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                  Próximo evento en
                </p>
                <p className="font-display text-3xl sm:text-4xl text-gold-400 tabular-nums">
                  {formatTimeUntil(nextEvent.timeUntil)}
                </p>
                <p className="font-display text-lg text-stone-800 mt-2">
                  {WEDDING_CONFIG.schedule[nextEvent.index].event}
                </p>
              </div>
            ) : null}
          </motion.div>
        )}

        {/* Timeline */}
        <div className="relative">
          {WEDDING_CONFIG.schedule.map((event, index) => (
            <TimelineEvent
              key={event.isoTime}
              event={event}
              status={eventStatuses[index] || { index, status: "upcoming" }}
              index={index}
              isLast={index === WEDDING_CONFIG.schedule.length - 1}
            />
          ))}
        </div>

        {/* Celebrate button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="text-center mt-8"
        >
          <motion.button
            onClick={onCelebrate}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold-400 text-white rounded-full font-medium hover:bg-gold-500 transition-colors shadow-lg shadow-gold-400/20"
          >
            <PartyPopper className="w-5 h-5" />
            ¡Celebrar!
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
