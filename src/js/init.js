let flavorData = null;
let clusterData = null;
let metabolitesData = null;
let translationsCache = {};

async function loadTranslations(lang) {
    if (translationsCache[lang]) return translationsCache[lang];
    try {
        const dict = await fetchJSON(`/i18n/${lang}.json`);
        translationsCache[lang] = dict;
        return dict;
    } catch (err) {
        console.warn(`Failed to load translations for ${lang}:`, err);
        if (lang !== 'en') return loadTranslations('en');
        return {};
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        flavorData = await fetchJSON('/data/flavor.json');
    } catch (err) {
        const container = document.getElementById('radar-chart');
        if (container) {
            container.innerHTML = `<span class="text-red-500 text-sm">Error loading chart data: ${err.message}</span>`;
        }
    }

    try {
        metabolitesData = await fetchJSON('/data/metabolites.json');
    } catch (err) {
        const container = document.getElementById('pie-chart');
        if (container) {
            container.innerHTML = `<span class="text-red-500 text-sm">Error loading metabolites data: ${err.message}</span>`;
        }
    }

    clusterData = generateMockClusterData();

    setupInfoToggleButtons();
    await setupLanguageSwitcher();
});

function setupInfoToggleButtons() {
    document.querySelectorAll('[data-toggle-info]').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-toggle-info');
            const target = document.getElementById(targetId);
            if (!target) return;
            const isHidden = target.classList.toggle('hidden');
            const expanded = !isHidden;
            button.setAttribute('aria-expanded', expanded.toString());
        });
    });
}

async function setupLanguageSwitcher() {
    const savedLang = localStorage.getItem('vep_lang') || 'en';
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        langSelect.value = savedLang;
        langSelect.addEventListener('change', async (e) => {
            const newLang = e.target.value;
            const dict = await loadTranslations(newLang);
            applyTranslations(dict);
            renderCharts(newLang, dict);
            localStorage.setItem('vep_lang', newLang);
        });
    }
    const dict = await loadTranslations(savedLang);
    applyTranslations(dict);
    renderCharts(savedLang, dict);
}

function applyTranslations(dict) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (!dict[key]) return;
        if (el.children.length === 0) {
            el.textContent = dict[key];
            return;
        }
        const textNode = Array.from(el.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
        if (textNode) {
            textNode.nodeValue = dict[key];
        } else {
            el.prepend(document.createTextNode(dict[key]));
        }
    });
    document.title = dict['app.title'] || 'Flavor Evaluation Platform';
}

function renderCharts(lang, dict) {
    const radarContainer = document.getElementById('radar-chart');
    if (radarContainer) {
        if (flavorData) {
            const translatedData = translateRadarData(flavorData, dict);
            renderRadarChart(radarContainer, translatedData);
        }
    }

    const scatterContainer = document.getElementById('scatter-chart');
    if (scatterContainer) {
        const translatedPoints = translateScatterData(clusterData, dict);
        renderScatterPlot(scatterContainer, translatedPoints);
    }

    const pieContainer = document.getElementById('pie-chart');
    if (pieContainer) {
        if (metabolitesData) {
            renderPieChart(pieContainer, metabolitesData.compounds, dict);
        }
    }
}

function translateRadarData(data, dict) {
    return Object.fromEntries(Object.entries(data).map(([category, value]) => {
        const key = `category.${category}`;
        return [dict[key] || category, value];
    }));
}

function translateScatterData(points, dict) {
    if (!points) return [];
    return points.map(point => {
        const key = `scatter.category.${point.category}`;
        return {
            ...point,
            category: dict[key] || point.category
        };
    });
}
