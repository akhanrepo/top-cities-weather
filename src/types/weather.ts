export interface AirQuality {
    aqi: number;
    category: string;
    color: string;
    pm2_5: number;
    pm10: number;
    co: number;
    no2: number;
    o3: number;
    so2: number;
}

export interface WeatherAlert {
    type: 'heatwave' | 'coldsnap' | 'heavyrain' | 'snow' | 'thunderstorm' | 'highwind';
    icon: string;
    message: string;
}

export interface DailyForecast {
    id: number;
    date: string; // Serialized date
    minTemp: number;
    maxTemp: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    uvIndex: number;
    precipitationProbability: number;
}

export interface Weather {
    id: number;
    city: string;
    temperature: number;
    feelsLike: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    uvIndex: number;
    precipitationProbability: number;
    airQuality: AirQuality;
    timezone: string;
    lastUpdated: string; // Serialized date
    forecasts?: DailyForecast[];
    alerts?: WeatherAlert[];
}
