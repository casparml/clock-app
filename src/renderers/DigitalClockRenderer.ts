import type { IClockRenderer } from './ClockRenderer.interface';
import type {
    TimeData,
    DigitalRenderData,
    DigitalClockConfig,
    DateInfo
} from '../types/clock.types';

/**
 * Digital clock renderer - generates simple digital display
 */
export class DigitalClockRenderer implements IClockRenderer {
    private config: Required<DigitalClockConfig>;

    constructor(config: DigitalClockConfig = {}) {
        this.config = {
            use24Hour: false,
            showSeconds: true,
            showDate: false,
            separator: ':',
            ...config
        };
    }

    private formatNumber(number: number): string {
        return number < 10 ? '0' + number : number.toString();
    }

    private getDateString(date?: Date): DateInfo {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
            'Thursday', 'Friday', 'Saturday'];

        const currentDate = date || new Date();
        const dayName = days[currentDate.getDay()];
        const monthName = months[currentDate.getMonth()];
        const dateNum = currentDate.getDate();
        const year = currentDate.getFullYear();

        return {
            day: dayName,
            date: dateNum,
            month: monthName,
            year: year,
            formatted: `${dayName}, ${monthName} ${dateNum}, ${year}`
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
            showSeconds: this.config.showSeconds
        };

        if (this.config.showDate) {
            result.date = this.getDateString();
        }

        return result;
    }
}