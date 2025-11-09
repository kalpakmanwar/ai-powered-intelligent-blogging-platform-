# MySQL Database Setup Guide

## Prerequisites

- MySQL 8.0+ (or MySQL 5.7+) installed and running
- MySQL root access or a user with database creation privileges

## Setup Steps

### 1. Install MySQL

**Windows:**
- Download MySQL Installer from [mysql.com](https://dev.mysql.com/downloads/installer/)
- Run the installer and follow the setup wizard
- Remember your root password

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

### 2. Create Database

**Option 1: Using MySQL Command Line**
```bash
mysql -u root -p
```

Then run:
```sql
CREATE DATABASE IF NOT EXISTS ai_context_blog;
SHOW DATABASES;
EXIT;
```

**Option 2: Using MySQL Workbench**
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Create a new schema named `ai_context_blog`
4. Set default collation to `utf8mb4_unicode_ci`

### 3. Configure Application Properties

Edit `backend/src/main/resources/application.properties`:

```properties
# Update these values according to your MySQL setup
spring.datasource.url=jdbc:mysql://localhost:3306/ai_context_blog?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your-mysql-password
```

**Important:** Replace `your-mysql-password` with your actual MySQL root password.

### 4. Verify Connection

Run the Spring Boot application:
```bash
cd backend
mvn spring-boot:run
```

If the connection is successful, you'll see:
- Application starts without database errors
- Tables are created automatically
- You can see SQL logs in the console

### 5. Verify Tables Created

Connect to MySQL and check:
```sql
USE ai_context_blog;
SHOW TABLES;
```

You should see tables like:
- `users`
- `blogs`
- `comments`
- `likes`
- `blog_tags`

## Troubleshooting

### Connection Refused Error

**Problem:** `Communications link failure`

**Solutions:**
1. Make sure MySQL is running:
   ```bash
   # Windows
   net start MySQL80
   
   # macOS/Linux
   sudo systemctl start mysql
   # or
   brew services start mysql
   ```

2. Check MySQL port (default is 3306):
   ```bash
   # Windows
   netstat -an | findstr 3306
   
   # macOS/Linux
   netstat -an | grep 3306
   ```

### Access Denied Error

**Problem:** `Access denied for user 'root'@'localhost'`

**Solutions:**
1. Verify username and password in `application.properties`
2. Reset MySQL root password if needed
3. Create a new MySQL user:
   ```sql
   CREATE USER 'bloguser'@'localhost' IDENTIFIED BY 'your-password';
   GRANT ALL PRIVILEGES ON ai_context_blog.* TO 'bloguser'@'localhost';
   FLUSH PRIVILEGES;
   ```
   Then update `application.properties`:
   ```properties
   spring.datasource.username=bloguser
   spring.datasource.password=your-password
   ```

### Timezone Error

**Problem:** `The server time zone value 'XYZ' is unrecognized`

**Solution:** Add `serverTimezone=UTC` to the connection URL (already included in the config)

### SSL Connection Error

**Problem:** `SSL connection error`

**Solution:** The connection URL already includes `useSSL=false` for development. For production, configure SSL properly.

## Production Considerations

For production deployment:

1. **Use a dedicated database user:**
   ```sql
   CREATE USER 'blogapp'@'localhost' IDENTIFIED BY 'strong-password';
   GRANT SELECT, INSERT, UPDATE, DELETE ON ai_context_blog.* TO 'blogapp'@'localhost';
   FLUSH PRIVILEGES;
   ```

2. **Enable SSL:**
   - Update connection URL to use SSL
   - Configure SSL certificates

3. **Connection Pooling:**
   - Already configured with HikariCP
   - Adjust pool size in `application.properties` if needed

4. **Backup Strategy:**
   ```bash
   # Backup database
   mysqldump -u root -p ai_context_blog > backup.sql
   
   # Restore database
   mysql -u root -p ai_context_blog < backup.sql
   ```

## Using H2 for Development (Optional)

If you prefer H2 for quick development:

1. Use the dev profile:
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=dev
   ```

2. Or comment out MySQL config and uncomment H2 in `application.properties`

## Database Schema

The application automatically creates these tables:

- **users** - User accounts
- **blogs** - Blog posts
- **comments** - Comments on blogs
- **likes** - Likes on blogs
- **blog_tags** - Tags for blogs (collection table)

All relationships are managed by JPA/Hibernate automatically.

