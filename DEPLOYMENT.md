# RESET Deployment Guide

## Quick Start Deployment to Render & Vercel

### Step 1: Deploy Backend to Render

1. **Create a Render Account** (if you don't have one):
   - Go to https://render.com
   - Sign up with GitHub account

2. **Create a New Web Service**:
   - Click "New +" → "Web Service"
   - Select your GitHub repository: `RESET--PORN-ADDICTION-HELPER`
   - Click "Connect"

3. **Configure the Service**:
   - **Name**: `reset-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: `Free` (for testing) or `Starter` (for production)

4. **Add Environment Secrets**:
   - Click "Advanced" → "Add Secret File" or Environment variables
   - Add these secrets:
     ```
     DATABASE_URL=postgresql://...  (Render will generate this)
     ANTHROPIC_API_KEY=sk-ant-...   (Your Anthropic API key)
     NODE_ENV=production
     PORT=10000
     ```

5. **Create Database**:
   - In Render dashboard, click "New +" → "PostgreSQL"
   - Name: `reset-db`
   - Once created, Render will provide `DATABASE_URL`
   - Copy this URL to the backend service's `DATABASE_URL` secret

6. **Deploy**:
   - Click "Create Web Service"
   - Render will automatically build and deploy from `render.yaml`
   - Once deployed, you'll get a URL like: `https://reset-backend.onrender.com`

---

### Step 2: Deploy Frontend to Vercel

1. **Create a Vercel Account** (if you don't have one):
   - Go to https://vercel.com
   - Sign up with GitHub account

2. **Import Project**:
   - Click "Add New" → "Project"
   - Select `RESET--PORN-ADDICTION-HELPER` repository
   - Click "Import"

3. **Configure Build**:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Output Directory**: `.next`

4. **Add Environment Variables**:
   - In "Environment Variables" section, add:
     ```
     NEXT_PUBLIC_API_URL=https://reset-backend.onrender.com
     ```

5. **Deploy**:
   - Click "Deploy"
   - Vercel will deploy your frontend
   - You'll get a URL like: `https://reset-frontend.vercel.app`

---

### Step 3: Connect Frontend & Backend

The frontend is already configured to use the backend URL from environment variables:
- Frontend will call `NEXT_PUBLIC_API_URL` (set in Vercel)
- Backend will receive requests at `https://reset-backend.onrender.com`

**No additional code changes needed!** The environment variables connect them automatically.

---

### Step 4: Verify Deployment

1. **Test Backend API**:
   ```bash
   curl https://reset-backend.onrender.com/api/health
   ```

2. **Test Frontend**:
   - Visit your Vercel URL
   - Check browser console (F12) for any API errors
   - Try creating a user to confirm backend connection

3. **Check Logs**:
   - Render dashboard: Logs tab for backend
   - Vercel dashboard: Deployments for frontend

---

### Troubleshooting

#### Backend not starting?
- Check `npm run build` completes locally: `cd backend && npm run build`
- Verify all environment secrets are set (especially `ANTHROPIC_API_KEY`)
- Check database URL is correct and database is created

#### Frontend can't reach backend?
- Verify `NEXT_PUBLIC_API_URL` is set in Vercel
- Check API calls in browser DevTools (Network tab)
- Ensure backend URL doesn't have trailing slash

#### Database errors?
- Ensure PostgreSQL database is created in Render
- Run migrations: `npx prisma migrate deploy`
- Check `DATABASE_URL` is correctly set

---

### Manual Deployment (if render.yaml doesn't work)

If Render doesn't auto-detect `render.yaml`, manually configure:

**Backend Service** (`reset-backend`):
```yaml
type: web
name: reset-backend
runtime: node
buildCommand: cd backend && npm install && npm run build
startCommand: cd backend && npm start
```

**Frontend Service** (`reset-frontend`):
```yaml
type: web
name: reset-frontend
runtime: node
buildCommand: cd frontend && npm install && npm run build
startCommand: cd frontend && npm start
```

---

### Environment Variables Reference

**Backend (.env or Render secrets)**:
```
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://user:password@host:5432/reset_db
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

**Frontend (Vercel environment)**:
```
NEXT_PUBLIC_API_URL=https://reset-backend.onrender.com
```

---

### Useful Links

- Render Dashboard: https://dashboard.render.com
- Vercel Dashboard: https://vercel.com/dashboard
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs

---

## All Done! 🚀

Your full-stack app is now deployed:
- **Backend API**: https://reset-backend.onrender.com
- **Frontend App**: https://reset-frontend.vercel.app
