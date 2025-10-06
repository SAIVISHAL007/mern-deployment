# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/atlas
2. Click "Sign Up" or "Try Free"
3. Create account with email/password
4. Verify your email address

## Step 2: Create a New Cluster
1. Click "Create a New Cluster"
2. Choose "Shared" (Free tier)
3. Select cloud provider: AWS
4. Choose region: closest to your users
5. Cluster name: "mern-cluster" (or any name)
6. Click "Create Cluster"

## Step 3: Configure Database Access
1. In "Database Access" tab:
   - Click "Add New Database User"
   - Username: `mern-user`
   - Password: Generate secure password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

## Step 4: Configure Network Access
1. In "Network Access" tab:
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Comment: "Vercel deployment"
   - Click "Confirm"

## Step 5: Get Connection String
1. Go to "Clusters" tab
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Driver: Node.js, Version: 4.1 or later
5. Copy the connection string:
   ```
   mongodb+srv://mern-user:<password>@mern-cluster.xxxxx.mongodb.net/mern-app?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password
7. Replace `mern-app` with your database name

## Step 6: Update Environment Variables
Create `.env` file in server folder:
```
MONGODB_URI=mongodb+srv://mern-user:your-password@mern-cluster.xxxxx.mongodb.net/mern-app?retryWrites=true&w=majority
CLIENT_URL=http://localhost:3000
PORT=5000
NODE_ENV=development
```

## Step 7: Test Connection
Run your server and check if it connects to MongoDB Atlas:
```bash
cd server
npm install
npm start
```

Look for: "MongoDB connected successfully" in console.

## Important Notes:
- Keep your password secure
- Don't commit `.env` file to Git
- Use environment variables in production
- Monitor usage in Atlas dashboard