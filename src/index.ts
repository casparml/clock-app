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

// Export manager
export { ClockManager } from './managers/ClockManager';

// Imports for initialization
import { ClockManager } from './managers/ClockManager';

// Auto-start for web
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM loaded, initializing clock manager');
            const manager = new ClockManager();
            manager.start();
        });
    } else {
        console.log('DOM ready, initializing clock manager');
        const manager = new ClockManager();
        manager.start();
    }
}