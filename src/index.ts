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
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Auto-start for web
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM loaded, initializing clock manager and React');

            // Initialize clock manager
            const manager = new ClockManager();
            manager.start();

            // Initialize React settings
            initializeReactSettings();
        });
    } else {
        console.log('DOM ready, initializing clock manager and React');

        // Initialize clock manager
        const manager = new ClockManager();
        manager.start();

        // Initialize React settings
        initializeReactSettings();
    }
}

function initializeReactSettings() {
    try {
        // Create a container for React settings
        const settingsContainer = document.createElement('div');
        settingsContainer.id = 'react-settings-root';
        document.body.appendChild(settingsContainer);

        console.log('React settings container created:', settingsContainer);

        // Mount React app
        const root = createRoot(settingsContainer);
        root.render(React.createElement(App));

        console.log('React settings app mounted successfully');
    } catch (error) {
        console.error('Failed to initialize React settings:', error);
    }
}