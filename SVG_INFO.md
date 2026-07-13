# SVG Chart Information

## Format Confirmation

All charts generated in this application are **SVG (Scalable Vector Graphics)** format:

### Radar Chart
- **File**: `js/charts/radar.js`
- **Format**: Inline SVG elements
- **Created via**: `createSVGElement('svg', {...})`
- **Rendering**: Vector-based (lines, polygons, circles)
- **Export**: `radar-chart.svg`

### Scatter Plot  
- **File**: `js/charts/scatter.js`
- **Format**: Inline SVG elements
- **Created via**: `createSVGElement('svg', {...})`
- **Rendering**: Vector-based (circles, lines, text)
- **Export**: `scatter-plot.svg`

## Why SVG?

✓ **Scalable** — No pixelation at any zoom level  
✓ **Lightweight** — Smaller file sizes than raster  
✓ **Editable** — Can be edited in any text editor or vector software  
✓ **Responsive** — Adapts to container size  
✓ **Accessible** — Text and structure are part of the DOM  
✓ **Printable** — High quality at any print size  

## How They're Generated

Charts are generated **programmatically** as DOM elements:

```javascript
function createSVGElement(tag, attrs = {}) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attrs).forEach(([key, value]) => {
        el.setAttribute(key, value);
    });
    return el;
}
```

This creates:
- `<svg>` root element
- `<polygon>` shapes (radar polygon, scatter background)
- `<line>` elements (axes, gridlines)
- `<circle>` markers (data points, vertices)
- `<text>` labels (axis labels, legends)

## Exporting Charts

### Using Export Buttons (in page)
1. Open `http://localhost:8000`
2. Click "Export Radar (SVG)" or "Export Scatter (SVG)"
3. Charts download as `.svg` files

### Using Console (alternative)
```javascript
// Export via browser console
exportRadarChart();
exportScatterPlot();
```

### Using Code (for automation)
```javascript
// Get SVG element
const svg = document.querySelector('#radar-chart svg');

// Serialize to string
const svgString = new XMLSerializer().serializeToString(svg);

// Create blob and download
const blob = new Blob([svgString], { type: 'image/svg+xml' });
const url = URL.createObjectURL(blob);
// ... download logic
```

## Opening SVG Files

Saved `.svg` files can be opened in:
- ✓ Any web browser (Chrome, Firefox, Safari)
- ✓ Vector editors (Illustrator, Inkscape, Figma)
- ✓ Text editors (VS Code, Notepad++)
- ✓ Preview apps (Mac, Windows)

## Converting SVG

To convert `.svg` to other formats:
- **PNG/JPG**: Use online converters or Inkscape (free)
- **PDF**: Open in browser → Print to PDF
- **EPS**: Use Illustrator or Inkscape

## SVG Features Used

### Radar Chart
- `<polygon>` for the radar shape
- `<circle>` for vertex markers
- `<line>` for axes and grid rings
- `<text>` for labels (radius of ~15 circles)

### Scatter Plot
- `<circle>` for data points (60 points)
- `<line>` for axes and gridlines
- `<text>` for axis labels
- Dynamic colors via `hsl()` CSS

## Performance

- **File size**: ~5-10KB for each chart SVG
- **Render time**: <10ms (browser renders instantly)
- **Memory**: Minimal (DOM elements only)
- **Scalability**: No degradation with zoom/resize

## Advantages Over Other Formats

| Format | Size | Scalable | Editable | Web-Ready |
|--------|------|----------|----------|-----------|
| SVG    | ✓    | ✓        | ✓        | ✓         |
| PNG    | ✗    | ✗        | ✗        | ✓         |
| JPG    | ✗    | ✗        | ✗        | ✓         |
| PDF    | ~    | ✓        | ✗        | ~         |
