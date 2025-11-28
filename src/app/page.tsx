'use client';

import { useEffect, useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ViewToggle } from '@/components/ViewToggle';
import { TemperatureToggle } from '@/components/TemperatureToggle';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CityCard } from '@/components/CityCard';
import { CityListItem } from '@/components/CityListItem';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { Weather } from '@/types/weather';

type ForecastView = 'current' | 'tomorrow' | 'week';

export default function Home() {
    const { preferences, setViewMode, setSortOrder } = useUserPreferences();
    const [weatherData, setWeatherData] = useState<Weather[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [forecastView, setForecastView] = useState<ForecastView>('current');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/weather');
                if (!response.ok) {
                    throw new Error('Failed to fetch weather data');
                }
                const data = await response.json();
                setWeatherData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const filteredAndSortedData = useMemo(() => {
        let filtered = weatherData.filter(weather =>
            weather.city.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Sort favorites first, then by selected sort order
        filtered.sort((a, b) => {
            const aFav = preferences.favoriteCities.includes(a.city);
            const bFav = preferences.favoriteCities.includes(b.city);

            if (aFav && !bFav) return -1;
            if (!aFav && bFav) return 1;

            // Both favorite or both not favorite, sort by preference
            if (preferences.sortOrder === 'name') {
                return a.city.localeCompare(b.city);
            } else {
                return b.temperature - a.temperature;
            }
        });

        return filtered;
    }, [weatherData, searchQuery, preferences.favoriteCities, preferences.sortOrder]);

    const lastUpdated = weatherData.length > 0
        ? new Date(weatherData[0].lastUpdated).toLocaleString()
        : '';

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
            <Header />

            <main className="flex-grow px-4 md:px-8 py-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col gap-6 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                                Weather Dashboard
                            </h2>
                            {lastUpdated && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Last updated: {lastUpdated}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <ThemeToggle />
                            <TemperatureToggle />
                            <ViewToggle viewMode={preferences.viewMode} setViewMode={setViewMode} />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Search cities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                            value={preferences.sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as 'name' | 'temp')}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="name">Sort by Name</option>
                            <option value="temp">Sort by Temperature</option>
                        </select>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2">
                        <button
                            onClick={() => setForecastView('current')}
                            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${forecastView === 'current'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            Current Weather
                        </button>
                        <button
                            onClick={() => setForecastView('tomorrow')}
                            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${forecastView === 'tomorrow'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            Tomorrow's Weather
                        </button>
                        <button
                            onClick={() => setForecastView('week')}
                            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${forecastView === 'week'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            Next Week
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 py-12">
                        <p>{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <>
                        {forecastView === 'current' ? (
                            <>
                                {preferences.viewMode === 'card' ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {filteredAndSortedData.map((weather) => (
                                            <CityCard key={weather.city} weather={weather} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        {filteredAndSortedData.map((weather) => (
                                            <CityListItem key={weather.city} weather={weather} />
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                <p className="text-lg">Forecast view coming soon!</p>
                                <p className="text-sm mt-2">
                                    {forecastView === 'tomorrow' ? "Tomorrow's forecast" : "7-day forecast"} will be displayed here.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}
