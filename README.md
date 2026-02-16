# ForgAuto v3.2

The 3D marketplace for automotive parts. Buy and sell STL files for your car.

**Live Site:** https://forgauto.com  
**API:** https://forgauto-api.warwideweb.workers.dev

---

## Features

### For Buyers
- Browse 3D printable car parts by make, model, and category
- 3D model preview (spin/zoom) before purchase
- Instant digital download after payment
- Find local print shops for Print & Ship service
- Hire designers for custom parts

### For Sellers
- $5 flat listing fee (keep 100% of sales)
- No monthly fees, no commission
- Listings never expire
- Optional $10 Featured placement (30 days)
- Optional $20 Boost to Premier (30 days)

### Platform
- 70+ car makes supported
- 6 categories: Interior, Exterior, Gauges, Accessories, Performance, Lighting
- Google OAuth login
- Responsive design (mobile-friendly)

---

## Tech Stack

**Frontend:**
- Vanilla JavaScript (no framework)
- Three.js for 3D STL viewing
- CSS custom properties for theming
- GitHub Pages hosting

**Backend:**
- Cloudflare Workers (API)
- Cloudflare D1 (SQLite database)
- Cloudflare R2 (file storage)

---

## Version History

### v3.2 (Feb 17, 2026)
- Editable listings (owner can edit/delete)
- Mobile-friendly responsive design
- Improved 3D viewer with loading states
- Download button after purchase
- Better touch controls for 3D model
- Fixed auth token for uploads

### v3.1 (Feb 17, 2026)
- Fixed Hire Designer page (shows sample designers)
- Fixed form validation (red error messages)
- Fixed user display name in nav
- Fixed stats count accuracy
- Added sample listings for full marketplace look
- Added DMCA page
- Removed fake purchase ticker
- Removed misleading trust badges
- Browse sidebar uses dropdowns instead of long lists
- Dark favicon added

### v3.0 (Feb 16, 2026)
- Boost to Premier feature ($20)
- Required file + photo uploads
- Incomplete listing warnings (red badges)
- Part detail fetches from API first
- Premiered Parts section (paid placement)

### v2.0 (Feb 16, 2026)
- Full marketplace launch
- Google OAuth integration
- 3D STL viewer
- Print shop directory
- Designer profiles
- Messaging system

---

## Files

```
/
├── index.html      # Main app shell
├── app.js          # All JavaScript (SPA router, views, API)
├── style.css       # All styles
├── privacy.html    # Privacy policy
├── terms.html      # Terms of service
├── dmca.html       # DMCA takedown procedures
├── favicon.svg     # Dark theme favicon
└── README.md       # This file
```

---

## API Endpoints

### Auth
- `GET /api/auth/google` - Google OAuth redirect
- `GET /api/auth/me` - Get current user

### Parts
- `GET /api/parts` - List parts (filters: category, make, model, search, user)
- `GET /api/parts/:id` - Get single part with images/reviews
- `POST /api/parts` - Create listing (auth required)
- `PUT /api/parts/:id` - Update listing (owner only)
- `DELETE /api/parts/:id` - Delete listing (owner only)
- `POST /api/parts/:id/purchase` - Purchase part
- `POST /api/parts/:id/boost` - Boost to Premier ($20)
- `POST /api/parts/:id/reviews` - Add review

### Files
- `POST /api/upload/file` - Upload 3D file to R2
- `GET /files/:key` - Serve files from R2

### Users
- `GET /api/users/:id` - Public profile
- `GET /api/designers` - List designers

---

## Local Development

1. Clone the repo
2. Open `index.html` in browser (or use live server)
3. API calls go to production Cloudflare Worker

For API development, see the `forgauto-api` repo.

---

## License

Copyright 2026 ForgAuto. All rights reserved.
