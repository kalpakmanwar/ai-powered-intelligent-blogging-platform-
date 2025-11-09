# How to Start the Project

## Prerequisites
- ✅ Java 17 installed (you have it!)
- ✅ MySQL running with database `ai_context_blog` created
- ✅ MySQL password set in `backend/src/main/resources/application.properties`

## Step 1: Start the Backend

### Option A: Using the Batch Script (Easiest)
1. Open a **new terminal/command prompt**
2. Navigate to the backend folder:
   ```
   cd backend
   ```
3. Run the startup script:
   ```
   start-backend.bat
   ```

### Option B: Using PowerShell
1. Open PowerShell
2. Navigate to the backend folder:
   ```
   cd backend
   ```
3. Run:
   ```
   .\start-backend.ps1
   ```

### Option C: Manual (if scripts don't work)
1. Open a terminal in the `backend` folder
2. Set JAVA_HOME:
   ```powershell
   $env:JAVA_HOME = "C:\Program Files\Java\jdk-17.0.2"
   ```
3. Run Maven:
   ```
   .\mvnw.cmd spring-boot:run
   ```

**Wait for:** `Started AiContextBlogApplication` message (takes 1-2 minutes)

The backend will run on: **http://localhost:8080**

---

## Step 2: Start the Frontend

1. Open a **NEW terminal/command prompt** (keep backend running!)
2. Navigate to the frontend folder:
   ```
   cd frontend
   ```
3. Start the React app:
   ```
   npm start
   ```

**Wait for:** Browser to automatically open at **http://localhost:3000**

---

## Step 3: Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080

---

## Troubleshooting

### Backend won't start
- Check if MySQL is running
- Verify MySQL password in `backend/src/main/resources/application.properties`
- Make sure port 8080 is not in use

### Frontend won't start
- Make sure you're in the `frontend` folder
- Try: `npm install` again
- Check if port 3000 is not in use

### Connection Refused
- Make sure backend is running first
- Wait 1-2 minutes for backend to fully start
- Check backend terminal for errors

---

## Quick Commands Summary

**Terminal 1 (Backend):**
```powershell
cd backend
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17.0.2"
.\mvnw.cmd spring-boot:run
```

**Terminal 2 (Frontend):**
```powershell
cd frontend
npm start
```

