interface ViewToggleProps {
    viewMode: 'card' | 'list';
    setViewMode: (mode: 'card' | 'list') => void;
}

export function ViewToggle({ viewMode, setViewMode }: ViewToggleProps) {
    return (
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <button
                onClick={() => setViewMode('card')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'card'
                        ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
            >
                Grid
            </button>
            <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'list'
                        ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
            >
                List
            </button>
        </div>
    );
}
