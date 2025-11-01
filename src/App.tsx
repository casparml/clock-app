import React, { useEffect, useRef } from 'react';
import { SettingsProvider } from './contexts/SettingsContext';
import Settings from './components/Settings';
import { ClockManager } from './managers/ClockManager';

const App: React.FC = () => {
    const managerRef = useRef<ClockManager | null>(null);

    useEffect(() => {
        // Initialize clock manager after the DOM elements are rendered
        managerRef.current = new ClockManager();
        managerRef.current.start();

        // Cleanup on unmount
        return () => {
            if (managerRef.current) {
                managerRef.current.stop();
            }
        };
    }, []);

    return (
        <SettingsProvider>
            <div id="clockContainer">
                <div id="digitalClock" className="clock-display" style={{ display: 'none' }}>
                    <div className="time-container">
                        <span className="time hours">00</span>
                        <span className="separator">:</span>
                        <span className="time minutes">00</span>
                        <span className="separator">:</span>
                        <span className="time seconds">00</span>
                    </div>
                </div>

                <div id="clock" className="clock-display">
                    <div id="hrDots"></div>
                    <div id="minDots"></div>
                    <div id="secDots"></div>
                </div>

                <div id="analogClock" className="clock-display" style={{ display: 'none' }}></div>
            </div>
            <Settings />
        </SettingsProvider>
    );
};

export default App;