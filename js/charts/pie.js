// Pie chart renderer for metabolite contributions
function renderPieChart(containerEl, data, options = {}) {
    if (!data || data.length === 0) {
        containerEl.innerHTML = '<span class="text-gray-400 text-sm">No data</span>';
        return;
    }

    const sortedData = [...data].sort((a, b) => b.contribution - a.contribution);
    const svg = createPieSVG();
    const { centerX, centerY, radius } = getPieDimensions();
    const categories = sortedData.map(d => d.name);
    const colorMap = buildColorMap(categories);

    drawPieSlices(svg, sortedData, centerX, centerY, radius, colorMap);
    drawPieLabels(svg, sortedData, centerX, centerY, radius);
    setupPieTooltips(svg, containerEl, sortedData, centerX, centerY, radius, colorMap);
    injectIntoContainer(containerEl, svg);
    drawPieLegend(containerEl, sortedData, colorMap);
}

function createPieSVG() {
    const svg = createSVGElement('svg', {
        viewBox: '0 0 320 320',
        preserveAspectRatio: 'xMidYMid meet'
    });
    svg.style.cssText = `
        width: 100%;
        height: 100%;
        background: white;
        display: block;
    `;
    return svg;
}

function getPieDimensions() {
    return {
        centerX: 160,
        centerY: 160,
        radius: 145
    };
}

function buildColorMap(categories) {
    const colorMap = {};
    categories.forEach((cat, idx) => {
        colorMap[cat] = getHSLColor(idx, categories.length);
    });
    return colorMap;
}

function drawPieSlices(svg, data, centerX, centerY, radius, colorMap) {
    const slicesGroup = createSVGElement('g');
    let currentAngle = -90;

    data.forEach((item) => {
        const sliceAngle = (item.contribution / 100) * 360;
        const startAngle = currentAngle * Math.PI / 180;
        const endAngle = (currentAngle + sliceAngle) * Math.PI / 180;

        const x1 = centerX + radius * Math.cos(startAngle);
        const y1 = centerY + radius * Math.sin(startAngle);
        const x2 = centerX + radius * Math.cos(endAngle);
        const y2 = centerY + radius * Math.sin(endAngle);

        const largeArc = sliceAngle > 180 ? 1 : 0;

        const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
            'Z'
        ].join(' ');

        const slice = createSVGElement('path', {
            d: pathData,
            fill: colorMap[item.name],
            stroke: 'white',
            'stroke-width': '2'
        });

        slicesGroup.appendChild(slice);

        // Store data on slice for tooltip
        slice.dataset.name = item.name;
        slice.dataset.contribution = item.contribution;
        slice.dataset.startAngle = currentAngle;
        slice.dataset.endAngle = currentAngle + sliceAngle;

        currentAngle += sliceAngle;
    });

    svg.appendChild(slicesGroup);
}

function drawPieLabels(svg, data, centerX, centerY, radius) {
    const labelsGroup = createSVGElement('g');
    let currentAngle = -90;
    const labelRadius = radius * 0.80;

    data.forEach((item) => {
        const sliceAngle = (item.contribution / 100) * 360;
        const midAngle = currentAngle + sliceAngle / 2;
        const midRad = midAngle * Math.PI / 180;

        const labelX = centerX + labelRadius * Math.cos(midRad);
        const labelY = centerY + labelRadius * Math.sin(midRad);

        // Number only (no % sign)
        const percentLabel = createSVGElement('text', {
            x: labelX,
            y: labelY,
            'text-anchor': 'middle',
            'dominant-baseline': 'middle',
            'font-size': '10',
            fill: 'white',
            'font-weight': '600'
        });
        percentLabel.textContent = item.contribution;
        labelsGroup.appendChild(percentLabel);

        currentAngle += sliceAngle;
    });

    svg.appendChild(labelsGroup);
}

function setupPieTooltips(svg, containerEl, data, centerX, centerY, radius, colorMap) {
    const tooltip = createTooltip();
    containerEl.appendChild(tooltip);

    const slices = svg.querySelectorAll('path');
    slices.forEach((slice) => {
        const name = slice.dataset.name;
        const contribution = slice.dataset.contribution;

        const onEnter = (e) => {
            const rect = svg.getBoundingClientRect();
            showTooltip(tooltip, `${name}: ${contribution}%`, e, rect);
            slice.setAttribute('opacity', '0.8');
            slice.setAttribute('stroke-width', '3');
        };

        const onLeave = () => {
            hideTooltip(tooltip);
            slice.setAttribute('opacity', '1');
            slice.setAttribute('stroke-width', '2');
        };

        slice.style.cursor = 'pointer';
        slice.addEventListener('mouseenter', onEnter);
        slice.addEventListener('mousemove', onEnter);
        slice.addEventListener('mouseleave', onLeave);
    });
}

function drawPieLegend(containerEl, data, colorMap) {
    const compoundNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'Others'];

    const legend = document.createElement('div');
    legend.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-left: 8px;
        padding: 8px;
        background: #f9fafb;
        border-radius: 6px;
        font-size: 11px;
        max-height: 100%;
        overflow-y: auto;
        flex-shrink: 0;
        width: 140px;
    `;

    data.forEach((item, idx) => {
        const legendItem = document.createElement('div');
        legendItem.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
            color: #374151;
            padding: 4px 0;
        `;

        const swatch = document.createElement('div');
        swatch.style.cssText = `
            width: 12px;
            height: 12px;
            border-radius: 2px;
            background: ${colorMap[item.name]};
            flex-shrink: 0;
        `;

        const label = document.createElement('span');
        label.textContent = `Compound ${compoundNames[idx]}`;
        label.title = item.name;
        label.style.cssText = 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap;';

        legendItem.appendChild(swatch);
        legendItem.appendChild(label);
        legend.appendChild(legendItem);
    });

    containerEl.appendChild(legend);
}

function injectIntoContainer(containerEl, svg) {
    containerEl.innerHTML = '';
    containerEl.style.display = 'flex';
    containerEl.style.alignItems = 'flex-start';
    containerEl.style.gap = '0';

    const svgWrapper = document.createElement('div');
    svgWrapper.style.cssText = `
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
    `;
    svgWrapper.appendChild(svg);
    containerEl.appendChild(svgWrapper);
}
