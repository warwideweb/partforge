# PartForge — 3D Printed Car Parts Marketplace

## What Is This?
A marketplace website where people can buy and sell 3D printable car parts (STL files). Think Etsy but specifically for 3D printed automotive parts. No dedicated platform like this exists yet.

**Created by:** Evan Jasek (@ErrorByHuman)
**Date:** February 16, 2026

---

## Files In This Folder

```
PartForge/
├── index.html      ← The main website (all pages in one file)
├── style.css       ← All the styling (dark theme, responsive design)
├── app.js          ← All the functionality (search, filters, listings, dashboard)
├── README.md       ← This file (instructions)
├── BUSINESS_PLAN.md ← Full business plan and revenue model
└── DEPLOY.md       ← Step-by-step deployment instructions
```

---

## Preview Locally
Just double-click `index.html` — it opens in your browser. Everything works locally.

---

## Deploy Live (so anyone can visit the URL)

### Option 1: Netlify Drop (Easiest — 30 seconds, no account needed)
1. Open your browser to https://app.netlify.com/drop
2. Drag the entire `PartForge` folder onto the page
3. Done — you get a live URL like `https://random-name.netlify.app`
4. Optional: Create a free Netlify account to keep the URL permanent and add a custom domain

### Option 2: GitHub Pages (Free, permanent URL)
1. Go to https://github.com and sign in (or create account)
2. Click the "+" in top right → "New repository"
3. Name it: `partforge`
4. Make it Public
5. Click "Create repository"
6. On the next page, click "uploading an existing file"
7. Drag `index.html`, `style.css`, and `app.js` into the upload area
8. Click "Commit changes"
9. Go to repo Settings → Pages → Source: "Deploy from a branch" → Branch: main → Save
10. Wait 1-2 minutes → your site is live at: `https://YOUR-USERNAME.github.io/partforge/`

### Option 3: Vercel (Free, fast)
1. Go to https://vercel.com → Sign up with GitHub
2. Click "Add New Project" → Import your partforge repo
3. Click Deploy
4. Live URL in 30 seconds

### Option 4: Custom Domain (when ready to launch for real)
1. Buy a domain like `partforge.io` or `partforge.com` (~$12/year from Namecheap, Google Domains, or Cloudflare)
2. Point DNS to whichever hosting you chose (Netlify/GitHub Pages/Vercel all support custom domains free)
3. SSL certificate is automatic and free on all three platforms

---

## Features Built

### For Buyers:
- **Search** by car make, model, or part name
- **Filter** by category (Exterior, Interior, Engine Bay, Lighting, etc.)
- **Filter** by car make (Mercedes, BMW, Toyota, Honda, etc.)
- **Filter** by price range
- **Sort** by newest, popular, price
- **Listing detail pages** with print specs, compatibility info, reviews
- **Buy button** (connects to Stripe for payment processing)

### For Sellers:
- **Post a listing** with photos, description, car compatibility, print settings
- **$5 flat listing fee** — no commission on sales
- **Seller dashboard** with views, downloads, earnings stats
- **Manage listings** (edit/delete)

### Design:
- Dark theme with electric blue accent
- Mobile-friendly (works on phone, tablet, desktop)
- Smooth animations and hover effects
- Professional look — not a hackathon project

---

## Sample Listings (Pre-loaded)
12 fake listings to show how it looks with content:
1. Mercedes 190E Hood Vents — $29 (by ErrorByHuman — this is YOUR real part)
2. BMW E30 Intake Manifold Spacer — $15
3. Honda Civic EK9 Cup Holder — $8
4. Toyota AE86 Gauge Pod — $12
5. Mazda Miata NA Vent Rings — $10
6. Ford Mustang Phone Mount — $7
7. Nissan 240SX Drift Knob — $9
8. Universal OBD2 Port Cover — $5
9. Porsche 944 Headlight Bracket — $18
10. VW Golf MK2 Switch Panel — $14
11. Mercedes W201 Mirror Cap — $12
12. Subaru WRX Turbo Heat Shield — $22

---

## What's Next (To Make This a Real Business)

### Phase 1: Launch (Week 1-2)
- [ ] Deploy to live URL
- [ ] Buy domain (partforge.io or similar)
- [ ] Create Stripe account at https://stripe.com (free, 5 min)
- [ ] Add real Stripe checkout for the $5 listing fee
- [ ] List your own 190E Hood Vents as the first real listing
- [ ] Make a YouTube video: "I built a marketplace for 3D printed car parts"

### Phase 2: Backend (Week 3-4)
- [ ] Add user accounts (sign up / login)
- [ ] Real database for listings (Supabase — free tier)
- [ ] File upload for STL files and photos
- [ ] Email notifications for sellers

### Phase 3: Growth (Month 2-3)
- [ ] Share on r/3Dprinting, r/functionalprint, r/cars, car-specific subreddits
- [ ] Share on Mercedes forums, BMW forums, etc.
- [ ] Add "Pro Seller" tier ($10/month) for featured placement
- [ ] Add seller verification badges
- [ ] SEO optimization

### Phase 4: Scale (Month 3-6)
- [ ] Handle STL file hosting and delivery (so buyers download directly)
- [ ] Add optional commission model (5% if you handle payments for sellers)
- [ ] Mobile app (PWA — progressive web app, no app store needed)
- [ ] Partnership with 3D printer companies for cross-promotion

---

## Tech Details (For Any Developer or AI Agent)

- **Frontend only** — no backend server needed for the prototype
- **Pure HTML/CSS/JS** — no frameworks, no build tools, no dependencies
- **Data** stored in JavaScript (app.js) as JSON objects — easy to replace with real database later
- **Responsive** — CSS Grid + Flexbox, mobile-first breakpoints
- **Font:** Inter (Google Fonts CDN)
- **No npm, no node_modules, no build step** — just 3 files

To add a real backend later, recommended stack:
- **Supabase** (free PostgreSQL database + auth + file storage)
- **Stripe** (payment processing)
- **Vercel** (hosting with serverless functions)
- All have generous free tiers — total cost: $0-12/month to start

---

## Contact
- Website: errorbyhuman.com
- YouTube: @ErrorByHuman
- Telegram: @Icuminpiece
