import { ClockController } from '../controllers/ClockController';
import { ClockRendererFactory } from '../renderers/ClockRendererFactory';
import { WebDOMAdapter } from '../adapters/WebDOMAdapter';
import type { ClockType } from '../types/clock.types';
import { SettingsService } from '../services/settingsService';

export class ClockManager {
    private currentController: ClockController | null = null;
    private currentType: ClockType | null = null;

    constructor() {
        this.listenToClockTypeChanges();
    }

    private listenToClockTypeChanges(): void {
        // Listen for custom event from settings context
        window.addEventListener('clockTypeChanged', ((e: CustomEvent) => {
            const newType = e.detail as ClockType;
            if (newType !== this.currentType) {
                this.switchClock(newType);
            }
        }) as EventListener);
    }

    switchClock(type: ClockType): void {
        if (this.currentType === type && this.currentController) {
            return;
        }

        // Stop current controller
        if (this.currentController) {
            this.currentController.stop();
            this.currentController = null;
        }

        // Set currentType immediately to prevent duplicate switches
        this.currentType = type;

        // Small delay to ensure cleanup
        setTimeout(() => {
            this.initializeClock(type);
        }, 50);
    }

    private initializeClock(type: ClockType): void {
        // Hide all clock displays
        document.querySelectorAll('.clock-display').forEach(el => {
            (el as HTMLElement).style.display = 'none';
            el.classList.remove('active');
        });

        // Show the selected clock element
        const clockElement = this.getClockElement(type);
        if (!clockElement) {
            console.error(`Clock element not found for type: ${type}`);
            return;
        }

        clockElement.style.display = type === 'digital' ? 'block' : 'flex';
        clockElement.classList.add('active');

        // Create new controller
        try {
            const renderer = ClockRendererFactory.create(type, this.getDefaultConfig(type));
            const adapter = new WebDOMAdapter(this.getAdapterElements(type));
            this.currentController = new ClockController(renderer, adapter);
            this.currentController.start();

            // Save preference
            localStorage.setItem('clockType', type);
        } catch (error) {
            console.error(`Failed to initialize ${type} clock:`, error);
        }
    }

    private getClockElement(type: ClockType): HTMLElement | null {
        switch (type) {
            case 'digital':
                return document.getElementById('digitalClock');
            case 'dots':
                return document.getElementById('clock');
            case 'analog':
                return document.getElementById('analogClock');
            default:
                return null;
        }
    }

    private getAdapterElements(type: ClockType) {
        if (type === 'dots') {
            return {
                seconds: document.getElementById('secDots'),
                minutes: document.getElementById('minDots'),
                hours: document.getElementById('hrDots')
            };
        } else if (type === 'analog') {
            return {
                container: document.getElementById('analogClock')
            };
        }
        // Digital clock doesn't need specific elements passed
        return {};
    }

    private getDefaultConfig(type: ClockType) {
        const settings = SettingsService.loadSettings();

        switch (type) {
            case 'digital':
                return {
                    use24Hour: settings.clock.timeFormat === '24h',
                    showSeconds: settings.clock.showSeconds,
                    showDate: settings.clock.showDate
                };
            case 'analog':
                return {
                    showSecondHand: settings.clock.showSeconds,
                    smoothSeconds: true,
                    showNumbers: true,
                    numberStyle: '12' as const,
                    showDate: settings.clock.showDate
                };
            case 'dots':
                return {
                    showSeconds: settings.clock.showSeconds,
                    showDate: settings.clock.showDate
                };
            default:
                return {};
        }
    }

    private applySettings(): void {
        // Re-initialize the current clock with new settings
        if (this.currentType) {
            const type = this.currentType;

            // Stop current controller
            if (this.currentController) {
                this.currentController.stop();
                this.currentController = null;
            }

            // Re-initialize with new settings
            setTimeout(() => {
                this.initializeClock(type);
            }, 50);
        }
    }

    start(): void {
        // Get saved preference or default to digital
        const savedType = (localStorage.getItem('clockType') as ClockType) || 'digital';
        this.switchClock(savedType);

        // Listen for settings changes from React
        window.addEventListener('settingsChanged', () => {
            this.applySettings();
        });
    }

    stop(): void {
        if (this.currentController) {
            this.currentController.stop();
            this.currentController = null;
            this.currentType = null;
        }
    }
}