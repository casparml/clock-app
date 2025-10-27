/**
 * Time data from the clock model
 */
export interface TimeData {
    hours12: number;
    hours24: number;
    minutes: number;
    seconds: number;
    milliseconds?: number;
    daytime: 'AM' | 'PM';
}

/**
 * Date information
 */
export interface DateInfo {
    day: string;
    date: number;
    month: string;
    year: number;
    formatted: string;
}

/**
 * Dot style information
 */
export interface DotStyles {
    transform: string;
    active: boolean;
    dimmed: boolean;
}

/**
 * Individual dot data
 */
export interface Dot {
    index: number;
    rotation: number;
    isActive: boolean;
    isCurrent: boolean;
    styles: DotStyles;
}

/**
 * Time unit display data
 */
export interface TimeUnitDisplay {
    dots: Dot[];
    value: string;
    label: string;
    daytime?: string;
}

/**
 * Dots clock render data
 */
export interface DotsRenderData {
    type: 'dots';
    seconds?: TimeUnitDisplay;  // Make this optional
    minutes: TimeUnitDisplay;
    hours: TimeUnitDisplay & {
        daytime?: 'AM' | 'PM';
    };
}

/**
 * Digital clock render data
 */
export interface DigitalRenderData {
    type: 'digital';
    timeString: string;
    hours: string;
    minutes: string;
    seconds: string;
    daytime: string | null;
    separator: string;
    showSeconds: boolean;
    blinkSeparator: boolean;
    date?: DateInfo;
}

/**
 * Clock hand data
 */
export interface ClockHand {
    angle: number;
    length: number;
    width: number;
}

/**
 * Clock tick data
 */
export interface ClockTick {
    type: 'major' | 'minor';
    index: number;
    angle: number;
    isMajor: boolean;
}

/**
 * Clock number display
 */
export interface ClockNumber {
    value: number;
    display: string;
    angle: number;
}

/**
 * Analog clock render data
 */
export interface AnalogRenderData {
    type: 'analog';
    hands: {
        hour: ClockHand;
        minute: ClockHand;
        second: ClockHand | null;
    };
    ticks: ClockTick[];
    numbers: ClockNumber[];
    centerDot: {
        radius: number;
    };
    timeData: TimeData;
    showSecondHand?: boolean;  // Add this line
}

/**
 * Union type for all render data types
 */
export type RenderData = DotsRenderData | DigitalRenderData | AnalogRenderData;

/**
 * Clock type options
 */
export type ClockType = 'dots' | 'analog' | 'digital';

/**
 * Number style for analog clocks
 */
export type NumberStyle = '12' | '24' | 'roman' | 'none';

/**
 * Configuration for dots clock
 */
export interface DotsClockConfig {
    secondsTotal?: number;
    secondsDegree?: number;
    minutesTotal?: number;
    minutesDegree?: number;
    hoursTotal?: number;
    hoursDegree?: number;
    showSeconds?: boolean;
}

/**
 * Configuration for digital clock
 */
export interface DigitalClockConfig {
    use24Hour?: boolean;
    showSeconds?: boolean;
    showDate?: boolean;
    separator?: string;
}

/**
 * Configuration for analog clock
 */
export interface AnalogClockConfig {
    showSecondHand?: boolean;
    smoothSeconds?: boolean;
    showNumbers?: boolean;
    numberStyle?: NumberStyle;
    showTicks?: boolean;
    majorTicks?: number;
    minorTicks?: number;
}

/**
 * Union type for all config types
 */
export type ClockConfig = DotsClockConfig | DigitalClockConfig | AnalogClockConfig;

/**
 * DOM elements for web adapter
 */
export interface DOMElements {
    seconds?: HTMLElement | null;
    minutes?: HTMLElement | null;
    hours?: HTMLElement | null;
    container?: HTMLElement | null;
}