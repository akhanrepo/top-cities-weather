'use client';

import { Weather } from '@/types/weather';
import { useTemperature } from '@/context/TemperatureContext';

interface CityListItemProps {
    weather: Weather;
}

export function CityListItem({ weather }: CityListItemProps) {
    const { unit, convertTemp } = useTemperature();

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

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="text-3xl">{getConditionIcon(weather.condition)}</div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{weather.city}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{weather.condition}</p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {convertTemp(weather.temperature)}°{unit}
                    </div>
                </div>

                <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="text-center">
                        <div className="text-xs uppercase tracking-wider opacity-70">Humidity</div>
                        <div className="font-semibold text-gray-700 dark:text-gray-300">{weather.humidity}%</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs uppercase tracking-wider opacity-70">Wind</div>
                        <div className="font-semibold text-gray-700 dark:text-gray-300">{weather.windSpeed} km/h</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
