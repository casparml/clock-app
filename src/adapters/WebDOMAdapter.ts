import {
    RenderData,
    DOMElements,
    Dot,
    DigitalRenderData,
    AnalogRenderData,
    DotsRenderData
} from '../types/clock.types';

/**
 * Clock adapter interface
 */
export interface IClockAdapter {
    update(renderData: RenderData): void;
}

/**
 * DOM adapter - handles web-specific rendering
 */
export class WebDOMAdapter implements IClockAdapter {
    private elements: DOMElements;

    constructor(elements: DOMElements = {}) {
        this.elements = {
            seconds: elements.seconds || (typeof document !== 'undefined' ? document.getElementById('secDots') : null),
            minutes: elements.minutes || (typeof document !== 'undefined' ? document.getElementById('minDots') : null),
            hours: elements.hours || (typeof document !== 'undefined' ? document.getElementById('hrDots') : null),
            container: elements.container || (typeof document !== 'undefined' ? document.getElementById('clockContainer') : null)
        };
    }

    private renderDots(dots: Dot[]): string {
        return dots.map(dot => {
            const classes = 'dot' + (dot.isActive ? ' active' : '');
            const style = dot.styles.transform + (dot.styles.dimmed ? '; background: #555;' : '');
            return `<div class="${classes}" style="transform: ${style}"></div>`;
        }).join('');
    }

    private renderDigital(renderData: DigitalRenderData): string {
        const daytimeHTML = renderData.daytime ? `<span class="daytime">${renderData.daytime}</span>` : '';
        const dateHTML = renderData.date ? `<div class="date">${renderData.date.formatted}</div>` : '';

        return `
            <div class="digital-clock">
                <div class="time-display">
                    <span class="hours">${renderData.hours}</span>
                    <span class="separator">${renderData.separator}</span>
                    <span class="minutes">${renderData.minutes}</span>
                    ${renderData.showSeconds ? `<span class="separator">${renderData.separator}</span><span class="seconds">${renderData.seconds}</span>` : ''}
                    ${daytimeHTML}
                </div>
                ${dateHTML}
            </div>
        `;
    }

    private renderAnalog(renderData: AnalogRenderData): string {
        const ticksHTML = renderData.ticks.map(tick =>
            `<div class="tick ${tick.type}" style="transform: rotate(${tick.angle}deg)"></div>`
        ).join('');

        const numbersHTML = renderData.numbers.map(num => {
            const radians = (num.angle - 90) * (Math.PI / 180);
            const radius = 40;
            const x = 50 + radius * Math.cos(radians);
            const y = 50 + radius * Math.sin(radians);
            return `<div class="clock-number" style="left: ${x}%; top: ${y}%">${num.display}</div>`;
        }).join('');

        const secondHandHTML = renderData.hands.second ?
            `<div class="hand second-hand" style="transform: rotate(${renderData.hands.second.angle}deg); height: ${renderData.hands.second.length}%; width: ${renderData.hands.second.width}px"></div>` : '';

        return `
            <div class="analog-clock">
                <div class="clock-face">
                    ${ticksHTML}
                    ${numbersHTML}
                    <div class="hand hour-hand" style="transform: rotate(${renderData.hands.hour.angle}deg); height: ${renderData.hands.hour.length}%; width: ${renderData.hands.hour.width}px"></div>
                    <div class="hand minute-hand" style="transform: rotate(${renderData.hands.minute.angle}deg); height: ${renderData.hands.minute.length}%; width: ${renderData.hands.minute.width}px"></div>
                    ${secondHandHTML}
                    <div class="center-dot" style="width: ${renderData.centerDot.radius * 2}px; height: ${renderData.centerDot.radius * 2}px"></div>
                </div>
            </div>
        `;
    }

    update(renderData: RenderData): void {
        if (renderData.type === 'digital') {
            if (this.elements.container) {
                this.elements.container.innerHTML = this.renderDigital(renderData);
            }
        } else if (renderData.type === 'analog') {
            if (this.elements.container) {
                this.elements.container.innerHTML = this.renderAnalog(renderData);
            }
        } else {
            // Original dots clock rendering
            const dotsData = renderData as DotsRenderData;
            if (this.elements.seconds) {
                this.elements.seconds.innerHTML =
                    this.renderDots(dotsData.seconds.dots) +
                    `<h1>${dotsData.seconds.value}<br><span>${dotsData.seconds.label}</span></h1>`;
            }

            if (this.elements.minutes) {
                this.elements.minutes.innerHTML =
                    this.renderDots(dotsData.minutes.dots) +
                    `<h2>${dotsData.minutes.value}<br><span>${dotsData.minutes.label}</span></h2>`;
            }

            if (this.elements.hours) {
                this.elements.hours.innerHTML =
                    this.renderDots(dotsData.hours.dots) +
                    `<b>${dotsData.hours.daytime}</b>` +
                    `<h3>${dotsData.hours.value}<br><span>${dotsData.hours.label}</span></h3>`;
            }
        }
    }
}