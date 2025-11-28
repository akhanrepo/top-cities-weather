import { formatInTimeZone } from 'date-fns-tz';

// Mapping of cities to their IANA timezones
export const CITY_TIMEZONES: Record<string, string> = {
    "Tokyo": "Asia/Tokyo",
    "Delhi": "Asia/Kolkata",
    "Shanghai": "Asia/Shanghai",
    "Sao Paulo": "America/Sao_Paulo",
    "Mexico City": "America/Mexico_City",
    "Cairo": "Africa/Cairo",
    "Mumbai": "Asia/Kolkata",
    "Beijing": "Asia/Shanghai",
    "Dhaka": "Asia/Dhaka",
    "Osaka": "Asia/Tokyo",
    "New York": "America/New_York",
    "Karachi": "Asia/Karachi",
    "Buenos Aires": "America/Argentina/Buenos_Aires",
    "Chongqing": "Asia/Shanghai",
    "Istanbul": "Europe/Istanbul",
    "Kolkata": "Asia/Kolkata",
    "Manila": "Asia/Manila",
    "Lagos": "Africa/Lagos",
    "Rio de Janeiro": "America/Sao_Paulo",
    "Tianjin": "Asia/Shanghai",
    "Kinshasa": "Africa/Kinshasa",
    "Guangzhou": "Asia/Shanghai",
    "Los Angeles": "America/Los_Angeles",
    "Moscow": "Europe/Moscow",
    "Shenzhen": "Asia/Shanghai",
    "Lahore": "Asia/Karachi",
    "Bangalore": "Asia/Kolkata",
    "Paris": "Europe/Paris",
    "Bogota": "America/Bogota",
    "Jakarta": "Asia/Jakarta",
    "Chennai": "Asia/Kolkata",
    "Lima": "America/Lima",
    "Bangkok": "Asia/Bangkok",
    "Seoul": "Asia/Seoul",
    "Nagoya": "Asia/Tokyo",
    "Hyderabad": "Asia/Kolkata",
    "London": "Europe/London",
    "Tehran": "Asia/Tehran",
    "Chicago": "America/Chicago",
    "Chengdu": "Asia/Shanghai",
    "Nanjing": "Asia/Shanghai",
    "Wuhan": "Asia/Shanghai",
    "Ho Chi Minh City": "Asia/Ho_Chi_Minh",
    "Luanda": "Africa/Luanda",
    "Ahmedabad": "Asia/Kolkata",
    "Kuala Lumpur": "Asia/Kuala_Lumpur",
    "Xi'an": "Asia/Shanghai",
    "Hong Kong": "Asia/Hong_Kong",
    "Dongguan": "Asia/Shanghai",
    "Hangzhou": "Asia/Shanghai",
};

/**
 * Get the timezone for a city
 */
export function getCityTimezone(city: string): string {
    return CITY_TIMEZONES[city] || 'UTC';
}

/**
 * Get the current time in a city's timezone
 */
export function getCityTime(city: string): string {
    const timezone = getCityTimezone(city);
    return formatInTimeZone(new Date(), timezone, 'HH:mm');
}

/**
 * Get the current date and time in a city's timezone
 */
export function getCityDateTime(city: string): string {
    const timezone = getCityTimezone(city);
    return formatInTimeZone(new Date(), timezone, 'MMM d, HH:mm');
}

/**
 * Get timezone offset display (e.g., "UTC+9")
 */
export function getTimezoneOffset(city: string): string {
    const timezone = getCityTimezone(city);
    const now = new Date();
    const offset = formatInTimeZone(now, timezone, 'XXX');
    return `UTC${offset}`;
}
