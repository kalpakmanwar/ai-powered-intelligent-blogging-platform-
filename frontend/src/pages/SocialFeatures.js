import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

/**
 * Social Features Page - Unique Interactive Design
 * Features:
 * - Interactive social stats
 * - Blog discovery with filters
 * - Social interaction showcase
 * - Dark theme with modern gradients
 */
function SocialFeatures() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await api.get('/blogs');
      if (Array.isArray(response.data)) {
        setBlogs(response.data);
      } else {
        setBlogs([]);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const socialFeatures = [
    {
      id: 'like',
      icon: '❤️',
      title: 'Like',
      description: 'Show appreciation',
      color: 'from-red-500 to-pink-500',
      count: blogs.reduce((sum, blog) => sum + (blog.likeCount || 0), 0)
    },
    {
      id: 'comment',
      icon: '💬',
      title: 'Comment',
      description: 'Share thoughts',
      color: 'from-blue-500 to-cyan-500',
      count: blogs.reduce((sum, blog) => sum + (blog.commentCount || 0), 0)
    },
    {
      id: 'follow',
      icon: '👥',
      title: 'Follow',
      description: 'Stay updated',
      color: 'from-purple-500 to-indigo-500',
      count: blogs.length
    },
    {
      id: 'bookmark',
      icon: '🔖',
      title: 'Bookmark',
      description: 'Save for later',
      color: 'from-yellow-500 to-orange-500',
      count: blogs.length
    }
  ];

  // Get blog image or placeholder
  const getBlogImage = (blog, index) => {
    const tags = blog.tags || [];
    const title = blog.title?.toLowerCase() || '';
    
    const imageMap = {
      'technology': '1677442136019-21780ecad995',
      'ai': '1677442136019-21780ecad995',
      'react': '1633356122544-f134324a6cee',
      'web': '1633356122544-f134324a6cee',
      'spring': '1555066931-4365d14bab8c',
      'backend': '1555066931-4365d14bab8c',
      'design': '1561070791-2526d30994b5',
      'ui': '1561070791-2526d30994b5',
      'cricket': '1579952363873-27f3b1cddf47',
      'sports': '1579952363873-27f3b1cddf47'
    };
    
    for (const tag of tags) {
      const tagLower = tag.toLowerCase();
      for (const [key, imageId] of Object.entries(imageMap)) {
        if (tagLower.includes(key)) {
          return `https://images.unsplash.com/photo-${imageId}?w=600&h=400&fit=crop&auto=format`;
        }
      }
    }
    
    for (const [key, imageId] of Object.entries(imageMap)) {
      if (title.includes(key)) {
        return `https://images.unsplash.com/photo-${imageId}?w=600&h=400&fit=crop&auto=format`;
      }
    }
    
    const defaultImages = [
      '1677442136019-21780ecad995',
      '1633356122544-f134324a6cee',
      '1555066931-4365d14bab8c',
      '1561070791-2526d30994b5'
    ];
    const imageId = defaultImages[index % defaultImages.length];
    return `https://images.unsplash.com/photo-${imageId}?w=600&h=400&fit=crop&auto=format`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400 mx-auto mb-4"></div>
          <p className="text-lg font-light text-white300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-full p-4 shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Social Features
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white300 font-light mb-10 max-w-3xl mx-auto">
            Connect, interact, and engage with amazing content. Like, comment, follow, and bookmark your favorites.
          </p>
        </div>

        {/* Interactive Social Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {socialFeatures.map((feature) => (
            <div
              key={feature.id}
              onClick={() => setSelectedFeature(selectedFeature === feature.id ? null : feature.id)}
              className={`group relative overflow-hidden bg-gradient-to-br ${selectedFeature === feature.id ? `from-${feature.color.split(' ')[1].split('-')[1]}-500/40 to-${feature.color.split(' ')[3].split('-')[1]}-500/40` : 'from-gray-800/50 to-gray-900/50'} backdrop-blur-sm rounded-3xl p-8 border ${selectedFeature === feature.id ? 'border-blue-500/60' : 'border-gray-700/30'} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer`}
            >
              <div className="text-center">
                <div className="text-6xl mb-4 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                  {feature.icon}
                </div>
                <div className={`text-4xl font-bold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent mb-2`}>
                  {feature.count}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm font-light text-white300">
                  {feature.description}
                </p>
              </div>
              {selectedFeature === feature.id && (
                <div className="absolute top-4 right-4">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Blogs Section */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Discover & Interact
            </span>
          </h2>
          <p className="text-white400 font-light mb-12 text-center">Explore blogs and engage with the community</p>
        </div>

        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {blogs.map((blog, index) => (
              <Link key={blog.id} to={`/blog/${blog.id}`}>
                <div className="group relative overflow-hidden bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-3xl border border-gray-700/50 shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.03] hover:border-blue-500/50 cursor-pointer">
                  {/* Blog Image */}
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600">
                    <img
                      src={getBlogImage(blog, index)}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors">
                        {blog.title}
                      </h3>
                    </div>
                  </div>

                  {/* Blog Content */}
                  <div className="p-6">
                    <p className="text-sm font-light text-white400 mb-6 line-clamp-3 leading-relaxed">
                      {blog.summary || blog.content?.substring(0, 150) + '...'}
                    </p>
                    
                    {/* Social Stats */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          </svg>
                          <span className="text-white font-semibold">{blog.likeCount || 0}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                          <span className="text-white font-semibold">{blog.commentCount || 0}</span>
                        </div>
                      </div>
                      <div className="text-white400 text-sm">
                        {blog.author?.username || 'Unknown'}
                      </div>
                    </div>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {blog.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-3 py-1 bg-gray-700/50 text-white text-xs font-medium rounded-full border border-gray-600/50"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-800/50 rounded-3xl border border-gray-700/50">
            <div className="text-6xl mb-6">📝</div>
            <h3 className="text-2xl font-bold text-white mb-4">No blogs yet</h3>
            <p className="text-white400 font-light mb-8">Be the first to create amazing content!</p>
            <Link
              to="/create"
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-purple-500/50 transform hover:-translate-y-1 transition-all duration-200"
            >
              Create Your First Blog
            </Link>
          </div>
        )}
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default SocialFeatures;
