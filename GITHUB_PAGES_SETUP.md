# GitHub Pages Setup Instructions

Your ebook site is **ready to deploy**! Follow these simple steps to enable GitHub Pages.

## 🚀 Quick Setup (2 minutes)

### Step 1: Merge the Pull Request

1. Go to: [https://github.com/kazimkayhan/english-toefl-ebook/pull/1](https://github.com/kazimkayhan/english-toefl-ebook/pull/1)
2. Review the changes (all site files are in `/docs/`)
3. Click **"Merge pull request"**
4. Confirm the merge

### Step 2: Enable GitHub Pages

1. Go to your repository: [https://github.com/kazimkayhan/english-toefl-ebook](https://github.com/kazimkayhan/english-toefl-ebook)
2. Click **Settings** (top navigation bar)
3. Scroll down in the left sidebar and click **Pages**
4. Under **"Source"**, configure:
   - **Branch:** Select `main` from dropdown
   - **Folder:** Select `/docs` from dropdown
5. Click **Save**

### Step 3: Wait for Deployment

- GitHub will automatically build and deploy your site
- Initial deployment takes 1-3 minutes
- You'll see a message: "Your site is ready to be published at..."
- Once deployed, the message changes to: "Your site is live at..."

### Step 4: Visit Your Site! 🎉

Your ebook will be available at:

**https://kazimkayhan.github.io/english-toefl-ebook/**

## ✅ Verification

After deployment, you should see:

- ✨ Beautiful gradient cover page with "English to TOEFL" title
- 📊 Statistics: 100 weeks, 600 daily cards, 6 levels
- 🎯 "Start Learning" button leading to the guide
- 🌙 Theme toggle (light/dark mode)
- 📚 Full curriculum navigation by stage and week

## 🛠 Troubleshooting

### If the site shows a 404 error:

1. Verify you selected **`main` branch** and **`/docs` folder** in Pages settings
2. Wait 2-3 minutes for the first deployment to complete
3. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)

### If styles don't load:

1. Check that all files in `/docs/` were committed:
   - index.html
   - styles.css
   - app.js
   - data.js
   - .nojekyll
2. Clear browser cache and reload

### If content doesn't appear:

1. Open browser console (F12)
2. Check for JavaScript errors
3. Verify `data.js` is loading (should be ~955KB)

## 📝 Future Updates

To update the curriculum content:

```bash
# 1. Edit markdown files in /uploads/
# 2. Regenerate the data
node parse-curriculum.js

# 3. Commit and push
git add docs/data.js
git commit -m "Update curriculum data"
git push origin main

# GitHub Pages will auto-deploy the changes
```

## 🎨 Customization

### Change the base path (if needed):

The site is configured for `https://kazimkayhan.github.io/english-toefl-ebook/`

If you move it to a custom domain or different path, update all asset URLs in `index.html` if using relative paths (current setup uses relative paths, so it should work automatically).

### Modify the theme:

Edit color variables in `docs/styles.css`:

```css
:root {
    --color-primary: #2563eb;  /* Change main brand color */
    --color-bg: #ffffff;        /* Background color */
    /* ... etc */
}
```

## 📊 Site Statistics

- **Total Size:** ~1.1 MB (mostly curriculum data)
- **Load Time:** < 1 second (static files only)
- **Pages:** Single-page application with dynamic content
- **Compatibility:** All modern browsers, mobile-friendly

## 🌍 Sharing

Once live, share your ebook:

- **Direct Link:** https://kazimkayhan.github.io/english-toefl-ebook/
- **QR Code:** Generate one pointing to the URL
- **Social Media:** Share the link with learners
- **Custom Domain:** Can add via GitHub Pages settings (optional)

---

**Need help?** Open an issue on the repository or check [GitHub Pages documentation](https://docs.github.com/en/pages).
