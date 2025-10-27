import { IClockRenderer } from './ClockRenderer.interface';
import {
    TimeData,
    AnalogRenderData,
    AnalogClockConfig,
    ClockTick,
    ClockNumber
} from '../types/clock.types';

/**
 * Analog clock renderer - generates traditional clock hands
 */
export class AnalogClockRenderer implements IClockRenderer {
    private config: Required<AnalogClockConfig>;

    constructor(config: AnalogClockConfig = {}) {
        this.config = {
            showSecondHand: true,
            smoothSeconds: false,
            showNumbers: true,
            numberStyle: '12',
            showTicks: true,
            majorTicks: 12,
            minorTicks: 60,
            ...config
        };
    }

    private calculateHandAngles(timeData: TimeData): { hour: number; minute: number; second: number } {
        // Seconds: 6 degrees per second
        const secondAngle = this.config.smoothSeconds ?
            (timeData.seconds + (new Date().getMilliseconds() / 1000)) * 6 :
            timeData.seconds * 6;

        // Minutes: 6 degrees per minute + smooth transition based on seconds
        const minuteAngle = (timeData.minutes * 6) + (timeData.seconds * 0.1);

        // Hours: 30 degrees per hour + smooth transition based on minutes
        const hourAngle = (timeData.hours12 * 30) + (timeData.minutes * 0.5);

        return {
            hour: hourAngle,
            minute: minuteAngle,
            second: secondAngle
        };
    }

    private generateTicks(): ClockTick[] {
        const ticks: ClockTick[] = [];

        if (this.config.showTicks) {
            // Major ticks (hours)
            for (let i = 1; i <= this.config.majorTicks; i++) {
                ticks.push({
                    type: 'major',
                    index: i,
                    angle: i * (360 / this.config.majorTicks),
                    isMajor: true
                });
            }

            // Minor ticks (minutes)
            if (this.config.minorTicks > this.config.majorTicks) {
                for (let i = 1; i <= this.config.minorTicks; i++) {
                    if (i % (this.config.minorTicks / this.config.majorTicks) !== 0) {
                        ticks.push({
                            type: 'minor',
                            index: i,
                            angle: i * (360 / this.config.minorTicks),
                            isMajor: false
                        });
                    }
                }
            }
        }

        return ticks;
    }

    private generateNumbers(): ClockNumber[] {
        if (!this.config.showNumbers || this.config.numberStyle === 'none') {
            return [];
        }

        const numbers: ClockNumber[] = [];
        const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI',
            'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

        for (let i = 1; i <= 12; i++) {
            let display: string;
            switch (this.config.numberStyle) {
                case 'roman':
                    display = romanNumerals[i - 1];
                    break;
                case '24':
                    display = i.toString();
                    break;
                case '12':
                default:
                    display = i.toString();
                    break;
            }

            numbers.push({
                value: i,
                display: display,
                angle: i * 30
            });
        }

        return numbers;
    }

    render(timeData: TimeData): AnalogRenderData {
        const angles = this.calculateHandAngles(timeData);

        return {
            type: 'analog',
            hands: {
                hour: {
                    angle: angles.hour,
                    length: 50,
                    width: 6
                },
                minute: {
                    angle: angles.minute,
                    length: 75,
                    width: 4
                },
                second: this.config.showSecondHand ? {
                    angle: angles.second,
                    length: 85,
                    width: 2
                } : null
            },
            ticks: this.generateTicks(),
            numbers: this.generateNumbers(),
            centerDot: {
                radius: 8
            },
            timeData: timeData
        };
    }
}