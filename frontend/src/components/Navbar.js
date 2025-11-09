import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-900/90 backdrop-blur-sm shadow-xl sticky top-0 z-50 border-b border-gray-700/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              AI Blog Platform
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/ai-solver"
                  className="px-4 py-2 text-white hover:text-blue-400 font-medium transition-colors"
                >
                  AI Solver
                </Link>
                <Link
                  to="/create"
                  className="px-4 py-2 text-white hover:text-blue-400 font-medium transition-colors"
                >
                  Create Blog
                </Link>
                <Link
                  to="/rich-content"
                  className="px-4 py-2 text-white hover:text-blue-400 font-medium transition-colors"
                >
                  Image to Summary
                </Link>
                <Link
                  to="/my-blogs"
                  className="px-4 py-2 text-white hover:text-blue-400 font-medium transition-colors"
                >
                  My Blogs
                </Link>
                <Link
                  to="/admin"
                  className="px-4 py-2 text-white hover:text-blue-400 font-medium transition-colors"
                >
                  Admin
                </Link>
                <div className="flex items-center gap-3 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white font-medium">{user?.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-800/50 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors border border-gray-700/50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-white hover:text-blue-400 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
