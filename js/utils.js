// SVG element creation helper
function createSVGElement(tag, attrs = {}) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attrs).forEach(([key, value]) => {
        el.setAttribute(key, value);
    });
    return el;
}

// Linear scale: maps [dataMin, dataMax] → [rangeMin, rangeMax]
function createLinearScale(dataMin, dataMax, rangeMin, rangeMax) {
    const dataRange = dataMax - dataMin;
    return (value) => rangeMin + ((value - dataMin) / dataRange) * (rangeMax - rangeMin);
}

// Generate HSL color by hue rotation
function getHSLColor(index, totalCount, saturation = 70, lightness = 50) {
    const hue = (index * 360 / totalCount) % 360;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// Tooltip management
function createTooltip() {
    const tooltip = document.createElement('div');
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 6px 10px;
        border-radius: 4px;
        font-size: 11px;
        pointer-events: none;
        z-index: 10;
        display: none;
        white-space: nowrap;
    `;
    return tooltip;
}

function showTooltip(tooltip, text, mouseEvent, svgRect) {
    tooltip.textContent = text;
    tooltip.style.display = 'block';
    tooltip.style.left = (mouseEvent.clientX - svgRect.left) + 'px';
    tooltip.style.top = (mouseEvent.clientY - svgRect.top - 25) + 'px';
}

function hideTooltip(tooltip) {
    tooltip.style.display = 'none';
}

// Compute data extent with padding
function computeDataExtent(values, paddingFraction = 0.1) {
    let min = Math.min(...values);
    let max = Math.max(...values);
    const range = max - min;
    const padding = (range || 1) * paddingFraction;
    return { min: min - padding, max: max + padding, range: (max + padding) - (min - padding) };
}
