import { IClockRenderer } from './ClockRenderer.interface';
import {
    TimeData,
    DotsRenderData,
    DotsClockConfig,
    Dot,
    DotStyles
} from '../types/clock.types';

/**
 * Dots clock renderer - generates dot-based clock
 */
export class DotsClockRenderer implements IClockRenderer {
    private config: Required<DotsClockConfig>;

    constructor(config: DotsClockConfig = {}) {
        this.config = {
            secondsTotal: 60,
            secondsDegree: 6,
            minutesTotal: 60,
            minutesDegree: 6,
            hoursTotal: 12,
            hoursDegree: 30,
            ...config
        };
    }

    private generateDots(total: number, current: number, degree: number, isActive: boolean = false): Dot[] {
        const dots: Dot[] = [];
        for (let i = 1; i <= total; i++) {
            dots.push({
                index: i,
                rotation: i * degree,
                isActive: i === current,
                isCurrent: i === current,
                styles: this.getDotStyles(i, current, degree, isActive)
            });
        }
        return dots;
    }

    private getDotStyles(index: number, current: number, degree: number, isActive: boolean): DotStyles {
        return {
            transform: `rotate(${index * degree}deg)`,
            active: index === current,
            dimmed: current === 0 && !isActive
        };
    }

    render(timeData: TimeData): DotsRenderData {
        return {
            type: 'dots',
            seconds: {
                dots: this.generateDots(
                    this.config.secondsTotal,
                    timeData.seconds,
                    this.config.secondsDegree,
                    true
                ),
                value: this.formatNumber(timeData.seconds),
                label: 'Seconds'
            },
            minutes: {
                dots: this.generateDots(
                    this.config.minutesTotal,
                    timeData.minutes,
                    this.config.minutesDegree
                ),
                value: this.formatNumber(timeData.minutes),
                label: 'Minutes'
            },
            hours: {
                dots: this.generateDots(
                    this.config.hoursTotal,
                    timeData.hours12,
                    this.config.hoursDegree
                ),
                value: this.formatNumber(timeData.hours12),
                label: 'Hours',
                daytime: timeData.daytime
            }
        };
    }

    private formatNumber(number: number): string {
        return number < 10 ? '0' + number : number.toString();
    }
}