# JWT Authentication Setup

## Backend (Spring Security + JWT)

### Security Configuration
- **JWT Secret**: Configured in `application.properties` (change in production!)
- **Token Expiration**: 24 hours (86400000 ms)
- **Security Filter Chain**: 
  - JWT authentication filter runs before username/password filter
  - Stateless session management
  - CORS enabled for `http://localhost:3000`

### Protected Endpoints
- **Public Endpoints**:
  - `/api/auth/**` - Login and registration
  - `/api/blogs/analyze` - AI analysis (no auth required)
  - `/api/blogs` (GET) - List all blogs
  - `/api/blogs/{id}` (GET) - Get blog by ID
  - `/api/blogs/search` (GET) - Search blogs
  - `/api/blogs/{id}/comments` (GET) - Get comments
  - `/api/blogs/{id}/recommendations` (GET) - Get recommendations

- **Protected Endpoints** (require JWT token):
  - `/api/blogs` (POST) - Create blog
  - `/api/blogs/{id}/like` (POST) - Like/unlike blog
  - `/api/blogs/{id}/liked` (GET) - Check if liked
  - `/api/blogs/{id}/comments` (POST) - Add comment
  - `/api/blogs/user/my-blogs` (GET) - Get user's blogs

### JWT Token Flow
1. User registers/logs in via `/api/auth/register` or `/api/auth/login`
2. Backend validates credentials and generates JWT token
3. Token is returned in response with user data
4. Frontend stores token in localStorage
5. Token is sent in `Authorization: Bearer <token>` header for protected requests
6. JWT filter validates token on each request

## Frontend (React)

### Token Storage
- **localStorage**: Token and user data stored in browser localStorage
- **Axios Instance**: Token automatically added to all requests via interceptor
- **Auth Context**: Global state management for authentication

### Protected Routes
- **`/create`** - Protected (requires authentication)
  - Redirects to `/login` if not authenticated
  - Shows loading spinner while checking auth state

- **`/my-blogs`** - Protected (requires authentication)
  - Redirects to `/login` if not authenticated

- **`/` (Dashboard)** - Public (shows all blogs)
  - Anyone can view blogs

- **`/blog/:id`** - Public (anyone can read blogs)
  - Comments and likes require authentication

- **`/login`** and **`/register`** - Public
  - Redirects to `/` if already authenticated

### Authentication Flow
1. User enters credentials on login/register page
2. Frontend calls `/api/auth/login` or `/api/auth/register`
3. Response contains JWT token and user data
4. Token stored in localStorage
5. Token added to axios instance headers
6. Auth context updated with user data
7. User redirected to dashboard
8. Protected routes now accessible

### Logout Flow
1. User clicks logout button
2. Token removed from localStorage
3. Token removed from axios instance headers
4. Auth context cleared
5. User redirected to home page

### Token Refresh
- Currently, tokens expire after 24 hours
- On 401 response, user is automatically logged out and redirected to login
- Future enhancement: Implement token refresh mechanism

## Testing Authentication

### Test Login
```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

### Test Protected Endpoint
```bash
GET http://localhost:8080/api/blogs/user/my-blogs
Authorization: Bearer <your-jwt-token>
```

### Frontend Testing
1. Navigate to `/login`
2. Enter credentials
3. Should redirect to `/` (dashboard)
4. Try accessing `/create` - should work
5. Click logout
6. Try accessing `/create` - should redirect to `/login`

## Security Notes

⚠️ **Important for Production**:
1. Change JWT secret in `application.properties`
2. Use HTTPS in production
3. Implement token refresh mechanism
4. Add rate limiting for login/register endpoints
5. Consider adding refresh tokens
6. Store sensitive data in httpOnly cookies instead of localStorage (optional)

