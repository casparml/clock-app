import { TimeData } from '../types/clock.types';

/**
 * Clock data model - pure logic, no DOM dependencies
 */
export class ClockModel {
    private hours24: number = 0;
    private hours12: number = 0;
    private minutes: number = 0;
    private seconds: number = 0;
    private daytime: 'AM' | 'PM' = 'AM';

    constructor() {
        this.updateTime();
    }

    updateTime(): void {
        const date = new Date();
        this.hours24 = date.getHours();
        this.hours12 = this.hours24 % 12 || 12;
        this.minutes = date.getMinutes();
        this.seconds = date.getSeconds();
        this.daytime = this.hours24 >= 12 ? 'PM' : 'AM';
    }

    getTimeData(): TimeData {
        return {
            hours12: this.hours12,
            hours24: this.hours24,
            minutes: this.minutes,
            seconds: this.seconds,
            daytime: this.daytime
        };
    }
}