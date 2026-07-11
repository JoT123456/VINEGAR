// Generate random cluster data with circular jitter
function generateMockClusterData(config = {}) {
    const {
        numClusters = 3,
        pointsPerCluster = 20,
        gridRange = 20,
        jitterRadius = 3
    } = config;

    const points = [];
    const centers = [];

    // Pick random cluster centers
    for (let c = 0; c < numClusters; c++) {
        const cx = Math.random() * gridRange;
        const cy = Math.random() * gridRange;
        centers.push({ x: cx, y: cy });

        // Generate points around this center with circular jitter
        for (let i = 0; i < pointsPerCluster; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const r = Math.random() * jitterRadius;
            points.push({
                x: cx + r * Math.cos(angle),
                y: cy + r * Math.sin(angle),
                category: `Cluster ${c + 1}`
            });
        }
    }

    points.centers = centers;
    return points;
}

// Fetch JSON data
async function fetchJSON(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load ${url}`);
    return response.json();
}
