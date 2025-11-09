import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateBlog from './pages/CreateBlog';
import BlogDetails from './pages/BlogDetails';
import MyBlogs from './pages/MyBlogs';
import AdminPanel from './pages/AdminPanel';
import AIProblemSolver from './pages/AIProblemSolver';
import RichContentCreation from './pages/RichContentCreation';
import SocialFeatures from './pages/SocialFeatures';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400 mx-auto mb-4"></div>
          <p className="text-xl text-white300 font-light">Loading...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/ai-solver" replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={isAuthenticated ? <Navigate to="/ai-solver" replace /> : <Register />} 
      />
      <Route path="/" element={<Dashboard />} />
      <Route path="/blog/:id" element={<BlogDetails />} />
      <Route 
        path="/ai-solver" 
        element={
          <PrivateRoute>
            <AIProblemSolver />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/create" 
        element={
          <PrivateRoute>
            <CreateBlog />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/my-blogs" 
        element={
          <PrivateRoute>
            <MyBlogs />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <PrivateRoute>
            <AdminPanel />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/rich-content" 
        element={<RichContentCreation />} 
      />
      <Route 
        path="/social-features" 
        element={<SocialFeatures />} 
      />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
            <Navbar />
            <div className="flex-grow">
              <AppRoutes />
            </div>
            <footer className="bg-gray-900/90 backdrop-blur-sm border-t border-gray-700/50 text-white py-6 mt-auto">
              <div className="max-w-7xl mx-auto px-4 text-center">
                <p className="text-sm font-light text-white">
                  <span className="font-semibold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Kalpak Manwar</span>
                  {' | '}
                  Email: <a href="mailto:kalpakm11@gmail.com" className="hover:text-blue-400 transition-colors">kalpakm11@gmail.com</a>
                  {' | '}
                  Contact No.: <a href="tel:8767309823" className="hover:text-blue-400 transition-colors">8767309823</a>
                </p>
                <p className="text-xs text-white500 mt-2 font-light">
                  Powered by OpenRouter AI
                </p>
              </div>
            </footer>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

