"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  CloudFog,
  Thermometer,
  Wind,
  Droplets,
  Shirt,
} from "lucide-react";
import { getWeddingWeather, type WeatherData } from "@/app/actions/weather";

function getWeatherIcon(iconCode: string) {
  // Iconos de OpenWeather: https://openweathermap.org/weather-conditions
  const iconMap: Record<string, React.ReactNode> = {
    "01d": <Sun className="w-10 h-10 text-yellow-500" />,
    "01n": <Sun className="w-10 h-10 text-yellow-400" />,
    "02d": <Cloud className="w-10 h-10 text-gray-400" />,
    "02n": <Cloud className="w-10 h-10 text-gray-500" />,
    "03d": <Cloud className="w-10 h-10 text-gray-400" />,
    "03n": <Cloud className="w-10 h-10 text-gray-500" />,
    "04d": <Cloud className="w-10 h-10 text-gray-500" />,
    "04n": <Cloud className="w-10 h-10 text-gray-600" />,
    "09d": <CloudRain className="w-10 h-10 text-blue-400" />,
    "09n": <CloudRain className="w-10 h-10 text-blue-500" />,
    "10d": <CloudRain className="w-10 h-10 text-blue-400" />,
    "10n": <CloudRain className="w-10 h-10 text-blue-500" />,
    "11d": <CloudRain className="w-10 h-10 text-purple-500" />,
    "11n": <CloudRain className="w-10 h-10 text-purple-600" />,
    "13d": <CloudSnow className="w-10 h-10 text-blue-200" />,
    "13n": <CloudSnow className="w-10 h-10 text-blue-300" />,
    "50d": <CloudFog className="w-10 h-10 text-gray-400" />,
    "50n": <CloudFog className="w-10 h-10 text-gray-500" />,
  };

  return iconMap[iconCode] || <Cloud className="w-10 h-10 text-gray-400" />;
}

interface WeatherWidgetProps {
  className?: string;
}

export function WeatherWidget({ className = "" }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [advice, setAdvice] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const result = await getWeddingWeather();
        if (result.success && result.data) {
          setWeather(result.data);
          setAdvice(result.advice || "");
        } else {
          setError(result.error || "Error desconocido");
        }
      } catch {
        setError("Error al cargar el pronóstico");
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className={`bg-white rounded-2xl p-6 shadow-sm ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-stone-200 rounded w-3/4 mb-4"></div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-stone-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-8 bg-stone-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-stone-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return null; // No mostrar nada si hay error
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`bg-white rounded-2xl p-6 shadow-sm ${className}`}
    >
      <h3 className="font-display text-lg text-stone-800 mb-4 flex items-center gap-2">
        <Thermometer className="w-5 h-5 text-gold-400" />
        Pronóstico para el día
      </h3>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex-shrink-0">{getWeatherIcon(weather.icon)}</div>
        <div>
          <div className="text-3xl font-semibold text-stone-800">
            {weather.temp}°C
          </div>
          <div className="text-stone-600 capitalize">{weather.description}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
        <div className="flex items-center gap-1.5 text-stone-600">
          <Thermometer className="w-4 h-4 text-red-400" />
          <span>
            {weather.tempMin}° / {weather.tempMax}°
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-stone-600">
          <Droplets className="w-4 h-4 text-blue-400" />
          <span>{weather.humidity}%</span>
        </div>
        <div className="flex items-center gap-1.5 text-stone-600">
          <Wind className="w-4 h-4 text-gray-400" />
          <span>{weather.windSpeed} km/h</span>
        </div>
      </div>

      {advice && (
        <div className="bg-gold-50 rounded-lg p-4 mt-4">
          <div className="flex items-start gap-2">
            <Shirt className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-stone-700">{advice}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
