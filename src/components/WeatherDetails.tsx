'use client';

import { useState } from 'react';
import type { Weather } from '@/types/weather';
import { AQIBadge } from './AQIBadge';

interface WeatherDetailsProps {
    weather: Weather;
    unit: 'C' | 'F';
    convertTemp: (celsius: number) => number;
}

export function WeatherDetails({ weather, unit, convertTemp }: WeatherDetailsProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const getUVLevel = (uv: number) => {
        if (uv <= 2) return { level: 'Low', color: 'text-green-600' };
        if (uv <= 5) return { level: 'Moderate', color: 'text-yellow-600' };
        if (uv <= 7) return { level: 'High', color: 'text-orange-600' };
        if (uv <= 10) return { level: 'Very High', color: 'text-red-600' };
        return { level: 'Extreme', color: 'text-purple-600' };
    };

    const uvInfo = getUVLevel(weather.uvIndex);

    return (
        <div className="w-full">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full text-left text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
            >
                {isExpanded ? '▼ Hide Details' : '▶ Show Details'}
            </button>

            {isExpanded && (
                <div className="mt-4 space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                    {/* Feels Like */}
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Feels Like</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {convertTemp(weather.feelsLike)}°{unit}
                        </span>
                    </div>

                    {/* UV Index */}
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">UV Index</span>
                        <span className={`text-sm font-semibold ${uvInfo.color}`}>
                            {weather.uvIndex} ({uvInfo.level})
                        </span>
                    </div>

                    {/* Precipitation Probability */}
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Rain Chance</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {weather.precipitationProbability}%
                        </span>
                    </div>

                    {/* Wind Direction */}
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Wind</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {weather.windSpeed} km/h {weather.windDirection}
                        </span>
                    </div>

                    {/* Air Quality */}
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                        <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">Air Quality</span>
                        <AQIBadge
                            aqi={weather.airQuality.aqi}
                            category={weather.airQuality.category}
                            color={weather.airQuality.color}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
