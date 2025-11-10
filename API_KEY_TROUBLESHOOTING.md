# API Key Troubleshooting Guide

## 🔑 Authentication Error

If you're seeing the error message:
> "I'm sorry, but there was an authentication error. Please check your API key in the backend configuration (application.properties)."

This means your OpenRouter API key is either:
- Invalid or expired
- Not properly configured
- Missing from the configuration file

## ✅ Quick Fix Steps

### 1. Check Your API Key Configuration

Open `backend/src/main/resources/application.properties` and verify:

```properties
# OpenRouter API Configuration
openai.api.key=YOUR_API_KEY_HERE
openai.api.base-url=https://openrouter.ai/api/v1
```

### 2. Get a New OpenRouter API Key

1. Visit [OpenRouter.ai](https://openrouter.ai/)
2. Sign up or log in to your account
3. Go to [Keys](https://openrouter.ai/keys) page
4. Click "Create Key"
5. Copy your new API key
6. Replace the key in `application.properties`

### 3. Verify Your API Key

Your OpenRouter API key should:
- Start with `sk-or-v1-`
- Be at least 50 characters long
- Not contain any spaces or line breaks

### 4. Restart the Backend Server

After updating the API key:
1. Stop the backend server (Ctrl+C)
2. Restart it:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

### 5. Check Backend Logs

Look for these log messages:
- ✅ `"API key configured successfully"` - Good!
- ❌ `"API key not configured"` - Key is missing or invalid
- ❌ `"Authentication error - API key might be invalid"` - Key is invalid

## 🔍 Common Issues

### Issue: API Key Not Found
**Solution:** Make sure the key is in `application.properties` (not `application-dev.properties`)

### Issue: API Key Expired
**Solution:** Generate a new key from OpenRouter dashboard

### Issue: Invalid API Key Format
**Solution:** Ensure the key starts with `sk-or-v1-` and has no extra spaces

### Issue: API Key Has No Credits
**Solution:** Add credits to your OpenRouter account

## 📝 Alternative: Use Environment Variable

Instead of hardcoding the API key, you can use an environment variable:

1. Set environment variable:
   ```bash
   # Windows (PowerShell)
   $env:OPENAI_API_KEY="your-api-key-here"
   
   # Windows (CMD)
   set OPENAI_API_KEY=your-api-key-here
   
   # Linux/Mac
   export OPENAI_API_KEY="your-api-key-here"
   ```

2. Update `application.properties`:
   ```properties
   openai.api.key=${OPENAI_API_KEY:your-fallback-key-here}
   ```

## 🆘 Still Having Issues?

1. **Check OpenRouter Dashboard:**
   - Verify your account is active
   - Check if you have credits/balance
   - Ensure the key hasn't been revoked

2. **Test API Key Manually:**
   ```bash
   curl https://openrouter.ai/api/v1/models \
     -H "Authorization: Bearer YOUR_API_KEY"
   ```

3. **Check Network Connection:**
   - Ensure you can access `openrouter.ai`
   - Check firewall/proxy settings

4. **Review Backend Logs:**
   - Look for detailed error messages
   - Check for network errors or timeouts

## 📞 Support

If you continue to experience issues:
- Check [OpenRouter Documentation](https://openrouter.ai/docs)
- Review backend logs for detailed error messages
- Ensure your internet connection is stable

---

**Note:** Never commit your API key to version control. Add `application.properties` to `.gitignore` if it contains sensitive keys.

