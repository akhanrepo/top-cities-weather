export function Header() {
    return (
        <header className="py-6 px-4 md:px-8 border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                    Global Weather
                </h1>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Top 50 Cities
                </div>
            </div>
        </header>
    );
}
