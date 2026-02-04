# Vercel Deployment Guide

## Frontend Deployment (Vercel)

### 1. Configuration Files Created
- ✅ `vercel.json` - Handles SPA routing and asset caching
- ✅ `public/_redirects` - Fallback routing configuration
- ✅ `.env.example` - Environment variables template

### 2. Deploy to Vercel

#### Option A: Via Vercel CLI
```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

#### Option B: Via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your repository
4. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3. Environment Variables on Vercel

Add these environment variables in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | `https://your-backend-url.com/api` | Your backend API URL |

**Important**: The variable MUST start with `VITE_` to be accessible in the client.

### 4. Backend Deployment

You also need to deploy your backend. Options:

#### Option 1: Render.com (Recommended for Node.js)
1. Create account on [render.com](https://render.com)
2. New → Web Service
3. Connect repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node

#### Option 2: Railway.app
1. Create account on [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select backend folder
4. Add environment variables

#### Option 3: Heroku
```bash
cd backend
heroku create your-app-name
git push heroku main
```

### 5. Backend Environment Variables

Add these to your backend hosting platform:

```env
PORT=5002
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
FRONTEND_URL=https://your-vercel-app.vercel.app
ADMIN_EMAIL=admin@arduinoshop.com
ADMIN_PASSWORD=admin123
```

### 6. Update CORS After Deployment

Once you have your Vercel URL, update `backend/server.js`:

```javascript
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:4173',
        'https://your-app.vercel.app', // Add your Vercel URL
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true,
    optionsSuccessStatus: 200,
};
```

### 7. Test Your Deployment

After deployment:

1. ✅ Test all routes (/, /videos, /products/:id, /cart, /checkout)
2. ✅ Test admin login (/admin/login)
3. ✅ Test video upload
4. ✅ Test product creation
5. ✅ Test checkout flow

### 8. Troubleshooting

#### 404 Errors on Routes
- ✅ Fixed by `vercel.json` configuration
- All routes now redirect to `index.html`

#### API Requests Failing
- Check `VITE_API_URL` in Vercel environment variables
- Ensure backend is deployed and accessible
- Check CORS configuration on backend

#### Environment Variables Not Working
- Must prefix with `VITE_` for Vite
- Redeploy after adding variables

#### Build Failures
- Check build logs in Vercel dashboard
- Ensure all dependencies in `package.json`
- Check Node version compatibility

## Production Checklist

Before going live:

- [ ] Backend deployed and accessible
- [ ] Frontend deployed on Vercel
- [ ] Environment variables configured
- [ ] CORS updated with production URL
- [ ] Database seeded with initial data
- [ ] Admin account created
- [ ] Test all functionality
- [ ] SSL/HTTPS enabled (automatic on Vercel)
- [ ] Custom domain configured (optional)

## Custom Domain (Optional)

### On Vercel:
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### On Backend:
1. Update `FRONTEND_URL` environment variable
2. Add domain to CORS whitelist

## Monitoring

- **Frontend**: Vercel provides automatic analytics
- **Backend**: Use services like Sentry, LogRocket
- **Database**: MongoDB Atlas monitoring

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check backend server logs
3. Check browser console for errors
4. Verify environment variables
