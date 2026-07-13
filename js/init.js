// Initialize charts on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Render radar chart
    try {
        const flavorData = await fetchJSON('data/flavor.json');
        renderRadarChart(document.getElementById('radar-chart'), flavorData);
    } catch (err) {
        const container = document.getElementById('radar-chart');
        container.innerHTML = `<span class="text-red-500 text-sm">Error loading chart data: ${err.message}</span>`;
    }

    // Generate and render scatter plot
    const clusterData = generateMockClusterData();
    renderScatterPlot(document.getElementById('scatter-chart'), clusterData);

    // Render pie chart
    try {
        const metabolitesData = await fetchJSON('data/metabolites.json');
        renderPieChart(document.getElementById('pie-chart'), metabolitesData.compounds);
    } catch (err) {
        const container = document.getElementById('pie-chart');
        container.innerHTML = `<span class="text-red-500 text-sm">Error loading metabolites data: ${err.message}</span>`;
    }
});
