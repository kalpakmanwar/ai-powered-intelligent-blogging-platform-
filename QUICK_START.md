# Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Java 17+ installed (`java -version`)
- ✅ Maven 3.6+ installed (`mvn -version`)
- ✅ MySQL 8.0+ installed and running (`mysql --version`)
- ✅ Node.js 16+ and npm installed (`node -v` and `npm -v`)

## Step-by-Step Setup

### 1. MySQL Database Setup

**Start MySQL:**
```bash
# Windows
net start MySQL80

# macOS
brew services start mysql

# Linux
sudo systemctl start mysql
```

**Create Database:**
```bash
mysql -u root -p
```

Then in MySQL:
```sql
CREATE DATABASE IF NOT EXISTS ai_context_blog;
EXIT;
```

### 2. Backend Configuration

**Edit `backend/src/main/resources/application.properties`:**
```properties
# Update MySQL password
spring.datasource.password=your-mysql-password
```

**Optional: Set OpenAI API Key:**
```bash
# Windows (PowerShell)
$env:OPENAI_API_KEY="your-api-key-here"

# macOS/Linux
export OPENAI_API_KEY=your-api-key-here
```

### 3. Start Backend

```bash
cd backend
mvn spring-boot:run
```

✅ Backend should start on `http://localhost:8080`
✅ Database tables will be created automatically

### 4. Start Frontend

```bash
cd frontend
npm install
npm start
```

✅ Frontend should start on `http://localhost:3000`

### 5. Test the Application

1. Open `http://localhost:3000` in your browser
2. Register a new account
3. Create a blog post
4. See AI-generated summary and tags!

## Troubleshooting

### MySQL Connection Issues

**Error: "Access denied for user 'root'@'localhost'"**
- Check password in `application.properties`
- Verify MySQL is running
- Try resetting MySQL password

**Error: "Unknown database 'ai_context_blog'"**
- Create database manually: `CREATE DATABASE ai_context_blog;`
- Or the connection URL will create it automatically

### Port Already in Use

**Backend (8080):**
```bash
# Find process
netstat -ano | findstr :8080  # Windows
lsof -i :8080                 # macOS/Linux

# Kill process or change port in application.properties
```

**Frontend (3000):**
```bash
# Find process
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # macOS/Linux

# Kill process or change port
```

## Using H2 for Quick Testing (Optional)

If you want to skip MySQL setup for quick testing:

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

This uses H2 in-memory database (data resets on restart).

## Next Steps

- See `README.md` for full documentation
- See `DATABASE_SETUP.md` for detailed MySQL setup
- See `AUTHENTICATION_SETUP.md` for JWT details

