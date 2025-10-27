// Export types
export * from './types/clock.types';

// Export model
export { ClockModel } from './models/ClockModel';

// Export renderers
export type { IClockRenderer } from './renderers/ClockRenderer.interface';
export { DotsClockRenderer } from './renderers/DotsClockRenderer';
export { DigitalClockRenderer } from './renderers/DigitalClockRenderer';
export { AnalogClockRenderer } from './renderers/AnalogClockRenderer';
export { ClockRendererFactory } from './renderers/ClockRendererFactory';

// Export adapters
export type { IClockAdapter } from './adapters/WebDOMAdapter';
export {WebDOMAdapter} from './adapters/WebDOMAdapter';

// Export controller
export { ClockController } from './controllers/ClockController';

// Imports for initialization
import { ClockRendererFactory } from './renderers/ClockRendererFactory';
import { WebDOMAdapter } from './adapters/WebDOMAdapter';
import { ClockController } from './controllers/ClockController';
import { ClockType, ClockConfig } from './types/clock.types';

/**
 * Simple initialization function
 */
export function initClock(type: ClockType = 'dots', config: ClockConfig = {}): ClockController {
    const renderer = ClockRendererFactory.create(type, config);
    const adapter = new WebDOMAdapter({});
    const controller = new ClockController(renderer, adapter);
    controller.start();
    return controller;
}

// Auto-start for web
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => initClock());
    } else {
        initClock();
    }
}