'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type TemperatureUnit = 'C' | 'F';
export type ViewMode = 'card' | 'list';
export type SortOrder = 'name' | 'temp';

interface UserPreferences {
    // Favorites
    favoriteCities: string[];

    // Display preferences
    temperatureUnit: TemperatureUnit;
    viewMode: ViewMode;
    sortOrder: SortOrder;
    theme: 'light' | 'dark' | 'system';

    // Compare mode
    compareCities: string[];
}

interface UserPreferencesContextType {
    preferences: UserPreferences;

    // Favorite methods
    toggleFavorite: (city: string) => void;
    isFavorite: (city: string) => boolean;

    // Preference setters
    setTemperatureUnit: (unit: TemperatureUnit) => void;
    setViewMode: (mode: ViewMode) => void;
    setSortOrder: (order: SortOrder) => void;
    setTheme: (theme: 'light' | 'dark' | 'system') => void;

    // Compare mode methods
    toggleCompareCity: (city: string) => void;
    isInCompare: (city: string) => boolean;
    clearCompare: () => void;
}

const defaultPreferences: UserPreferences = {
    favoriteCities: [],
    temperatureUnit: 'C',
    viewMode: 'card',
    sortOrder: 'name',
    theme: 'system',
    compareCities: [],
};

const STORAGE_KEY = 'weather-app-preferences';

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export function UserPreferencesProvider({ children }: { children: React.ReactNode }) {
    const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load preferences from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setPreferences({ ...defaultPreferences, ...parsed });
            } catch (e) {
                console.error('Failed to parse stored preferences:', e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save preferences to localStorage whenever they change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
        }
    }, [preferences, isLoaded]);

    const toggleFavorite = (city: string) => {
        setPreferences(prev => {
            const isFav = prev.favoriteCities.includes(city);
            if (isFav) {
                // Remove from favorites
                return {
                    ...prev,
                    favoriteCities: prev.favoriteCities.filter(c => c !== city),
                };
            } else {
                // Add to favorites (max 5)
                if (prev.favoriteCities.length >= 5) {
                    // Could show a toast notification here
                    console.warn('Maximum 5 favorite cities allowed');
                    return prev;
                }
                return {
                    ...prev,
                    favoriteCities: [...prev.favoriteCities, city],
                };
            }
        });
    };

    const isFavorite = (city: string) => {
        return preferences.favoriteCities.includes(city);
    };

    const toggleCompareCity = (city: string) => {
        setPreferences(prev => {
            const isInCompare = prev.compareCities.includes(city);
            if (isInCompare) {
                return {
                    ...prev,
                    compareCities: prev.compareCities.filter(c => c !== city),
                };
            } else {
                if (prev.compareCities.length >= 3) {
                    console.warn('Maximum 3 cities for comparison');
                    return prev;
                }
                return {
                    ...prev,
                    compareCities: [...prev.compareCities, city],
                };
            }
        });
    };

    const isInCompare = (city: string) => {
        return preferences.compareCities.includes(city);
    };

    const clearCompare = () => {
        setPreferences(prev => ({
            ...prev,
            compareCities: [],
        }));
    };

    const setTemperatureUnit = (unit: TemperatureUnit) => {
        setPreferences(prev => ({ ...prev, temperatureUnit: unit }));
    };

    const setViewMode = (mode: ViewMode) => {
        setPreferences(prev => ({ ...prev, viewMode: mode }));
    };

    const setSortOrder = (order: SortOrder) => {
        setPreferences(prev => ({ ...prev, sortOrder: order }));
    };

    const setTheme = (theme: 'light' | 'dark' | 'system') => {
        setPreferences(prev => ({ ...prev, theme }));
    };

    return (
        <UserPreferencesContext.Provider
            value={{
                preferences,
                toggleFavorite,
                isFavorite,
                setTemperatureUnit,
                setViewMode,
                setSortOrder,
                setTheme,
                toggleCompareCity,
                isInCompare,
                clearCompare,
            }}
        >
            {children}
        </UserPreferencesContext.Provider>
    );
}

export function useUserPreferences() {
    const context = useContext(UserPreferencesContext);
    if (context === undefined) {
        throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
    }
    return context;
}
