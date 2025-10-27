// src/types/settings.ts
export interface ClockSettings {
    timeFormat: '12h' | '24h';
    showSeconds: boolean;
    theme: 'light' | 'dark' | 'auto';
    dateFormat: 'short' | 'long' | 'numeric';
    showDate: boolean;
    blinkSeparator: boolean;
    timezone?: string; // Optional: for displaying different timezones
}

export interface UserSettings {
    clock: ClockSettings;
}

export const DEFAULT_SETTINGS: UserSettings = {
    clock: {
        timeFormat: '12h',
        showSeconds: true,
        theme: 'auto',
        dateFormat: 'long',
        showDate: true,
        blinkSeparator: true,
    },
};