# How to Run the Application

## Prerequisites
1. **Java 17** - Make sure Java 17 is installed
2. **MySQL** - MySQL server should be running
3. **Node.js** - Node.js and npm should be installed
4. **MySQL Database** - Database `ai_context_blog` should exist (or will be created automatically)

## Step 1: Start MySQL Database
Make sure MySQL is running on `localhost:3306` with:
- Username: `root`
- Password: `kalpak` (as configured in `application.properties`)

If your MySQL password is different, update it in:
```
backend/src/main/resources/application.properties
Line 9: spring.datasource.password=your-password
```

## Step 2: Start the Backend (Spring Boot)

### Option A: Using the Batch Script (Windows - Recommended)
1. Open Command Prompt or PowerShell
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Run the startup script:
   ```bash
   start-backend.bat
   ```

### Option B: Using Maven Wrapper (Windows/Linux/Mac)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Run Maven:
   ```bash
   .\mvnw.cmd spring-boot:run
   ```
   (On Linux/Mac: `./mvnw spring-boot:run`)

### Option C: Using Maven (if installed)
```bash
cd backend
mvn spring-boot:run
```

**Wait for:** You should see:
```
Started AiContextBlogApplication in X.XXX seconds
Tomcat started on port(s): 8080 (http)
```

The backend will be running at: **http://localhost:8080**

## Step 3: Start the Frontend (React)

1. Open a **NEW** terminal/command prompt window
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies (only needed first time or after changes):
   ```bash
   npm install
   ```
4. Start the React development server:
   ```bash
   npm start
   ```

**Wait for:** The browser should automatically open to:
**http://localhost:3000**

If it doesn't open automatically, manually navigate to `http://localhost:3000`

## Step 4: Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080/api

## Troubleshooting

### Backend Issues:

1. **Port 8080 already in use:**
   ```bash
   # Windows - Find process using port 8080
   netstat -ano | findstr :8080
   # Kill the process (replace PID with actual process ID)
   taskkill /F /PID <PID>
   ```

2. **JAVA_HOME not found:**
   - Make sure Java 17 is installed
   - Update `start-backend.bat` with your Java path:
     ```batch
     set "JAVA_HOME=C:\Program Files\Java\jdk-17.0.2"
     ```

3. **Database connection error:**
   - Check MySQL is running
   - Verify password in `application.properties`
   - Make sure database `ai_context_blog` exists or can be created

### Frontend Issues:

1. **Port 3000 already in use:**
   - The terminal will ask if you want to use a different port
   - Type `Y` to use port 3001

2. **Module not found errors:**
   ```bash
   cd frontend
   rm -rf node_modules
   npm install
   ```

3. **npm start fails:**
   - Make sure you're in the `frontend` directory
   - Try deleting `node_modules` and `package-lock.json`, then run `npm install` again

## Quick Start Commands Summary

### Terminal 1 (Backend):
```bash
cd backend
start-backend.bat
```

### Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

## New Features Added

After starting the application, you'll have access to:

1. **AI Blog Writer Assistant** - Auto-suggestions while typing in Create Blog page
2. **Follow System** - Follow other users from blog detail pages
3. **Bookmark System** - Bookmark blogs for later reading
4. **Trending Blogs** - See most engaging blogs on the Dashboard
5. **Tag Cloud** - Visual tag cloud on Dashboard
6. **Enhanced Admin Panel** - Detailed analytics with charts

## First Time Setup

1. **Create a user account:**
   - Go to http://localhost:3000/register
   - Register with username, email, and password

2. **Login:**
   - Go to http://localhost:3000/login
   - Login with your credentials

3. **Create your first blog:**
   - Click "Create Blog" in the navbar
   - Write your content (AI suggestions will appear as you type!)
   - Click "Generate AI Insights" to get AI-generated summary and tags
   - Publish your blog

Enjoy your AI-powered blog platform! 🚀

