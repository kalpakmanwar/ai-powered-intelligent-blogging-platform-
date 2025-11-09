# Deployment Guide

This guide will help you deploy the AI Context Blog System to production.

## 🚀 Deployment Options

### Frontend Deployment (Vercel - Recommended)

Vercel is the easiest way to deploy React applications.

#### Step 1: Prepare Frontend for Production

1. **Update API Base URL** for production:
   ```javascript
   // frontend/src/services/axiosInstance.js
   const axiosInstance = axios.create({
     baseURL: process.env.REACT_APP_API_URL || "https://your-backend-url.com/api",
     // ... rest of config
   });
   ```

2. **Create `.env.production`** file:
   ```
   REACT_APP_API_URL=https://your-backend-url.com/api
   ```

#### Step 2: Deploy to Vercel

1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from frontend directory**:
   ```bash
   cd frontend
   vercel
   ```

4. **Or use Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Set root directory to `frontend`
   - Add environment variable: `REACT_APP_API_URL=https://your-backend-url.com/api`
   - Click "Deploy"

#### Alternative: Deploy to Netlify

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Build the project**:
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod --dir=build
   ```

4. **Or use Netlify Dashboard**:
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `frontend/build` folder
   - Add environment variable: `REACT_APP_API_URL`

---

### Backend Deployment (Railway - Recommended)

Railway makes it easy to deploy Spring Boot applications.

#### Step 1: Prepare Backend for Production

1. **Update `application.properties`**:
   ```properties
   # Production Database (use Railway's MySQL or external)
   spring.datasource.url=${DATABASE_URL}
   spring.datasource.username=${DB_USERNAME}
   spring.datasource.password=${DB_PASSWORD}
   
   # JWT Secret (use environment variable)
   jwt.secret=${JWT_SECRET}
   
   # OpenAI API Key
   openai.api.key=${OPENAI_API_KEY}
   
   # CORS - Update with your frontend URL
   cors.allowed-origins=${FRONTEND_URL:https://your-frontend.vercel.app}
   ```

2. **Create `railway.json`** (optional):
   ```json
   {
     "$schema": "https://railway.app/railway.schema.json",
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "java -jar target/ai-context-blog-1.0.0.jar",
       "restartPolicyType": "ON_FAILURE",
       "restartPolicyMaxRetries": 10
     }
   }
   ```

#### Step 2: Deploy to Railway

1. **Install Railway CLI** (optional):
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Initialize Railway project**:
   ```bash
   cd backend
   railway init
   ```

4. **Add MySQL Database**:
   - In Railway dashboard, click "New" → "Database" → "MySQL"
   - Copy the connection URL

5. **Set Environment Variables**:
   ```bash
   railway variables set DATABASE_URL=your-mysql-connection-url
   railway variables set JWT_SECRET=your-secret-key
   railway variables set OPENAI_API_KEY=your-openai-key
   railway variables set FRONTEND_URL=https://your-frontend.vercel.app
   ```

6. **Deploy**:
   ```bash
   railway up
   ```

7. **Or use Railway Dashboard**:
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Connect your GitHub repository
   - Set root directory to `backend`
   - Add MySQL database
   - Add environment variables
   - Deploy

#### Alternative: Deploy to Render

1. **Create `render.yaml`** in backend directory:
   ```yaml
   services:
     - type: web
       name: ai-context-blog-backend
       env: java
       buildCommand: ./mvnw clean package -DskipTests
       startCommand: java -jar target/ai-context-blog-1.0.0.jar
       envVars:
         - key: DATABASE_URL
           sync: false
         - key: JWT_SECRET
           sync: false
         - key: OPENAI_API_KEY
           sync: false
         - key: FRONTEND_URL
           sync: false
   ```

2. **Deploy**:
   - Go to [render.com](https://render.com)
   - Connect your GitHub repository
   - Select "Web Service"
   - Set root directory to `backend`
   - Add environment variables
   - Deploy

---

## 🔧 Environment Variables

### Frontend (Vercel/Netlify)
```
REACT_APP_API_URL=https://your-backend-url.com/api
```

### Backend (Railway/Render)
```
DATABASE_URL=jdbc:mysql://host:port/database
DB_USERNAME=your-username
DB_PASSWORD=your-password
JWT_SECRET=your-secret-key-change-in-production
OPENAI_API_KEY=your-openai-api-key
FRONTEND_URL=https://your-frontend.vercel.app
```

---

## 📝 Post-Deployment Checklist

- [ ] Update CORS settings with production frontend URL
- [ ] Set strong JWT secret
- [ ] Configure production database
- [ ] Update API base URL in frontend
- [ ] Test all features in production
- [ ] Set up monitoring (optional)
- [ ] Configure custom domain (optional)
- [ ] Set up SSL/HTTPS (automatic with Vercel/Railway)

---

## 🐛 Troubleshooting

### Frontend Issues
- **CORS errors**: Check backend CORS configuration
- **API not connecting**: Verify `REACT_APP_API_URL` environment variable
- **Build fails**: Check for TypeScript/ESLint errors

### Backend Issues
- **Database connection**: Verify database credentials
- **Port issues**: Railway/Render assigns ports automatically
- **Build fails**: Check Java version (requires Java 17+)

---

## 🔒 Security Notes

1. **Never commit** `.env` files or secrets
2. **Use environment variables** for all sensitive data
3. **Enable HTTPS** (automatic with Vercel/Railway)
4. **Use strong JWT secret** in production
5. **Limit CORS** to your frontend domain only
6. **Use production database** (not local MySQL)

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [Netlify Documentation](https://docs.netlify.com)

---

**Happy Deploying! 🚀**

