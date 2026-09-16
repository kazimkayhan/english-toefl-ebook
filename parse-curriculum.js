const fs = require('fs');
const path = require('path');

// Parse markdown files and generate structured data
function parseCurriculum() {
    const uploadsDir = path.join(__dirname, 'uploads');
    
    // Read all stage files
    const stageFiles = [
        { file: '01-a0-a1-weeks-01-10_2543.md', stage: 'A0-A1', weeks: [1, 10], color: '#8b5cf6' },
        { file: '02-a2-weeks-11-22_0352.md', stage: 'A2', weeks: [11, 22], color: '#06b6d4' },
        { file: '03-b1-weeks-23-40_6d88.md', stage: 'B1', weeks: [23, 40], color: '#10b981' },
        { file: '04-b2-weeks-41-58_d376.md', stage: 'B2', weeks: [41, 58], color: '#f59e0b' },
        { file: '05-c1-weeks-59-78_dd41.md', stage: 'C1', weeks: [59, 78], color: '#ef4444' },
        { file: '06-c2-toefl-peak-weeks-79-100_da01.md', stage: 'C2/TOEFL', weeks: [79, 100], color: '#ec4899' }
    ];

    const curriculum = {
        title: "English to TOEFL: A0→C2 Daily Lesson Cards",
        description: "A complete 100-week daily curriculum from absolute beginner to C2/TOEFL iBT peak",
        totalWeeks: 100,
        totalDays: 600,
        stages: []
    };

    stageFiles.forEach(stageInfo => {
        const filePath = path.join(uploadsDir, stageInfo.file);
        if (!fs.existsSync(filePath)) {
            console.warn(`File not found: ${filePath}`);
            return;
        }

        const content = fs.readFileSync(filePath, 'utf-8');
        const stage = {
            name: stageInfo.stage,
            weekRange: stageInfo.weeks,
            color: stageInfo.color,
            weeks: []
        };

        // Parse weeks and days
        const weekRegex = /## Week (\d+) — (.+?)(?=\n##|\n### Week \d+ · Day|$)/gs;
        let weekMatch;

        while ((weekMatch = weekRegex.exec(content)) !== null) {
            const weekNum = parseInt(weekMatch[1]);
            const weekTitle = weekMatch[2].trim();
            
            // Extract week description
            const weekContent = weekMatch[0];
            const levelBandMatch = weekContent.match(/\*\*Level band:\*\* (.+)/);
            const grammarFocusMatch = weekContent.match(/\*\*Grammar focus:\*\* (.+)/);
            
            const week = {
                number: weekNum,
                title: weekTitle,
                levelBand: levelBandMatch ? levelBandMatch[1].trim() : stageInfo.stage,
                grammarFocus: grammarFocusMatch ? grammarFocusMatch[1].trim() : '',
                days: []
            };

            // Find all days for this week
            const dayRegex = new RegExp(`### Week ${weekNum} · Day (\\d+) — (.+?)\\n([\\s\\S]*?)(?=### Week ${weekNum} · Day \\d+|## Week \\d+|$)`, 'g');
            let dayMatch;

            while ((dayMatch = dayRegex.exec(content)) !== null) {
                const dayNum = parseInt(dayMatch[1]);
                const dayTitle = dayMatch[2].trim();
                const dayContent = dayMatch[3];

                // Parse day sections
                const day = {
                    number: dayNum,
                    title: dayTitle,
                    goal: extractSection(dayContent, 'Goal'),
                    warmup: extractSection(dayContent, 'Warm-up'),
                    learn: extractLearnSection(dayContent),
                    practice: extractSection(dayContent, 'Practice'),
                    produce: extractSection(dayContent, 'Produce'),
                    review: extractSection(dayContent, 'Review'),
                    checkpoint: extractSection(dayContent, 'Checkpoint')
                };

                week.days.push(day);
            }

            // Sort days
            week.days.sort((a, b) => a.number - b.number);
            
            if (week.days.length > 0) {
                stage.weeks.push(week);
            }
        }

        // Sort weeks
        stage.weeks.sort((a, b) => a.number - b.number);
        
        if (stage.weeks.length > 0) {
            curriculum.stages.push(stage);
        }
    });

    // Read checklist
    const checklistPath = path.join(uploadsDir, '07-master-checklist_dcd9.md');
    if (fs.existsSync(checklistPath)) {
        curriculum.checklist = fs.readFileSync(checklistPath, 'utf-8');
    }

    // Read README
    const readmePath = path.join(uploadsDir, 'README_2847.md');
    if (fs.existsSync(readmePath)) {
        curriculum.readme = fs.readFileSync(readmePath, 'utf-8');
    }

    return curriculum;
}

function extractSection(content, sectionName) {
    const regex = new RegExp(`\\*\\*${sectionName}:?\\*\\*([\\s\\S]*?)(?=\\n\\*\\*\\d+\\.|\\n---|\n### |$)`, 'i');
    const match = content.match(regex);
    if (!match) return '';
    
    let text = match[1].trim();
    
    // Clean up markdown formatting for display
    text = text.replace(/\*\*(\d+)\./g, '\n\n**$1.');
    
    return text;
}

function extractLearnSection(content) {
    const learnMatch = content.match(/\*\*2\. Learn[^*]*\*\*([^]*?)(?=\*\*3\. Practice|\*\*Checkpoint|$)/);
    if (!learnMatch) return { grammar: '', vocab: [], examples: [] };

    const learnContent = learnMatch[1];
    
    // Extract grammar/point
    const grammarMatch = learnContent.match(/Grammar\/point:\s*(.+?)(?=\n|$)/);
    const grammar = grammarMatch ? grammarMatch[1].trim() : '';

    // Extract vocab
    const vocabMatch = learnContent.match(/Vocab \((?:\d+|~\d+) items[^)]*\):\s*(.+?)(?=\n-|\nExamples|Pronunciation|\*\*3\.|$)/s);
    let vocab = [];
    if (vocabMatch) {
        vocab = vocabMatch[1]
            .split(/[;,]/)
            .map(v => v.trim())
            .filter(v => v.length > 0 && v.length < 50);
    }

    // Extract examples
    const examplesMatch = learnContent.match(/Examples[^:]*:([^]*?)(?=\*\*3\. Practice|$)/);
    let examples = [];
    if (examplesMatch) {
        examples = examplesMatch[1]
            .split(/\n/)
            .map(e => e.trim().replace(/^-\s*/, ''))
            .filter(e => e.length > 0 && e.includes(' '))
            .slice(0, 10);
    }

    return { grammar, vocab, examples };
}

// Generate and save
const curriculum = parseCurriculum();

console.log('Parsed curriculum:');
console.log(`- Stages: ${curriculum.stages.length}`);
curriculum.stages.forEach(stage => {
    console.log(`  - ${stage.name}: ${stage.weeks.length} weeks`);
    const totalDays = stage.weeks.reduce((sum, w) => sum + w.days.length, 0);
    console.log(`    Total days: ${totalDays}`);
});

// Write to data.js
const dataJs = `// Generated curriculum data
const CURRICULUM = ${JSON.stringify(curriculum, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, 'docs', 'data.js'), dataJs, 'utf-8');
console.log('\ndata.js generated successfully!');
