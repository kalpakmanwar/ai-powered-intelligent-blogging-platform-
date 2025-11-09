# Run Backend Without Maven Command Line

## Option 1: Use IntelliJ IDEA (Recommended)

1. **Download IntelliJ IDEA Community** (Free):
   - https://www.jetbrains.com/idea/download/

2. **Open Project**:
   - Open IntelliJ IDEA
   - File → Open → Select `backend` folder
   - Wait for Maven to download dependencies (first time)

3. **Run Application**:
   - Find `AiContextBlogApplication.java` in project
   - Right-click → "Run 'AiContextBlogApplication'"
   - Or click the green play button next to the class

4. **Check Console**:
   - Look for "Started AiContextBlogApplication"
   - Backend running on http://localhost:8080

## Option 2: Use Eclipse

1. **Download Eclipse IDE**:
   - https://www.eclipse.org/downloads/
   - Choose "Eclipse IDE for Enterprise Java and Web Developers"

2. **Import Project**:
   - File → Import → Maven → Existing Maven Projects
   - Browse to `backend` folder
   - Click Finish

3. **Run Application**:
   - Right-click project → Run As → Spring Boot App

## Option 3: Use VS Code

1. **Install Extensions**:
   - Install "Extension Pack for Java"
   - Install "Spring Boot Extension Pack"

2. **Open Project**:
   - File → Open Folder → Select `backend` folder

3. **Run Application**:
   - Open `AiContextBlogApplication.java`
   - Click "Run" button above main method
   - Or press F5

## Option 4: Install Maven (Command Line)

See `INSTALL_MAVEN.md` for detailed instructions.

## Quick Test

Once backend is running:
- Open browser: http://localhost:8080/api/blogs
- Should see: `[]` (empty array) or JSON data

