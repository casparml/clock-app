import type {IClockRenderer} from './ClockRenderer.interface';
import type {
    TimeData,
    DotsRenderData,
    DotsClockConfig,
    Dot,
    DotStyles
} from '../types/clock.types';
import { SettingsService } from '../services/settingsService';

/**
 * Dots clock renderer - generates dot-based clock
 */
export class DotsClockRenderer implements IClockRenderer {
    private config: Required<DotsClockConfig>;
    private showSeconds: boolean = true;

    constructor(config: DotsClockConfig = {}) {
        // Load settings from localStorage
        const settings = SettingsService.loadSettings();

        this.config = {
            secondsTotal: 60,
            secondsDegree: 6,
            minutesTotal: 60,
            minutesDegree: 6,
            hoursTotal: 12,
            hoursDegree: 30,
            showSeconds: config.showSeconds !== undefined ? config.showSeconds : settings.clock.showSeconds,
            ...config
        };

        this.showSeconds = this.config.showSeconds;

        // Apply visibility immediately
        this.updateSecondsVisibility();
    }

    public setShowSeconds(show: boolean): void {
        this.showSeconds = show;
        this.config.showSeconds = show;
        this.updateSecondsVisibility();
    }

    private updateSecondsVisibility(): void {
        // Hide/show seconds container
        const secDots = document.getElementById('secDots');
        if (secDots) {
            secDots.style.display = this.showSeconds ? 'flex' : 'none';
        }
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
        const result: DotsRenderData = {
            type: 'dots',
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

        // Only include seconds if showSeconds is true
        if (this.showSeconds) {
            result.seconds = {
                dots: this.generateDots(
                    this.config.secondsTotal,
                    timeData.seconds,
                    this.config.secondsDegree,
                    true
                ),
                value: this.formatNumber(timeData.seconds),
                label: 'Seconds'
            };
        }

        return result;
    }

    private formatNumber(number: number): string {
        return number < 10 ? '0' + number : number.toString();
    }
}