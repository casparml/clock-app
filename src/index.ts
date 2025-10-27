// Import styles FIRST
import './styles/main.css';

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
export { WebDOMAdapter } from './adapters/WebDOMAdapter';

// Export controller
export { ClockController } from './controllers/ClockController';

// Imports for initialization
import { ClockRendererFactory } from './renderers/ClockRendererFactory';
import { WebDOMAdapter } from './adapters/WebDOMAdapter';
import { ClockController } from './controllers/ClockController';
import type { ClockType, ClockConfig } from './types/clock.types';

/**
 * Simple initialization function
 */
export function initClock(type: ClockType = 'dots', config: ClockConfig = {}): ClockController {
    console.log('🕐 Initializing clock...', type);
    const renderer = ClockRendererFactory.create(type, config);
    const adapter = new WebDOMAdapter({});
    const controller = new ClockController(renderer, adapter);
    controller.start();
    console.log('✅ Clock started!');
    return controller;
}

// Auto-start for web
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM loaded, initializing dots clock');
            initClock('dots'); // Default to dots clock
        });
    } else {
        console.log('DOM ready, initializing dots clock');
        initClock('dots'); // Default to dots clock
    }
}