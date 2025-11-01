import type { IClockRenderer } from './ClockRenderer.interface';
import type {
    TimeData,
    AnalogRenderData,
    AnalogClockConfig,
    ClockTick,
    ClockNumber
} from '../types/clock.types';
import { SettingsService } from '../services/settingsService';
import { DateFormatter } from '../utils/DateFormatter';

/**
 * Analog clock renderer - generates traditional clock face
 */
export class AnalogClockRenderer implements IClockRenderer {
    private config: Required<AnalogClockConfig>;

    constructor(config: AnalogClockConfig = {}) {
        // Load settings from localStorage
        const settings = SettingsService.loadSettings();

        this.config = {
            showSecondHand: config.showSecondHand !== undefined ? config.showSecondHand : settings.clock.showSeconds,
            smoothSeconds: false,
            showNumbers: true,
            numberStyle: '12',
            showTicks: true,
            majorTicks: 12,
            minorTicks: 60,
            showDate: config.showDate !== undefined ? config.showDate : settings.clock.showDate,
            ...config
        };
    }

    public setShowSeconds(show: boolean): void {
        this.config.showSecondHand = show;
    }

    public setShowDate(show: boolean): void {
        this.config.showDate = show;
    }

    private calculateHandAngle(value: number, maxValue: number, smoothValue: number = 0): number {
        const baseAngle = (value / maxValue) * 360;
        const smoothAngle = smoothValue > 0 ? (smoothValue / maxValue) * 360 : 0;
        return baseAngle + smoothAngle;
    }

    private generateTicks(): ClockTick[] {
        const ticks: ClockTick[] = [];

        if (!this.config.showTicks) {
            return ticks;
        }

        // Generate major ticks (12 hours)
        for (let i = 0; i < this.config.majorTicks; i++) {
            const angle = (i / this.config.majorTicks) * 360;
            ticks.push({
                type: 'major',
                index: i,
                angle: angle,
                isMajor: true
            });
        }

        // Generate minor ticks (60 seconds)
        for (let i = 0; i < this.config.minorTicks; i++) {
            const angle = (i / this.config.minorTicks) * 360;
            // Skip if this position has a major tick
            const hasMajorTick = ticks.some(tick =>
                Math.abs(tick.angle - angle) < 1
            );

            if (!hasMajorTick) {
                ticks.push({
                    type: 'minor',
                    index: i,
                    angle: angle,
                    isMajor: false
                });
            }
        }

        return ticks;
    }

    private generateNumbers(): ClockNumber[] {
        const numbers: ClockNumber[] = [];

        if (!this.config.showNumbers || this.config.numberStyle === 'none') {
            return numbers;
        }

        const romanNumerals = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
        const count = this.config.numberStyle === '24' ? 24 : 12;

        for (let i = 0; i < count; i++) {
            // Start at 12 o'clock (0 degrees) and go clockwise
            const angle = (i / count) * 360;

            let display: string;
            if (this.config.numberStyle === 'roman') {
                display = romanNumerals[i];
            } else {
                // For 12-hour: show 12, 1, 2, ... 11
                display = (i === 0 ? count : i).toString();
            }

            numbers.push({
                value: i === 0 ? count : i,
                display: display,
                angle: angle
            });
        }

        return numbers;
    }

    render(timeData: TimeData): AnalogRenderData {
        // Calculate angles for each hand (0 degrees = 12 o'clock)
        const secondAngle = this.calculateHandAngle(timeData.seconds, 60);

        // Minute hand moves smoothly based on seconds
        const minuteAngle = this.calculateHandAngle(
            timeData.minutes,
            60,
            timeData.seconds / 60  // Smooth movement: add fractional minutes from seconds
        );

        // Hour hand moves smoothly based on minutes
        const hourAngle = this.calculateHandAngle(
            timeData.hours12 % 12,
            12,
            timeData.minutes / 60  // Smooth movement: add fractional hours from minutes
        );

        const hands: AnalogRenderData['hands'] = {
            hour: {
                angle: hourAngle,
                length: 80,
                width: 8
            },
            minute: {
                angle: minuteAngle,
                length: 110,
                width: 6
            },
            second: {
                angle: secondAngle,
                length: 130,
                width: 3
            }
        };

        const result: AnalogRenderData = {
            type: 'analog',
            hands: hands,
            ticks: this.generateTicks(),
            numbers: this.generateNumbers(),
            centerDot: {
                radius: 8
            },
            timeData: timeData,
            showSecondHand: this.config.showSecondHand
        };

        if (this.config.showDate) {
            result.date = DateFormatter.getDateInfo();
        }

        return result;
    }
}