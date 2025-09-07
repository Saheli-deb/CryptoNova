# 🚀 CryptoNova Deployment Guide

Deploy your AI-powered crypto portfolio app for **FREE** using Vercel + Render!

## 📋 Prerequisites

1. GitHub account
2. Vercel account (free)
3. Render account (free)

---

## 🧠 Part 1: Deploy Backend on Render (FREE)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Deploy on Render
1. Go to [render.com](https://render.com) and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `cryptonova-backend`
   - **Root Directory**: `ml_models`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn backend_clean:app`
   - **Instance Type**: `Free`

### Step 3: Environment Variables
Add these in Render dashboard:
```
FLASK_ENV=production
PORT=10000
```

### Step 4: Get Your Backend URL
After deployment, copy your backend URL:
```
https://cryptonova-backend-xxxxx.onrender.com
```

---

## 📱 Part 2: Deploy Frontend on Vercel (FREE)

### Step 1: Update Environment
Create `.env.local` with your backend URL:
```
VITE_ML_API_URL=https://your-backend-url.onrender.com
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "New Project"
3. Connect your GitHub repository
4. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (leave empty)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Environment Variables
In Vercel dashboard, add:
```
VITE_ML_API_URL = https://your-backend-url.onrender.com
```

### Step 4: Deploy!
Click "Deploy" and wait for completion.

---

## 🎯 Final Result

- **Frontend**: `https://cryptonova.vercel.app`
- **Backend**: `https://cryptonova-backend.onrender.com`
- **Cost**: $0/month (completely FREE!)

---

## 🔧 Important Notes

### Render Free Tier Limitations:
- Backend may "sleep" after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- 512MB RAM limit
- 750 hours/month (enough for most usage)

### How to Minimize Sleep Issues:
1. Use a service like [cron-job.org](https://cron-job.org) to ping your backend every 14 minutes
2. Add this endpoint to your backend for health checks: `/api/health`

---

## 🐛 Troubleshooting

### Backend Issues:
- Check logs in Render dashboard
- Ensure all dependencies are in `requirements.txt`
- Verify environment variables are set

### Frontend Issues:
- Check Vercel build logs
- Ensure `VITE_ML_API_URL` is set correctly
- Verify API endpoints match backend URL

### CORS Issues:
Already handled in backend with `flask-cors`

---

## 🚀 Ready to Deploy?

Follow the steps above and you'll have your CryptoNova app live on the internet for FREE!

Need help? Check the logs in both Render and Vercel dashboards for detailed error messages.
