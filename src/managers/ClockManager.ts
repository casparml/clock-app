import { ClockController } from '../controllers/ClockController';
import { ClockRendererFactory } from '../renderers/ClockRendererFactory';
import { WebDOMAdapter } from '../adapters/WebDOMAdapter';
import type { ClockType } from '../types/clock.types';

export class ClockManager {
    private currentController: ClockController | null = null;
    private currentType: ClockType | null = null;

    constructor() {
        this.setupControls();
    }

    private setupControls(): void {
        const buttons = document.querySelectorAll('.clock-switch-btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                const clockType = target.getAttribute('data-clock-type') as ClockType;
                if (clockType && clockType !== this.currentType) {
                    this.switchClock(clockType);
                }
            });
        });
    }

    switchClock(type: ClockType): void {
        console.log(`Switching to ${type} clock`);

        // Don't switch if already on this type
        if (type === this.currentType && this.currentController) {
            console.log(`Already on ${type} clock`);
            return;
        }

        // Stop current controller
        if (this.currentController) {
            console.log(`Stopping previous clock controller`);
            this.currentController.stop();
            this.currentController = null;
        }

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

        // Update button states
        document.querySelectorAll('.clock-switch-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeButton = document.querySelector(`[data-clock-type="${type}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }

        // Show the selected clock element
        const clockElement = this.getClockElement(type);
        if (clockElement) {
            console.log(`Found clock element for ${type}:`, clockElement);
            clockElement.style.display = type === 'digital' ? 'block' : 'flex';
            clockElement.classList.add('active');
        } else {
            console.error(`Clock element not found for type: ${type}`);
            return;
        }

        // Create new controller
        try {
            console.log(`Creating renderer for ${type}`);
            const renderer = ClockRendererFactory.create(type, this.getDefaultConfig(type));
            console.log(`Creating adapter with elements:`, this.getAdapterElements(type));
            const adapter = new WebDOMAdapter(this.getAdapterElements(type));
            this.currentController = new ClockController(renderer, adapter);
            this.currentController.start();
            this.currentType = type;

            console.log(`${type} clock initialized and started`);

            // Save preference
            localStorage.setItem('preferredClockType', type);
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
        switch (type) {
            case 'digital':
                return {
                    use24Hour: true,
                    showSeconds: true,
                    showDate: false
                };
            case 'analog':
                return {
                    showSecondHand: true,
                    smoothSeconds: true,
                    showNumbers: true,
                    numberStyle: '12' as const
                };
            default:
                return {};
        }
    }

    start(): void {
        // Get saved preference or default to dots
        const savedType = (localStorage.getItem('preferredClockType') as ClockType) || 'dots';
        console.log(`Starting with ${savedType} clock`);
        this.switchClock(savedType);
    }

    stop(): void {
        if (this.currentController) {
            this.currentController.stop();
            this.currentController = null;
            this.currentType = null;
        }
    }
}