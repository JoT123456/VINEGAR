let flavorData = null;
let clusterData = null;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        flavorData = await fetchJSON('data/flavor.json');
    } catch (err) {
        const container = document.getElementById('radar-chart');
        if (container) {
            container.innerHTML = `<span class="text-red-500 text-sm">Error loading chart data: ${err.message}</span>`;
        }
    }

    clusterData = generateMockClusterData();

    setupInfoToggleButtons();
    setupLanguageSwitcher();
});

const translations = {
    en: {
        "app.title": "Flavor Evaluation Platform",
        "header.project": "Project:",
        "header.user": "User Center",
        "nav.navigation": "Navigation",
        "nav.home": "Home Overview",
        "nav.data": "Data Management",
        "nav.task": "Task Management",
        "nav.results": "Result Analysis",
        "nav.reports": "Report Center",
        "nav.settings": "Settings",
        "nav.system": "System Settings",
        "nav.help": "Help Documentation",
        "home.title": "Home Overview",
        "home.subtitle": "Learn more about the Flavor Predicting Platform, its purpose, and its main objectives.",
        "home.section.overview.title": "Project Overview",
        "home.section.overview.text": "The Flavor Predicting Platform is designed to help fermentation teams and quality analysts evaluate the sensory profile of a product batch. By combining data-driven predictions with intuitive visual reports, the platform helps stakeholders better understand flavor indicators, metabolite contributions, and sample deviations.",
        "home.section.what.title": "What the Tool Does",
        "home.section.what.point1": "Predicts key flavor indicators such as acidity, freshness, and aftertaste.",
        "home.section.what.point2": "Displays results with confidence intervals to support decision-making.",
        "home.section.what.point3": "Highlights sample anomalies and batch deviations for quality control.",
        "home.section.what.point4": "Provides interactive charts to visualize sensory and metabolite data.",
        "home.section.objectives.title": "Main Objectives",
        "home.section.objectives.point1": "Improve transparency in fermentation quality assessment.",
        "home.section.objectives.point2": "Support faster decisions with clear visual summaries.",
        "home.section.objectives.point3": "Help identify patterns and anomalies early in the production process.",
        "home.section.objectives.point4": "Allow teams to compare predicted sensory scores against reference values.",
        "home.goToData": "Go to Data Management",
        "data.title": "Data Management",
        "data.subtitle": "Upload your input data file here to begin analysis and flavor prediction.",
        "data.uploadHeading": "Upload an input file",
        "data.uploadHint": "Supported formats: CSV, XLSX, JSON",
        "data.selectFileLabel": "Select file",
        "data.uploadButton": "Upload File",
        "data.note": "After upload, you can return to Result Analysis to inspect predicted flavor indicators.",
        "data.goToResults": "Go to Result Analysis",
        "chart.radar.title": "Flavor Indicator Radar Chart",
        "chart.radar.info": "This radar chart shows the predicted sensory indicators for the batch, making it easier to compare flavor attributes and identify strengths and weaknesses in the fermentation profile.",
        "chart.metabolite.title": "Top 10 Key Metabolite Contributions",
        "chart.metabolite.info": "This chart presents the top ten metabolites contributing most to the sensory profile, helping to understand which compounds influence quality outcomes.",
        "chart.scatter.title": "Sample Distribution (Anomaly Detection)",
        "chart.scatter.info": "The scatter chart shows the sample distribution and highlights possible anomalies or batch deviations, making it easier to identify unusual patterns in the data.",
        "results.title": "Flavor Indicator Prediction Results (with 95% CI)",
        "results.attribute": "Attribute",
        "results.predicted": "Predicted",
        "results.ci": "95% CI",
        "results.ref": "Reference Mean",
        "results.assessment": "Assessment",
        "results.attribute.acidity": "Acidity",
        "results.attribute.freshness": "Freshness",
        "results.attribute.fruityAroma": "Fruity Aroma",
        "results.attribute.mellowness": "Mellowness",
        "results.attribute.aftertaste": "Aftertaste",
        "anomalies.title": "Abnormal Sample List",
        "anomalies.view": "View Details",
        "anomalies.header.sampleId": "Sample ID",
        "anomalies.header.score": "Anomaly Score",
        "anomalies.header.type": "Type",
        "anomalies.type.outlier": "Outlier",
        "anomalies.type.batchDeviation": "Batch Deviation",
        "placeholder.barChart": "Bar Chart Placeholder",
        "download.report": "Download Results Report",
        "task.submitted": "Submitted",
        "task.id": "Task ID",
        "task.submittedAt": "Submitted",
        "task.completed": "Completed",
        "task.status": "Status",
        "category.Fruity": "Fruity",
        "category.Acidity": "Acidity",
        "category.Aftertaste": "Aftertaste",
        "category.Mellowness": "Mellowness",
        "category.Freshness": "Freshness",
        "scatter.category.Cluster 1": "Cluster 1",
        "scatter.category.Cluster 2": "Cluster 2",
        "scatter.category.Cluster 3": "Cluster 3"
    },
    pt: {
        "app.title": "Plataforma de Avaliação de Sabor",
        "header.project": "Projeto:",
        "header.user": "Central do Usuário",
        "nav.navigation": "Navegação",
        "nav.home": "Visão Geral",
        "nav.data": "Gerenciamento de Dados",
        "nav.task": "Gerenciamento de Tarefas",
        "nav.results": "Análise de Resultados",
        "nav.reports": "Central de Relatórios",
        "nav.settings": "Configurações",
        "nav.system": "Configurações do Sistema",
        "nav.help": "Documentação de Ajuda",
        "home.title": "Visão Geral",
        "home.subtitle": "Saiba mais sobre a Plataforma de Previsão de Sabor, seu propósito e seus principais objetivos.",
        "home.section.overview.title": "Visão Geral do Projeto",
        "home.section.overview.text": "A Plataforma de Previsão de Sabor foi projetada para ajudar equipes de fermentação e analistas de qualidade a avaliar o perfil sensorial de um lote. Ao combinar previsões baseadas em dados com relatórios visuais intuitivos, a plataforma ajuda as partes interessadas a entender melhor os indicadores de sabor, as contribuições de metabólitos e as variações das amostras.",
        "home.section.what.title": "O que a Ferramenta Faz",
        "home.section.what.point1": "Prevê indicadores-chave de sabor, como acidez, frescor e retrogosto.",
        "home.section.what.point2": "Exibe intervalos de confiança para apoiar a tomada de decisão.",
        "home.section.what.point3": "Destaca anomalias de amostra e desvios de lote para controle de qualidade.",
        "home.section.what.point4": "Fornece gráficos interativos para visualizar dados sensoriais e de metabólitos.",
        "home.section.objectives.title": "Objetivos Principais",
        "home.section.objectives.point1": "Melhorar a transparência na avaliação da qualidade da fermentação.",
        "home.section.objectives.point2": "Apoiar decisões mais rápidas com resumos visuais claros.",
        "home.section.objectives.point3": "Ajudar a identificar padrões e anomalias cedo no processo de produção.",
        "home.section.objectives.point4": "Permitir que as equipes comparem pontuações sensoriais previstas com valores de referência.",
        "home.goToData": "Ir para Gerenciamento de Dados",
        "data.title": "Gerenciamento de Dados",
        "data.subtitle": "Faça upload do seu arquivo de entrada aqui para iniciar a análise e a previsão de sabor.",
        "data.uploadHeading": "Enviar um arquivo de entrada",
        "data.uploadHint": "Formatos suportados: CSV, XLSX, JSON",
        "data.selectFileLabel": "Selecionar arquivo",
        "data.uploadButton": "Enviar arquivo",
        "data.note": "Após o upload, você pode retornar à Análise de Resultados para inspecionar os indicadores de sabor previstos.",
        "data.goToResults": "Ir para Análise de Resultados",
        "chart.radar.title": "Gráfico Radar de Indicadores de Sabor",
        "chart.radar.info": "Este gráfico radar mostra os indicadores sensoriais previstos para o lote, facilitando a comparação dos atributos de sabor e a identificação de pontos fortes e fracos no perfil de fermentação.",
        "chart.metabolite.title": "Top 10 Metabólitos que Mais Contribuem",
        "chart.metabolite.info": "Este gráfico apresenta os dez principais metabólitos que mais contribuem para o perfil sensorial, ajudando a entender quais compostos influenciam os resultados de qualidade.",
        "chart.scatter.title": "Distribuição de Amostras (Detecção de Anomalias)",
        "chart.scatter.info": "O gráfico de dispersão mostra a distribuição das amostras e destaca possíveis anomalias ou desvios de lote, facilitando a identificação de padrões incomuns nos dados.",
        "results.title": "Resultados de Predição de Indicadores de Sabor (com IC 95%)",
        "results.attribute": "Atributo",
        "results.predicted": "Previsto",
        "results.ci": "IC 95%",
        "results.ref": "Média de Referência",
        "results.assessment": "Avaliação",
        "results.attribute.acidity": "Acidez",
        "results.attribute.freshness": "Frescura",
        "results.attribute.fruityAroma": "Aroma Frutado",
        "results.attribute.mellowness": "Suavidade",
        "results.attribute.aftertaste": "Retrogosto",
        "anomalies.title": "Lista de Amostras Anormais",
        "anomalies.view": "Ver Detalhes",
        "anomalies.header.sampleId": "ID da Amostra",
        "anomalies.header.score": "Pontuação de Anomalia",
        "anomalies.header.type": "Tipo",
        "anomalies.type.outlier": "Outlier",
        "anomalies.type.batchDeviation": "Desvio de Lote",
        "placeholder.barChart": "Espaço Reservado para Gráfico de Barras",
        "download.report": "Baixar Relatório de Resultados",
        "task.submitted": "Enviado",
        "task.id": "ID da Tarefa",
        "task.submittedAt": "Enviado",
        "task.completed": "Concluído",
        "task.status": "Status",
        "category.Fruity": "Frutado",
        "category.Acidity": "Acidez",
        "category.Aftertaste": "Retrogosto",
        "category.Mellowness": "Suavidade",
        "category.Freshness": "Frescura",
        "scatter.category.Cluster 1": "Cluster 1",
        "scatter.category.Cluster 2": "Cluster 2",
        "scatter.category.Cluster 3": "Cluster 3"
    },
    zh: {
        "app.title": "风味评估平台",
        "header.project": "项目：",
        "header.user": "用户中心",
        "nav.navigation": "导航",
        "nav.home": "首页概览",
        "nav.data": "数据管理",
        "nav.task": "任务管理",
        "nav.results": "结果分析",
        "nav.reports": "报告中心",
        "nav.settings": "设置",
        "nav.system": "系统设置",
        "nav.help": "帮助文档",
        "home.title": "首页概览",
        "home.subtitle": "了解风味预测平台、其目的和主要目标。",
        "home.section.overview.title": "项目概览",
        "home.section.overview.text": "风味预测平台旨在帮助发酵团队和质量分析师评估产品批次的感官特性。通过将数据驱动的预测与直观的可视化报告相结合，该平台帮助利益相关者更好地理解风味指标、代谢物贡献和样本偏差。",
        "home.section.what.title": "该工具的作用",
        "home.section.what.point1": "预测关键风味指标，例如酸度、新鲜度和余味。",
        "home.section.what.point2": "显示置信区间以支持决策。",
        "home.section.what.point3": "突出样本异常和批次偏差，以便进行质量控制。",
        "home.section.what.point4": "提供交互式图表以可视化感官和代谢物数据。",
        "home.section.objectives.title": "主要目标",
        "home.section.objectives.point1": "提高发酵质量评估的透明度。",
        "home.section.objectives.point2": "通过清晰的可视化摘要支持更快速的决策。",
        "home.section.objectives.point3": "帮助及早识别生产过程中的模式和异常。",
        "home.section.objectives.point4": "允许团队将预测的感官评分与参考值进行比较。",
        "home.goToData": "转到数据管理",
        "data.title": "数据管理",
        "data.subtitle": "在此上传输入文件以开始分析和风味预测。",
        "data.uploadHeading": "上传输入文件",
        "data.uploadHint": "支持的格式：CSV、XLSX、JSON",
        "data.selectFileLabel": "选择文件",
        "data.uploadButton": "上传文件",
        "data.note": "上传后，您可以返回结果分析以检查预测的风味指标。",
        "data.goToResults": "转到结果分析",
        "chart.radar.title": "风味指标雷达图",
        "chart.radar.info": "该雷达图显示批次的预测感官指标，便于比较风味属性并识别发酵特性中的优缺点。",
        "chart.metabolite.title": "前10位关键代谢物贡献",
        "chart.metabolite.info": "该图显示对感官特性贡献最大的十种代谢物，帮助理解哪些化合物影响质量结果。",
        "chart.scatter.title": "样本分布（异常检测）",
        "chart.scatter.info": "散点图显示样本分布并突出可能的异常或批次偏差，便于识别数据中的异常模式。",
        "results.title": "风味指标预测结果（95% 置信区间）",
        "results.attribute": "属性",
        "results.predicted": "预测值",
        "results.ci": "95% 置信区间",
        "results.ref": "参考均值",
        "results.assessment": "评估",
        "results.attribute.acidity": "酸度",
        "results.attribute.freshness": "新鲜度",
        "results.attribute.fruityAroma": "果香",
        "results.attribute.mellowness": "醇和度",
        "results.attribute.aftertaste": "余味",
        "anomalies.title": "异常样本列表",
        "anomalies.view": "查看详情",
        "anomalies.header.sampleId": "样本 ID",
        "anomalies.header.score": "异常得分",
        "anomalies.header.type": "类型",
        "anomalies.type.outlier": "异常点",
        "anomalies.type.batchDeviation": "批次偏差",
        "placeholder.barChart": "柱状图占位符",
        "download.report": "下载结果报告",
        "task.submitted": "已提交",
        "task.id": "任务 ID",
        "task.submittedAt": "提交时间",
        "task.completed": "已完成",
        "task.status": "状态",
        "category.Fruity": "果香",
        "category.Acidity": "酸度",
        "category.Aftertaste": "余味",
        "category.Mellowness": "醇和度",
        "category.Freshness": "新鲜度",
        "scatter.category.Cluster 1": "集群 1",
        "scatter.category.Cluster 2": "集群 2",
        "scatter.category.Cluster 3": "集群 3"
    }
};

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

function setupLanguageSwitcher() {
    const savedLang = localStorage.getItem('vep_lang') || 'en';
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        langSelect.value = savedLang;
        langSelect.addEventListener('change', (e) => {
            const newLang = e.target.value;
            applyTranslations(newLang);
            renderCharts(newLang);
            localStorage.setItem('vep_lang', newLang);
        });
    }
    applyTranslations(savedLang);
    renderCharts(savedLang);
}

function applyTranslations(lang) {
    const dict = translations[lang] || translations.en;
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
    document.title = dict['app.title'] || translations.en['app.title'];
}

function renderCharts(lang) {
    const radarContainer = document.getElementById('radar-chart');
    if (radarContainer) {
        if (flavorData) {
            const translatedData = translateRadarData(flavorData, lang);
            renderRadarChart(radarContainer, translatedData);
        }
    }

    const scatterContainer = document.getElementById('scatter-chart');
    if (scatterContainer) {
        const translatedPoints = translateScatterData(clusterData, lang);
        renderScatterPlot(scatterContainer, translatedPoints);
    }
}

function translateRadarData(data, lang) {
    const dict = translations[lang] || translations.en;
    return Object.fromEntries(Object.entries(data).map(([category, value]) => {
        const key = `category.${category}`;
        return [dict[key] || category, value];
    }));
}

function translateScatterData(points, lang) {
    const dict = translations[lang] || translations.en;
    if (!points) return [];
    return points.map(point => {
        const key = `scatter.category.${point.category}`;
        return {
            ...point,
            category: dict[key] || point.category
        };
    });
}

