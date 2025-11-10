# 🔒 Security Fix: API Key Exposure

## ⚠️ IMPORTANT: API Key Was Exposed

Your OpenRouter API key was exposed in a public GitHub repository and has been **disabled by OpenRouter**.

## ✅ Immediate Actions Taken

1. ✅ Added `application.properties` to `.gitignore` to prevent future exposure
2. ✅ Removed exposed API key from `application.properties`
3. ✅ Removed exposed database password from `application.properties`
4. ✅ Created `application.properties.example` template file
5. ✅ Replaced sensitive values with placeholders

## 🔧 Next Steps (REQUIRED)

### 1. Get a New OpenRouter API Key

1. Visit [https://openrouter.ai/keys](https://openrouter.ai/keys)
2. Log in to your account
3. Click "Create Key" to generate a new API key
4. Copy the new key (it will start with `sk-or-v1-`)

### 2. Update Your Local Configuration

1. Open `backend/src/main/resources/application.properties`
2. Replace `YOUR_OPENROUTER_API_KEY_HERE` with your new API key:
   ```properties
   openai.api.key=sk-or-v1-YOUR_NEW_KEY_HERE
   ```
3. Replace `YOUR_DB_USERNAME` with your database username
4. Replace `YOUR_DB_PASSWORD` with your database password
5. Replace `YOUR_JWT_SECRET_KEY_HERE` with a strong random secret

### 3. Remove Exposed Key from Git History

**⚠️ CRITICAL:** The exposed key is still in your Git history. You need to remove it:

#### Option A: Remove from Git History (Recommended)

```bash
# Navigate to your project directory
cd "C:\Users\Kalpak\OneDrive\Desktop\Programming\ContextSens"

# Remove application.properties from Git tracking
git rm --cached backend/src/main/resources/application.properties

# Commit the removal
git commit -m "Security: Remove exposed API key and sensitive data from repository"

# Force push to GitHub (WARNING: This rewrites history)
git push --force
```

#### Option B: Use BFG Repo-Cleaner (More Thorough)

1. Download BFG Repo-Cleaner: https://rtyley.github.io/bfg-repo-cleaner/
2. Run:
   ```bash
   java -jar bfg.jar --replace-text passwords.txt backend/src/main/resources/application.properties
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   git push --force
   ```

### 4. Verify .gitignore is Working

After updating your local `application.properties`, verify it's ignored:

```bash
git status
```

You should **NOT** see `application.properties` in the list of modified files.

### 5. Update GitHub Repository

1. Go to your repository: https://github.com/kalpakmanwar/ai-powered-intelligent-blogging-platform-
2. The exposed key should be removed from the current version
3. If it's still visible, you may need to contact GitHub support to remove it from history

## 🛡️ Security Best Practices Going Forward

### ✅ DO:
- ✅ Use environment variables for sensitive data
- ✅ Keep `application.properties` in `.gitignore`
- ✅ Use `application.properties.example` as a template
- ✅ Never commit API keys, passwords, or secrets
- ✅ Use different keys for development and production
- ✅ Rotate keys regularly

### ❌ DON'T:
- ❌ Commit `application.properties` with real credentials
- ❌ Share API keys in code, comments, or documentation
- ❌ Use the same key across multiple projects
- ❌ Store keys in plain text files

## 🔐 Alternative: Use Environment Variables

For better security, consider using environment variables:

### 1. Update `application.properties`:

```properties
# Use environment variables
openai.api.key=${OPENROUTER_API_KEY:YOUR_DEFAULT_KEY_HERE}
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:}
jwt.secret=${JWT_SECRET:your-secret-key}
```

### 2. Set Environment Variables:

**Windows (PowerShell):**
```powershell
$env:OPENROUTER_API_KEY="sk-or-v1-your-key-here"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your-password"
$env:JWT_SECRET="your-jwt-secret"
```

**Windows (CMD):**
```cmd
set OPENROUTER_API_KEY=sk-or-v1-your-key-here
set DB_USERNAME=root
set DB_PASSWORD=your-password
set JWT_SECRET=your-jwt-secret
```

**Linux/Mac:**
```bash
export OPENROUTER_API_KEY="sk-or-v1-your-key-here"
export DB_USERNAME="root"
export DB_PASSWORD="your-password"
export JWT_SECRET="your-jwt-secret"
```

## 📝 Checklist

- [ ] Get new OpenRouter API key from https://openrouter.ai/keys
- [ ] Update `application.properties` with new key
- [ ] Update database credentials in `application.properties`
- [ ] Update JWT secret in `application.properties`
- [ ] Remove exposed key from Git history
- [ ] Verify `.gitignore` is working
- [ ] Test the application with new credentials
- [ ] Restart backend server

## 🆘 Need Help?

If you need assistance:
- OpenRouter Support: support@openrouter.ai
- GitHub Support: https://support.github.com
- Check `API_KEY_TROUBLESHOOTING.md` for API key issues

---

**Remember:** Security is an ongoing process. Always be vigilant about protecting sensitive information!

