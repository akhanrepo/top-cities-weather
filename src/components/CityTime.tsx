'use client';

import { useEffect, useState } from 'react';
import { getCityTime } from '@/lib/timezone';

interface CityTimeProps {
    city: string;
}

export function CityTime({ city }: CityTimeProps) {
    const [time, setTime] = useState<string>('--:--');

    useEffect(() => {
        // Update time immediately
        const updateTime = () => {
            setTime(getCityTime(city));
        };

        updateTime();

        // Update every minute
        const interval = setInterval(updateTime, 60000);

        return () => clearInterval(interval);
    }, [city]);

    return (
        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <span className="text-lg">🕐</span>
            <span>{time}</span>
        </div>
    );
}
