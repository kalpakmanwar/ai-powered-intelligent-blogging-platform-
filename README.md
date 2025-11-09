# AI-Powered Intelligent Blogging and Content Analysis Platform

A full-stack intelligent blogging web application that analyzes blog context using AI. Built with Java Spring Boot backend and React frontend.

## 🎬 Live Demo

🚀 **Coming Soon** - Deploy to Vercel (Frontend) + Railway (Backend)

📸 **Screenshots** - See [SCREENSHOTS.md](./SCREENSHOTS.md) for UI previews

## 🎯 Features

- 🔐 **JWT Authentication** - Secure user registration and login
- ✍️ **Blog Management** - Create, view, and manage blog posts
- 🤖 **AI-Powered Analysis** - Automatic tag generation and summary creation using OpenAI
- 🔍 **Smart Search** - Search blogs by title, content, or tags
- 💬 **Interactions** - Like and comment on blog posts
- 📊 **AI Recommendations** - AI-powered blog recommendations based on content context
- 🏷️ **Trending Tags** - Discover popular tags across all blogs
- 🌓 **Dark/Light Theme** - Toggle between dark and light modes
- 📱 **Responsive Design** - Modern, mobile-friendly UI with Tailwind CSS
- 👨‍💼 **Admin Panel** - Manage blogs, users, and view statistics
- 📸 **Image to Summary** - Upload images and get AI-powered detailed summaries
- 💬 **AI Problem Solver** - Interactive AI chat for solving technical problems
- 🎨 **Modern UI/UX** - Beautiful gradient designs with smooth animations

## 🏗️ Project Structure

```
ai-context-blog/
├── backend/
│   ├── src/main/java/com/contextblog/
│   │   ├── controller/     # REST controllers
│   │   ├── model/          # Entity models and DTOs
│   │   ├── repository/     # JPA repositories
│   │   ├── service/        # Business logic
│   │   ├── security/       # JWT and security config
│   │   └── AiContextBlogApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
└── frontend/
    ├── src/
    │   ├── components/     # React components
    │   ├── pages/         # Page components
    │   ├── context/       # React context (Auth, Theme)
    │   ├── services/      # API services
    │   ├── App.js
    │   └── index.js
    ├── package.json
    └── tailwind.config.js
```

## 📋 Prerequisites

- **Java 17** or higher
- **Maven 3.6+**
- **Node.js 16+** and npm
- **MySQL 8.0+** (or MySQL 5.7+)
- **OpenAI API Key** (optional, for AI features)

## 🚀 Setup Instructions

### Backend Setup

1. **Set up MySQL Database:**
   ```sql
   -- Create database (if it doesn't exist)
   CREATE DATABASE IF NOT EXISTS ai_context_blog;
   
   -- Or use MySQL command line:
   mysql -u root -p
   CREATE DATABASE ai_context_blog;
   ```

2. **Configure Database Connection:**
   - Open `backend/src/main/resources/application.properties`
   - Update MySQL credentials if needed:
     ```properties
     spring.datasource.username=root
     spring.datasource.password=your-mysql-password
     spring.datasource.url=jdbc:mysql://localhost:3306/ai_context_blog?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
     ```

3. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

4. **Configure OpenAI API Key (optional):**
   - Set environment variable: `export OPENAI_API_KEY=your-api-key-here`
   - Or update `application.properties` with your API key
   - Note: If no API key is provided, the system will use fallback methods for tags and summaries

5. **Build and run the Spring Boot application:**
   ```bash
   mvn spring-boot:run
   ```

   The backend will start on `http://localhost:8080`
   - The database will be created automatically if it doesn't exist
   - Tables will be created automatically on first run

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

   The frontend will start on `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Blogs
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/{id}` - Get blog by ID
- `POST /api/blogs` - Create a new blog (requires auth)
- `GET /api/blogs/search?keyword={keyword}` - Search blogs
- `GET /api/blogs/{id}/recommendations` - Get recommended blogs
- `GET /api/blogs/{id}/ai-recommendations` - Get AI-based recommendations
- `GET /api/blogs/trending-tags` - Get trending tags
- `GET /api/blogs/user/my-blogs` - Get user's blogs (requires auth)

### AI Analysis
- `POST /api/blogs/analyze` - Analyze blog content (generates summary, tags, related blogs)

### Interactions
- `POST /api/blogs/{id}/like` - Toggle like on blog (requires auth)
- `GET /api/blogs/{id}/liked` - Check if blog is liked (requires auth)
- `POST /api/blogs/{id}/comments` - Add comment (requires auth)
- `GET /api/blogs/{id}/comments` - Get blog comments

## 🎨 UI Features

### Tailwind CSS Cards
- Modern card designs with hover effects
- Gradient backgrounds
- Smooth animations and transitions
- Responsive grid layouts

### Dark/Light Theme
- Toggle button in navbar
- Theme preference saved in localStorage
- Smooth transitions between themes
- All components support both themes

### Loading Animations
- Spinner animations for data loading
- Skeleton loaders for AI content generation
- Smooth transitions and fade effects

## 🔧 Configuration

### Backend Configuration (`application.properties`)

```properties
# Server
server.port=8080

# Database (MySQL)
spring.datasource.url=jdbc:mysql://localhost:3306/ai_context_blog?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your-mysql-password
spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver

# JPA
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=update

# JWT
jwt.secret=your-secret-key-change-this-in-production
jwt.expiration=86400000

# OpenAI API
openai.api.key=${OPENAI_API_KEY:your-openai-api-key-here}

# CORS
cors.allowed-origins=http://localhost:3000
```

**Note:** For development with H2 database, use the `dev` profile:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Frontend Configuration

- **API Base URL**: Configured in `src/services/axiosInstance.js` (default: `http://localhost:8080/api`)
- **Theme**: Automatically saved in localStorage

## 💡 Usage

1. **Register/Login**: Create an account or login to access all features
2. **Create Blog**: Write a blog post - AI will automatically generate tags and summary
3. **Browse**: View all blogs on the dashboard
4. **Search**: Use the search bar or click trending tags to find blogs
5. **Interact**: Like and comment on blog posts
6. **Recommendations**: View AI-recommended similar blogs on blog detail pages
7. **My Blogs**: Manage your own blog posts
8. **Admin Panel**: View statistics and manage content (if you have admin access)
9. **Theme Toggle**: Switch between dark and light modes using the button in navbar

## 🛠️ Technologies Used

### Backend
- **Spring Boot 3.1.5** - Enterprise Java framework
- **Spring Security** - JWT-based authentication & authorization
- **Spring Data JPA** - Database ORM and repository pattern
- **MySQL 8.0+** - Relational database
- **OpenRouter API** - AI integration (GPT-4, Gemini, Claude)
- **Lombok** - Boilerplate code reduction
- **Maven** - Dependency management & build tool

### Frontend
- **React 18** - Modern UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **Context API** - State management (Auth, Theme)
- **PostCSS & Autoprefixer** - CSS processing

### AI & APIs
- **OpenRouter** - Multi-model AI API gateway
- **GPT-4 Vision** - Image analysis
- **Gemini 2.0** - Text generation
- **Claude 3.5** - Advanced reasoning

## 📝 Notes

- The AI service uses OpenAI GPT-3.5-turbo for generating summaries and tags
- If OpenAI API key is not configured, the system falls back to simple keyword extraction
- JWT tokens expire after 24 hours (configurable in `application.properties`)
- The application uses MySQL database by default
- For development with H2, use the `dev` profile: `mvn spring-boot:run -Dspring-boot.run.profiles=dev`
- Database tables are created automatically on first run (`spring.jpa.hibernate.ddl-auto=update`)

## 🔐 Security Notes

⚠️ **Important for Production**:
1. Change JWT secret in `application.properties`
2. Use HTTPS in production
3. Implement token refresh mechanism
4. Add rate limiting for login/register endpoints
5. Store sensitive data in httpOnly cookies instead of localStorage (optional)
6. Use a dedicated database user with limited privileges (not root)
7. Enable SSL for MySQL connections in production
8. Regular database backups

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy

**Frontend (Vercel):**
```bash
cd frontend
vercel deploy
```

**Backend (Railway):**
```bash
cd backend
railway up
```

### Environment Variables

See [DEPLOYMENT.md](./DEPLOYMENT.md) for required environment variables.

## 🧪 Testing

See [TESTING.md](./TESTING.md) for testing guide.

### Run Tests

**Backend:**
```bash
cd backend
mvn test
```

**Frontend:**
```bash
cd frontend
npm test
```

## 📚 Future Enhancements

- ✅ Image to Summary (Implemented)
- ✅ AI Problem Solver (Implemented)
- 🔄 User profiles and avatars
- 🔄 Rich text editor for blog content
- 🔄 Advanced recommendation algorithms
- 🔄 Email notifications
- 🔄 Real-time notifications
- 🔄 Social sharing features

## 📄 License

This project is open source and available for educational purposes.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues or questions, please open an issue on the repository.

---

**Built with ❤️ using Spring Boot and React**
