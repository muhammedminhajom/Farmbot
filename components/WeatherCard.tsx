import { WeatherData, ForecastDay } from '@/types';
import { getWeatherEmoji, formatTemp } from '@/utils/formatters';

export default function WeatherCard({ weather, forecast }: { weather: WeatherData, forecast: ForecastDay[] }) {
  return (
    <div className="bg-sky rounded-2xl p-4 shadow-sm w-full mx-auto my-4 border border-blue-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-blue-800">ഇപ്പോഴത്തെ കാലാവസ്ഥ</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-4xl">{getWeatherEmoji(weather.description)}</span>
            <span className="text-3xl font-bold text-gray-900">{formatTemp(weather.temp)}</span>
          </div>
          <p className="text-xs text-gray-600 mt-1 capitalize">{weather.description}</p>
        </div>
        <div className="text-right text-sm space-y-1">
          <p className="text-blue-900 font-medium">💧 {weather.humidity}%</p>
          <p className="text-blue-900 font-medium">💨 {weather.windSpeed} km/h</p>
          <p className="text-blue-900 font-medium">🌧️ {weather.rain} mm</p>
        </div>
      </div>
      
      {forecast && forecast.length > 0 && (
        <div className="pt-3 border-t border-blue-200 overflow-x-auto pb-1">
          <div className="flex space-x-3 w-max">
            {forecast.map((day, i) => {
               const dayName = new Date(day.date).toLocaleDateString('ml-IN', { weekday: 'short' });
               return (
                <div key={i} className="flex flex-col items-center bg-white/60 rounded-lg p-2 min-w-[60px]">
                  <span className="text-xs font-medium text-gray-700">{dayName}</span>
                  <span className="text-xl my-1">{getWeatherEmoji(day.description)}</span>
                  <span className="text-xs font-bold text-gray-900">{formatTemp(day.maxTemp)}</span>
                </div>
               );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
