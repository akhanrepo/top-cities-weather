'use client';

import type { WeatherAlert } from '@/types/weather';

interface WeatherAlertBadgeProps {
    alerts: WeatherAlert[];
}

export function WeatherAlertBadge({ alerts }: WeatherAlertBadgeProps) {
    if (!alerts || alerts.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-2">
            {alerts.map((alert, index) => (
                <div
                    key={`${alert.type}-${index}`}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md text-xs font-medium"
                    title={alert.message}
                >
                    <span>{alert.icon}</span>
                    <span>{alert.message}</span>
                </div>
            ))}
        </div>
    );
}
