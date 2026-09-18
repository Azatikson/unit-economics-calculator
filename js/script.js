const form = document.getElementById("unit-economics-form");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const priceInput = document.getElementById("price");
    const cogsInput = document.getElementById("cogs");
    const churnInput = document.getElementById("churn");
    const cacInput = document.getElementById("cac");
    const conversionInput = document.getElementById("conversion");

    const priceValue = priceInput.value.trim();
    const cogsValue = cogsInput.value.trim();
    const churnValue = churnInput.value.trim();
    const cacValue = cacInput.value.trim();
    const conversionValue = conversionInput.value.trim();

    if (!priceValue || !cogsValue || !churnValue || !cacValue || !conversionValue) {
        alert("Заполните все поля.");
        return;
    }

    const price = Number(priceValue);
    const cogs = Number(cogsValue);
    const churn = Number(churnValue);
    const cac = Number(cacValue);
    const conversion = Number(conversionValue);

    if (isNaN(price) || isNaN(cogs) || isNaN(churn) || isNaN(cac) || isNaN(conversion)) {
        alert("Все значения должны быть числами.");
        return;
    }

    if (price <= 0) {
        alert("Цена должна быть больше нуля.");
        return;
    }
    if (cogs < 0) {
        alert("Переменные затраты не могут быть отрицательными.");
        return;
    }
    if (churn <= 0 || churn > 100) {
        alert("Месячный отток должен быть в диапазоне от 0 до 100 (не включая 0).");
        return;
    }
    if (cac <= 0) {
        alert("Стоимость привлечения должна быть больше нуля.");
        return;
    }
    if (conversion < 0 || conversion > 100) {
        alert("Конверсия должна быть в диапазоне от 0 до 100.");
        return;
    }

    const churnRate = churn / 100;
    const conversionRate = conversion / 100;

    const ltvPaying = price / churnRate;
    const ltvPerUser = ltvPaying * conversionRate;
    const grossMargin = ((price - cogs) / price) * 100;
    const ltvCacRatio = ltvPerUser / cac;

    let verdictText;
    let verdictClass;

    if (ltvCacRatio >= 3) {
        verdictText = "✅ Отличная юнит-экономика";
        verdictClass = "verdict-good";
    } else if (ltvCacRatio >= 1) {
        verdictText = "⚠️ На грани";
        verdictClass = "verdict-warning";
    } else {
        verdictText = "❌ Убыточно";
        verdictClass = "verdict-bad";
    }

    const resultsDiv = document.getElementById("results");

    resultsDiv.innerHTML = `
        <h2>Результаты расчёта</h2>
        <div class="metric-card">
            <span class="metric-label">LTV платящего пользователя</span>
            <span class="metric-value">${ltvPaying.toFixed(2)} ₽</span>
        </div>
        <div class="metric-card">
            <span class="metric-label">LTV на одного привлечённого пользователя</span>
            <span class="metric-value">${ltvPerUser.toFixed(2)} ₽</span>
        </div>
        <div class="metric-card">
            <span class="metric-label">Маржа (gross margin)</span>
            <span class="metric-value">${grossMargin.toFixed(1)}%</span>
        </div>
        <div class="metric-card">
            <span class="metric-label">Соотношение LTV/CAC</span>
            <span class="metric-value">${ltvCacRatio.toFixed(2)}</span>
        </div>
        <div class="verdict ${verdictClass}">
            <span>Вердикт</span>
            <span>${verdictText}</span>
        </div>
        <button id="export-csv" class="export-button">📥 Скачать CSV</button>
    `;

    resultsDiv.style.display = "block";

    const exportBtn = document.getElementById('export-csv');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportToCSV(ltvPaying, ltvPerUser, grossMargin, ltvCacRatio, verdictText);
        });
    }
});

function exportToCSV(ltvPaying, ltvPerUser, grossMargin, ltvCacRatio, verdictText) {
    const rows = [
        ['Показатель', 'Значение'],
        ['LTV платящего пользователя', ltvPaying.toFixed(2) + ' ₽'],
        ['LTV на одного привлечённого пользователя', ltvPerUser.toFixed(2) + ' ₽'],
        ['Маржа (gross margin)', grossMargin.toFixed(1) + '%'],
        ['Соотношение LTV/CAC', ltvCacRatio.toFixed(2)],
        ['Вердикт', verdictText]
    ];

   
    const csvContent = rows.map(row => row.join(';')).join('\n');

    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'unit-economics-results.csv';
    link.click();
    URL.revokeObjectURL(link.href);
}

const layout = document.querySelector('.layout');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebarOpen = document.getElementById('sidebar-open');
const sidebarOpenControls = document.querySelector('.sidebar-open-controls');

function openSidebar() {
    layout.classList.remove('sidebar-hidden');
    if (sidebarOpenControls) {
        sidebarOpenControls.classList.remove('visible');
    }
}

function closeSidebar() {
    layout.classList.add('sidebar-hidden');
    if (sidebarOpenControls) {
        sidebarOpenControls.classList.add('visible');
    }
}

if (sidebarToggle) {
    sidebarToggle.addEventListener('click', closeSidebar);
}

if (sidebarOpen) {
    sidebarOpen.addEventListener('click', openSidebar);
}


const themeToggleSidebar = document.getElementById('theme-toggle-sidebar');
const themeToggleOpen = document.getElementById('theme-toggle-open');
const themeIcons = document.querySelectorAll('.theme-icon');

function applyTheme(isDark) {
    if (isDark) {
        document.body.classList.add('dark-theme');
        themeIcons.forEach(icon => icon.textContent = '☀️');
    } else {
        document.body.classList.remove('dark-theme');
        themeIcons.forEach(icon => icon.textContent = '🌙');
    }
}

function syncThemeToggles(changedCheckbox, otherCheckbox) {
    return function() {
        otherCheckbox.checked = changedCheckbox.checked;
        applyTheme(changedCheckbox.checked);
    };
}


applyTheme(false);

if (themeToggleSidebar && themeToggleOpen) {
    themeToggleSidebar.addEventListener('change', syncThemeToggles(themeToggleSidebar, themeToggleOpen));
    themeToggleOpen.addEventListener('change', syncThemeToggles(themeToggleOpen, themeToggleSidebar));
}


const dictionaryToggle = document.getElementById('dictionary-toggle');
const dictionaryModal = document.getElementById('dictionary-modal');
const dictionaryClose = document.getElementById('dictionary-close');

function openDictionary() {
    dictionaryModal.classList.add('visible');
}

function closeDictionary() {
    dictionaryModal.classList.remove('visible');
}

if (dictionaryToggle) {
    dictionaryToggle.addEventListener('click', openDictionary);
}

if (dictionaryClose) {
    dictionaryClose.addEventListener('click', closeDictionary);
}


if (dictionaryModal) {
    dictionaryModal.addEventListener('click', function(event) {
        if (event.target === dictionaryModal) {
            closeDictionary();
        }
    });
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && dictionaryModal.classList.contains('visible')) {
        closeDictionary();
    }
});