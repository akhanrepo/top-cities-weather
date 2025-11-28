'use client';

import { useTemperature } from '@/context/TemperatureContext';

export function TemperatureToggle() {
    const { unit, setUnit } = useTemperature();

    return (
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <button
                onClick={() => setUnit('C')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${unit === 'C'
                        ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
            >
                °C
            </button>
            <button
                onClick={() => setUnit('F')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${unit === 'F'
                        ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
            >
                °F
            </button>
        </div>
    );
}
