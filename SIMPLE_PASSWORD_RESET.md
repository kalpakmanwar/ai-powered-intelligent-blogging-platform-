# Simple MySQL Password Reset

## Option 1: Try Common Passwords First

Before resetting, try these common passwords in MySQL Workbench:

1. **`root`** (most common default)
2. **`password`**
3. **`admin`**
4. **Leave it empty** (no password - just click OK)
5. **`123456`**
6. **Your Windows password**

Try each one in MySQL Workbench connection window.

## Option 2: Find MySQL Installer

**Method A: Search in Start Menu**
1. Press `Windows Key`
2. Type: `MySQL`
3. Look for "MySQL Installer - Community" or "MySQL Installer"

**Method B: Check Program Files**
1. Open File Explorer
2. Go to: `C:\Program Files\MySQL\`
3. Look for "MySQL Installer" folder
4. Open `MySQLInstaller.exe`

**Method C: Control Panel**
1. Press `Windows Key + R`
2. Type: `appwiz.cpl`
3. Press Enter
4. Look for "MySQL" in the list
5. Right-click → "Change" or "Modify"

## Option 3: Reset via Command Line (Easier Method)

### Step 1: Open Command Prompt as Admin
1. Press `Windows Key`
2. Type: `cmd`
3. Right-click "Command Prompt" → **Run as administrator**

### Step 2: Stop MySQL
```bash
net stop MySQL80
```
(If that doesn't work, try: `net stop MySQL`)

### Step 3: Start MySQL Without Password Check
```bash
cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
mysqld --skip-grant-tables --console
```

**Keep this window open!** Open a NEW command prompt window.

### Step 4: Connect Without Password (New Window)
Open another Command Prompt as Admin:
```bash
cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
mysql -u root
```

### Step 5: Reset Password
In the MySQL prompt, type:
```sql
USE mysql;
UPDATE user SET authentication_string=PASSWORD('newpassword123') WHERE User='root';
FLUSH PRIVILEGES;
EXIT;
```

### Step 6: Stop and Restart MySQL
1. Go back to first command prompt
2. Press `Ctrl+C` to stop MySQL
3. Close both windows
4. Start MySQL service:
```bash
net start MySQL80
```

### Step 7: Test New Password
```bash
mysql -u root -p
```
Enter: `newpassword123`

## Option 4: Just Use "root" as Password

If you're just testing/developing:

1. In `application.properties`, keep:
   ```properties
   spring.datasource.password=root
   ```

2. Try to start the backend:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

3. If it works, great! If not, you'll see the error and know the password is wrong.

## Option 5: Create New User (If You Can Access MySQL)

If you can somehow access MySQL (even with wrong password), create a new user:

1. Try connecting with empty password or "root"
2. If it works, run:
```sql
CREATE USER 'blogapp'@'localhost' IDENTIFIED BY 'simplepass123';
GRANT ALL PRIVILEGES ON ai_context_blog.* TO 'blogapp'@'localhost';
FLUSH PRIVILEGES;
```

3. Then in `application.properties`:
```properties
spring.datasource.username=blogapp
spring.datasource.password=simplepass123
```

## Quick Test

**Try this first:**
1. Open MySQL Workbench
2. Try connecting with password: `root`
3. If it works → use `root` in application.properties
4. If it doesn't work → try the reset methods above

