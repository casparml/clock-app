import { ClockModel } from '../models/ClockModel';
import { IClockRenderer } from '../renderers/ClockRenderer.interface';
import { IClockAdapter } from '../adapters/WebDOMAdapter';

/**
 * Main clock controller - coordinates model, renderer, and adapter
 */
export class ClockController {
    private model: ClockModel;
    private renderer: IClockRenderer;
    private adapter: IClockAdapter;
    private intervalId: number | null = null;

    constructor(renderer: IClockRenderer, adapter: IClockAdapter) {
        this.model = new ClockModel();
        this.renderer = renderer;
        this.adapter = adapter;
    }

    update(): void {
        this.model.updateTime();
        const timeData = this.model.getTimeData();
        const renderData = this.renderer.render(timeData);
        this.adapter.update(renderData);
    }

    start(interval: number = 1000): void {
        this.update();
        this.intervalId = window.setInterval(() => this.update(), interval);
    }

    stop(): void {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}