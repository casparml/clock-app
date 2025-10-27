import { IClockRenderer } from './ClockRenderer.interface';
import { DotsClockRenderer } from './DotsClockRenderer';
import { DigitalClockRenderer } from './DigitalClockRenderer';
import { AnalogClockRenderer } from './AnalogClockRenderer';
import {
    ClockType,
    ClockConfig,
    DotsClockConfig,
    DigitalClockConfig,
    AnalogClockConfig
} from '../types/clock.types';

/**
 * Clock renderer factory - creates different clock styles
 */
export class ClockRendererFactory {
    static create(type: ClockType, config: ClockConfig = {}): IClockRenderer {
        switch (type) {
            case 'dots':
                return new DotsClockRenderer(config as DotsClockConfig);
            case 'analog':
                return new AnalogClockRenderer(config as AnalogClockConfig);
            case 'digital':
                return new DigitalClockRenderer(config as DigitalClockConfig);
            default:
                return new DotsClockRenderer(config as DotsClockConfig);
        }
    }
}