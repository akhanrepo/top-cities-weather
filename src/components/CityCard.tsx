'use client';

import { Weather } from '@/types/weather';
import { useTemperature } from '@/context/TemperatureContext';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { WeatherAlertBadge } from './WeatherAlertBadge';
import { CityTime } from './CityTime';
import { WeatherDetails } from './WeatherDetails';

interface CityCardProps {
    weather: Weather;
}

export function CityCard({ weather }: CityCardProps) {
    const { unit, convertTemp } = useTemperature();
    const { isFavorite, toggleFavorite } = useUserPreferences();

    const getConditionIcon = (condition: string) => {
        switch (condition.toLowerCase()) {
            case 'sunny': return '☀️';
            case 'cloudy': return '☁️';
            case 'rainy': return '🌧️';
            case 'snowy': return '❄️';
            case 'partly cloudy': return '⛅';
            case 'thunderstorm': return '⛈️';
            case 'clear': return '🌙';
            default: return '🌡️';
        }
    };

    const favorite = isFavorite(weather.city);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 dark:border-gray-700 flex flex-col">
            {/* Header with favorite and time */}
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{weather.city}</h3>
                <button
                    onClick={() => toggleFavorite(weather.city)}
                    className="text-2xl focus:outline-none hover:scale-110 transition-transform"
                    aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                    {favorite ? '⭐' : '☆'}
                </button>
            </div>

            {/* City Time */}
            <div className="mb-4">
                <CityTime city={weather.city} />
            </div>

            {/* Weather Alerts */}
            {weather.alerts && weather.alerts.length > 0 && (
                <div className="mb-4">
                    <WeatherAlertBadge alerts={weather.alerts} />
                </div>
            )}

            {/* Main Weather Display */}
            <div className="flex flex-col items-center text-center mb-4">
                <div className="text-4xl mb-4">{getConditionIcon(weather.condition)}</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {convertTemp(weather.temperature)}°{unit}
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">{weather.condition}</p>
            </div>

            {/* Basic Stats */}
            <div className="w-full grid grid-cols-2 gap-2 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4 mb-4">
                <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider opacity-70">Humidity</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{weather.humidity}%</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider opacity-70">Wind</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{weather.windSpeed} km/h</span>
                </div>
            </div>

            {/* Expandable Details */}
            <WeatherDetails weather={weather} unit={unit} convertTemp={convertTemp} />
        </div>
    );
}

