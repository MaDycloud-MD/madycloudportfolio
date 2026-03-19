# Complete Deployment Guide
## MaDycloud Portfolio — Full-Stack Production Setup

---

## Prerequisites

- Node.js 18+ installed locally
- Git installed
- Accounts needed (all free tier):
  - MongoDB Atlas → cloud.mongodb.com
  - Firebase      → console.firebase.google.com
  - Cloudinary    → cloudinary.com
  - Render        → render.com  (backend)
  - Vercel        → vercel.com  (frontend)

---

## Step 1 — MongoDB Atlas

1. Go to **cloud.mongodb.com** → Create free account
2. **Create a cluster** → Choose M0 Free Tier → Any region close to you
3. **Database Access** → Add new database user
   - Username: `madycloud`
   - Password: generate a strong one (save it!)
   - Role: `readWriteAnyDatabase`
4. **Network Access** → Add IP Address → `0.0.0.0/0` (allow all — needed for Render's dynamic IPs)
5. **Connect** → Drivers → Copy the connection string

```
mongodb+srv://madycloud:<password>@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
```

Replace `<password>` with your actual password. Save this as `MONGODB_URI`.

---

## Step 2 — Firebase

### Create Project
1. Go to **console.firebase.google.com** → Add project → Name: `madycloud-portfolio`
2. Disable Google Analytics (not needed) → Create project

### Enable Authentication
1. **Authentication** → Get started → Sign-in method tab
2. Enable **Email/Password** provider
3. **Users** tab → Add user
   - Email: `md.shoaib.i.makandar@gmail.com` (your admin email)
   - Password: choose a strong password

### Get Client Config
1. **Project Settings** (gear icon) → General → Your apps → Add app → Web
2. Name it `madycloud-frontend` → Register
3. Copy the `firebaseConfig` object — these are your `NEXT_PUBLIC_FIREBASE_*` values:

```js
const firebaseConfig = {
  apiKey:            "AIzaSy...",          // NEXT_PUBLIC_FIREBASE_API_KEY
  authDomain:        "xxx.firebaseapp.com",// NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  projectId:         "xxx",               // NEXT_PUBLIC_FIREBASE_PROJECT_ID
  storageBucket:     "xxx.appspot.com",   // NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456789",         // NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  appId:             "1:xxx:web:xxx",     // NEXT_PUBLIC_FIREBASE_APP_ID
};
```

### Get Admin SDK Credentials (for backend)
1. **Project Settings** → **Service Accounts** tab
2. Click **Generate new private key** → Download JSON file
3. From the JSON, extract these 3 values:
   - `project_id`    → `FIREBASE_ADMIN_PROJECT_ID`
   - `client_email`  → `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `private_key`   → `FIREBASE_ADMIN_PRIVATE_KEY`

---

## Step 3 — Cloudinary

1. Go to **cloudinary.com** → Create free account
2. **Dashboard** → Copy:
   - Cloud Name  → `CLOUDINARY_CLOUD_NAME`
   - API Key     → `CLOUDINARY_API_KEY`
   - API Secret  → `CLOUDINARY_API_SECRET`
3. **Settings → Upload** → No additional config needed (we use signed uploads)

---

## Step 4 — Resend (Email Notifications)

1. Go to **resend.com** → Create free account (100 emails/day free)
2. **API Keys** → Create API Key → Copy it → `RESEND_API_KEY`
3. (Optional but recommended) **Domains** → Add your domain `madycloud.me`
   → Follow DNS verification steps → Then update `from` in `contact.js`:
   ```js
   from: 'Portfolio <contact@madycloud.me>'
   ```
   Until domain is verified, use `onboarding@resend.dev` (works for testing).

---

## Step 5 — Seed the Database

Before deploying, seed MongoDB with your existing data:

```bash
cd backend
cp .env.example .env
# Fill in MONGODB_URI in .env

npm install
node scripts/seed.js
```

Expected output:
```
✅ Connected to MongoDB
🗑️  Cleared existing data
📦 Seeded 7 projects
💼 Seeded 2 experience entries
🛠️  Seeded 5 skill groups
🎓 Seeded 2 education entries
🏅 Seeded 6 certifications
🤝 Seeded 4 volunteering entries
✨ Database seeded successfully!
```

---

## Step 6 — Deploy Backend to Render

### Prepare the repo
```bash
# From project root, push to GitHub
git init
git add .
git commit -m "Initial full-stack portfolio"
git remote add origin https://github.com/MaDycloud-MD/madycloud-portfolio.git
git push -u origin main
```

### Create Render Web Service
1. Go to **render.com** → New → **Web Service**
2. Connect your GitHub repo
3. Configure:
   - **Name**: `madycloud-api`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free

4. **Environment Variables** — Add all of these:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | your Atlas connection string |
| `FIREBASE_ADMIN_PROJECT_ID` | from service account JSON |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | from service account JSON |
| `FIREBASE_ADMIN_PRIVATE_KEY` | full key including `-----BEGIN/END PRIVATE KEY-----` |
| `CLOUDINARY_CLOUD_NAME` | from Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | from Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | from Cloudinary dashboard |
| `RESEND_API_KEY` | from Resend dashboard |
| `ADMIN_EMAIL` | `md.shoaib.i.makandar@gmail.com` |
| `FRONTEND_URL` | `https://madycloud.me` |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |

5. Click **Create Web Service** → Wait for deploy
6. Copy your Render URL: `https://madycloud-api.onrender.com`

> ⚠️ **Render free tier note**: The service sleeps after 15 minutes of inactivity.
> First request after sleep takes ~30 seconds (cold start).
> To avoid this, upgrade to Render Starter ($7/mo) or use a free uptime monitor
> like **UptimeRobot** (uptimerobot.com) to ping `/api/health` every 5 minutes.

### Test the backend
```bash
curl https://madycloud-api.onrender.com/api/health
# → {"success":true,"message":"MaDycloud API is running 🚀"}

curl https://madycloud-api.onrender.com/api/projects
# → {"success":true,"data":[...your 7 projects...]}
```

---

## Step 7 — Deploy Frontend to Vercel

### Install Vercel CLI
```bash
npm i -g vercel
```

### Deploy
```bash
cd frontend
vercel

# Follow prompts:
# Set up and deploy? Y
# Which scope? (your account)
# Link to existing project? N
# Project name: madycloud-frontend
# Directory: ./  (already in frontend/)
# Override settings? N
```

### Add Environment Variables on Vercel
Go to **Vercel Dashboard** → Your project → **Settings** → **Environment Variables**

Add all of these (select All Environments: Production, Preview, Development):

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://madycloud-api.onrender.com` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | from Firebase config |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | from Firebase config |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | from Firebase config |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | from Firebase config |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | from Firebase config |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | from Firebase config |
| `NEXT_PUBLIC_ADMIN_EMAIL` | `md.shoaib.i.makandar@gmail.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://madycloud.me` |

### Redeploy after adding env vars
```bash
vercel --prod
```

---

## Step 8 — Custom Domain

### On Vercel
1. **Project Settings** → **Domains**
2. Add `madycloud.me` and `www.madycloud.me`
3. Vercel shows you DNS records to add

### On your domain registrar (e.g. Namecheap / GoDaddy / Cloudflare)
Add these DNS records:
```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

Wait 5–60 minutes for DNS propagation. HTTPS is automatic.

---

## Step 9 — Firebase Authorized Domains

Firebase blocks auth from unknown domains by default.

1. **Firebase Console** → Authentication → **Settings** → **Authorized domains**
2. Add:
   - `madycloud.me`
   - `www.madycloud.me`
   - `madycloud-frontend.vercel.app` (your Vercel preview URL)

---

## Step 10 — Verify Everything Works

### Public portfolio
```
https://madycloud.me              → Home page loads with DB data
https://madycloud.me/#projects    → Projects from MongoDB
https://madycloud.me/#contact     → Form submits, you get email
```

### Admin dashboard
```
https://madycloud.me/admin/login  → Firebase login form
  → Login with your admin email/password
https://madycloud.me/admin        → Dashboard with counts
https://madycloud.me/admin/projects → CRUD projects
https://madycloud.me/admin/resume   → Upload new PDF resume
https://madycloud.me/admin/messages → View contact submissions
```

---

## Local Development Workflow

```bash
# Terminal 1 — Backend
cd backend
cp .env.example .env   # fill in values
npm install
npm run dev            # nodemon on port 5000

# Terminal 2 — Frontend
cd frontend
cp .env.example .env.local   # fill in values, set API_URL=http://localhost:5000
npm install
npm run dev            # Next.js on port 3000

# Open http://localhost:3000
# Admin: http://localhost:3000/admin/login
```

---

## File Structure Summary

```
madycloud-portfolio/
├── backend/                    ← Express on Render
│   ├── server.js
│   ├── lib/
│   │   ├── mongodb.js
│   │   ├── firebase-admin.js
│   │   ├── cloudinary.js
│   │   └── crudFactory.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Project.js
│   │   ├── Experience.js
│   │   ├── Skill.js
│   │   ├── Education.js
│   │   ├── Certification.js
│   │   ├── Volunteering.js
│   │   ├── ContactMessage.js
│   │   └── Resume.js
│   ├── routes/
│   │   ├── projects.js
│   │   ├── experience.js
│   │   ├── skills.js
│   │   ├── education.js
│   │   ├── certifications.js
│   │   ├── volunteering.js
│   │   ├── contact.js         ← saves to DB + Resend email
│   │   ├── resume.js          ← singleton PDF management
│   │   └── upload.js          ← Cloudinary signed upload
│   ├── scripts/
│   │   └── seed.js            ← run once to populate DB
│   ├── package.json
│   └── .env.example
│
└── frontend/                   ← Next.js on Vercel
    ├── app/
    │   ├── layout.js
    │   ├── page.js             ← ISR home (revalidate: 60s)
    │   ├── globals.css
    │   └── admin/
    │       ├── layout.js       ← Firebase auth guard
    │       ├── page.js         ← Dashboard stats
    │       ├── login/page.js
    │       ├── projects/page.js
    │       ├── experience/page.js
    │       ├── skills/page.js
    │       ├── education/page.js
    │       ├── certifications/page.js
    │       ├── volunteering/page.js
    │       ├── messages/page.js
    │       └── resume/page.js
    ├── components/
    │   ├── Navbar.js
    │   ├── ThemeProvider.js
    │   ├── SwipeThemeToggle.js
    │   ├── sections/
    │   │   ├── Hero.js
    │   │   ├── Experience.js
    │   │   ├── Projects.js
    │   │   ├── Skills.js
    │   │   ├── Education.js
    │   │   ├── Certifications.js
    │   │   ├── Volunteering.js
    │   │   └── Contact.js      ← form with validation + API call
    │   └── admin/
    │       ├── AdminSidebar.js
    │       ├── ImageUploader.js ← direct Cloudinary upload
    │       └── adminUtils.js    ← DataTable, Modal, CRUD hook, Field
    ├── hooks/
    │   ├── useAuth.js
    │   └── useScrollFadeIn.js
    ├── lib/
    │   ├── firebase.js
    │   └── api.js
    ├── middleware.js
    ├── next.config.js
    ├── tailwind.config.js
    ├── package.json
    └── .env.example
```

---

## Environment Variables — Complete Reference

### Backend (`backend/.env`)
```env
MONGODB_URI=mongodb+srv://...
FIREBASE_ADMIN_PROJECT_ID=...
FIREBASE_ADMIN_CLIENT_EMAIL=...
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
RESEND_API_KEY=re_...
ADMIN_EMAIL=md.shoaib.i.makandar@gmail.com
FRONTEND_URL=https://madycloud.me
PORT=5000
NODE_ENV=production
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=https://madycloud-api.onrender.com
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_ADMIN_EMAIL=md.shoaib.i.makandar@gmail.com
NEXT_PUBLIC_SITE_URL=https://madycloud.me
```

---

## Quick Commands

```bash
# Reseed database (after changes to seed.js)
cd backend && node scripts/seed.js

# Deploy backend changes to Render
git push origin main   # Render auto-deploys on push

# Deploy frontend changes to Vercel
cd frontend && vercel --prod
# OR: git push origin main  (if you connected Vercel to GitHub — recommended)

# Test backend locally
cd backend && npm run dev

# Test frontend locally
cd frontend && npm run dev
```

---

*MaDycloud Portfolio — madycloud.me*
