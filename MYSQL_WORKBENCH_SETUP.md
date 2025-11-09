# MySQL Workbench Setup Guide

## Step-by-Step Instructions

### STEP 1: Open MySQL Workbench

1. Open MySQL Workbench application
2. You'll see a list of connections
3. Double-click on your local MySQL connection (usually named "Local instance MySQL80" or similar)
4. Enter your MySQL root password when prompted
5. Click "OK"

### STEP 2: Create Database

Once connected, you'll see the SQL editor. Follow these steps:

1. **In the left sidebar**, right-click in the "Schemas" area
2. Click **"Create Schema..."**
3. In the popup window:
   - **Schema Name:** Type `ai_context_blog`
   - **Default Collation:** Select `utf8mb4_unicode_ci` (or leave default)
4. Click **"Apply"** button
5. Click **"Finish"** button

**OR** you can use SQL directly:

1. Click on the SQL editor tab (or open a new query tab)
2. Type this SQL:
   ```sql
   CREATE DATABASE IF NOT EXISTS ai_context_blog;
   ```
3. Click the **Execute** button (lightning bolt icon) or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)
4. You should see "Success" message

### STEP 3: Verify Database Created

1. In the left sidebar under "Schemas"
2. Click the refresh icon (circular arrow)
3. You should see `ai_context_blog` database listed
4. ✅ Database is ready!

### STEP 4: Update application.properties

1. Open: `backend/src/main/resources/application.properties`
2. Find: `spring.datasource.password=root`
3. Change `root` to your MySQL root password
4. Save the file

### STEP 5: Start the Application

The application will automatically:
- Connect to the database
- Create all tables automatically
- Set up everything for you

**That's it!** You're ready to run the backend.

## Quick SQL Commands (Optional)

If you want to verify or manage the database later:

```sql
-- Show all databases
SHOW DATABASES;

-- Use the database
USE ai_context_blog;

-- Show all tables
SHOW TABLES;

-- See table structure
DESCRIBE users;
DESCRIBE blogs;
```

## Troubleshooting

**Can't connect to MySQL?**
- Make sure MySQL service is running
- Check your root password
- Verify MySQL is installed correctly

**Database already exists?**
- That's fine! The application will use it
- Or you can drop it: `DROP DATABASE ai_context_blog;` then create again

**Connection refused?**
- Start MySQL service:
  - Windows: Services → MySQL80 → Start
  - macOS: `brew services start mysql`
  - Linux: `sudo systemctl start mysql`

