// src/contexts/SettingsContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type {UserSettings} from '../types/settings';
import { SettingsService } from '../services/settingsService';

export type ClockType = 'digital' | 'dots' | 'analog';

interface SettingsContextType {
    settings: UserSettings;
    updateSettings: (settings: Partial<UserSettings>) => void;
    resetSettings: () => void;
    clockType: ClockType;
    setClockType: (type: ClockType) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<UserSettings>(() =>
        SettingsService.loadSettings()
    );

    const [clockType, setClockType] = useState<ClockType>(() => {
        const saved = localStorage.getItem('clockType');
        return (saved as ClockType) || 'digital';
    });

    // Save clockType to localStorage and notify ClockManager when it changes
    useEffect(() => {
        localStorage.setItem('clockType', clockType);

        // Dispatch custom event to notify ClockManager
        window.dispatchEvent(new CustomEvent('clockTypeChanged', {
            detail: clockType
        }));

        console.log('Clock type changed to:', clockType);
    }, [clockType]);

    const updateSettings = (partialSettings: Partial<UserSettings>) => {
        const newSettings = SettingsService.updateSettings(partialSettings);
        setSettings(newSettings);

        // Dispatch custom event to notify other parts of the app
        window.dispatchEvent(new CustomEvent('settingsChanged', {
            detail: newSettings
        }));
    };

    const resetSettings = () => {
        const defaultSettings = SettingsService.resetSettings();
        setSettings(defaultSettings);

        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('settingsChanged', {
            detail: defaultSettings
        }));
    };

    // Apply theme changes
    useEffect(() => {
        const theme = settings.clock.theme;
        const root = document.documentElement;

        if (theme === 'dark') {
            root.classList.add('dark');
        } else if (theme === 'light') {
            root.classList.remove('dark');
        } else {
            // Auto mode - use system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        }
    }, [settings.clock.theme]);

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, resetSettings, clockType, setClockType }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = (): SettingsContextType => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};