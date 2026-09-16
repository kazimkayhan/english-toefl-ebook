# English to TOEFL: A0→C2 Daily Lesson Cards

🌐 **Live Site:** [https://kazimkayhan.github.io/english-toefl-ebook/](https://kazimkayhan.github.io/english-toefl-ebook/)

A beautiful ebook-style website featuring a complete **100-week daily curriculum** (600 lesson cards) from absolute beginner (A0) to C2/TOEFL iBT peak, aligned to the 2026 TOEFL iBT format.

## 📚 Features

- **600 Daily Lesson Cards** organized across 100 weeks
- **6 CEFR Levels:** A0-A1, A2, B1, B2, C1, C2/TOEFL Peak
- **Structured Learning:** Each day includes Warm-up, Learn, Practice, Produce, and Review sections
- **Beautiful Reader Interface** with elegant typography and smooth navigation
- **Dark/Light Mode** for comfortable reading
- **Search & Filter** by week, level, or topic
- **Mobile-Friendly** responsive design
- **Progress Tracking** with gates and checkpoints at key milestones

## 🎯 Learning Journey

| Stage | Weeks | Days | Focus |
|-------|-------|------|-------|
| A0→A1 | 1–10 | 60 | Absolute beginner to elementary |
| A2 | 11–22 | 72 | Pre-intermediate |
| B1 | 23–40 | 108 | Intermediate |
| B2 | 41–58 | 108 | Upper-intermediate |
| C1 | 59–78 | 120 | Advanced |
| C2/TOEFL | 79–100 | 132 | Mastery + TOEFL Peak |

Each study day takes **90-120 minutes** across 6 days per week, with Day 7 for rest or light review.

## 🚀 Quick Start

### For Learners

Simply visit the [live website](https://kazimkayhan.github.io/english-toefl-ebook/) and:

1. Read the **How to Use** guide
2. Browse the **Curriculum** by stage and week
3. Follow **one card per study day** (Days 1-6)
4. Pass **gates** at Weeks 10, 22, 40, 58, 78, and 100
5. Keep a portfolio of recordings and writing samples

### For Developers

The site is built as a static website (HTML/CSS/JavaScript) that works directly on GitHub Pages.

**Rebuild the site from source:**

```bash
# 1. Ensure source markdown files are in /uploads/
# 2. Run the parser to regenerate data.js
node parse-curriculum.js

# 3. The static site in /docs/ is ready for deployment
```

## 📁 Repository Structure

```
├── docs/                    # Static site (served by GitHub Pages)
│   ├── index.html          # Main HTML structure
│   ├── styles.css          # Styling and theme
│   ├── app.js              # UI interactions and navigation
│   └── data.js             # Generated curriculum data
├── uploads/                 # Source curriculum markdown files
│   ├── 01-a0-a1-weeks-01-10.md
│   ├── 02-a2-weeks-11-22.md
│   ├── 03-b1-weeks-23-40.md
│   ├── 04-b2-weeks-41-58.md
│   ├── 05-c1-weeks-59-78.md
│   ├── 06-c2-toefl-peak-weeks-79-100.md
│   ├── 07-master-checklist.md
│   └── COMPLETE-A0-to-C2-daily-lesson-cards.md
├── parse-curriculum.js      # Parser script (Node.js)
└── README.md               # This file
```

## 🔧 Technical Details

### Technology Stack

- **Pure HTML/CSS/JavaScript** – No frameworks or build tools required
- **Static Site** – Fully client-side, works on any web server
- **GitHub Pages** – Free hosting with custom domain support
- **Responsive Design** – Works on desktop, tablet, and mobile
- **Local Storage** – Saves theme preference

### How It Works

1. **Parser** (`parse-curriculum.js`) reads markdown files from `/uploads/`
2. Extracts structured data (stages, weeks, days, lessons)
3. Generates `data.js` with all curriculum content
4. Static HTML loads `data.js` and renders content dynamically
5. No server-side processing needed – all runs in the browser

### GitHub Pages Setup

This repository is configured to serve from the `/docs` folder on the `main` branch.

**To enable GitHub Pages:**

1. Go to repository **Settings** → **Pages**
2. Under "Source", select:
   - **Branch:** `main`
   - **Folder:** `/docs`
3. Click **Save**
4. Site will be live at `https://kazimkayhan.github.io/english-toefl-ebook/`

### Updating Content

To update the curriculum:

1. Edit markdown files in `/uploads/`
2. Run `node parse-curriculum.js` to regenerate `data.js`
3. Commit and push changes
4. GitHub Pages will update automatically

## 📖 Content Overview

### Daily Rhythm (~90-120 min)

| Block | Time | Purpose |
|-------|------|---------|
| Warm-up | 10–15 min | Anki + pronunciation |
| Learn | 25–35 min | Grammar + vocabulary |
| Practice | 20–25 min | Controlled tasks |
| Produce | 20–25 min | Speaking + writing |
| Review | 10–15 min | Anki + repetition |

### 2026 TOEFL iBT Alignment

The curriculum aligns with the **2026 TOEFL iBT format** (effective January 21, 2026):

- **Reading:** Complete the Words, Daily Life, Academic Passage
- **Listening:** Choose a Response, Conversation, Announcement, Academic Talk
- **Writing:** Build a Sentence, Email, Academic Discussion
- **Speaking:** Listen and Repeat, Interview

**Scoring Note:** The 2026 iBT uses a **1-6 band scale** per section. Peak target: secure band 5.5, stretch toward band 6.

## 🛠 Development

### Prerequisites

- Node.js (for running the parser)
- Any modern web browser
- Git

### Local Testing

```bash
# Serve the site locally
cd docs
python3 -m http.server 8000
# Visit http://localhost:8000
```

Or use any static file server:

```bash
npx serve docs
```

### Making Changes

1. **Update curriculum:** Edit markdown files in `/uploads/`
2. **Update styling:** Edit `docs/styles.css`
3. **Update functionality:** Edit `docs/app.js`
4. **Regenerate data:** Run `node parse-curriculum.js`
5. **Test locally** before pushing

## 📝 License

This curriculum and website are provided for educational purposes. Feel free to use, adapt, and share.

## 🙏 Credits

Created as a comprehensive self-study resource for English learners progressing from zero to TOEFL readiness.

---

**Start your journey today:** [https://kazimkayhan.github.io/english-toefl-ebook/](https://kazimkayhan.github.io/english-toefl-ebook/)
