import type { IClockRenderer } from './ClockRenderer.interface';
import type {
    TimeData,
    DigitalRenderData,
    DigitalClockConfig,
    DateInfo
} from '../types/clock.types';
import { SettingsService } from '../services/settingsService';

/**
 * Digital clock renderer - generates simple digital display
 */
export class DigitalClockRenderer implements IClockRenderer {
    private config: Required<DigitalClockConfig> & { blinkSeparator: boolean };

    constructor(config: DigitalClockConfig = {}) {
        // Load settings from localStorage
        const settings = SettingsService.loadSettings();

        this.config = {
            use24Hour: settings.clock.timeFormat === '24h',
            showSeconds: settings.clock.showSeconds,
            showDate: settings.clock.showDate,
            blinkSeparator: settings.clock.blinkSeparator,
            separator: ':',
            ...config
        };

        // Listen for settings changes
        window.addEventListener('settingsChanged', () => {
            this.updateFromSettings();
        });
    }

    private updateFromSettings(): void {
        const settings = SettingsService.loadSettings();
        this.config.use24Hour = settings.clock.timeFormat === '24h';
        this.config.showSeconds = settings.clock.showSeconds;
        this.config.showDate = settings.clock.showDate;
        this.config.blinkSeparator = settings.clock.blinkSeparator;
    }

    public setTimeFormat(format: '12h' | '24h'): void {
        this.config.use24Hour = format === '24h';
    }

    public setShowSeconds(show: boolean): void {
        this.config.showSeconds = show;
    }

    public setShowDate(show: boolean): void {
        this.config.showDate = show;
    }

    private formatNumber(number: number): string {
        return number < 10 ? '0' + number : number.toString();
    }

    private getDateString(date?: Date): DateInfo {
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

    render(timeData: TimeData): DigitalRenderData {
        const hours = this.config.use24Hour ?
            this.formatNumber(timeData.hours24) :
            this.formatNumber(timeData.hours12);

        const minutes = this.formatNumber(timeData.minutes);
        const seconds = this.formatNumber(timeData.seconds);

        const sep = this.config.separator;
        const timeString = this.config.showSeconds ?
            `${hours}${sep}${minutes}${sep}${seconds}` :
            `${hours}${sep}${minutes}`;

        const result: DigitalRenderData = {
            type: 'digital',
            timeString: timeString,
            hours: hours,
            minutes: minutes,
            seconds: seconds,
            daytime: this.config.use24Hour ? null : timeData.daytime,
            separator: sep,
            showSeconds: this.config.showSeconds,
            blinkSeparator: this.config.blinkSeparator
        };

        if (this.config.showDate) {
            result.date = this.getDateString();
        }

        return result;
    }
}