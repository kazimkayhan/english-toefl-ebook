// Application state
let currentStage = null;
let currentWeek = null;
let searchQuery = '';

// Theme management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButton();
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButton();
}

function updateThemeButton() {
    const buttons = document.querySelectorAll('.theme-toggle');
    const theme = document.documentElement.getAttribute('data-theme');
    buttons.forEach(btn => {
        btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    });
}

// Page navigation
function showCover() {
    setActivePage('cover-page');
}

function showGuide() {
    setActivePage('guide-page');
}

function showLessons() {
    setActivePage('lessons-page');
    if (!currentStage) {
        renderStagesNav();
    }
}

function showChecklist() {
    setActivePage('checklist-page');
    renderChecklist();
}

function setActivePage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// Render stages navigation
function renderStagesNav() {
    const nav = document.getElementById('stages-nav');
    nav.innerHTML = '';

    CURRICULUM.stages.forEach((stage, index) => {
        const section = document.createElement('div');
        section.className = 'stage-section';

        const button = document.createElement('button');
        button.className = 'stage-button';
        button.style.borderLeft = `3px solid ${stage.color}`;
        button.innerHTML = `
            <span><strong>${stage.name}</strong> <small>(Weeks ${stage.weekRange[0]}–${stage.weekRange[1]})</small></span>
            <span class="expand-icon">›</span>
        `;
        button.onclick = () => toggleStage(stage, button);

        const weeksList = document.createElement('div');
        weeksList.className = 'weeks-list';
        weeksList.style.display = 'none';

        stage.weeks.forEach(week => {
            const weekBtn = document.createElement('button');
            weekBtn.className = 'week-button';
            weekBtn.innerHTML = `<span class="week-num">Week ${week.number}</span><span class="week-title">${week.title}</span>`;
            weekBtn.onclick = () => selectWeek(stage, week);
            weeksList.appendChild(weekBtn);
        });

        section.appendChild(button);
        section.appendChild(weeksList);
        nav.appendChild(section);
    });
}

function toggleStage(stage, button) {
    const weeksList = button.nextElementSibling;
    const isOpen = weeksList.style.display === 'block';
    const icon = button.querySelector('.expand-icon');
    
    // Close all
    document.querySelectorAll('.weeks-list').forEach(list => {
        list.style.display = 'none';
    });
    document.querySelectorAll('.stage-button .expand-icon').forEach(i => {
        i.style.transform = 'rotate(0deg)';
    });
    document.querySelectorAll('.stage-button').forEach(b => {
        b.classList.remove('active');
    });
    
    if (!isOpen) {
        weeksList.style.display = 'block';
        button.classList.add('active');
        icon.style.transform = 'rotate(90deg)';
    }
}

function selectWeek(stage, week) {
    currentStage = stage;
    currentWeek = week;
    
    // Update active states
    document.querySelectorAll('.week-button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderWeekContent(stage, week);
}

// Render week content
function renderWeekContent(stage, week) {
    const content = document.getElementById('lesson-content');
    
    let html = `
        <div class="content-wrapper">
            <div class="week-header">
                <div class="breadcrumb">
                    <span style="color: ${stage.color};">${stage.name}</span>
                    <span class="breadcrumb-sep">›</span>
                    <span>Week ${week.number}</span>
                </div>
                <h1 class="week-title">${week.title}</h1>
                <div class="week-meta-grid">
                    ${week.levelBand ? `<div class="meta-chip"><strong>Level:</strong> ${week.levelBand}</div>` : ''}
                    ${week.grammarFocus ? `<div class="meta-chip"><strong>Grammar:</strong> ${week.grammarFocus}</div>` : ''}
                    ${week.studyLoad ? `<div class="meta-chip"><strong>Load:</strong> ${week.studyLoad}</div>` : ''}
                    ${week.pronunciation ? `<div class="meta-chip meta-full"><strong>Pronunciation:</strong> ${week.pronunciation}</div>` : ''}
                </div>
            </div>
    `;
    
    week.days.forEach(day => {
        html += renderDayCard(week.number, day);
    });
    
    html += '</div>';
    content.innerHTML = html;
    content.scrollTop = 0;
}

function renderDayCard(weekNum, day) {
    let html = `
        <div class="lesson-card" id="week${weekNum}-day${day.number}">
            <div class="lesson-header">
                <div class="day-badge">Day ${day.number}</div>
                <div class="day-header-content">
                    <h2 class="day-title">${day.title}</h2>
                    ${day.goal ? `<p class="day-goal">${escapeHtml(day.goal)}</p>` : ''}
                </div>
            </div>
    `;
    
    // Warm-up
    if (day.warmup) {
        html += `
            <div class="lesson-section">
                <h3><span class="section-number">1</span> Warm-up <span class="time-badge">10–15 min</span></h3>
                <div class="section-content">${formatContent(day.warmup)}</div>
            </div>
        `;
    }
    
    // Learn
    if (day.learn && (day.learn.grammar || day.learn.vocab.length > 0)) {
        html += `
            <div class="lesson-section">
                <h3><span class="section-number">2</span> Learn <span class="time-badge">25–35 min</span></h3>
                <div class="section-content">
                    ${day.learn.grammar ? `<div class="info-item"><strong>Grammar:</strong> ${escapeHtml(day.learn.grammar)}</div>` : ''}
                    ${day.learn.vocab.length > 0 ? `
                        <div class="vocab-section">
                            <strong>Vocabulary:</strong>
                            <div class="vocab-grid">
                                ${day.learn.vocab.map(v => `<span class="vocab-item">${escapeHtml(v)}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                    ${day.learn.examples.length > 0 ? `
                        <div class="examples-section">
                            <strong>Examples:</strong>
                            <ul class="examples-list">
                                ${day.learn.examples.map(e => `<li>${escapeHtml(e)}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    // Practice
    if (day.practice) {
        html += `
            <div class="lesson-section">
                <h3><span class="section-number">3</span> Practice <span class="time-badge">20–25 min</span></h3>
                <div class="section-content">${formatContent(day.practice)}</div>
            </div>
        `;
    }
    
    // Produce
    if (day.produce) {
        html += `
            <div class="lesson-section">
                <h3><span class="section-number">4</span> Produce <span class="time-badge">20–25 min</span></h3>
                <div class="section-content">${formatContent(day.produce)}</div>
            </div>
        `;
    }
    
    // Review
    if (day.review) {
        html += `
            <div class="lesson-section">
                <h3><span class="section-number">5</span> Review <span class="time-badge">10–15 min</span></h3>
                <div class="section-content">${formatContent(day.review)}</div>
            </div>
        `;
    }
    
    // Checkpoint
    if (day.checkpoint) {
        html += `
            <div class="checkpoint-box">
                <div class="checkpoint-icon">✓</div>
                <div class="checkpoint-content">
                    <h3>Checkpoint</h3>
                    <p>${escapeHtml(day.checkpoint)}</p>
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    return html;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatContent(text) {
    if (!text) return '';
    
    // First escape HTML
    text = escapeHtml(text);
    
    // Then apply markdown-style formatting
    let formatted = text
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .split('\n\n')
        .map(para => {
            para = para.trim();
            if (!para) return '';
            
            // Handle lists
            if (para.includes('\n- ')) {
                const items = para.split('\n- ').filter(i => i.trim());
                const first = items.shift();
                return (first ? `<p>${first}</p>` : '') + 
                       '<ul>' + items.map(item => `<li>${item.trim()}</li>`).join('') + '</ul>';
            }
            
            // Regular paragraph
            return `<p>${para.replace(/\n/g, '<br>')}</p>`;
        })
        .join('');
    
    return formatted || '<p>' + text + '</p>';
}

// Search functionality
function filterLessons() {
    const query = document.getElementById('search-input').value.toLowerCase();
    searchQuery = query;
    
    if (!query) {
        renderStagesNav();
        return;
    }
    
    // Search through all weeks and days
    const results = [];
    CURRICULUM.stages.forEach(stage => {
        stage.weeks.forEach(week => {
            const weekMatches = 
                week.title.toLowerCase().includes(query) ||
                week.grammarFocus.toLowerCase().includes(query) ||
                `week ${week.number}`.includes(query);
            
            if (weekMatches) {
                results.push({ type: 'week', stage, week });
            }
            
            week.days.forEach(day => {
                const dayMatches = 
                    day.title.toLowerCase().includes(query) ||
                    `day ${day.number}`.includes(query);
                
                if (dayMatches || weekMatches) {
                    results.push({ type: 'day', stage, week, day });
                }
            });
        });
    });
    
    // Display results
    if (results.length > 0 && results[0].type === 'week') {
        selectWeek(results[0].stage, results[0].week);
    }
}

// Render checklist page
function renderChecklist() {
    const content = document.getElementById('checklist-content');
    if (!CURRICULUM.checklist) {
        content.innerHTML = '<p>Checklist not available.</p>';
        return;
    }
    
    // Convert markdown to HTML (simple conversion)
    let html = CURRICULUM.checklist
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/^- \[ \] (.+)$/gm, '<div class="checkbox-item">☐ $1</div>')
        .replace(/^\| (.+) \|$/gm, '<tr><td>$1</td></tr>')
        .replace(/\n\n/g, '</p><p>');
    
    content.innerHTML = html;
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activePage = document.querySelector('.page.active');
            if (activePage.id === 'lessons-page') {
                showGuide();
            } else if (activePage.id === 'guide-page') {
                showCover();
            }
        }
    });
});
