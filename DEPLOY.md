# PartForge — Deployment Instructions

## For Any AI Agent
If you're an AI agent asked to deploy this site, here's exactly what to do.

---

## Option 1: GitHub Pages (Recommended)

### Prerequisites
- GitHub account (create at https://github.com if needed)
- `gh` CLI installed (`brew install gh` on Mac)

### Steps

```bash
# 1. Install GitHub CLI if not installed
brew install gh

# 2. Authenticate with GitHub
gh auth login
# Choose: GitHub.com → HTTPS → Yes (authenticate with browser) → Login with browser

# 3. Navigate to the PartForge folder
cd ~/Desktop/PartForge

# 4. Initialize git repo
git init
git add index.html style.css app.js README.md BUSINESS_PLAN.md DEPLOY.md

# 5. Create the GitHub repo and push
git commit -m "Initial commit - PartForge marketplace"
gh repo create partforge --public --source=. --push

# 6. Enable GitHub Pages
gh api -X POST repos/{owner}/partforge/pages -f source[branch]=main -f source[path]=/

# 7. Get the live URL (wait 1-2 minutes for deployment)
echo "Site will be live at: https://$(gh api user -q .login).github.io/partforge/"
```

### Manual GitHub Pages (No CLI)
1. Go to https://github.com → Sign in
2. Click "+" → "New repository" → Name: `partforge` → Public → Create
3. Click "uploading an existing file"
4. Drag in: `index.html`, `style.css`, `app.js`
5. Click "Commit changes"
6. Go to Settings → Pages → Source: main branch, / (root) → Save
7. Wait 2 min → live at `https://USERNAME.github.io/partforge/`

---

## Option 2: Netlify Drop (Fastest — No Account Needed)

1. Open browser to https://app.netlify.com/drop
2. Drag the entire `PartForge` folder onto the page
3. Wait 10 seconds
4. You get a URL like `https://random-name.netlify.app`
5. Done!

To keep the URL permanent:
- Create a free Netlify account
- Claim the site
- Optionally change the subdomain name

---

## Option 3: Vercel

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Navigate to folder
cd ~/Desktop/PartForge

# 3. Deploy
vercel --prod

# Follow prompts — creates account if needed
# Gives you a live URL immediately
```

---

## Option 4: Cloudflare Pages (Free, Fast CDN)

1. Go to https://dash.cloudflare.com → Sign up free
2. Go to Workers & Pages → Create application → Pages
3. Click "Upload assets"
4. Name the project: `partforge`
5. Drag the PartForge files in
6. Deploy
7. Live at `partforge.pages.dev`

---

## Adding a Custom Domain (Any Host)

1. Buy a domain:
   - https://www.namecheap.com (~$10-15/year for .com or .io)
   - https://www.cloudflare.com/products/registrar/ (at cost pricing)

2. Add domain to your host:
   - **GitHub Pages:** Settings → Pages → Custom domain → enter domain → Save
   - **Netlify:** Domain settings → Add custom domain
   - **Vercel:** Project settings → Domains → Add

3. Update DNS at your registrar:
   - For GitHub Pages: CNAME record → `USERNAME.github.io`
   - For Netlify: CNAME record → `YOUR-SITE.netlify.app`
   - For Vercel: CNAME record → `cname.vercel-dns.com`

4. SSL is automatic and free on all platforms.

---

## Adding Stripe Payments (For the $5 Listing Fee)

1. Create Stripe account: https://stripe.com (free)
2. Get your publishable key from Dashboard → Developers → API keys
3. Create a Payment Link:
   - Products → Add product → "PartForge Listing Fee" → $5 one-time
   - Payment Links → Create → Select the product → Copy link
4. Replace the placeholder checkout in `app.js` with the real Stripe Payment Link
5. When someone clicks "Pay $5 Listing Fee", redirect to your Stripe link

That's it — Stripe deposits money to your bank account automatically.

---

## File Structure Reference

```
PartForge/
├── index.html         # Main page (all views/routes)
├── style.css          # Styles (dark theme, responsive)
├── app.js             # Logic (search, filters, routing, data)
├── README.md          # Overview and instructions
├── BUSINESS_PLAN.md   # Revenue model, projections, strategy
└── DEPLOY.md          # This file (deployment instructions)
```

All 3 code files must be in the same folder. No build step. No dependencies.
