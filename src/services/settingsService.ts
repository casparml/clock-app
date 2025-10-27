// src/services/settingsService.ts
import {type UserSettings, DEFAULT_SETTINGS } from '../types/settings';

const STORAGE_KEY = 'clock_app_settings';

export class SettingsService {
    /**
     * Load settings from localStorage
     */
    static loadSettings(): UserSettings {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Merge with defaults to ensure all properties exist
                return {
                    ...DEFAULT_SETTINGS,
                    ...parsed,
                    clock: {
                        ...DEFAULT_SETTINGS.clock,
                        ...parsed.clock,
                    },
                };
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
        return DEFAULT_SETTINGS;
    }

    /**
     * Save settings to localStorage
     */
    static saveSettings(settings: UserSettings): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    /**
     * Update partial settings
     */
    static updateSettings(partialSettings: Partial<UserSettings>): UserSettings {
        const currentSettings = this.loadSettings();
        const newSettings = {
            ...currentSettings,
            ...partialSettings,
            clock: {
                ...currentSettings.clock,
                ...(partialSettings.clock || {}),
            },
        };
        this.saveSettings(newSettings);
        return newSettings;
    }

    /**
     * Reset settings to defaults
     */
    static resetSettings(): UserSettings {
        this.saveSettings(DEFAULT_SETTINGS);
        return DEFAULT_SETTINGS;
    }

    /**
     * Export settings (useful for migration to database later)
     */
    static exportSettings(): string {
        const settings = this.loadSettings();
        return JSON.stringify(settings, null, 2);
    }

    /**
     * Import settings (useful for migration from database later)
     */
    static importSettings(settingsJson: string): UserSettings {
        try {
            const settings = JSON.parse(settingsJson);
            this.saveSettings(settings);
            return settings;
        } catch (error) {
            console.error('Error importing settings:', error);
            return this.loadSettings();
        }
    }
}