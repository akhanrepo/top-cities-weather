'use client';

import { useTheme } from '@/context/ThemeContext';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const cycleTheme = () => {
        if (theme === 'light') {
            setTheme('dark');
        } else if (theme === 'dark') {
            setTheme('system');
        } else {
            setTheme('light');
        }
    };

    const getIcon = () => {
        switch (theme) {
            case 'light':
                return '☀️';
            case 'dark':
                return '🌙';
            case 'system':
                return '💻';
        }
    };

    const getLabel = () => {
        switch (theme) {
            case 'light':
                return 'Light';
            case 'dark':
                return 'Dark';
            case 'system':
                return 'System';
        }
    };

    return (
        <button
            onClick={cycleTheme}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            aria-label="Toggle theme"
            title={`Current: ${getLabel()}. Click to cycle.`}
        >
            <span className="text-xl">{getIcon()}</span>
            <span className="text-sm font-medium">{getLabel()}</span>
        </button>
    );
}
