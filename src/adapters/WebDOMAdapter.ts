import type {
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
        // Determine clock type based on which elements are provided
        if (elements.container) {
        } else if (!elements.seconds && !elements.minutes && !elements.hours) {
        } else {
        }

        this.elements = {
            seconds: elements.seconds || null,
            minutes: elements.minutes || null,
            hours: elements.hours || null,
            container: elements.container || null
        };
    }

    private renderDots(dots: Dot[]): string {
        return dots.map(dot => {
            const classes = 'dot' + (dot.isActive ? ' active' : '');
            const style = dot.styles.transform + (dot.styles.dimmed ? '; background: #555;' : '');
            return `<div class="${classes}" style="transform: ${style}"></div>`;
        }).join('');
    }

    private updateDigitalClock(renderData: DigitalRenderData): void {
        const digitalClock = document.getElementById('digitalClock');
        if (!digitalClock) return;

        const hoursElement = digitalClock.querySelector('.hours');
        const minutesElement = digitalClock.querySelector('.minutes');
        const secondsElement = digitalClock.querySelector('.seconds');

        if (hoursElement) hoursElement.textContent = renderData.hours;
        if (minutesElement) minutesElement.textContent = renderData.minutes;
        if (secondsElement && renderData.showSeconds) secondsElement.textContent = renderData.seconds;

        // Handle AM/PM
        let daytimeElement = digitalClock.querySelector('.daytime');
        if (renderData.daytime) {
            if (!daytimeElement) {
                daytimeElement = document.createElement('span');
                daytimeElement.className = 'daytime';
                digitalClock.appendChild(daytimeElement);
            }
            daytimeElement.textContent = ` ${renderData.daytime}`;
        } else if (daytimeElement) {
            daytimeElement.remove();
        }

        // Handle date
        let dateElement = digitalClock.querySelector('.date');
        if (renderData.date) {
            if (!dateElement) {
                dateElement = document.createElement('div');
                dateElement.className = 'date';
                digitalClock.appendChild(dateElement);
            }
            dateElement.textContent = renderData.date.formatted;
        } else if (dateElement) {
            dateElement.remove();
        }
    }

    private updateDotsClock(dotsData: DotsRenderData): void {
        const seconds = this.elements.seconds || document.getElementById('secDots');
        const minutes = this.elements.minutes || document.getElementById('minDots');
        const hours = this.elements.hours || document.getElementById('hrDots');

        if (seconds) {
            seconds.innerHTML =
                this.renderDots(dotsData.seconds.dots) +
                `<h1>${dotsData.seconds.value}<br><span>${dotsData.seconds.label}</span></h1>`;
        }

        if (minutes) {
            minutes.innerHTML =
                this.renderDots(dotsData.minutes.dots) +
                `<h2>${dotsData.minutes.value}<br><span>${dotsData.minutes.label}</span></h2>`;
        }

        if (hours) {
            hours.innerHTML =
                this.renderDots(dotsData.hours.dots) +
                `<b>${dotsData.hours.daytime}</b>` +
                `<h3>${dotsData.hours.value}<br><span>${dotsData.hours.label}</span></h3>`;
        }
    }

    private renderAnalog(renderData: AnalogRenderData): string {
        const ticksHTML = renderData.ticks.map(tick =>
            `<div class="tick ${tick.type}" style="transform: rotate(${tick.angle}deg)"></div>`
        ).join('');

        const numbersHTML = renderData.numbers.map(num => {
            // Calculate position on circle
            const angleRad = (num.angle - 90) * (Math.PI / 180); // -90 to start at top
            const radius = 42; // percentage from center
            const x = 50 + radius * Math.cos(angleRad);
            const y = 50 + radius * Math.sin(angleRad);
            return `<div class="clock-number" style="left: calc(${x}% - 20px); top: calc(${y}% - 20px);">${num.display}</div>`;
        }).join('');

        const secondHandHTML = renderData.hands.second ?
            `<div class="hand second-hand" style="transform: translateX(-50%) rotate(${renderData.hands.second.angle}deg)"></div>` : '';

        return `
            <div class="clock-face">
                ${ticksHTML}
                ${numbersHTML}
                <div class="hand hour-hand" style="transform: translateX(-50%) rotate(${renderData.hands.hour.angle}deg)"></div>
                <div class="hand minute-hand" style="transform: translateX(-50%) rotate(${renderData.hands.minute.angle}deg)"></div>
                ${secondHandHTML}
                <div class="center-dot"></div>
            </div>
        `;
    }

    private updateAnalogClock(renderData: AnalogRenderData): void {
        const container = this.elements.container || document.getElementById('analogClock');
        if (container) {
            // Check if container already has content
            const existingFace = container.querySelector('.clock-face');
            if (existingFace) {
                // Update existing clock face
                container.innerHTML = this.renderAnalog(renderData);
            } else {
                // Initial render
                container.innerHTML = this.renderAnalog(renderData);
            }
            console.log('Analog clock updated');
        } else {
            console.error('Analog clock container not found');
        }
    }

    update(renderData: RenderData): void {
        if (renderData.type === 'digital') {
            this.updateDigitalClock(renderData);
        } else if (renderData.type === 'analog') {
            this.updateAnalogClock(renderData);
        } else {
            // Dots clock (type is 'dots' or undefined for backwards compatibility)
            this.updateDotsClock(renderData as DotsRenderData);
        }
    }
}