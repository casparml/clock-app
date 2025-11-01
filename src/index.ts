// Import styles FIRST
import './styles/themes.css';
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
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import analytics from './services/analytics.service';

// Auto-start for web
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initializeApp();
        });
    } else {
        initializeApp();
    }
}

function initializeApp() {
    // Track app initialization
    analytics.track('app_initialized', {
        userAgent: navigator.userAgent,
        timestamp: Date.now()
    });

    // Mount React app to root
    const rootElement = document.getElementById('root');
    if (rootElement) {
        const root = createRoot(rootElement);
        root.render(React.createElement(App));
        analytics.track('react_mounted');
    } else {
        console.error('Root element not found');
        analytics.track('react_mount_error', {
            error: 'Root element not found'
        });
    }
}