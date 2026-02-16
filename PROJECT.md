# ForgAuto — Complete Project Documentation

**Last Updated:** 2026-02-16 23:31 GMT+7 — Version 2.2

---

## Quick Links

| Resource | URL |
|----------|-----|
| **Live Site** | https://forgauto.com |
| **GitHub Pages** | https://warwideweb.github.io/forgauto/ |
| **API** | https://forgauto-api.warwideweb.workers.dev |
| **Admin Panel** | https://forgauto.com/admin.html |
| **API Health** | https://forgauto-api.warwideweb.workers.dev/api/health |

---

## Credentials & Secrets

> **Note:** Actual secrets stored securely in Cloudflare Worker secrets and local `.env` files. See SECRETS.md (local only, not in git).

### Services
- **Google OAuth:** Console at https://console.cloud.google.com/apis/credentials
- **Cloudflare:** Dashboard at https://dash.cloudflare.com
- **Domain:** Namecheap → Cloudflare DNS

### GitHub
- **Repo:** https://github.com/warwideweb/forgauto
- **Branch:** main

---

## Infrastructure

### Cloudflare Resources
- **Worker:** `forgauto-api`
- **D1 Database:** `forgauto` (ID: `b3f1053e-95f3-414e-8c7f-d78cec3d8285`)
- **R2 Bucket:** `forgauto-files`

### Worker Secrets (set via wrangler)
```
GOOGLE_CLIENT_ID     = (Google Console)
GOOGLE_CLIENT_SECRET = (Google Console)
ADMIN_KEY            = (ask admin)
JWT_SECRET           = (auto-generated)
CORS_ORIGIN          = *
```

### DNS Records (Cloudflare)
| Type | Name | Content |
|------|------|---------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | warwideweb.github.io |
| CNAME | api | forgauto-api.warwideweb.workers.dev |

---

## Database Schema

```sql
-- Users
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    name TEXT,
    role TEXT DEFAULT 'seller',
    avatar_url TEXT,
    bio TEXT,
    rate TEXT,
    tags TEXT,
    google_id TEXT,
    verified INTEGER DEFAULT 0,
    banned INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sessions
CREATE TABLE sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Parts (Listings)
CREATE TABLE parts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    make TEXT NOT NULL,
    model TEXT,
    price REAL NOT NULL,
    file_url TEXT,
    file_format TEXT,
    file_size TEXT,
    material TEXT,
    infill TEXT,
    downloads INTEGER DEFAULT 0,
    featured INTEGER DEFAULT 0,
    featured_until DATETIME,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Part Images
CREATE TABLE part_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    part_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    FOREIGN KEY (part_id) REFERENCES parts(id)
);

-- Reviews
CREATE TABLE reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    part_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    seller_id INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (part_id) REFERENCES parts(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (seller_id) REFERENCES users(id)
);

-- Purchases
CREATE TABLE purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    part_id INTEGER NOT NULL,
    buyer_id INTEGER NOT NULL,
    seller_id INTEGER NOT NULL,
    price REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (part_id) REFERENCES parts(id),
    FOREIGN KEY (buyer_id) REFERENCES users(id),
    FOREIGN KEY (seller_id) REFERENCES users(id)
);

-- Designer Requests
CREATE TABLE designer_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    designer_id INTEGER NOT NULL,
    client_email TEXT NOT NULL,
    client_name TEXT,
    description TEXT NOT NULL,
    make TEXT,
    model TEXT,
    budget TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (designer_id) REFERENCES users(id)
);
```

---

## API Reference (v1.4)

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Email registration |
| POST | `/api/auth/login` | Email login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/auth/google` | Google OAuth redirect |
| GET | `/api/auth/google/callback` | Google OAuth callback |
| POST | `/api/auth/google/token` | Exchange Google token |

### User Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/:id` | Public profile |
| PUT | `/api/profile` | Update profile |
| PUT | `/api/profile/avatar` | Upload avatar |
| GET | `/api/designers` | List designers |

### Parts/Listings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/parts` | List parts |
| GET | `/api/parts/:id` | Part details |
| POST | `/api/parts` | Create listing |
| PUT | `/api/parts/:id` | Update listing |
| DELETE | `/api/parts/:id` | Delete listing |
| POST | `/api/parts/:id/images` | Add images |
| POST | `/api/parts/:id/reviews` | Add review |
| POST | `/api/parts/:id/purchase` | Purchase |

### Admin (requires X-Admin-Key header)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard stats |
| GET | `/api/admin/users` | All users |
| PUT | `/api/admin/users/:id` | Update user |
| DELETE | `/api/admin/users/:id` | Delete user |
| GET | `/api/admin/parts` | All listings |
| PUT | `/api/admin/parts/:id` | Update listing |
| DELETE | `/api/admin/parts/:id` | Delete listing |
| GET | `/api/admin/sales` | All sales |

### Misc
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats` | Public stats |
| GET | `/api/health` | Health check |
| GET | `/files/:key` | Serve R2 files |

---

## Deployment Commands

### Deploy Worker
```bash
cd ~/Desktop/PartForge/worker
npx wrangler deploy
```

### Deploy Frontend
```bash
cd ~/Desktop/PartForge/PartForge
git add -A && git commit -m "Update" && git push
```

### Add Worker Secret
```bash
echo "value" | npx wrangler secret put SECRET_NAME
```

### Query Database
```bash
npx wrangler d1 execute forgauto --remote --command "SELECT * FROM users"
```

### View Worker Logs
```bash
npx wrangler tail forgauto-api
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-16 | Initial deployment |
| 1.1 | 2026-02-16 | D1 database setup |
| 1.2 | 2026-02-16 | Google OAuth |
| 1.3 | 2026-02-16 | Profile photos, R2 file serving |
| 1.4 | 2026-02-16 | Admin panel |
| 2.0 | 2026-02-16 | Messaging system, password recovery |
| 2.1 | 2026-02-16 | Featured designers/shops, reviews, card styling |
| 2.2 | 2026-02-16 | Browser history support, Google OAuth fix |

---

## TODO

- [ ] Stripe payment integration
- [ ] Email notifications
- [ ] Print & Ship partnerships
- [ ] Mobile app
- [ ] Better 3D viewer
- [ ] Search improvements

---

## Troubleshooting

### "Connection error" on admin panel
- Hard refresh (Ctrl+Shift+R)
- Check API health: `curl https://forgauto-api.warwideweb.workers.dev/api/health`
- Check browser console for CORS errors

### "Invalid client" on Google OAuth
- Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set
- Check redirect URIs in Google Console

### Database changes not showing
- Add `--remote` flag to wrangler d1 commands
- Check you're using the correct database ID

---

*Documentation maintained by OpenClaw AI*
