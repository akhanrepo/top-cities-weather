interface WeatherAPICurrentResponse {
    location: {
        name: string;
        region: string;
        country: string;
        lat: number;
        lon: number;
        tz_id: string;
        localtime: string;
    };
    current: {
        temp_c: number;
        temp_f: number;
        condition: {
            text: string;
            icon: string;
            code: number;
        };
        wind_mph: number;
        wind_kph: number;
        wind_degree: number;
        wind_dir: string;
        humidity: number;
        feelslike_c: number;
        feelslike_f: number;
        uv: number;
        air_quality?: {
            co: number;
            no2: number;
            o3: number;
            so2: number;
            pm2_5: number;
            pm10: number;
            'us-epa-index': number;
        };
    };
}

interface WeatherAPIForecastResponse {
    location: {
        name: string;
        tz_id: string;
    };
    current: WeatherAPICurrentResponse['current'];
    forecast: {
        forecastday: Array<{
            date: string;
            day: {
                maxtemp_c: number;
                mintemp_c: number;
                avgtemp_c: number;
                maxwind_kph: number;
                totalprecip_mm: number;
                avghumidity: number;
                daily_will_it_rain: number;
                daily_chance_of_rain: number;
                daily_will_it_snow: number;
                daily_chance_of_snow: number;
                condition: {
                    text: string;
                    icon: string;
                    code: number;
                };
                uv: number;
            };
        }>;
    };
}

export interface WeatherData {
    city: string;
    temperature: number;
    feelsLike: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    uvIndex: number;
    timezone: string;
    airQuality: {
        aqi: number;
        category: string;
        color: string;
        pm2_5: number;
        pm10: number;
        co: number;
        no2: number;
        o3: number;
        so2: number;
    };
    lastUpdated: Date;
}

export interface ForecastDay {
    date: string;
    minTemp: number;
    maxTemp: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    uvIndex: number;
    precipitationProbability: number;
}

export class WeatherAPIError extends Error {
    constructor(message: string, public statusCode?: number) {
        super(message);
        this.name = 'WeatherAPIError';
    }
}

/**
 * Get AQI category and color based on US EPA index
 */
function getAQIInfo(aqiIndex: number): { category: string; color: string } {
    if (aqiIndex === 1) return { category: 'Good', color: '#10b981' };
    if (aqiIndex === 2) return { category: 'Moderate', color: '#f59e0b' };
    if (aqiIndex === 3) return { category: 'Unhealthy for Sensitive', color: '#f97316' };
    if (aqiIndex === 4) return { category: 'Unhealthy', color: '#ef4444' };
    if (aqiIndex === 5) return { category: 'Very Unhealthy', color: '#9333ea' };
    if (aqiIndex === 6) return { category: 'Hazardous', color: '#7f1d1d' };
    return { category: 'Unknown', color: '#6b7280' };
}

/**
 * Fetch current weather with extended data for a city
 */
export async function fetchWeatherForCity(city: string, apiKey: string): Promise<WeatherData> {
    // Include aqi=yes to get air quality data
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}&aqi=yes`;

    try {
        const response = await fetch(url, {
            next: { revalidate: 0 }, // Don't cache, we want fresh data
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new WeatherAPIError('Invalid API key', 401);
            } else if (response.status === 400) {
                throw new WeatherAPIError(`Invalid city name: ${city}`, 400);
            } else {
                throw new WeatherAPIError(`API request failed with status ${response.status}`, response.status);
            }
        }

        const data: WeatherAPICurrentResponse = await response.json();

        // Process air quality data
        const aqiIndex = data.current.air_quality?.['us-epa-index'] || 1;
        const aqiInfo = getAQIInfo(aqiIndex);

        return {
            city: data.location.name,
            temperature: Math.round(data.current.temp_c),
            feelsLike: Math.round(data.current.feelslike_c),
            condition: data.current.condition.text,
            humidity: data.current.humidity,
            windSpeed: Math.round(data.current.wind_kph),
            windDirection: data.current.wind_dir,
            uvIndex: data.current.uv,
            timezone: data.location.tz_id,
            airQuality: {
                aqi: aqiIndex,
                category: aqiInfo.category,
                color: aqiInfo.color,
                pm2_5: data.current.air_quality?.pm2_5 || 0,
                pm10: data.current.air_quality?.pm10 || 0,
                co: data.current.air_quality?.co || 0,
                no2: data.current.air_quality?.no2 || 0,
                o3: data.current.air_quality?.o3 || 0,
                so2: data.current.air_quality?.so2 || 0,
            },
            lastUpdated: new Date(),
        };
    } catch (error) {
        if (error instanceof WeatherAPIError) {
            throw error;
        }
        throw new WeatherAPIError(`Failed to fetch weather for ${city}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Fetch 7-day forecast for a city
 */
export async function fetchForecastForCity(city: string, apiKey: string, days: number = 7): Promise<ForecastDay[]> {
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=${days}&aqi=no`;

    try {
        const response = await fetch(url, {
            next: { revalidate: 0 },
        });

        if (!response.ok) {
            throw new WeatherAPIError(`Forecast API request failed with status ${response.status}`, response.status);
        }

        const data: WeatherAPIForecastResponse = await response.json();

        return data.forecast.forecastday.map(day => ({
            date: day.date,
            minTemp: Math.round(day.day.mintemp_c),
            maxTemp: Math.round(day.day.maxtemp_c),
            condition: day.day.condition.text,
            humidity: day.day.avghumidity,
            windSpeed: Math.round(day.day.maxwind_kph),
            uvIndex: day.day.uv,
            precipitationProbability: day.day.daily_will_it_rain
                ? day.day.daily_chance_of_rain
                : day.day.daily_chance_of_snow,
        }));
    } catch (error) {
        if (error instanceof WeatherAPIError) {
            throw error;
        }
        throw new WeatherAPIError(`Failed to fetch forecast for ${city}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function fetchWeatherForCities(cities: string[], apiKey: string): Promise<WeatherData[]> {
    const weatherPromises = cities.map(city =>
        fetchWeatherForCity(city, apiKey).catch(error => {
            console.error(`Error fetching weather for ${city}:`, error);
            return null;
        })
    );

    const results = await Promise.all(weatherPromises);
    return results.filter((data): data is WeatherData => data !== null);
}

