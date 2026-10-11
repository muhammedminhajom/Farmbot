import { ForecastDay, HistoricalWeather, LocationData, WeatherData } from '@/types';

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export async function reverseGeocode(lat: number, lon: number): Promise<{village: string, district: string}> {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${API_KEY}&result_type=locality|sublocality|administrative_area_level_2`;
    const res = await fetch(url);
    const data = await res.json();
    
    let village = 'Kerala';
    let district = 'Kerala';
    
    if (data.results && data.results.length > 0) {
      const addressComponents = data.results[0].address_components;
      for (const comp of addressComponents) {
        if (comp.types.includes('locality') || comp.types.includes('sublocality')) {
          village = comp.long_name;
        }
        if (comp.types.includes('administrative_area_level_2')) {
          district = comp.long_name;
        }
      }
    }
    return { village, district };
  } catch (e) {
    return { village: 'Kerala', district: 'Kerala' };
  }
}

export async function getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
  try {
    return {
      temp: 28 + Math.random() * 5,
      humidity: 60 + Math.random() * 20,
      description: 'Partly cloudy',
      rain: Math.random() > 0.5 ? 2.5 : 0,
      windSpeed: 10 + Math.random() * 10,
      icon: '02d'
    };
  } catch (e) {
    return {
      temp: 30, humidity: 75, description: 'Unknown', rain: 0, windSpeed: 5, icon: ''
    };
  }
}

export async function getWeatherForecast(lat: number, lon: number): Promise<{forecast: ForecastDay[], history: HistoricalWeather}> {
  try {
    const forecast: ForecastDay[] = Array.from({length: 5}).map((_, i) => ({
      date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
      maxTemp: 32 + Math.random() * 3,
      minTemp: 24 + Math.random() * 3,
      humidity: 70 + Math.random() * 10,
      rain: Math.random() * 15,
      description: 'Scattered thunderstorms'
    }));
    
    const history: HistoricalWeather = {
      avgRain: Math.random() * 5,
      avgHumidity: 70 + Math.random() * 10
    };
    
    return { forecast, history };
  } catch (e) {
    return {
      forecast: [],
      history: { avgRain: 0, avgHumidity: 0 }
    };
  }
}
