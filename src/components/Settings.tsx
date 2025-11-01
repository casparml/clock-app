import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';

const Settings: React.FC = () => {
    const { settings, updateSettings, resetSettings, clockType, setClockType } = useSettings();
    const [isOpen, setIsOpen] = useState(false);
    const [activeType, setActiveType] = useState(clockType);

    // Only sync when opening the panel, not when clockType changes
    useEffect(() => {
        if (isOpen) {
            setActiveType(clockType);
        }
    }, [isOpen]); // Remove clockType from dependencies

    const handleToggle = () => setIsOpen(!isOpen);

    const handleClockTypeClick = (type: 'digital' | 'dots' | 'analog') => {
        setActiveType(type);
        setClockType(type);
    };

    return (
        <>
            {/* Settings Button */}
            <button
                onClick={handleToggle}
                className="settings-button"
                aria-label="Settings"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="settings-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </svg>
            </button>

            {/* Settings Panel Overlay */}
            {isOpen && (
                <div className="settings-overlay" onClick={handleToggle}>
                    <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div className="settings-header">
                            <h2>Settings</h2>
                            <button
                                onClick={handleToggle}
                                className="settings-close"
                                aria-label="Close settings"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                            <div className="settings-content">
                                {/* Clock Type Section */}
                                <div className="settings-group">
                                    <label className="settings-label">
                                        <span className="label-icon">🕐</span> Clock Type
                                    </label>
                                    <div className="clock-type-selector">
                                        <button
                                            className={`clock-switch-btn ${activeType === 'digital' ? 'active' : ''}`}
                                            onClick={() => handleClockTypeClick('digital')}
                                        >
                                            Digital
                                        </button>
                                        <button
                                            className={`clock-switch-btn ${activeType === 'dots' ? 'active' : ''}`}
                                            onClick={() => handleClockTypeClick('dots')}
                                        >
                                            Dots
                                        </button>
                                        <button
                                            className={`clock-switch-btn ${activeType === 'analog' ? 'active' : ''}`}
                                            onClick={() => handleClockTypeClick('analog')}
                                        >
                                            Analog
                                        </button>
                                    </div>
                                </div>

                                {/* Theme Section */}
                                <div className="settings-group">
                                    <label className="settings-label">
                                        <span className="label-icon">🎨</span> Theme
                                    </label>
                                    <select
                                        value={settings.clock.theme}
                                        onChange={(e) =>
                                            updateSettings({
                                                clock: { ...settings.clock, theme: e.target.value as 'light' | 'dark' | 'auto' },
                                            })
                                        }
                                        className="settings-select"
                                    >
                                        <option value="light">☀️ Light</option>
                                        <option value="dark">🌙 Dark</option>
                                        <option value="auto">🔄 Auto (System)</option>
                                    </select>
                                </div>

                                {/* Time Format Section */}
                                <div className="settings-group">
                                    <label className="settings-label">
                                        <span className="label-icon">🕐</span> Time Format
                                    </label>
                                    <select
                                        value={settings.clock.timeFormat}
                                        onChange={(e) =>
                                            updateSettings({
                                                clock: { ...settings.clock, timeFormat: e.target.value as '12h' | '24h' },
                                            })
                                        }
                                        className="settings-select"
                                    >
                                        <option value="12h">12 Hour (AM/PM)</option>
                                        <option value="24h">24 Hour (Military)</option>
                                    </select>
                                </div>

                                {/* Toggle Options */}
                                <div className="settings-toggles">
                                    {/* Show Seconds */}
                                    <div className="settings-toggle-item">
                                        <div className="toggle-label">
                                            <span className="label-icon">⏱️</span>
                                            <span>Show Seconds</span>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={settings.clock.showSeconds}
                                                onChange={(e) =>
                                                    updateSettings({
                                                        clock: { ...settings.clock, showSeconds: e.target.checked },
                                                    })
                                                }
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>

                                    {/* Show Date */}
                                    <div className="settings-toggle-item">
                                        <div className="toggle-label">
                                            <span className="label-icon">📅</span>
                                            <span>Show Date</span>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={settings.clock.showDate}
                                                onChange={(e) =>
                                                    updateSettings({
                                                        clock: { ...settings.clock, showDate: e.target.checked },
                                                    })
                                                }
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>

                                    {/* Blink Separator */}
                                    <div className="settings-toggle-item">
                                        <div className="toggle-label">
                                            <span className="label-icon">✨</span>
                                            <span>Blink Separators</span>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={settings.clock.blinkSeparator}
                                                onChange={(e) =>
                                                    updateSettings({
                                                        clock: { ...settings.clock, blinkSeparator: e.target.checked },
                                                    })
                                                }
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>

                                {/* Date Format (conditional) */}
                                {settings.clock.showDate && (
                                    <div className="settings-group settings-fade-in">
                                        <label className="settings-label">
                                            <span className="label-icon">📆</span> Date Format
                                        </label>
                                        <select
                                            value={settings.clock.dateFormat}
                                            onChange={(e) =>
                                                updateSettings({
                                                    clock: {
                                                        ...settings.clock,
                                                        dateFormat: e.target.value as 'short' | 'long' | 'numeric',
                                                    },
                                                })
                                            }
                                            className="settings-select"
                                        >
                                            <option value="long">Long (January 1, 2025)</option>
                                            <option value="short">Short (Jan 1, 2025)</option>
                                            <option value="numeric">Numeric (01/01/2025)</option>
                                        </select>
                                    </div>
                                )}

                                {/* Reset Button */}
                                <button
                                    onClick={() => {
                                        if (confirm('Reset all settings to defaults?')) {
                                            resetSettings();
                                        }
                                    }}
                                    className="settings-reset-btn"
                                >
                                    🔄 Reset to Defaults
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    };

    export default Settings;