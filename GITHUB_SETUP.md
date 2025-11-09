# GitHub Repository Setup Guide

This guide will help you push your **AI-Powered Intelligent Blogging and Content Analysis Platform** to GitHub.

## 📋 Prerequisites

- Git installed on your system
- GitHub account created
- Project files ready

## 🚀 Step-by-Step Instructions

### Step 1: Initialize Git Repository (if not already done)

```bash
cd "C:\Users\Kalpak\OneDrive\Desktop\Programming\ContextSens"
git init
```

### Step 2: Add All Files

```bash
git add .
```

### Step 3: Create Initial Commit

```bash
git commit -m "Initial commit: AI-Powered Intelligent Blogging and Content Analysis Platform"
```

### Step 4: Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click the **"+"** icon in the top right
3. Select **"New repository"**
4. Repository name: `ai-powered-intelligent-blogging-platform` (or your preferred name)
5. Description: `AI-Powered Intelligent Blogging and Content Analysis Platform - Full-stack intelligent blogging system with AI-powered context analysis`
6. Choose **Public** or **Private**
7. **DO NOT** initialize with README, .gitignore, or license (we already have these)
8. Click **"Create repository"**

### Step 5: Add Remote Repository

```bash
git remote add origin https://github.com/YOUR_USERNAME/ai-powered-intelligent-blogging-platform.git
```

Replace `YOUR_USERNAME` with your GitHub username.

### Step 6: Push to GitHub

```bash
git branch -M main
git push -u origin main
```

If prompted for credentials:
- Username: Your GitHub username
- Password: Use a **Personal Access Token** (not your GitHub password)

### Step 7: Create Personal Access Token (if needed)

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **"Generate new token"**
3. Give it a name (e.g., "Project Access")
4. Select scopes: `repo` (full control of private repositories)
5. Click **"Generate token"**
6. **Copy the token** (you won't see it again!)
7. Use this token as your password when pushing

## 📝 Complete Commands (Copy-Paste Ready)

```bash
# Navigate to project directory
cd "C:\Users\Kalpak\OneDrive\Desktop\Programming\ContextSens"

# Initialize git (if not done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: AI-Powered Intelligent Blogging and Content Analysis Platform"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/ai-powered-intelligent-blogging-platform.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

## 🎨 After Pushing - Enhance Your Repository

### 1. Add Repository Description
- Go to your repository on GitHub
- Click **"Edit"** next to the description
- Add: `AI-Powered Intelligent Blogging and Content Analysis Platform - Full-stack intelligent blogging system with AI-powered context analysis`

### 2. Add Topics/Tags
- Click the gear icon next to "About"
- Add topics: `ai`, `blogging`, `spring-boot`, `react`, `java`, `javascript`, `full-stack`, `machine-learning`, `openai`, `tailwindcss`

### 3. Add Repository Website (after deployment)
- Go to repository settings
- Scroll to "GitHub Pages" or "Website"
- Add your deployed URL

### 4. Pin Repository (Optional)
- Go to your GitHub profile
- Click "Customize your pins"
- Pin this repository

## 📸 Add Screenshots

1. Create a `screenshots/` folder
2. Add screenshots of your application
3. Update `SCREENSHOTS.md` with actual image paths
4. Commit and push:
   ```bash
   git add screenshots/
   git commit -m "Add project screenshots"
   git push
   ```

## 🔒 Security Notes

Before pushing, make sure:
- ✅ `.env` files are in `.gitignore`
- ✅ API keys are not in code
- ✅ Database passwords are not committed
- ✅ `application.properties` doesn't contain real credentials

## 📚 Repository Structure

Your repository should have:
```
ai-powered-intelligent-blogging-platform/
├── backend/          # Spring Boot backend
├── frontend/         # React frontend
├── .github/          # GitHub Actions workflows
├── README.md         # Main documentation
├── DEPLOYMENT.md     # Deployment guide
├── TESTING.md        # Testing guide
├── SCREENSHOTS.md    # Screenshots template
└── .gitignore        # Git ignore file
```

## ✅ Verification Checklist

- [ ] Git repository initialized
- [ ] All files added and committed
- [ ] GitHub repository created
- [ ] Remote added correctly
- [ ] Code pushed successfully
- [ ] Repository description added
- [ ] Topics/tags added
- [ ] README displays correctly
- [ ] No sensitive data committed

## 🎉 Success!

Your project is now on GitHub! Share the repository URL with HR/recruiters.

**Repository URL Format:**
```
https://github.com/YOUR_USERNAME/ai-powered-intelligent-blogging-platform
```

---

**Need Help?** Check GitHub's documentation or open an issue.

