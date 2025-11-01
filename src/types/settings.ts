// src/types/settings.ts
export interface ClockSettings {
    theme: 'light' | 'dark' | 'minimal' | 'auto';
    timeFormat: '12h' | '24h';
    showSeconds: boolean;
    showDate: boolean;
    dateFormat: 'short' | 'long' | 'numeric';
    blinkSeparator: boolean;
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