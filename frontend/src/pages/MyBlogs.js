import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import BlogCard from '../components/BlogCard';

function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  const fetchMyBlogs = async () => {
    try {
      const response = await api.get('/blogs/user/my-blogs');
      // Ensure response.data is an array
      if (Array.isArray(response.data)) {
        setBlogs(response.data);
      } else {
        console.error('Invalid response format:', response.data);
        setBlogs([]);
      }
    } catch (error) {
      console.error('Error fetching my blogs:', error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400 mx-auto mb-4"></div>
          <p className="text-xl text-white font-light">Loading your blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            My Blogs
          </h1>
          <Link to="/create" className="btn-primary">
            Create New Blog
          </Link>
        </div>

        {!Array.isArray(blogs) || blogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-3xl shadow-2xl border border-blue-500/30">
              <svg className="w-24 h-24 text-white mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-2xl font-bold text-white mb-2">No blogs yet</h3>
              <p className="text-white mb-6 font-light">Start sharing your thoughts with the world!</p>
              <Link to="/create" className="btn-primary">
                Create Your First Blog
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(blogs) && blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBlogs;
