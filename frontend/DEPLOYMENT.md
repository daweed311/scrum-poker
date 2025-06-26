# Netlify Deployment Guide

## Quick Deploy

1. **Connect Repository:**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Choose GitHub and select your repository

2. **Configure Build Settings:**
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

3. **Deploy:**
   - Click "Deploy site"
   - Netlify will automatically build and deploy your app

## Environment Configuration

The frontend automatically detects the environment:
- **Development:** Uses `http://localhost:3001` for backend API
- **Production:** Uses `https://scrum-poker-9c6i.onrender.com` for backend API

No additional environment variables needed!

## Custom Domain (Optional)

1. Go to your site settings in Netlify
2. Click "Domain settings"
3. Add your custom domain
4. Configure DNS as instructed

## Continuous Deployment

- Every push to the `main` branch will trigger a new deployment
- Pull requests create preview deployments automatically

## Troubleshooting

- **Build fails:** Check that Node.js version is 18+ in build settings
- **API errors:** Ensure your Render backend is running and accessible
- **Routing issues:** The `netlify.toml` file handles SPA routing automatically 