export function Footer() {
    return (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 px-4 md:px-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>© {new Date().getFullYear()} Top Cities Weather. All rights reserved.</p>
                    <p className="mt-1">
                        Made with ❤️ by{' '}
                        <a
                            href="https://github.com/yourusername"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        >
                            Your Name
                        </a>
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <a
                        href="https://www.buymeacoffee.com/yourusername"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg transition-colors"
                    >
                        <span>☕</span>
                        <span>Buy me a coffee</span>
                    </a>
                </div>
            </div>
        </footer>
    );
}
