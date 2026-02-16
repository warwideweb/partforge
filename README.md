# ForgAuto — 3D Marketplace for Automotive Parts

![Version](https://img.shields.io/badge/version-2.2-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**The marketplace for 3D printable car parts. $5 listing fee, 0% commission.**

🌐 **Live:** https://forgauto.com  
📦 **API:** https://forgauto-api.warwideweb.workers.dev  
⚙️ **Admin:** https://forgauto.com/admin.html

---

## Features

### For Buyers
- 🔍 Search by make, model, category
- 🎨 3D model preview (STL viewer)
- 💬 Message sellers directly
- ⭐ Reviews and ratings
- 🏭 Find local print shops

### For Sellers
- 📤 Upload 3D files (STL, STEP, OBJ)
- 💰 **$5 flat listing fee, keep 100% of sales**
- 📊 Sales dashboard
- 🌟 Featured listings (+$10/30 days)

### For Designers
- 💼 Get hired for custom work
- ⭐ Build reputation with reviews
- 🏆 Featured placement ($100/30 days)
- 📈 Sorted by commissions earned

### For Print Shops
- 📍 Get discovered by local customers
- ⭐ Customer reviews
- 🏆 Featured placement ($150/30 days)

### Platform
- 🔐 Google OAuth + Email login
- 🔑 Password recovery
- 👤 Profile photos
- 💬 Built-in messaging
- 📱 Mobile responsive
- ⚙️ Admin panel
- ↩️ Browser back button support

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vanilla JS, CSS3 |
| API | Cloudflare Workers |
| Database | Cloudflare D1 (SQLite) |
| Storage | Cloudflare R2 |
| Auth | Google OAuth 2.0 |
| Hosting | GitHub Pages |
| Domain | Namecheap → Cloudflare DNS |

---

## Pricing

| Feature | Price | Duration |
|---------|-------|----------|
| Part Listing | $5 | Forever |
| Featured Part | +$10 | 30 days |
| Featured Designer | $100 | 30 days |
| Featured Print Shop | $150 | 30 days |
| Commission | 0% | - |

---

## API Endpoints

### Auth
- `POST /api/auth/signup` — Email signup
- `POST /api/auth/login` — Email login
- `GET /api/auth/google` — Google OAuth
- `POST /api/auth/forgot-password` — Request password reset
- `POST /api/auth/reset-password` — Reset with token

### Parts
- `GET /api/parts` — List parts
- `POST /api/parts` — Create listing
- `GET /api/parts/:id` — Part details
- `POST /api/parts/:id/reviews` — Add review

### Messaging
- `GET /api/messages` — List conversations
- `GET /api/messages/:userId` — Get conversation
- `POST /api/messages` — Send message
- `GET /api/messages/unread` — Unread count

### Designers
- `GET /api/designers` — List (sorted by sales)
- `POST /api/designers/feature` — Purchase featured

### Print Shops
- `GET /api/printshops` — List shops
- `POST /api/printshops/register` — Register shop
- `POST /api/printshops/:id/reviews` — Add review
- `POST /api/printshops/:id/feature` — Purchase featured

### Admin
- `GET /api/admin/stats` — Dashboard
- `GET /api/admin/users` — All users
- `GET /api/admin/parts` — All listings
- `GET /api/admin/sales` — All transactions

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-16 | Initial deployment |
| 1.5 | 2026-02-16 | Google OAuth, profile photos |
| 2.0 | 2026-02-16 | Messaging, password recovery, admin panel |
| 2.1 | 2026-02-16 | Featured designers/shops, reviews |
| 2.2 | 2026-02-16 | Browser history, Google OAuth fix |

---

## Deployment

```bash
# Frontend
cd PartForge && git push

# API
cd worker && npx wrangler deploy
```

---

## License

MIT License — Free to use and modify.

---

*Built by Error by Human • 2026*
