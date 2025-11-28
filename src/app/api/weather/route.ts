import { NextResponse } from 'next/server';
import { getWeatherReport } from '@/services/weatherService';

export async function GET() {
    try {
        const weatherData = await getWeatherReport();
        return NextResponse.json(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
    }
}
