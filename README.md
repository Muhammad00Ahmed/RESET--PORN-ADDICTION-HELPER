# RESET — Behavioral Intervention System

> Real-time AI coaching to break compulsive habits through psychological interruption, streak reinforcement, and identity building.

---

## Architecture

```
reset/
├── frontend/          # Next.js 15 App Router
│   ├── app/
│   │   ├── page.tsx          # Home — urge trigger button
│   │   ├── coach/page.tsx    # AI intervention (3 modes)
│   │   └── dashboard/page.tsx # Analytics & streak
│   ├── components/           # Reusable UI system
│   ├── lib/                  # API client + store
│   └── styles/               # Design system tokens
│
├── backend/           # Node.js + Express API
│   └── src/
│       ├── routes/
│       │   ├── coach.ts      # POST /api/coach/intervene
│       │   ├── streak.ts     # POST /api/streak/update
│       │   ├── log.ts        # POST /api/log
│       │   └── user.ts       # GET /api/user/:id
│       └── index.ts
│
├── prisma/
│   └── schema.prisma         # Full DB schema
│
└── ai/
    └── systemPrompt.ts       # RESET Coach AI engine
```

---

## Quick Start

### 1. Prerequisites
- Node.js 18+
- PostgreSQL database
- Anthropic API key

### 2. Environment Setup

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your DATABASE_URL and ANTHROPIC_API_KEY

# Frontend
cp frontend/.env.local.example frontend/.env.local
# Edit if your backend runs on a different port
```

### 3. Install Dependencies

```bash
npm run install:all
```

### 4. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Or use migrations (production)
npm run db:migrate
```

### 5. Start Development

```bash
# Run both frontend and backend simultaneously
npm run dev

# Or separately:
npm run dev:backend   # http://localhost:4000
npm run dev:frontend  # http://localhost:3000
```

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — single urge trigger button |
| `/coach?mode=URGE&urgency=8` | Crisis intervention mode |
| `/coach?mode=VULNERABILITY&urgency=4` | Emotional redirect mode |
| `/coach?mode=RECOVERY&urgency=2` | Streak reinforcement mode |
| `/dashboard` | Analytics, streak, trigger patterns |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/coach/intervene` | AI intervention with mode detection |
| POST | `/api/streak/update` | Increment or reset streak |
| POST | `/api/log` | Log urge/relapse/success |
| POST | `/api/log/trigger` | Log behavioral trigger pattern |
| GET | `/api/log/:userId` | Get user logs |
| POST | `/api/user` | Create user |
| GET | `/api/user/:id` | Get user profile + analytics |
| GET | `/api/user/:id/analytics` | Get detailed analytics |

---

## Behavioral Modes

| Mode | Trigger | Response Style |
|------|---------|----------------|
| 🔴 URGE | High urgency keywords or score ≥7 | Short, commanding, action-first |
| 🟡 VULNERABILITY | Emotional keywords or score 4-6 | Warm, reframing, redirect actions |
| 🟢 RECOVERY | Stable baseline | Identity reinforcement, calm |

---

## Design System

- **Fonts**: Bebas Neue (headings) + DM Sans (body) + JetBrains Mono (data)
- **Colors**: 5 max — `#0A0A0B` bg, `#F2F2F0` text, `#FF3333` urge, `#F5A623` vulnerability, `#1DB954` recovery
- **Spacing**: 8pt grid exclusively
- **Animation**: Framer Motion, subtle and purposeful

---

## Demo Mode

The app works without a backend — all pages have demo fallbacks with realistic data. API calls gracefully degrade to local state.

---

## Production Notes

- Rate limiting: 100 req/15min general, 10 req/min for coach
- All inputs validated with Zod
- Helmet.js security headers
- CORS configured for frontend URL

---

## Deployment

### Vercel (Frontend + API Routes)

1. **Connect Repository**
   - Import your GitHub repo to Vercel
   - Set root directory to `frontend/`

2. **Environment Variables**
   ```
   DATABASE_URL=postgresql://...
   ANTHROPIC_API_KEY=sk-ant-...
   NEXT_PUBLIC_API_URL=https://your-vercel-app.vercel.app
   ```

3. **Deploy**
   - Vercel automatically detects Next.js
   - API routes are deployed as serverless functions
   - Database migrations run automatically

### Render (Full Stack)

1. **Connect Repository**
   - Create new Render account
   - Connect your GitHub repo

2. **Environment Variables** (set in Render dashboard)
   ```
   DATABASE_URL=postgresql://...
   ANTHROPIC_API_KEY=sk-ant-...
   NEXT_PUBLIC_API_URL=https://reset-frontend.onrender.com
   ```

3. **Deploy Services**
   - Use `render.yaml` for automatic service configuration
   - Creates: Frontend (Next.js), Backend (Node.js), Database (PostgreSQL)
   - All services deploy simultaneously

4. **Database Setup**
   ```bash
   # After database is created, run migrations
   render psql < prisma/migrations.sql
   ```

### Manual Deployment

For other platforms, the app is container-ready:

```dockerfile
# Frontend
FROM node:18-alpine
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]

# Backend
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci
COPY backend/ .
RUN npm run build
EXPOSE 4000
CMD ["npm", "start"]
```
