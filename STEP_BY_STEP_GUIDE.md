# Step-by-Step Setup Guide

## 🚀 Quick Start - Follow These Steps

### STEP 1: Install MySQL

**Windows:**
1. Download MySQL Installer from: https://dev.mysql.com/downloads/installer/
2. Run installer, choose "Developer Default"
3. Set root password (remember it!)
4. Complete installation

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Linux:**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

### STEP 2: Create MySQL Database

Open terminal/command prompt and run:
```bash
mysql -u root -p
```

Enter your MySQL root password, then:
```sql
CREATE DATABASE ai_context_blog;
EXIT;
```

### STEP 3: Configure Backend

1. Open file: `backend/src/main/resources/application.properties`
2. Find this line: `spring.datasource.password=root`
3. Change `root` to your MySQL password
4. Save the file

### STEP 4: Start Backend

Open terminal in project root:
```bash
cd backend
mvn spring-boot:run
```

Wait for: "Started AiContextBlogApplication" message
✅ Backend running on http://localhost:8080

### STEP 5: Start Frontend (New Terminal)

Open a NEW terminal window:
```bash
cd frontend
npm install
npm start
```

Wait for browser to open automatically
✅ Frontend running on http://localhost:3000

### STEP 6: Test the Application

1. Browser should open to http://localhost:3000
2. Click "Register" button
3. Create an account (username, email, password)
4. Click "Create Blog" button
5. Write a blog post
6. Click "Generate AI Insights" to see AI magic!
7. Click "Publish Blog"

## ✅ That's It! You're Done!

## 🔧 Optional: OpenAI API Key (For Better AI)

1. Get API key from: https://platform.openai.com/api-keys
2. Set environment variable:

**Windows (PowerShell):**
```powershell
$env:OPENAI_API_KEY="your-api-key-here"
```

**macOS/Linux:**
```bash
export OPENAI_API_KEY=your-api-key-here
```

3. Restart backend

## ❌ Troubleshooting

### Backend won't start - MySQL error?
- Check MySQL is running: `mysql -u root -p`
- Verify password in `application.properties`
- Make sure database exists: `SHOW DATABASES;`

### Frontend won't start?
- Make sure you ran `npm install` first
- Check if port 3000 is already in use
- Try: `npm start` again

### Can't connect to backend?
- Make sure backend is running (check terminal)
- Verify backend shows: "Started AiContextBlogApplication"
- Check http://localhost:8080 in browser

## 📝 Summary

1. ✅ Install MySQL
2. ✅ Create database: `ai_context_blog`
3. ✅ Update password in `application.properties`
4. ✅ Run backend: `cd backend && mvn spring-boot:run`
5. ✅ Run frontend: `cd frontend && npm install && npm start`
6. ✅ Open browser to http://localhost:3000
7. ✅ Register and create your first blog!

**That's all you need to do!**

