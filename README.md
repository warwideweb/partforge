# ForgAuto v6.8

The 3D Marketplace for Automotive Parts.

**Live:** https://forgauto.com / https://warwideweb.github.io/forgauto/

## Features

### Users
- **Buyer/Seller** - Buy parts, sell designs ($10 listing fee, keep 100%)
- **Designer** - All seller features + public profile, custom commissions
- **Print Shop** - Listed in directory, receive quote requests ($100 registration)

### Print Shop System
- Full shop profile with logo, portfolio, capabilities
- Country/State/City location support (international)
- Technologies: FDM, SLA, SLS, MJF, Metal
- Services: Instant Quote, Print & Ship, Local Pickup, Rush
- Rating & review system (verified after 5 reviews)
- Blue star badge for verified shops

### Quote System
- Users request quotes from specific print shops
- Print shops receive requests in dashboard
- Respond with price, turnaround, message
- Users see quotes in "My Quotes" tab
- Pay Now / Message buttons

### Other Features
- 3D STL viewer on part pages
- Featured listings ($20/30 days)
- Messaging system with email notifications
- Google OAuth login
- Mobile responsive

## Tech Stack
- **Frontend:** Vanilla JS, HTML, CSS
- **Backend:** Cloudflare Workers (D1 + R2)
- **API:** https://forgauto-api.warwideweb.workers.dev

## Deployment

### Frontend (GitHub Pages)
```bash
cd PartForge
git add -A
git commit -m "Update"
git push origin main
```

### Backend (Cloudflare Workers)
```bash
cd worker
npx wrangler deploy
```

### Database Migration
Run migrations in Cloudflare Dashboard or:
```bash
npx wrangler d1 execute forgauto-db --file=migrations/003_printshop_quotes.sql
```

## Version History
- v6.8 - Country/State fields, verified blue star, mobile fixes, backend updates
- v6.7 - Quote system, My Quotes tab, seller avatar, print shop fixes
- v6.6 - Remove emojis, auth bug fixes
- v6.5 - Complete Print Shop system
- v6.4 - Designer profile tab
