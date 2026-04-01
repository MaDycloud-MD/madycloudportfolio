# MaDycloud Portfolio — Full-Stack Production Application

**Live:** [madycloud.me](https://madycloud.me) · **Admin:** [madycloud.me/admin](https://madycloud.me/admin)

---

## Overview

I built this portfolio as a production-grade full-stack application — not a static site. Every section you see on the frontend is powered by a real REST API, stored in MongoDB Atlas, and fully manageable through a custom admin dashboard I built from scratch. No hardcoded arrays, no rebuilds needed to update content.

The stack is deliberately split: a **Next.js frontend** on Vercel handles the public portfolio and admin dashboard, while a **separate Express backend** on Render serves the REST API. This separation means I can update the API independently, scale each layer differently, and keep my Firebase credentials off Vercel entirely.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     (Frontend)                              │
│  Next.js App Router                                         │
│  ├── / (Portfolio — force-dynamic, always fresh)            │
│  └── /admin (Dashboard — Firebase auth, session management) │
└───────────────────────┬─────────────────────────────────────┘
                        │ REST API calls
┌───────────────────────▼─────────────────────────────────────┐
│                         (Backend)                           │
│  Express.js REST API                                        │
│  ├── Firebase Admin SDK  (token verification)               │
│  ├── Mongoose            (MongoDB ODM)                      │
│  └── Cloudinary SDK      (signed upload signatures)         │
└──────────┬──────────────────────┬───────────────────────────┘
           │                      │
┌──────────▼──────────┐  ┌────────▼────────────────────────┐
│   MongoDB Atlas     │  │   Cloudinary CDN                │
│   (All content)     │  │   (Images, SVGs, Resume PDF)    │
└─────────────────────┘  └─────────────────────────────────┘
```

**Why this architecture?**

I chose to keep the backend separate from Next.js API routes for one primary reason: Render gives me a persistent Node.js process, which means my MongoDB connection stays warm. Vercel's serverless functions cold-start on every request in free tier, causing Mongoose to reconnect every time. For a portfolio that gets sporadic traffic, the Express-on-Render approach is more reliable.

---

## Repository Structure

```
madycloud-portfolio/
│
├── backend/                          # Express REST API → deployed on Render
│   ├── server.js                     # Entry point, middleware, route registration
│   ├── package.json                  # type: commonjs (important for Node v25+)
│   │
│   ├── lib/
│   │   ├── mongodb.js                # Mongoose connection singleton
│   │   ├── firebase-admin.js         # Firebase Admin SDK initialisation
│   │   ├── cloudinary.js             # Cloudinary v2 configuration
│   │   └── crudFactory.js            # Generic CRUD handler factory (DRY principle)
│   │
│   ├── middleware/
│   │   └── auth.js                   # Firebase token verification + admin email check
│   │
│   ├── models/                       # Mongoose schemas
│   │   ├── Project.js                # title, slug, description, details[], techStack[], links, coverImage
│   │   ├── Experience.js             # role, company, duration, points[], companyLogo
│   │   ├── Skill.js                  # category (custom), title, items[{label, logoUrl}]
│   │   ├── Education.js              # degree, institution, score, year
│   │   ├── Certification.js          # name, logoUrl, url, issuer, inProgress
│   │   ├── Volunteering.js           # title, description
│   │   ├── Profile.js                # name, bio, taglines[], photoUrl, links{} — singleton
│   │   ├── Resume.js                 # cloudinaryPublicId, url, filename — singleton
│   │   └── ContactMessage.js         # name, email, subject, message, read, ipAddress
│   │
│   ├── routes/
│   │   ├── projects.js               # Full CRUD, optional URL validation with checkFalsy
│   │   ├── experience.js             # Full CRUD via crudFactory
│   │   ├── skills.js                 # Full CRUD, any category string allowed
│   │   ├── education.js              # Full CRUD via crudFactory
│   │   ├── certifications.js         # Full CRUD via crudFactory
│   │   ├── volunteering.js           # Full CRUD via crudFactory
│   │   ├── profile.js                # GET, PUT, PUT /photo, DELETE /photo — singleton
│   │   ├── resume.js                 # GET (public), POST (admin), DELETE — singleton
│   │   ├── contact.js                # POST (public, rate-limited), GET/PUT/DELETE (admin)
│   │   └── upload.js                 # POST /sign (Cloudinary signature), DELETE
│   │
│   └── scripts/
│       └── seed.js                   # One-time DB seed from original hardcoded data
│
└── frontend/                         # Next.js App Router → deployed on Vercel
    ├── next.config.js                # Cloudinary + Wikipedia image domains whitelisted
    ├── tailwind.config.js            # Custom colours: primary (#facc15), dark (#0d1117)
    ├── postcss.config.js             # Required for Tailwind processing in Next.js
    ├── jsconfig.json                 # @/* path alias resolution
    ├── middleware.js                 # Empty matcher — auth handled client-side only
    │
    ├── app/
    │   ├── layout.js                 # Root layout: metadata, ThemeProvider, suppressHydrationWarning
    │   ├── page.js                   # Home page — force-dynamic, instant live updates
    │   ├── globals.css               # @import before @tailwind (CSS spec order matters)
    │   │
    │   └── admin/
    │       ├── layout.js             # Passthrough only — no auth logic here
    │       ├── page.js               # ← Everything lives here: login form, session
    │       │                         #   management, dashboard, sidebar, all panels
    │       ├── login/page.js         # Redirects to /admin (login is in admin/page.js)
    │       ├── projects/page.js
    │       ├── experience/page.js
    │       ├── skills/page.js        # Custom category support (not enum-restricted)
    │       ├── education/page.js
    │       ├── certifications/page.js
    │       ├── volunteering/page.js
    │       ├── messages/page.js      # Inbox with mark-read, delete, reply via email
    │       ├── resume/page.js        # Upload Resume PDF → Cloudinary, auto-deletes old
    │       └── profile/page.js       # Photo, name, bio, taglines, all social links
    │
    ├── components/
    │   ├── Navbar.js                 # Scroll-hide/show, mobile menu, dynamic resume URL
    │   ├── ThemeProvider.js          # Dark/light state with localStorage persistence
    │   ├── SwipeThemeToggle.js       # Touch-swipe + click toggle
    │   │
    │   ├── sections/                 # All portfolio sections — receive data as props from page.js
    │   │   ├── Hero.js               # Fetches profile from API: photo, name, taglines, links
    │   │   ├── Experience.js
    │   │   ├── Projects.js
    │   │   ├── Skills.js             # Category filter tabs
    │   │   ├── Education.js
    │   │   ├── Certifications.js
    │   │   ├── Volunteering.js
    │   │   └── Contact.js            # Form → POST /api/contact, saves to DB + Resend email
    │   │
    │   └── admin/
    │       ├── adminUtils.js         # useAdminCRUD hook, DataTable, AdminModal,
    │       │                         # AdminPageHeader (yellow + Add New button), Field, inputCls
    │       └── ImageUploader.js      # Direct Cloudinary upload via signed URLs,
    │                                 # SVG support (resource_type: raw), token from auth.currentUser
    │
    ├── hooks/
    │   ├── useAuth.js                # onAuthStateChanged, login, logout, getToken, isAdmin
    │   └── useScrollFadeIn.js        # IntersectionObserver fade-in animation
    │
    └── lib/
        ├── firebase.js               # Firebase client SDK initialisation
        └── api.js                    # apiFetch (public), apiAuth (authenticated)
```

---

## How the Data Flow Works

### Public Portfolio

```
Browser requests madycloud.me
  → Vercel runs page.js (force-dynamic — no build-time fetch)
  → page.js calls Promise.all([...6 API endpoints...]) with AbortSignal.timeout(8000)
  → Each section receives data as props
  → If backend is unreachable, sections render empty (no crash)
  → Hero.js additionally fetches /api/profile client-side for photo + taglines
```

I use `force-dynamic` instead of ISR because the portfolio should reflect admin changes instantly. There is no 60-second delay.

### Admin Dashboard

```
Admin visits madycloud.me/admin
  → onAuthStateChanged fires → checks Firebase session
  → If no session: LoginScreen renders (no redirect, no separate page)
  → Admin submits credentials → signInWithEmailAndPassword
  → Firebase sets user → onAuthStateChanged fires → Dashboard renders in-place
  → Session persists across refreshes (Firebase stores token in IndexedDB)
  → Tab close → signOut fires via pagehide event → session cleared
  → 30 minutes idle → auto-logout via setTimeout reset on user activity
```

### Image Upload Flow

```
Admin selects file in ImageUploader
  → GET token from auth.currentUser.getIdToken()
  → POST /api/upload/sign { folder, filename }
    → Backend generates Cloudinary signature (HMAC-SHA1 of params + secret)
    → Returns { signature, timestamp, cloudName, apiKey, resourceType }
  → Browser uploads directly to Cloudinary API
    → SVG files → /raw/upload endpoint
    → Images → /auto/upload endpoint
  → Cloudinary returns { secure_url, public_id }
  → URL saved to MongoDB via relevant API endpoint
  → public_id stored separately for future deletion
```

The browser uploads **directly to Cloudinary** — the file never passes through my Express server. This keeps the backend fast and avoids Render's memory limits.

---

## Environment Variables

### Backend (`backend/.env`)

```env
# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/portfolio

# Firebase Admin SDK — from Service Account JSON (Project Settings → Service Accounts)
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Cloudinary — from Dashboard
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_api_secret

# Resend — for contact form email notifications
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx

# Admin access — comma-separated, no spaces, must match Firebase user emails exactly
ADMIN_EMAILS=md.shoaib.i.makandar@gmail.com,admin@madycloud.me

# CORS — your Vercel frontend URL (both www and non-www handled automatically in code)
FRONTEND_URL=https://madycloud.me

PORT=5000
NODE_ENV=production
```

### Frontend (`frontend/.env.local`)

```env
# Express backend URL
NEXT_PUBLIC_API_URL=https://api.madycloud.me

# Firebase client SDK — from Project Settings → Your Apps → Web App
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=yourproject.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=yourproject
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=yourproject.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:xxx:web:xxx

# Comma-separated admin emails — must match ADMIN_EMAILS in backend exactly
NEXT_PUBLIC_ADMIN_EMAILS=md.shoaib.i.makandar@gmail.com,admin@madycloud.me

NEXT_PUBLIC_SITE_URL=https://madycloud.me
```

**Critical:** `NEXT_PUBLIC_*` variables are baked into the JavaScript bundle at build time. They must be referenced **statically** in code (e.g. `process.env.NEXT_PUBLIC_FIREBASE_API_KEY`) — dynamic key lookups like `process.env[someVar]` always return `undefined` in Next.js.

---

## Local Development

### Prerequisites
- Node.js v18+ (v25 requires `"type": "commonjs"` in backend `package.json`)
- MongoDB running locally or MongoDB Atlas connection string
- Firebase project with Email/Password auth enabled

### Setup

```bash
# Clone
git clone https://github.com/MaDycloud-MD/madycloud-portfolio.git
cd madycloud-portfolio

# Backend
cd backend
cp .env.example .env
# Edit .env — fill in MONGODB_URI at minimum for local dev
npm install
npm run dev                    # Starts on http://localhost:5000

# Frontend (new terminal)
cd frontend
cp .env.example .env.local
# Edit .env.local — set NEXT_PUBLIC_API_URL=http://localhost:5000
npm install
npm run dev                    # Starts on http://localhost:3000
```

### Seed the database (first time only)

```bash
cd backend
node scripts/seed.js
```

This populates MongoDB with all the original hardcoded data from the old React portfolio. **Do not run this again after you've added real content through the admin panel** — it clears everything first.

### Verify backend is running

```bash
curl http://localhost:5000/api/health
# → {"success":true,"message":"MaDycloud API is running 🚀"}

curl http://localhost:5000/api/projects
# → {"success":true,"data":[...]}
```

---

## Deployment

### 1. MongoDB Atlas

1. Create free M0 cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Database Access → Add user with `readWriteAnyDatabase`
3. Network Access → Add `0.0.0.0/0` (Render uses dynamic IPs)
4. Connect → Drivers → copy connection string → set as `MONGODB_URI`

### 2. Firebase

1. [console.firebase.google.com](https://console.firebase.google.com) → New project
2. Authentication → Sign-in method → Enable **Email/Password**
3. Authentication → Users → Add user (your admin email + password)
4. Project Settings → Service Accounts → **Generate new private key** → download JSON
5. Extract `project_id`, `client_email`, `private_key` → backend env vars
6. Project Settings → Your Apps → Web App → copy `firebaseConfig` → frontend env vars
7. Authentication → Settings → Authorized domains → add `madycloud.me` and `localhost`

### 3. Cloudinary

1. [cloudinary.com](https://cloudinary.com) → Free account
2. Dashboard → copy Cloud Name, API Key, API Secret → backend env vars

### 4. Resend

1. [resend.com](https://resend.com) → Free account (100 emails/day)
2. API Keys → Create → copy → `RESEND_API_KEY`
3. Optionally verify your domain for custom `from` address

---

## API Reference

All public endpoints return `{ success: true, data: [...] }`. All admin endpoints require `Authorization: Bearer <firebase-id-token>` header.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | Public | Health check |
| GET | `/api/profile` | Public | Get profile (singleton) |
| PUT | `/api/profile` | Admin | Update name, bio, taglines, links |
| PUT | `/api/profile/photo` | Admin | Update profile photo |
| DELETE | `/api/profile/photo` | Admin | Remove profile photo |
| GET | `/api/projects` | Public | List all projects |
| POST | `/api/projects` | Admin | Create project |
| PUT | `/api/projects/:id` | Admin | Update project |
| DELETE | `/api/projects/:id` | Admin | Delete project + Cloudinary image |
| GET | `/api/experience` | Public | List experience |
| POST/PUT/DELETE | `/api/experience/:id` | Admin | CRUD |
| GET | `/api/skills` | Public | List skill groups |
| POST/PUT/DELETE | `/api/skills/:id` | Admin | CRUD (any category string) |
| GET | `/api/education` | Public | List education |
| POST/PUT/DELETE | `/api/education/:id` | Admin | CRUD |
| GET | `/api/certifications` | Public | List certifications |
| POST/PUT/DELETE | `/api/certifications/:id` | Admin | CRUD |
| GET | `/api/volunteering` | Public | List volunteering |
| POST/PUT/DELETE | `/api/volunteering/:id` | Admin | CRUD |
| POST | `/api/contact` | Public | Submit message (rate-limited: 5/hour) |
| GET | `/api/contact` | Admin | List all messages |
| PUT | `/api/contact/:id/read` | Admin | Mark as read |
| DELETE | `/api/contact/:id` | Admin | Delete message |
| GET | `/api/resume` | Public | Get current resume URL |
| POST | `/api/resume` | Admin | Save resume after upload (deletes old) |
| DELETE | `/api/resume` | Admin | Delete resume from Cloudinary + DB |
| POST | `/api/upload/sign` | Admin | Get Cloudinary signed upload credentials |
| DELETE | `/api/upload` | Admin | Delete Cloudinary asset by publicId |

---

## Admin Dashboard

Access at `/admin`. The dashboard is a single-page application embedded within Next.js — login, session management, and all CRUD panels live in `app/admin/page.js`. There is no separate login page or route protection middleware.

### Session Behaviour
- **Stays logged in** across page refreshes — Firebase persists the token in IndexedDB
- **Auto-logout after 30 minutes** of inactivity (no mouse, keyboard, scroll, or touch)
- **Logout on tab close** — `pagehide` event calls `signOut()` when the tab is closed, but NOT on refresh (distinguished via `sessionStorage` flag)
- **Manual logout** via sidebar button clears the idle timer immediately

### Admin Sections

| Section | What you can manage |
|---------|---------------------|
| Profile | Name, bio, location, profile photo, typewriter taglines, all social links (LinkedIn, GitHub, Instagram, Telegram, Email, LeetCode, Twitter, YouTube, Website) |
| Experience | Role, company, duration, bullet points, company logo |
| Projects | Title, description, bullet details, tech stack with logos, GitHub/Live/YouTube links, cover image, featured flag, display order |
| Skills | Skill groups with custom or suggested categories, individual skills with logos (SVG supported) |
| Education | Degree, institution, score, year |
| Certifications | Name, badge image, credential URL, issuer, in-progress flag |
| Volunteering | Title, description |
| Messages | Read contact form submissions, mark as read, delete, reply via email |
| Upload Resume | Upload PDF → stored on Cloudinary, previous resume auto-deleted, portfolio download button updates instantly |

---

## Key Technical Decisions

### Why `force-dynamic` instead of ISR?

ISR (Incremental Static Regeneration) with `revalidate: 60` means changes take up to 60 seconds to appear. Since I'm the only content author and I want to see changes immediately after saving in the admin panel, `force-dynamic` is the right choice. The tradeoff — a slight increase in TTFB — is acceptable for a portfolio.

### Why direct Cloudinary uploads instead of server-proxied?

If I proxied file uploads through Express on Render's free tier, large files would hit memory limits and timeouts. The signed upload approach means the browser uploads directly to Cloudinary's CDN. My server only handles a lightweight signature generation request. This is also Cloudinary's recommended production pattern.

### Why `auth.currentUser` instead of the `useAuth` hook in ImageUploader?

React hooks return state values that can be stale between renders. `auth.currentUser` is a direct Firebase property that always returns the current live session. For security-sensitive operations like getting an ID token, I access it directly rather than relying on a potentially stale React state value.

### Why is admin auth entirely client-side?

The Next.js middleware approach (`middleware.js`) requires cookie-based sessions. Firebase Auth uses IndexedDB — not cookies — so middleware can't reliably check auth state. I removed the middleware entirely and handle auth in `admin/page.js` using `onAuthStateChanged`, which is the Firebase-recommended pattern. The actual security is enforced by the backend `auth.js` middleware on every admin API call.

### Why `"type": "commonjs"` in backend `package.json`?

Node.js v25 changed how it determines module type. Without explicitly setting `"type": "commonjs"`, Node v25 sometimes treats `.js` files as ES modules, breaking `require()`. This is a one-line fix that ensures consistent CommonJS behaviour across all Node versions.

---

## Adding New Sections in the Future

My data lives in MongoDB completely independently of the code. Adding a new section (e.g. Blog, Open Source, Talks) follows this pattern and never affects existing data:

1. **Backend:** Create `models/Blog.js` → `routes/blog.js` → register in `server.js`
2. **Frontend:** Create `app/admin/blog/page.js` → add to `admin/page.js` NAV + panelMap → add `fetch('/api/blog')` in `app/page.js`
3. **Component:** Create `components/sections/Blog.js` → add to home page

Existing content (projects, experience, skills, etc.) is completely unaffected. MongoDB collections are independent — modifying the codebase never touches the database unless you explicitly call create/update/delete.

---

## Tech Stack Summary

| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend framework | Next.js 14 App Router | SSR, force-dynamic, file-based routing |
| Styling | Tailwind CSS | Utility-first, consistent design tokens |
| Animations | Framer Motion + Tailwind | Smooth transitions, scroll-triggered |
| Backend | Express.js | Simple, battle-tested, CommonJS compatible |
| Database | MongoDB Atlas + Mongoose | Flexible schema, free tier, ODM |
| Auth | Firebase Authentication | Managed, secure, IndexedDB persistence |
| Media storage | Cloudinary | CDN, signed uploads, SVG + PDF support |
| Email | Resend | Modern API, reliable delivery |
| Frontend hosting | Vercel | Next.js native, automatic deploys |
| Backend hosting | Render | Persistent process, free tier |

---

## License, Trademark and Brand Usage

The name **"MaDycloud"**, **"madycloud"**, **"MaDy Cloud"**, and the domain **"madycloud.me"** are trademarks of the MaDycloud project.

These trademarks include, but are not limited to:

* Any variations in spelling, capitalization, or styling
* Any confusingly similar names or marks
* Any transliterations, abbreviations, or modified versions
* Any domain names, subdomains, or brand identifiers derived from the MaDycloud name

Unauthorized use of these trademarks is strictly prohibited.

This project is licensed under the **Apache License, Version 2.0**.
The license grants permission to use, modify, and distribute the software, but **does not grant permission to use the MaDycloud name, logo, brand, or domain without prior written authorization.**

If you wish to use the MaDycloud trademark, brand name, or logo in a product, service, distribution, or derivative work, you must obtain explicit written permission from the project owner.

---

*Designed, Developed & Owned by [Mohammed Shoaib Makandar](https://linkedin.com/in/myselfmd) · [madycloud.me](https://madycloud.me)*