import { SettingsService } from '../services/settingsService';
import type { DateInfo } from '../types/clock.types';

export class DateFormatter {
    public static getDateInfo(date?: Date): DateInfo {
        const settings = SettingsService.loadSettings();
        const currentDate = date || new Date();

        let formatted: string;

        switch (settings.clock.dateFormat) {
            case 'long': {
                const options: Intl.DateTimeFormatOptions = {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                };
                formatted = currentDate.toLocaleDateString('en-US', options);
                break;
            }
            case 'short': {
                const options: Intl.DateTimeFormatOptions = {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                };
                formatted = currentDate.toLocaleDateString('en-US', options);
                break;
            }
            case 'numeric': {
                const options: Intl.DateTimeFormatOptions = {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                };
                formatted = currentDate.toLocaleDateString('en-US', options);
                break;
            }
            default:
                formatted = currentDate.toLocaleDateString('en-US');
        }

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
            'Thursday', 'Friday', 'Saturday'];

        const dayName = days[currentDate.getDay()];
        const monthName = months[currentDate.getMonth()];
        const dateNum = currentDate.getDate();
        const year = currentDate.getFullYear();

        return {
            day: dayName,
            date: dateNum,
            month: monthName,
            year: year,
            formatted: formatted
        };
    }

    public static getFormattedDate(date?: Date, locale: string = 'en-US'): string {
        const settings = SettingsService.loadSettings();
        const currentDate = date || new Date();

        switch (settings.clock.dateFormat) {
            case 'long': {
                const options: Intl.DateTimeFormatOptions = {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                };
                return currentDate.toLocaleDateString(locale, options);
            }
            case 'short': {
                const options: Intl.DateTimeFormatOptions = {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                };
                return currentDate.toLocaleDateString(locale, options);
            }
            case 'numeric': {
                const options: Intl.DateTimeFormatOptions = {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                };
                return currentDate.toLocaleDateString(locale, options);
            }
            default:
                return currentDate.toLocaleDateString(locale);
        }
    }
}