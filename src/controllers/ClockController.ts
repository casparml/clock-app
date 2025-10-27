import { ClockModel } from '../models/ClockModel';
import type { IClockRenderer } from '../renderers/ClockRenderer.interface';
import type { IClockAdapter } from '../adapters/WebDOMAdapter';

/**
 * Main clock controller - coordinates model, renderer, and adapter
 */
export class ClockController {
    private model: ClockModel;
    private renderer: IClockRenderer;
    private adapter: IClockAdapter;
    private intervalId: number | null = null;
    private isRunning: boolean = false;

    constructor(renderer: IClockRenderer, adapter: IClockAdapter) {
        this.model = new ClockModel();
        this.renderer = renderer;
        this.adapter = adapter;
    }

    start(): void {
        if (this.isRunning) {
            return;
        }

        this.isRunning = true;

        // Update immediately on start
        this.update();

        // Then update every second, synchronized to the system clock
        const now = new Date();
        const msUntilNextSecond = 1000 - now.getMilliseconds();

        // Wait until the next full second, then start the interval
        setTimeout(() => {
            this.update();
            this.intervalId = window.setInterval(() => {
                this.update();
            }, 1000);
        }, msUntilNextSecond);
    }

    private update(): void {
        this.model.updateTime();
        const timeData = this.model.getTimeData();
        const renderData = this.renderer.render(timeData);
        this.adapter.update(renderData);
    }

    stop(): void {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
    }
}