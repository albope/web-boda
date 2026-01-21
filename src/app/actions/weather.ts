'use server'

// Coordenadas de Jumilla, Murcia
const JUMILLA_COORDS = {
  lat: 38.4781,
  lon: -1.3259,
}

// Fecha de la boda
const WEDDING_DATE = '2026-11-14'

export interface WeatherData {
  date: string
  temp: number
  tempMin: number
  tempMax: number
  feelsLike: number
  humidity: number
  description: string
  icon: string
  windSpeed: number
}

export interface WeatherResult {
  success: boolean
  data?: WeatherData
  cached?: boolean
  error?: string
  advice?: string
}

// Caché en memoria con TTL de 1 hora
let weatherCache: {
  data: WeatherData | null
  timestamp: number
} = {
  data: null,
  timestamp: 0,
}

const CACHE_TTL = 60 * 60 * 1000 // 1 hora en milisegundos

function getClothingAdvice(temp: number, description: string): string {
  const isRainy = description.toLowerCase().includes('lluvia') ||
                  description.toLowerCase().includes('rain')

  if (temp < 10) {
    return isRainy
      ? 'Temperatura fría con lluvia. Recomendamos abrigo elegante y paraguas.'
      : 'Temperatura fría. Recomendamos abrigo elegante o chal para las señoras.'
  } else if (temp < 15) {
    return isRainy
      ? 'Temperatura fresca con lluvia. Recomendamos chaqueta y paraguas.'
      : 'Temperatura fresca. Una chaqueta o chal será útil, especialmente para la noche.'
  } else if (temp < 20) {
    return isRainy
      ? 'Temperatura agradable con posibilidad de lluvia. Llevad paraguas por si acaso.'
      : 'Temperatura agradable para la época. Ideal para el código de vestimenta elegante.'
  } else {
    return isRainy
      ? 'Temperatura cálida con lluvia. Ropa ligera elegante y paraguas.'
      : 'Temperatura cálida. Ropa elegante y ligera será perfecta.'
  }
}

function translateDescription(description: string): string {
  const translations: Record<string, string> = {
    'clear sky': 'Cielo despejado',
    'few clouds': 'Pocas nubes',
    'scattered clouds': 'Nubes dispersas',
    'broken clouds': 'Nuboso',
    'overcast clouds': 'Muy nuboso',
    'shower rain': 'Chubascos',
    'rain': 'Lluvia',
    'light rain': 'Lluvia ligera',
    'moderate rain': 'Lluvia moderada',
    'heavy rain': 'Lluvia intensa',
    'thunderstorm': 'Tormenta',
    'snow': 'Nieve',
    'mist': 'Neblina',
    'fog': 'Niebla',
    'haze': 'Calima',
  }

  return translations[description.toLowerCase()] || description
}

export async function getWeddingWeather(): Promise<WeatherResult> {
  const apiKey = process.env.OPENWEATHER_API_KEY

  if (!apiKey) {
    console.log('OpenWeather API key no configurada')
    return {
      success: false,
      error: 'El servicio de clima no está configurado',
    }
  }

  // Verificar caché
  const now = Date.now()
  if (weatherCache.data && (now - weatherCache.timestamp) < CACHE_TTL) {
    return {
      success: true,
      data: weatherCache.data,
      cached: true,
      advice: getClothingAdvice(weatherCache.data.temp, weatherCache.data.description),
    }
  }

  try {
    // Calcular días hasta la boda
    const weddingDate = new Date(WEDDING_DATE)
    const today = new Date()
    const diffTime = weddingDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    // Si faltan más de 16 días, usamos datos climatológicos históricos promedio
    // OpenWeather solo da pronóstico hasta 16 días
    if (diffDays > 16) {
      // Datos climatológicos promedio de Jumilla en noviembre
      const historicalData: WeatherData = {
        date: WEDDING_DATE,
        temp: 13,
        tempMin: 7,
        tempMax: 18,
        feelsLike: 12,
        humidity: 65,
        description: 'Clima típico de noviembre',
        icon: '02d',
        windSpeed: 10,
      }

      return {
        success: true,
        data: historicalData,
        cached: false,
        advice: `Basado en datos históricos: ${getClothingAdvice(historicalData.temp, historicalData.description)}`,
      }
    }

    // Si estamos dentro del rango de pronóstico, usar la API
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${JUMILLA_COORDS.lat}&lon=${JUMILLA_COORDS.lon}&appid=${apiKey}&units=metric&lang=es`

    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Revalidar cada hora
    })

    if (!response.ok) {
      throw new Error(`Error de API: ${response.status}`)
    }

    const data = await response.json()

    // Buscar el pronóstico más cercano a la fecha de la boda a las 12:00
    const weddingDateStr = WEDDING_DATE
    const targetTime = `${weddingDateStr} 12:00:00`

    let closestForecast = data.list[0]
    let minDiff = Infinity

    for (const forecast of data.list) {
      const forecastDate = forecast.dt_txt.split(' ')[0]
      if (forecastDate === weddingDateStr) {
        const forecastTime = new Date(forecast.dt_txt).getTime()
        const targetDateTime = new Date(targetTime).getTime()
        const diff = Math.abs(forecastTime - targetDateTime)
        if (diff < minDiff) {
          minDiff = diff
          closestForecast = forecast
        }
      }
    }

    const weatherData: WeatherData = {
      date: WEDDING_DATE,
      temp: Math.round(closestForecast.main.temp),
      tempMin: Math.round(closestForecast.main.temp_min),
      tempMax: Math.round(closestForecast.main.temp_max),
      feelsLike: Math.round(closestForecast.main.feels_like),
      humidity: closestForecast.main.humidity,
      description: translateDescription(closestForecast.weather[0].description),
      icon: closestForecast.weather[0].icon,
      windSpeed: Math.round(closestForecast.wind.speed * 3.6), // m/s a km/h
    }

    // Actualizar caché
    weatherCache = {
      data: weatherData,
      timestamp: now,
    }

    return {
      success: true,
      data: weatherData,
      cached: false,
      advice: getClothingAdvice(weatherData.temp, weatherData.description),
    }
  } catch (error) {
    console.error('Error obteniendo clima:', error)

    // Si hay datos en caché aunque estén expirados, devolverlos como fallback
    if (weatherCache.data) {
      return {
        success: true,
        data: weatherCache.data,
        cached: true,
        advice: getClothingAdvice(weatherCache.data.temp, weatherCache.data.description),
      }
    }

    return {
      success: false,
      error: 'No se pudo obtener el pronóstico del tiempo',
    }
  }
}
