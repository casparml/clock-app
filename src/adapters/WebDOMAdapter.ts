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
        const separators = digitalClock.querySelectorAll('.separator');

        if (hoursElement) hoursElement.textContent = renderData.hours;
        if (minutesElement) minutesElement.textContent = renderData.minutes;

        // Update seconds and visibility
        if (secondsElement) {
            secondsElement.textContent = renderData.seconds;
            (secondsElement as HTMLElement).style.display = renderData.showSeconds ? 'inline' : 'none';
        }

        // Update separators visibility and blinking
        separators.forEach((separator, index) => {
            const sepElement = separator as HTMLElement;

            // Hide last separator if seconds are hidden
            if (index === separators.length - 1 && !renderData.showSeconds) {
                sepElement.style.display = 'none';
            } else {
                sepElement.style.display = 'inline';
            }

            // Toggle blink animation
            if (renderData.blinkSeparator) {
                sepElement.style.animation = 'blink 1s infinite';
            } else {
                sepElement.style.animation = 'none';
                sepElement.style.opacity = '1';
            }
        });

        // Handle AM/PM
        const timeContainer = digitalClock.querySelector('.time-container');
        if (timeContainer) {
            let daytimeElement = timeContainer.querySelector('.daytime');
            if (renderData.daytime) {
                if (!daytimeElement) {
                    daytimeElement = document.createElement('span');
                    daytimeElement.className = 'daytime';
                    timeContainer.appendChild(daytimeElement);
                }
                daytimeElement.textContent = ` ${renderData.daytime}`;
            } else if (daytimeElement) {
                daytimeElement.remove();
            }
        }

        // Handle date - render outside time container
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

        // Update seconds only if data exists
        if (seconds && dotsData.seconds) {
            seconds.innerHTML =
                this.renderDots(dotsData.seconds.dots) +
                `<h1>${dotsData.seconds.value}<br><span>${dotsData.seconds.label}</span></h1>`;
        }

        // Update minutes
        if (minutes) {
            minutes.innerHTML =
                this.renderDots(dotsData.minutes.dots) +
                `<h2>${dotsData.minutes.value}<br><span>${dotsData.minutes.label}</span></h2>`;
        }

        // Update hours
        if (hours) {
            hours.innerHTML =
                this.renderDots(dotsData.hours.dots) +
                `<b>${dotsData.hours.daytime || ''}</b>` +
                `<h3>${dotsData.hours.value}<br><span>${dotsData.hours.label}</span></h3>`;
        }

        // Handle date - use requestAnimationFrame to avoid conflicts with innerHTML updates
        const clockContainer = document.getElementById('clock');
        if (clockContainer) {
            requestAnimationFrame(() => {
                let dateElement = clockContainer.querySelector('.date') as HTMLElement;
                const newDateValue = dotsData.date?.formatted || null;

                if (newDateValue) {
                    if (!dateElement) {
                        dateElement = document.createElement('div');
                        dateElement.className = 'date';
                        clockContainer.appendChild(dateElement);
                    }
                    // Only update text if it changed
                    if (dateElement.textContent !== newDateValue) {
                        dateElement.textContent = newDateValue;
                    }
                } else {
                    // Remove date if it exists and we don't want to show it anymore
                    if (dateElement) {
                        dateElement.remove();
                    }
                }
            });
        }
    }

    private renderAnalog(renderData: AnalogRenderData): string {
        let html = '<div class="clock-face">';

        // Render ticks
        renderData.ticks.forEach(tick => {
            html += `<div class="tick ${tick.type}" style="transform: rotate(${tick.angle}deg)"></div>`;
        });

        // Render numbers with corrected positioning
        renderData.numbers.forEach(number => {
            // Convert angle to radians (subtract 90 to start at 12 o'clock)
            const angleRad = (number.angle - 90) * (Math.PI / 180);

            // Calculate position on a circle
            // Using 40% radius to position numbers inside the clock face
            const radiusPercent = 38;
            const x = 50 + radiusPercent * Math.cos(angleRad);
            const y = 50 + radiusPercent * Math.sin(angleRad);

            html += `<div class="clock-number" style="
            left: ${x}%;
            top: ${y}%;
            transform: translate(-50%, -50%);
        ">${number.display}</div>`;
        });

        // Render hour hand
        html += `<div class="hand hour-hand" style="transform: rotate(${renderData.hands.hour.angle}deg);"></div>`;

        // Render minute hand
        html += `<div class="hand minute-hand" style="transform: rotate(${renderData.hands.minute.angle}deg);"></div>`;

        // Render second hand with visibility control
        if (renderData.hands.second) {
            const display = renderData.showSecondHand !== false ? 'block' : 'none';
            html += `<div class="hand second-hand" style="transform: rotate(${renderData.hands.second.angle}deg); display: ${display};"></div>`;
        }

        // Render center dot
        html += '<div class="center-dot"></div>';

        html += '</div>';

        // Add date if present
        if (renderData.date) {
            html += `<div class="date">${renderData.date.formatted}</div>`;
        }
        return html;
    }

    private updateAnalogClock(renderData: AnalogRenderData): void {
        const container = this.elements.container || document.getElementById('analogClock');
        if (!container) {
            console.error('Analog clock container not found');
            return;
        }

        // Check if we need to re-render the clock face (only on initialization or settings change)
        let clockFace = container.querySelector('.clock-face');
        if (!clockFace) {
            // Initial render
            container.innerHTML = this.renderAnalog(renderData);
            clockFace = container.querySelector('.clock-face');
        } else {
            // Update only the hands
            const hourHand = container.querySelector('.hour-hand') as HTMLElement;
            const minuteHand = container.querySelector('.minute-hand') as HTMLElement;
            const secondHand = container.querySelector('.second-hand') as HTMLElement;

            if (hourHand) {
                hourHand.style.transform = `rotate(${renderData.hands.hour.angle}deg)`;
            }
            if (minuteHand) {
                minuteHand.style.transform = `rotate(${renderData.hands.minute.angle}deg)`;
            }
            if (secondHand && renderData.hands.second) {
                secondHand.style.transform = `rotate(${renderData.hands.second.angle}deg)`;
                secondHand.style.display = renderData.showSecondHand !== false ? 'block' : 'none';
            }
        }

        // Handle date - only update if changed
        let dateElement = container.querySelector('.date') as HTMLElement;
        if (renderData.date) {
            if (!dateElement) {
                dateElement = document.createElement('div');
                dateElement.className = 'date';
                container.appendChild(dateElement);
            }
            // Only update text if it changed
            if (dateElement.textContent !== renderData.date.formatted) {
                dateElement.textContent = renderData.date.formatted;
            }
        } else if (dateElement) {
            dateElement.remove();
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