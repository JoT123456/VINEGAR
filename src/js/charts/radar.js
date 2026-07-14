// Radar chart renderer
function renderRadarChart(containerEl, data, { maxScale = 5, rings = 5 } = {}) {
    const categories = Object.keys(data);
    if (categories.length === 0) {
        containerEl.innerHTML = '<span class="text-gray-400 text-sm">No data</span>';
        return;
    }

    const svg = createRadarSVG();
    const { centerX, centerY, maxRadius } = getRadarDimensions();

    drawRadarRings(svg, categories.length, rings, centerX, centerY, maxRadius);
    drawRadarAxes(svg, categories, centerX, centerY, maxRadius);
    const vertices = drawRadarPolygon(svg, data, categories, centerX, centerY, maxRadius, maxScale);
    setupRadarTooltips(svg, containerEl, vertices);

    injectIntoContainer(containerEl, svg);
}

function createRadarSVG() {
    const svg = createSVGElement('svg', {
        viewBox: '0 0 360 360',
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

function getRadarDimensions() {
    return {
        centerX: 180,
        centerY: 180,
        maxRadius: 140
    };
}

function drawRadarRings(svg, numCategories, ringCount, centerX, centerY, maxRadius) {
    const ringGroup = createSVGElement('g');

    for (let i = 1; i <= ringCount; i++) {
        const radius = (maxRadius / ringCount) * i;
        const points = getPolygonPoints(numCategories, centerX, centerY, radius);

        const ring = createSVGElement('polygon', {
            points: points.join(' '),
            fill: 'none',
            stroke: '#e5e7eb',
            'stroke-width': '1'
        });
        ringGroup.appendChild(ring);
    }

    svg.appendChild(ringGroup);
}

function drawRadarAxes(svg, categories, centerX, centerY, maxRadius) {
    const axisGroup = createSVGElement('g');

    categories.forEach((category, i) => {
        const { x, y, angle } = getPointOnCircle(i, categories.length, centerX, centerY, maxRadius);

        drawAxisLine(axisGroup, centerX, centerY, x, y);
        drawAxisLabel(axisGroup, category, angle, centerX, centerY, maxRadius);
    });

    svg.appendChild(axisGroup);
}

function drawAxisLine(group, x1, y1, x2, y2) {
    const line = createSVGElement('line', {
        x1, y1, x2, y2,
        stroke: '#d1d5db',
        'stroke-width': '1'
    });
    group.appendChild(line);
}

function drawAxisLabel(group, text, angle, centerX, centerY, maxRadius) {
    const labelRadius = maxRadius + 25;
    const labelX = centerX + labelRadius * Math.cos(angle);
    const labelY = centerY + labelRadius * Math.sin(angle);

    const label = createSVGElement('text', {
        x: labelX,
        y: labelY,
        'text-anchor': 'middle',
        'dominant-baseline': 'middle',
        'font-size': '12',
        fill: '#6b7280',
        'font-weight': '500'
    });
    label.textContent = text;
    group.appendChild(label);
}

function drawRadarPolygon(svg, data, categories, centerX, centerY, maxRadius, maxScale) {
    const vertices = [];
    const points = [];

    categories.forEach((category, i) => {
        const value = data[category];
        const normalized = Math.max(0, Math.min(value / maxScale, 1));
        const radius = normalized * maxRadius;
        const { x, y } = getPointOnCircle(i, categories.length, centerX, centerY, radius);

        points.push(`${x},${y}`);
        vertices.push({ x, y, category, value });
    });

    points.push(points[0]); // Close polygon

    const polygon = createSVGElement('polygon', {
        points: points.join(' '),
        fill: 'rgba(37, 99, 235, 0.2)',
        stroke: '#2563eb',
        'stroke-width': '2'
    });
    svg.appendChild(polygon);

    // Draw vertex markers
    vertices.forEach(vertex => {
        const marker = createSVGElement('circle', {
            cx: vertex.x,
            cy: vertex.y,
            r: '4',
            fill: '#2563eb',
            stroke: 'white',
            'stroke-width': '1.5'
        });
        svg.appendChild(marker);
    });

    return vertices;
}

function setupRadarTooltips(svg, containerEl, vertices) {
    const tooltip = createTooltip();
    containerEl.appendChild(tooltip);

    vertices.forEach(vertex => {
        const markers = svg.querySelectorAll('circle');
        const idx = Array.from(markers).findIndex(m =>
            parseFloat(m.getAttribute('cx')) === vertex.x &&
            parseFloat(m.getAttribute('cy')) === vertex.y
        );

        if (idx >= 0) {
            const marker = markers[idx];
            addMarkerHoverListener(marker, vertex, tooltip, svg);
        }
    });
}

function addMarkerHoverListener(marker, vertex, tooltip, svg) {
    const hitArea = createSVGElement('circle', {
        cx: marker.getAttribute('cx'),
        cy: marker.getAttribute('cy'),
        r: '8',
        fill: 'transparent'
    });
    hitArea.style.cursor = 'pointer';
    svg.appendChild(hitArea);

    const onEnter = (e) => {
        const rect = svg.getBoundingClientRect();
        showTooltip(tooltip, `${vertex.category}: ${vertex.value.toFixed(1)}`, e, rect);
        marker.setAttribute('r', '6');
        marker.setAttribute('stroke-width', '2.5');
    };

    const onLeave = () => {
        hideTooltip(tooltip);
        marker.setAttribute('r', '4');
        marker.setAttribute('stroke-width', '1.5');
    };

    hitArea.addEventListener('mouseenter', onEnter);
    hitArea.addEventListener('mousemove', onEnter);
    hitArea.addEventListener('mouseleave', onLeave);
}

function getPointOnCircle(index, total, centerX, centerY, radius) {
    const angle = (index * 360 / total - 90) * Math.PI / 180;
    return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        angle
    };
}

function getPolygonPoints(numSides, centerX, centerY, radius) {
    const points = [];
    for (let i = 0; i < numSides; i++) {
        const { x, y } = getPointOnCircle(i, numSides, centerX, centerY, radius);
        points.push(`${x},${y}`);
    }
    points.push(points[0]); // Close polygon
    return points;
}

function injectIntoContainer(containerEl, svg) {
    containerEl.innerHTML = '';
    containerEl.appendChild(svg);
}
