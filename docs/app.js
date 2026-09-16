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
        button.innerHTML = `
            <span><strong>${stage.name}</strong> (Weeks ${stage.weekRange[0]}–${stage.weekRange[1]})</span>
            <span>▼</span>
        `;
        button.onclick = () => toggleStage(stage, button);

        const weeksList = document.createElement('div');
        weeksList.className = 'weeks-list';
        weeksList.style.display = 'none';

        stage.weeks.forEach(week => {
            const weekBtn = document.createElement('button');
            weekBtn.className = 'week-button';
            weekBtn.textContent = `Week ${week.number}: ${week.title}`;
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
    
    // Close all
    document.querySelectorAll('.weeks-list').forEach(list => {
        list.style.display = 'none';
    });
    
    if (!isOpen) {
        weeksList.style.display = 'block';
        button.classList.add('active');
    } else {
        button.classList.remove('active');
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
            <div style="margin-bottom: 2rem;">
                <div style="color: var(--color-text-muted); font-size: 0.9rem; margin-bottom: 0.5rem;">
                    ${stage.name} • Week ${week.number}
                </div>
                <h1>${week.title}</h1>
                <div class="lesson-meta">
                    <span>Level: ${week.levelBand}</span>
                    ${week.grammarFocus ? `<span>Grammar: ${week.grammarFocus}</span>` : ''}
                    <span>${week.days.length} Days</span>
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
                <h2>Week ${weekNum} · Day ${day.number} — ${day.title}</h2>
                ${day.goal ? `<p><strong>Goal:</strong> ${day.goal}</p>` : ''}
            </div>
    `;
    
    // Warm-up
    if (day.warmup) {
        html += `
            <div class="lesson-section">
                <h3>1. Warm-up (10–15 min)</h3>
                ${formatContent(day.warmup)}
            </div>
        `;
    }
    
    // Learn
    if (day.learn && (day.learn.grammar || day.learn.vocab.length > 0)) {
        html += `
            <div class="lesson-section">
                <h3>2. Learn (25–35 min)</h3>
                ${day.learn.grammar ? `<p><strong>Grammar/Point:</strong> ${day.learn.grammar}</p>` : ''}
                ${day.learn.vocab.length > 0 ? `
                    <p><strong>Vocabulary:</strong></p>
                    <ul>
                        ${day.learn.vocab.map(v => `<li>${v}</li>`).join('')}
                    </ul>
                ` : ''}
                ${day.learn.examples.length > 0 ? `
                    <p><strong>Examples:</strong></p>
                    <ul>
                        ${day.learn.examples.map(e => `<li>${e}</li>`).join('')}
                    </ul>
                ` : ''}
            </div>
        `;
    }
    
    // Practice
    if (day.practice) {
        html += `
            <div class="lesson-section">
                <h3>3. Practice (20–25 min)</h3>
                ${formatContent(day.practice)}
            </div>
        `;
    }
    
    // Produce
    if (day.produce) {
        html += `
            <div class="lesson-section">
                <h3>4. Produce (20–25 min)</h3>
                ${formatContent(day.produce)}
            </div>
        `;
    }
    
    // Review
    if (day.review) {
        html += `
            <div class="lesson-section">
                <h3>5. Review (10–15 min)</h3>
                ${formatContent(day.review)}
            </div>
        `;
    }
    
    // Checkpoint
    if (day.checkpoint) {
        html += `
            <div class="checkpoint-box">
                <h3>✓ Checkpoint</h3>
                ${formatContent(day.checkpoint)}
            </div>
        `;
    }
    
    html += '</div>';
    return html;
}

function formatContent(text) {
    if (!text) return '';
    
    // Convert markdown-style formatting
    let formatted = text
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n-\s/g, '</p><ul><li>')
        .replace(/\n/g, '<br>');
    
    // Wrap in paragraph if not already
    if (!formatted.startsWith('<')) {
        formatted = '<p>' + formatted + '</p>';
    }
    
    return formatted;
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
