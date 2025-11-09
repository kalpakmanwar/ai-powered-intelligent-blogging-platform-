# Install Maven on Windows

## Quick Installation Steps

### Option 1: Using Chocolatey (Easiest)

1. **Install Chocolatey** (if not installed):
   - Open PowerShell as Administrator
   - Run: `Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))`

2. **Install Maven**:
   ```bash
   choco install maven
   ```

3. **Restart terminal** and try `mvn -version`

### Option 2: Manual Installation

1. **Download Maven**:
   - Go to: https://maven.apache.org/download.cgi
   - Download: `apache-maven-3.9.5-bin.zip` (or latest version)

2. **Extract**:
   - Extract to: `C:\Program Files\Apache\maven`

3. **Add to PATH**:
   - Press `Windows Key` → Type "Environment Variables"
   - Click "Edit the system environment variables"
   - Click "Environment Variables"
   - Under "System Variables", find "Path" → Click "Edit"
   - Click "New" → Add: `C:\Program Files\Apache\maven\bin`
   - Click "OK" on all windows

4. **Restart terminal** and test:
   ```bash
   mvn -version
   ```

### Option 3: Use IDE (Easiest for Development)

**IntelliJ IDEA:**
1. Open IntelliJ IDEA
2. File → Open → Select `backend` folder
3. Wait for Maven to sync
4. Right-click `AiContextBlogApplication.java` → Run

**Eclipse:**
1. Open Eclipse
2. File → Import → Maven → Existing Maven Projects
3. Select `backend` folder
4. Right-click project → Run As → Spring Boot App

**VS Code:**
1. Install "Extension Pack for Java"
2. Open `backend` folder
3. Open `AiContextBlogApplication.java`
4. Click "Run" button

## After Installing Maven

Run these commands:
```bash
cd backend
mvn spring-boot:run
```

