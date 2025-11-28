import { prisma } from '@/lib/prisma';
import { TOP_50_CITIES } from '@/config/cities';
import { fetchWeatherForCity, fetchForecastForCity } from '@/lib/weather';
import { getCityTimezone } from '@/lib/timezone';
import type { WeatherAlert } from '@/types/weather';

const API_KEY = process.env.WEATHER_API_KEY || '';

if (!API_KEY) {
    console.warn('WARNING: WEATHER_API_KEY not found in environment variables');
}

/**
 * Detect weather alerts based on conditions
 */
function detectWeatherAlerts(
    temp: number,
    windSpeed: number,
    condition: string,
    precipProb: number
): WeatherAlert[] {
    const alerts: WeatherAlert[] = [];

    // Heatwave
    if (temp >= 35) {
        alerts.push({
            type: 'heatwave',
            icon: '🔥',
            message: `Extreme heat warning: ${temp}°C`,
        });
    }

    // Cold snap
    if (temp <= -10) {
        alerts.push({
            type: 'coldsnap',
            icon: '❄️',
            message: `Extreme cold warning: ${temp}°C`,
        });
    }

    // High wind
    if (windSpeed >= 50) {
        alerts.push({
            type: 'highwind',
            icon: '💨',
            message: `High wind warning: ${windSpeed} km/h`,
        });
    }

    // Heavy rain
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('heavy rain') || (conditionLower.includes('rain') && precipProb >= 80)) {
        alerts.push({
            type: 'heavyrain',
            icon: '🌧️',
            message: 'Heavy rainfall expected',
        });
    }

    // Snow
    if (conditionLower.includes('snow') || conditionLower.includes('blizzard')) {
        alerts.push({
            type: 'snow',
            icon: '⛄',
            message: 'Snow expected',
        });
    }

    // Thunderstorm
    if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
        alerts.push({
            type: 'thunderstorm',
            icon: '⛈️',
            message: 'Thunderstorm warning',
        });
    }

    return alerts;
}

/**
 * Fetch and update weather data for all cities
 */
export async function getWeatherReport() {
    const now = new Date();
    const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);

    // Check if we have fresh data
    const existingData = await prisma.weather.findMany({
        include: {
            forecasts: true,
        },
    });

    const isStale = existingData.length < TOP_50_CITIES.length || existingData.some(w => w.lastUpdated < fourHoursAgo);

    if (isStale) {
        console.log('Data is stale or missing. Fetching fresh data from WeatherAPI...');

        try {
            // Fetch weather and forecasts for all cities
            const weatherDataPromises = TOP_50_CITIES.map(async (city) => {
                try {
                    const [currentWeather, forecasts] = await Promise.all([
                        fetchWeatherForCity(city, API_KEY),
                        fetchForecastForCity(city, API_KEY, 7),
                    ]);

                    // Get timezone
                    const timezone = getCityTimezone(city);

                    // Detect alerts
                    const alerts = detectWeatherAlerts(
                        currentWeather.temperature,
                        currentWeather.windSpeed,
                        currentWeather.condition,
                        forecasts[0]?.precipitationProbability || 0
                    );

                    return {
                        city: currentWeather.city,
                        temperature: currentWeather.temperature,
                        feelsLike: currentWeather.feelsLike,
                        condition: currentWeather.condition,
                        humidity: currentWeather.humidity,
                        windSpeed: currentWeather.windSpeed,
                        windDirection: currentWeather.windDirection,
                        uvIndex: currentWeather.uvIndex,
                        precipitationProbability: forecasts[0]?.precipitationProbability || 0,
                        airQuality: currentWeather.airQuality,
                        timezone: timezone,
                        alerts: alerts,
                        forecasts: forecasts,
                        lastUpdated: now,
                    };
                } catch (error) {
                    console.error(`Failed to fetch data for ${city}:`, error);
                    return null;
                }
            });

            const freshData = (await Promise.all(weatherDataPromises)).filter(d => d !== null);

            if (freshData.length === 0) {
                throw new Error('Failed to fetch weather data for any city');
            }

            // Update database
            await prisma.$transaction(
                freshData.map(data => {
                    return prisma.weather.upsert({
                        where: { city: data!.city },
                        update: {
                            temperature: data!.temperature,
                            feelsLike: data!.feelsLike,
                            condition: data!.condition,
                            humidity: data!.humidity,
                            windSpeed: data!.windSpeed,
                            windDirection: data!.windDirection,
                            uvIndex: data!.uvIndex,
                            precipitationProbability: data!.precipitationProbability,
                            airQualityAqi: data!.airQuality.aqi,
                            airQualityCategory: data!.airQuality.category,
                            airQualityColor: data!.airQuality.color,
                            airQualityPm25: data!.airQuality.pm2_5,
                            airQualityPm10: data!.airQuality.pm10,
                            airQualityCo: data!.airQuality.co,
                            airQualityNo2: data!.airQuality.no2,
                            airQualityO3: data!.airQuality.o3,
                            airQualitySo2: data!.airQuality.so2,
                            timezone: data!.timezone,
                            alerts: JSON.stringify(data!.alerts),
                            lastUpdated: now,
                            forecasts: {
                                deleteMany: {},
                                create: data!.forecasts.map(f => ({
                                    date: new Date(f.date),
                                    minTemp: f.minTemp,
                                    maxTemp: f.maxTemp,
                                    condition: f.condition,
                                    humidity: f.humidity,
                                    windSpeed: f.windSpeed,
                                    uvIndex: f.uvIndex,
                                    precipitationProbability: f.precipitationProbability,
                                })),
                            },
                        },
                        create: {
                            city: data!.city,
                            temperature: data!.temperature,
                            feelsLike: data!.feelsLike,
                            condition: data!.condition,
                            humidity: data!.humidity,
                            windSpeed: data!.windSpeed,
                            windDirection: data!.windDirection,
                            uvIndex: data!.uvIndex,
                            precipitationProbability: data!.precipitationProbability,
                            airQualityAqi: data!.airQuality.aqi,
                            airQualityCategory: data!.airQuality.category,
                            airQualityColor: data!.airQuality.color,
                            airQualityPm25: data!.airQuality.pm2_5,
                            airQualityPm10: data!.airQuality.pm10,
                            airQualityCo: data!.airQuality.co,
                            airQualityNo2: data!.airQuality.no2,
                            airQualityO3: data!.airQuality.o3,
                            airQualitySo2: data!.airQuality.so2,
                            timezone: data!.timezone,
                            alerts: JSON.stringify(data!.alerts),
                            lastUpdated: now,
                            forecasts: {
                                create: data!.forecasts.map(f => ({
                                    date: new Date(f.date),
                                    minTemp: f.minTemp,
                                    maxTemp: f.maxTemp,
                                    condition: f.condition,
                                    humidity: f.humidity,
                                    windSpeed: f.windSpeed,
                                    uvIndex: f.uvIndex,
                                    precipitationProbability: f.precipitationProbability,
                                })),
                            },
                        },
                    });
                })
            );

            console.log(`Successfully updated weather data for ${freshData.length} cities`);
        } catch (error) {
            console.error('Error updating weather data:', error);
            // Fall through to return existing data if update fails
        }
    } else {
        console.log('Serving data from cache.');
    }

    // Fetch the latest data with forecasts
    const weatherData = await prisma.weather.findMany({
        include: {
            forecasts: {
                orderBy: {
                    date: 'asc',
                },
            },
        },
    });

    // Transform to match expected format
    return weatherData.map(w => ({
        id: w.id,
        city: w.city,
        temperature: w.temperature,
        feelsLike: w.feelsLike,
        condition: w.condition,
        humidity: w.humidity,
        windSpeed: w.windSpeed,
        windDirection: w.windDirection,
        uvIndex: w.uvIndex,
        precipitationProbability: w.precipitationProbability,
        airQuality: {
            aqi: w.airQualityAqi,
            category: w.airQualityCategory,
            color: w.airQualityColor,
            pm2_5: w.airQualityPm25,
            pm10: w.airQualityPm10,
            co: w.airQualityCo,
            no2: w.airQualityNo2,
            o3: w.airQualityO3,
            so2: w.airQualitySo2,
        },
        timezone: w.timezone,
        lastUpdated: w.lastUpdated.toISOString(),
        alerts: w.alerts ? JSON.parse(w.alerts) : [],
        forecasts: w.forecasts.map(f => ({
            id: f.id,
            date: f.date.toISOString(),
            minTemp: f.minTemp,
            maxTemp: f.maxTemp,
            condition: f.condition,
            humidity: f.humidity,
            windSpeed: f.windSpeed,
            uvIndex: f.uvIndex,
            precipitationProbability: f.precipitationProbability,
        })),
    }));
}

