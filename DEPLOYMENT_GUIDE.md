# Deployment Guide

## Frontend (Vercel) Configuration

### Environment Variables
The frontend is now configured to use the deployed Render API:
- **Production API URL**: `http://localhost:5000/api`

### Files Updated:
1. `client/.env` - Production environment variables
2. `client/.env.production` - Vercel-specific production config
3. `client/.env.example` - Updated example with production URL
4. `client/src/pages/frontend-admin/services/api.js` - Uses environment variable with fallback

### Vercel Deployment Steps:
1. Connect your GitHub repository to Vercel
2. Set the root directory to `client`
3. Vercel will automatically detect it's a Vite project
4. Add environment variable in Vercel dashboard:
   - `VITE_API_URL` = `http://localhost:5000/api`
5. Deploy!

### Environment Variable Priority:
1. Vercel dashboard environment variables (highest priority)
2. `.env.production` file
3. `.env` file
4. Fallback to hardcoded production URL

## Backend (Render) 
Your backend is already deployed at: `http://localhost:5000`

## Notes:
- All components now use the centralized API_URL from `api.js`
- No localhost references remain in the codebase
- The frontend will work seamlessly with the deployed backend
- CORS should be configured on the backend to allow your Vercel domain