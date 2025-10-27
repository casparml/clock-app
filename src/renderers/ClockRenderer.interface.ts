import { TimeData, RenderData } from '../types/clock.types';

/**
 * Clock renderer interface
 */
export interface IClockRenderer {
    render(timeData: TimeData): RenderData;
}