// src/services/analytics.service.ts

interface AnalyticsEvent {
    event: string;
    timestamp: number;
    data?: Record<string, any>;
}

interface SessionData {
    sessionId: string;
    startTime: number;
    pageViews: number;
    events: AnalyticsEvent[];
    device: {
        userAgent: string;
        platform: string;
        language: string;
        screenResolution: string;
        viewport: string;
        pixelRatio: number;
        touchSupport: boolean;
        colorDepth: number;
        timezone: string;
    };
    performance: {
        loadTime?: number;
        domContentLoaded?: number;
        firstPaint?: number;
        firstContentfulPaint?: number;
    };
}

declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
        dataLayer?: any[];
    }
}

export class AnalyticsService {
    private static instance: AnalyticsService;
    private sessionData: SessionData;
    private eventQueue: AnalyticsEvent[] = [];
    private isTracking: boolean = true;
    private gaInitialized: boolean = false;
    private measurementId: string = import.meta.env.VITE_GA_MEASUREMENT_ID;

    private constructor() {
        this.sessionData = {
            sessionId: this.generateSessionId(),
            startTime: Date.now(),
            pageViews: 1,
            events: [],
            device: this.collectDeviceInfo(),
            performance: {}
        };

        this.initializeTracking();
        this.initializeGoogleAnalytics();
    }

    static getInstance(): AnalyticsService {
        if (!AnalyticsService.instance) {
            AnalyticsService.instance = new AnalyticsService();
        }
        return AnalyticsService.instance;
    }

    private generateSessionId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    private collectDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenResolution: `${screen.width}x${screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            pixelRatio: window.devicePixelRatio,
            touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
            colorDepth: screen.colorDepth,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
    }

    private initializeGoogleAnalytics(): void {
        if (typeof window === 'undefined') return;

        // Check if analytics is enabled
        const analyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS !== 'false';
        if (!analyticsEnabled) {
            return;
        }

        // Skip GA4 if no measurement ID is set
        if (!this.measurementId || this.measurementId === 'G-XXXXXXXXXX' || this.measurementId === '') {
            if (import.meta.env.DEV) {
                console.warn('Google Analytics: No valid measurement ID provided. Analytics disabled.');
            }
            return;
        }

        // Load Google Analytics script dynamically
        this.loadGAScript();

        // Wait for gtag to be available
        const checkGtag = setInterval(() => {
            if (window.gtag) {
                clearInterval(checkGtag);
                this.gaInitialized = true;
                this.configureGA4();
                this.sendInitialPageView();
            }
        }, 100);

        // Timeout after 5 seconds
        setTimeout(() => {
            clearInterval(checkGtag);
            if (!this.gaInitialized) {
                // Silently fail - GA is blocked or unavailable
                this.gaInitialized = false;
            }
        }, 5000);
    }

    private loadGAScript(): void {
        try {
            // Initialize dataLayer
            window.dataLayer = window.dataLayer || [];
            window.gtag = function() {
                window.dataLayer!.push(arguments);
            };
            window.gtag('js', new Date());

            // Load GA script
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
            
            // Handle script loading errors silently (likely ad blocker)
            script.onerror = () => {
                // Silently fail - this is expected when ad blockers are active
                this.gaInitialized = false;
            };
            
            document.head.appendChild(script);

            // Initial config
            window.gtag('config', this.measurementId, {
                send_page_view: false
            });
        } catch (error) {
            // Silently handle errors
            this.gaInitialized = false;
        }
    }

    private configureGA4(): void {
        if (!window.gtag) return;

        try {
            // Set custom dimensions
            window.gtag('config', this.measurementId, {
                custom_map: {
                    dimension1: 'session_id',
                    dimension2: 'device_type',
                    dimension3: 'screen_resolution',
                    dimension4: 'viewport_size',
                    dimension5: 'touch_support',
                    dimension6: 'timezone',
                    dimension7: 'clock_type',
                    dimension8: 'theme',
                    dimension9: 'time_format',
                    metric1: 'session_duration',
                    metric2: 'event_count'
                },
                session_id: this.sessionData.sessionId,
                device_type: this.getDeviceType(),
                screen_resolution: this.sessionData.device.screenResolution,
                viewport_size: this.sessionData.device.viewport,
                touch_support: this.sessionData.device.touchSupport ? 'yes' : 'no',
                timezone: this.sessionData.device.timezone
            });

            // Set user properties
            window.gtag('set', 'user_properties', {
                platform: this.sessionData.device.platform,
                language: this.sessionData.device.language,
                pixel_ratio: this.sessionData.device.pixelRatio,
                color_depth: this.sessionData.device.colorDepth
            });
        } catch (error) {
            console.error('Error configuring GA4:', error);
        }
    }

    private sendInitialPageView(): void {
        if (!window.gtag) return;

        try {
            window.gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href,
                page_path: window.location.pathname,
                session_id: this.sessionData.sessionId,
                ...this.sessionData.device
            });
        } catch (error) {
            console.error('Error sending initial page view:', error);
        }
    }

    private getDeviceType(): string {
        const width = window.innerWidth;
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
    }

    private initializeTracking(): void {
        // Track page load performance
        if (window.performance) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    try {
                        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
                        const paintEntries = performance.getEntriesByType('paint');

                        this.sessionData.performance = {
                            loadTime: perfData ? perfData.loadEventEnd - perfData.fetchStart : undefined,
                            domContentLoaded: perfData ? perfData.domContentLoadedEventEnd - perfData.fetchStart : undefined,
                            firstPaint: paintEntries.find(e => e.name === 'first-paint')?.startTime,
                            firstContentfulPaint: paintEntries.find(e => e.name === 'first-contentful-paint')?.startTime
                        };

                        this.track('page_performance', this.sessionData.performance);
                    } catch (error) {
                        console.error('Error tracking page performance:', error);
                    }
                }, 0);
            });
        }

        // Track page visibility changes
        document.addEventListener('visibilitychange', () => {
            this.track('visibility_change', {
                state: document.hidden ? 'hidden' : 'visible'
            });
        });

        // Track window focus/blur
        window.addEventListener('focus', () => this.track('window_focus'));
        window.addEventListener('blur', () => this.track('window_blur'));

        // Track viewport changes
        let resizeTimeout: NodeJS.Timeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.track('viewport_resize', {
                    width: window.innerWidth,
                    height: window.innerHeight,
                    device_type: this.getDeviceType()
                });
            }, 500);
        });

        // Track orientation changes
        if ('orientation' in screen) {
            screen.orientation?.addEventListener('change', () => {
                this.track('orientation_change', {
                    orientation: screen.orientation.type,
                    angle: screen.orientation.angle
                });
            });
        }

        // Track connection changes
        if ('connection' in navigator) {
            const connection = (navigator as any).connection;
            if (connection) {
                this.track('connection_info', {
                    effectiveType: connection.effectiveType,
                    downlink: connection.downlink,
                    rtt: connection.rtt,
                    saveData: connection.saveData
                });

                connection.addEventListener('change', () => {
                    this.track('connection_change', {
                        effectiveType: connection.effectiveType,
                        downlink: connection.downlink
                    });
                });
            }
        }

        // Track battery status
        if ('getBattery' in navigator) {
            (navigator as any).getBattery().then((battery: any) => {
                const trackBattery = () => {
                    this.track('battery_status', {
                        level: Math.round(battery.level * 100),
                        charging: battery.charging,
                        chargingTime: battery.chargingTime,
                        dischargingTime: battery.dischargingTime
                    });
                };

                trackBattery();
                battery.addEventListener('chargingchange', trackBattery);
                battery.addEventListener('levelchange', trackBattery);
            }).catch((error: any) => {
                console.error('Error accessing battery API:', error);
            });
        }

        // Track errors
        window.addEventListener('error', (event) => {
            this.track('javascript_error', {
                message: event.message,
                filename: event.filename,
                line: event.lineno,
                column: event.colno,
                error_type: 'runtime_error'
            });
        });

        // Track unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.track('unhandled_rejection', {
                reason: event.reason?.message || String(event.reason),
                error_type: 'promise_rejection'
            });
        });

        // Track session duration on unload
        window.addEventListener('beforeunload', () => {
            const sessionDuration = Date.now() - this.sessionData.startTime;
            this.track('session_end', {
                duration: sessionDuration,
                totalEvents: this.sessionData.events.length
            });
            this.flushEvents();
        });

        // Track time on page in intervals (every 30 seconds)
        setInterval(() => {
            const sessionDuration = Date.now() - this.sessionData.startTime;
            this.track('heartbeat', {
                session_duration: sessionDuration,
                event_count: this.sessionData.events.length
            });
        }, 30000);

        // Initial session start event
        this.track('session_start', {
            referrer: document.referrer,
            url: window.location.href,
            entry_point: 'direct'
        });
    }

    // Track custom events
    track(eventName: string, data?: Record<string, any>): void {
        if (!this.isTracking) return;

        try {
            const event: AnalyticsEvent = {
                event: eventName,
                timestamp: Date.now(),
                data
            };

            this.sessionData.events.push(event);
            this.eventQueue.push(event);

            // Send to Google Analytics
            this.sendToGA4(eventName, data);

            // Store locally as backup
            this.storeLocally(event);
        } catch (error) {
            console.error('Error tracking event:', error);
        }
    }

    private sendToGA4(eventName: string, data?: Record<string, any>): void {
        if (!window.gtag || !this.gaInitialized) return;

        try {
            // Clean event name (GA4 has naming restrictions)
            const cleanEventName = eventName
                .toLowerCase()
                .replace(/[^a-z0-9_]/g, '_')
                .substring(0, 40);

            // Flatten nested objects and ensure values are GA4 compatible
            const cleanData: Record<string, any> = {};
            if (data) {
                Object.entries(data).forEach(([key, value]) => {
                    const cleanKey = key.toLowerCase().replace(/[^a-z0-9_]/g, '_').substring(0, 40);

                    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                        // Flatten nested objects
                        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
                            const nestedCleanKey = `${cleanKey}_${nestedKey}`.toLowerCase().replace(/[^a-z0-9_]/g, '_').substring(0, 40);
                            cleanData[nestedCleanKey] = this.sanitizeValue(nestedValue);
                        });
                    } else {
                        cleanData[cleanKey] = this.sanitizeValue(value);
                    }
                });
            }

            // Add session context
            cleanData.session_id = this.sessionData.sessionId;
            cleanData.timestamp = Date.now();

            window.gtag('event', cleanEventName, cleanData);
        } catch (error) {
            console.error('Error sending event to GA4:', error);
        }
    }

    private sanitizeValue(value: any): string | number | boolean {
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            return value;
        }
        if (Array.isArray(value)) {
            return value.join(',');
        }
        return String(value);
    }

    // Track clock type changes
    trackClockChange(clockType: string): void {
        this.track('clock_type_change', {
            clock_type: clockType,
            previous_type: this.getLastClockType()
        });

        // Update GA4 user property
        if (window.gtag) {
            try {
                window.gtag('set', 'user_properties', {
                    current_clock_type: clockType
                });
            } catch (error) {
                console.error('Error setting user property:', error);
            }
        }
    }

    // Track settings changes
    trackSettingChange(settingName: string, oldValue: any, newValue: any): void {
        this.track('setting_change', {
            setting: settingName,
            old_value: String(oldValue),
            new_value: String(newValue)
        });

        // Update GA4 config for important settings
        if (window.gtag && ['theme', 'timeFormat'].includes(settingName)) {
            try {
                window.gtag('config', this.measurementId, {
                    [settingName]: newValue
                });
            } catch (error) {
                console.error('Error updating GA4 config:', error);
            }
        }
    }

    // Track user interactions
    trackInteraction(action: string, target?: string, data?: Record<string, any>): void {
        this.track('user_interaction', {
            action,
            target,
            ...data
        });
    }

    // Track clock usage duration
    trackClockUsage(clockType: string, duration: number): void {
        this.track('clock_usage', {
            clock_type: clockType,
            duration_ms: duration,
            duration_seconds: Math.round(duration / 1000)
        });
    }

    // Track feature usage
    trackFeatureUsage(feature: string, data?: Record<string, any>): void {
        this.track('feature_usage', {
            feature,
            ...data
        });
    }

    private getLastClockType(): string | undefined {
        const lastClockEvent = [...this.sessionData.events]
            .reverse()
            .find(e => e.event === 'clock_type_change');
        return lastClockEvent?.data?.clock_type;
    }

    private storeLocally(event: AnalyticsEvent): void {
        try {
            const stored = localStorage.getItem('analytics_events') || '[]';
            const events = JSON.parse(stored);
            events.push({
                ...event,
                sessionId: this.sessionData.sessionId
            });

            // Keep only last 100 events
            if (events.length > 100) {
                events.splice(0, events.length - 100);
            }

            localStorage.setItem('analytics_events', JSON.stringify(events));
        } catch (error) {
            console.error('Failed to store analytics event:', error);
        }
    }

    private flushEvents(): void {
        if (this.eventQueue.length === 0) return;

        try {
            const events = [...this.eventQueue];
            this.eventQueue = [];

            // Use sendBeacon for reliable sending on page unload
            if ('sendBeacon' in navigator && window.gtag) {
                // Send summary event via GA4
                window.gtag('event', 'batch_events', {
                    event_count: events.length,
                    session_id: this.sessionData.sessionId
                });
            }
        } catch (error) {
            console.error('Error flushing events:', error);
        }
    }

    // Get session summary
    getSessionSummary(): SessionData {
        return {
            ...this.sessionData,
            events: [...this.sessionData.events]
        };
    }

    // Export analytics data
    exportData(): string {
        return JSON.stringify(this.getSessionSummary(), null, 2);
    }

    // Clear analytics data
    clearData(): void {
        try {
            localStorage.removeItem('analytics_events');
            this.sessionData.events = [];
            this.eventQueue = [];
        } catch (error) {
            console.error('Error clearing analytics data:', error);
        }
    }

    // Enable/disable tracking
    setTracking(enabled: boolean): void {
        this.isTracking = enabled;

        if (window.gtag) {
            try {
                // Update GA4 consent
                window.gtag('consent', 'update', {
                    analytics_storage: enabled ? 'granted' : 'denied'
                });
            } catch (error) {
                console.error('Error updating tracking consent:', error);
            }
        }

        this.track('tracking_toggle', { enabled });
    }

    // Set measurement ID (useful for environment-specific configs)
    setMeasurementId(id: string): void {
        this.measurementId = id;
    }
}

export default AnalyticsService.getInstance();