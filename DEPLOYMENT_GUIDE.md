# Vercel Deployment Guide

## Method 1: Deploy using Vercel CLI (Recommended)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
cd mern-deployment
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? **Select your account**
- Link to existing project? **N**
- Project name: **mern-stack-app**
- In which directory is your code? **./**

### Step 4: Set Environment Variables
```bash
vercel env add MONGODB_URI
vercel env add CLIENT_URL
```

Enter your MongoDB Atlas connection string and production client URL.

## Method 2: Deploy using Vercel Web Interface

### Step 1: Push to GitHub
1. Create new repository on GitHub
2. Push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/mern-deployment.git
git push -u origin main
```

### Step 2: Connect to Vercel
1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure project:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: `cd client && npm run build`
   - Output Directory: `client/build`
   - Install Command: `cd client && npm install && cd ../server && npm install`

### Step 3: Add Environment Variables
1. Go to Project Settings → Environment Variables
2. Add these variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `CLIENT_URL`: Your Vercel app URL (https://your-app.vercel.app)
   - `NODE_ENV`: production

### Step 4: Deploy
Click "Deploy" and wait for deployment to complete.

## Post-Deployment Steps

1. **Update API URL in React App**
   - Update the `API_BASE_URL` in `client/src/App.js`
   - Replace with your actual Vercel deployment URL

2. **Test Your Deployment**
   - Visit your Vercel URL
   - Test API endpoints: `https://your-app.vercel.app/api/health`
   - Test student CRUD operations

3. **Monitor Logs**
   - Check Vercel dashboard for function logs
   - Monitor MongoDB Atlas for database connections

## Troubleshooting Common Issues

### Issue 1: API Routes Not Working
- Check `vercel.json` configuration
- Ensure API routes start with `/api/`
- Verify server exports the Express app

### Issue 2: MongoDB Connection Failed
- Check MongoDB Atlas network access (allow 0.0.0.0/0)
- Verify connection string in environment variables
- Check database user permissions

### Issue 3: Build Failures
- Ensure all dependencies are in `package.json`
- Check Node.js version compatibility
- Review build logs in Vercel dashboard

### Issue 4: CORS Errors
- Update CORS origin in server to match Vercel URL
- Set `CLIENT_URL` environment variable correctly

## Commands for Video Tutorial

```bash
# 1. Install dependencies
cd server && npm install
cd ../client && npm install

# 2. Test locally
cd server && npm start
cd ../client && npm start

# 3. Deploy to Vercel
npm install -g vercel
vercel login
vercel

# 4. Set environment variables
vercel env add MONGODB_URI
vercel env add CLIENT_URL

# 5. Redeploy with environment variables
vercel --prod
```