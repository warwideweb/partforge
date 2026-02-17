# ForgAuto v7.3

The 3D Marketplace for Automotive Parts.

**Live:** https://forgauto.com

## Features

### Marketplace
- Buy/sell 3D printable car parts (STL files)
- $10 listing fee, sellers keep 100%
- Featured listings ($20/30 days)
- 3D STL viewer on part pages

### User Roles
- **Buyer/Seller** - Buy parts, sell designs
- **Designer** - Public profile, custom commissions
- **Print Shop** - Listed in directory, receive quotes ($100 registration)

### Print Shop System
- Full shop profiles with portfolio
- Quote request system
- "Pay Online" or "Pay at Shop" options
- Shop reviews after completed jobs
- PDF receipts for both parties

### Mobile
- Clean mobile product pages (v7.3)
- Full-bleed 3D viewer
- Sticky buy bar at bottom
- Horizontal scroll thumbnails
- Hamburger navigation menu
- 2-column grid for parts

## Tech Stack
- **Frontend:** Vanilla JS, HTML, CSS
- **Backend:** Cloudflare Workers (D1 + R2)
- **Domain:** forgauto.com (Cloudflare DNS)

## Deployment

### Frontend (GitHub Pages)
```bash
cd PartForge
git add -A && git commit -m "Update" && git push
```

### Backend (Cloudflare Workers)
```bash
cd worker
npx wrangler deploy
```

## Version History

### v7.3
- **Clean mobile product page layout:**
  - Full-bleed 3D viewer (edge-to-edge, no padding)
  - Horizontal scroll thumbnail strip
  - Sticky bottom bar with price + buy button
  - Sections divided by thin lines (no card gaps)
  - App-like flow

### v7.2.8
- Fixed mobile logo size (2.5x bigger - 70px)

### v7.2.7
- Mobile browse search bar
- Home "New Parts" 6 items, 2 per row
- Print shop reviews table fix (D1 migration)

### v7.2.6
- 4 cards per row on desktop
- Message envelope icon with count
- Full mobile navigation (hamburger menu)

### v7.2.5
- Reduced padding on main
- Login button shows avatar + username
- Wider cards

### v7.2.4
- Card aspect ratio 4/3 (matches home page)
- 3 columns default grid

### v7.2.3
- Card images 16/9 aspect ratio
- Avatar circle for login
- Blue message badge

### v7.2.2
- Full-width browse page
- Message Customer button fix
- Message badge from conversations API

### v7.2.1
- Browse page full-width CSS fix

### v7.2.0
- Message badge on username
- Wider listings
- Pagination (25 per page)
- Pay at Shop option
- PDF receipts

### v7.1.0
- Seller rating from actual reviews
- Mobile layout restructure
- My Reviews tab improvements
- Review API endpoint fix

### v7.0.0
- Message notification badge
- Mobile-first part view
- Review gating (purchase required)
- My Reviews dashboard tab
- Print shop popup modal
- Ownership checkbox on listings

### v6.9.0
- Seller ratings on part pages
- Ownership confirmation checkbox
- Enhanced quote payment options

### v6.8.0
- Country/State location fields
- Verified blue star badge
- Mobile responsive fixes
