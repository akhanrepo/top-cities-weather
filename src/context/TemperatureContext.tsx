'use client';

import React, { createContext, useContext, useState } from 'react';

type TemperatureUnit = 'C' | 'F';

interface TemperatureContextType {
    unit: TemperatureUnit;
    setUnit: (unit: TemperatureUnit) => void;
    convertTemp: (celsius: number) => number;
}

const TemperatureContext = createContext<TemperatureContextType | undefined>(undefined);

export function TemperatureProvider({ children }: { children: React.ReactNode }) {
    const [unit, setUnit] = useState<TemperatureUnit>('C');

    const convertTemp = (celsius: number) => {
        if (unit === 'F') {
            return Math.round((celsius * 9) / 5 + 32);
        }
        return celsius;
    };

    return (
        <TemperatureContext.Provider value={{ unit, setUnit, convertTemp }}>
            {children}
        </TemperatureContext.Provider>
    );
}

export function useTemperature() {
    const context = useContext(TemperatureContext);
    if (context === undefined) {
        throw new Error('useTemperature must be used within a TemperatureProvider');
    }
    return context;
}
