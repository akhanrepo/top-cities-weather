'use client';

interface AQIBadgeProps {
    aqi: number;
    category: string;
    color: string;
}

export function AQIBadge({ aqi, category, color }: AQIBadgeProps) {
    return (
        <div className="inline-flex items-center gap-2">
            <div
                className="px-3 py-1 rounded-full text-white text-sm font-semibold"
                style={{ backgroundColor: color }}
            >
                AQI {aqi}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">{category}</span>
        </div>
    );
}

export function AQIScale() {
    const scale = [
        { range: '0-50', label: 'Good', color: '#10b981' },
        { range: '51-100', label: 'Moderate', color: '#f59e0b' },
        { range: '101-150', label: 'Unhealthy for Sensitive', color: '#f97316' },
        { range: '151-200', label: 'Unhealthy', color: '#ef4444' },
        { range: '201-300', label: 'Very Unhealthy', color: '#9333ea' },
        { range: '300+', label: 'Hazardous', color: '#7f1d1d' },
    ];

    return (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Air Quality Index Scale
            </h4>
            {scale.map((item) => (
                <div key={item.range} className="flex items-center gap-3">
                    <div
                        className="w-16 h-6 rounded"
                        style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm flex-1 text-gray-600 dark:text-gray-400">{item.label}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-500">{item.range}</span>
                </div>
            ))}
        </div>
    );
}
