// Scatter plot renderer
function renderScatterPlot(containerEl, points, options = {}) {
    if (!points || points.length === 0) {
        containerEl.innerHTML = '<span class="text-gray-400 text-sm">No data</span>';
        return;
    }

    const svg = createScatterSVG();
    const { xScale, yScale, extent } = buildScatterScales(points);
    const { padding, svgSize } = getScatterDimensions();
    const categories = getUniqueCategories(points);
    const colorMap = buildColorMap(categories);

    drawScatterGrid(svg, categories.length, xScale, yScale, extent, padding, svgSize);
    drawScatterAxes(svg, padding, svgSize);
    drawScatterPoints(svg, containerEl, points, xScale, yScale, colorMap);

    const legend = createScatterLegend(categories, colorMap);

    containerEl.innerHTML = '';
    containerEl.style.position = 'relative';
    containerEl.appendChild(legend);
    containerEl.appendChild(svg);
}

function createScatterSVG() {
    const svg = createSVGElement('svg', {
        width: '320',
        height: '320',
        viewBox: '0 0 320 320'
    });
    svg.style.cssText = 'background: white;';
    return svg;
}

function getScatterDimensions() {
    const svgSize = 320;
    const padding = 40;
    const plotWidth = svgSize - 2 * padding;
    const plotHeight = svgSize - 2 * padding;
    return { svgSize, padding, plotWidth, plotHeight };
}

function buildScatterScales(points) {
    const { padding, plotWidth, plotHeight, svgSize } = getScatterDimensions();

    const xValues = points.map(p => p.x);
    const yValues = points.map(p => p.y);
    const xExtent = computeDataExtent(xValues);
    const yExtent = computeDataExtent(yValues);

    const xScale = createLinearScale(xExtent.min, xExtent.max, padding, svgSize - padding);
    const yScale = createLinearScale(yExtent.min, yExtent.max, svgSize - padding, padding); // Inverted

    return { xScale, yScale, extent: { x: xExtent, y: yExtent } };
}

function getUniqueCategories(points) {
    return [...new Set(points.map(p => p.category))];
}

function buildColorMap(categories) {
    const colorMap = {};
    categories.forEach((cat, idx) => {
        colorMap[cat] = getHSLColor(idx, categories.length);
    });
    return colorMap;
}

function drawScatterGrid(svg, numCategories, xScale, yScale, extent, padding, svgSize) {
    const gridGroup = createSVGElement('g');
    const tickCount = 3;

    for (let i = 0; i <= tickCount; i++) {
        const xVal = extent.x.min + (i / tickCount) * extent.x.range;
        const yVal = extent.y.min + (i / tickCount) * extent.y.range;
        const xPx = xScale(xVal);
        const yPx = yScale(yVal);

        drawGridLine(gridGroup, xPx, padding, xPx, svgSize - padding, 'vertical');
        drawGridLine(gridGroup, padding, yPx, svgSize - padding, yPx, 'horizontal');
    }

    svg.appendChild(gridGroup);
}

function drawGridLine(group, x1, y1, x2, y2, direction) {
    const line = createSVGElement('line', {
        x1, y1, x2, y2,
        stroke: '#f3f4f6',
        'stroke-width': '1'
    });
    group.appendChild(line);
}

function drawScatterAxes(svg, padding, svgSize) {
    const axisGroup = createSVGElement('g');

    // X axis
    const xAxis = createSVGElement('line', {
        x1: padding,
        y1: svgSize - padding,
        x2: svgSize - padding,
        y2: svgSize - padding,
        stroke: '#9ca3af',
        'stroke-width': '1.5'
    });
    axisGroup.appendChild(xAxis);

    // Y axis
    const yAxis = createSVGElement('line', {
        x1: padding,
        y1: padding,
        x2: padding,
        y2: svgSize - padding,
        stroke: '#9ca3af',
        'stroke-width': '1.5'
    });
    axisGroup.appendChild(yAxis);

    // X axis label
    const xLabel = createSVGElement('text', {
        x: svgSize - padding + 5,
        y: svgSize - padding + 4,
        'font-size': '12',
        fill: '#6b7280',
        'font-weight': '600'
    });
    xLabel.textContent = 'PC1 (35%)';
    axisGroup.appendChild(xLabel);

    // Y axis label
    const yLabel = createSVGElement('text', {
        x: padding - 20,
        y: padding - 5,
        'font-size': '12',
        fill: '#6b7280',
        'font-weight': '600',
        'text-anchor': 'end'
    });
    yLabel.textContent = 'PC2 (18%)';
    axisGroup.appendChild(yLabel);

    svg.appendChild(axisGroup);
}

function drawScatterPoints(svg, containerEl, points, xScale, yScale, colorMap) {
    const tooltip = createTooltip();
    containerEl.appendChild(tooltip);

    points.forEach(point => {
        drawScatterPoint(svg, point, xScale, yScale, colorMap, tooltip);
    });
}

function drawScatterPoint(svg, point, xScale, yScale, colorMap, tooltip) {
    const xPx = xScale(point.x);
    const yPx = yScale(point.y);
    const color = colorMap[point.category];

    const marker = createSVGElement('circle', {
        cx: xPx,
        cy: yPx,
        r: '3.5',
        fill: color,
        stroke: 'white',
        'stroke-width': '1'
    });

    const hitArea = createSVGElement('circle', {
        cx: xPx,
        cy: yPx,
        r: '7',
        fill: 'transparent'
    });
    hitArea.style.cursor = 'pointer';

    const onEnter = (e) => {
        const rect = svg.getBoundingClientRect();
        const text = `${point.category}: (${point.x.toFixed(1)}, ${point.y.toFixed(1)})`;
        showTooltip(tooltip, text, e, rect);
        marker.setAttribute('r', '5');
        marker.setAttribute('stroke-width', '1.5');
    };

    const onLeave = () => {
        hideTooltip(tooltip);
        marker.setAttribute('r', '3.5');
        marker.setAttribute('stroke-width', '1');
    };

    hitArea.addEventListener('mouseenter', onEnter);
    hitArea.addEventListener('mousemove', onEnter);
    hitArea.addEventListener('mouseleave', onLeave);

    svg.appendChild(marker);
    svg.appendChild(hitArea);
}

function createScatterLegend(categories, colorMap) {
    const legend = document.createElement('div');
    legend.style.cssText = `
        display: flex;
        gap: 16px;
        justify-content: flex-end;
        margin-bottom: 8px;
        flex-wrap: wrap;
    `;

    categories.forEach(cat => {
        const item = document.createElement('div');
        item.style.cssText = `
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            color: #374151;
        `;

        const swatch = document.createElement('div');
        swatch.style.cssText = `
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: ${colorMap[cat]};
        `;

        const label = document.createElement('span');
        label.textContent = cat;

        item.appendChild(swatch);
        item.appendChild(label);
        legend.appendChild(item);
    });

    return legend;
}
