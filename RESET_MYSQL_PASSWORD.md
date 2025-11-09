# How to Reset MySQL Password (Windows)

## Method 1: Using MySQL Installer (Easiest)

### Step 1: Open MySQL Installer
1. Press `Windows Key + R`
2. Type: `appwiz.cpl` and press Enter
3. Find "MySQL" in the list
4. Click "Change" or "Modify"
5. Select "Reconfigure" option
6. Follow the wizard and set a new root password
7. Complete the reconfiguration

## Method 2: Using Command Line (If MySQL is running)

### Step 1: Stop MySQL Service
1. Press `Windows Key + R`
2. Type: `services.msc` and press Enter
3. Find "MySQL80" (or "MySQL")
4. Right-click → **Stop**

### Step 2: Start MySQL in Safe Mode
Open Command Prompt as Administrator:
1. Press `Windows Key`
2. Type: `cmd`
3. Right-click "Command Prompt" → **Run as administrator**

Then run:
```bash
cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
mysqld --init-file=C:\mysql-init.txt
```

### Step 3: Create Password Reset File
1. Open Notepad as Administrator
2. Create a new file
3. Type this (replace `NEW_PASSWORD` with your new password):
```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'NEW_PASSWORD';
```
4. Save as: `C:\mysql-init.txt`

### Step 4: Start MySQL with Reset File
In the admin command prompt:
```bash
cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
mysqld --init-file=C:\mysql-init.txt
```

Wait a few seconds, then press `Ctrl+C` to stop it.

### Step 5: Start MySQL Normally
1. Go back to Services (`services.msc`)
2. Find "MySQL80"
3. Right-click → **Start**

### Step 6: Test New Password
```bash
mysql -u root -p
```
Enter your new password.

## Method 3: Quick Reset (If you have access)

### Step 1: Open MySQL Workbench
1. Try to connect
2. If it connects, you can reset password there:
   - Go to Server → Users and Privileges
   - Find "root" user
   - Click "Change Password"
   - Set new password
   - Click "Apply"

## Method 4: Reinstall MySQL (Last Resort)

If nothing works:
1. Uninstall MySQL completely
2. Delete MySQL data folder (usually `C:\ProgramData\MySQL`)
3. Reinstall MySQL
4. Set a new password during installation
5. **Remember to write it down this time!**

## After Resetting Password

1. Update `application.properties`:
   ```properties
   spring.datasource.password=YOUR_NEW_PASSWORD
   ```

2. Test connection in MySQL Workbench with new password

3. Start your backend application

## Quick Alternative: Use a New MySQL User

If resetting is too complicated, create a new user:

1. If you can access MySQL somehow, run:
```sql
CREATE USER 'bloguser'@'localhost' IDENTIFIED BY 'simplepassword123';
GRANT ALL PRIVILEGES ON ai_context_blog.* TO 'bloguser'@'localhost';
FLUSH PRIVILEGES;
```

2. Then in `application.properties`:
```properties
spring.datasource.username=bloguser
spring.datasource.password=simplepassword123
```

