// Export SVG charts as downloadable files
function exportSVGAsFile(svgElement, filename) {
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function exportRadarChart() {
    const svg = document.querySelector('#radar-chart svg');
    if (!svg) {
        console.warn('Radar chart SVG not found');
        return;
    }
    exportSVGAsFile(svg, 'radar-chart.svg');
}

function exportScatterPlot() {
    const svg = document.querySelector('#scatter-chart svg');
    if (!svg) {
        console.warn('Scatter plot SVG not found');
        return;
    }
    exportSVGAsFile(svg, 'scatter-plot.svg');
}

function exportPieChart() {
    const svg = document.querySelector('#pie-chart svg');
    if (!svg) {
        console.warn('Pie chart SVG not found');
        return;
    }
    exportSVGAsFile(svg, 'metabolites-pie-chart.svg');
}
