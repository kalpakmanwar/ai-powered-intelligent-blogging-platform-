import React, { useState, useEffect } from 'react';
import api from '../services/api';

function AdminPanel() {
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalUsers: 0,
    totalComments: 0,
    totalLikes: 0,
    avgLikesPerBlog: 0,
    avgCommentsPerBlog: 0,
    blogsThisWeek: 0,
    topTags: []
  });
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    fetchStats();
    fetchBlogs();
    fetchUsers();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch all blogs to calculate stats
      const blogsResponse = await api.get('/blogs');
      const allBlogs = blogsResponse.data;
      
      const totalBlogs = allBlogs.length;
      const totalComments = allBlogs.reduce((sum, blog) => sum + (blog.commentCount || 0), 0);
      const totalLikes = allBlogs.reduce((sum, blog) => sum + (blog.likeCount || 0), 0);
      
      // Calculate averages
      const avgLikesPerBlog = totalBlogs > 0 ? (totalLikes / totalBlogs).toFixed(2) : 0;
      const avgCommentsPerBlog = totalBlogs > 0 ? (totalComments / totalBlogs).toFixed(2) : 0;
      
      // Blogs this week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const blogsThisWeek = allBlogs.filter(blog => {
        const blogDate = new Date(blog.createdAt);
        return blogDate >= oneWeekAgo;
      }).length;
      
      // Top tags
      const tagCounts = {};
      allBlogs.forEach(blog => {
        if (blog.tags && Array.isArray(blog.tags)) {
          blog.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        }
      });
      const topTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([tag, count]) => ({ tag, count }));
      
      // Note: In a real app, you'd have a separate admin endpoint for user stats
      setStats({
        totalBlogs,
        totalUsers: new Set(allBlogs.map(b => b.author?.id)).size,
        totalComments,
        totalLikes,
        avgLikesPerBlog: parseFloat(avgLikesPerBlog),
        avgCommentsPerBlog: parseFloat(avgCommentsPerBlog),
        blogsThisWeek,
        topTags
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogs = async () => {
    try {
      const response = await api.get('/blogs');
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      // Note: In a real app, you'd have an admin endpoint to fetch all users
      // For now, we'll extract unique users from blogs
      const response = await api.get('/blogs');
      const allBlogs = response.data;
      const uniqueUsers = Array.from(
        new Map(allBlogs.map(b => [b.author?.id, b.author])).values()
      ).filter(u => u);
      setUsers(uniqueUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-400 mx-auto mb-3"></div>
          <p className="text-base text-white300 font-light">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 text-white">
            Admin Panel
          </h1>
          <p className="text-sm text-white">Manage your blog system</p>
        </div>

        {/* Tabs */}
        <div className="mb-4 border-b border-gray-200">
          <nav className="flex space-x-6">
            <button
              onClick={() => setActiveTab('stats')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'stats'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-white500 hover:text-white700 hover:border-gray-300'
              }`}
            >
              Statistics
            </button>
            <button
              onClick={() => setActiveTab('blogs')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'blogs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-white500 hover:text-white700 hover:border-gray-300'
              }`}
            >
              All Blogs
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-white500 hover:text-white700 hover:border-gray-300'
              }`}
            >
              Users
            </button>
          </nav>
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-xl border border-blue-500/30 shadow-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-white mb-1">Total Blogs</p>
                  <p className="text-2xl font-bold text-white">{stats.totalBlogs}</p>
                </div>
                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-xl border border-blue-500/30 shadow-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-white mb-1">Total Users</p>
                  <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                </div>
                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-xl border border-blue-500/30 shadow-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-white mb-1">Total Comments</p>
                  <p className="text-2xl font-bold text-white">{stats.totalComments}</p>
                </div>
                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-xl border border-blue-500/30 shadow-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-white mb-1">Total Likes</p>
                  <p className="text-2xl font-bold text-white">{stats.totalLikes}</p>
                </div>
                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-xl border border-blue-500/30 shadow-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-white mb-1">Avg Likes/Blog</p>
                  <p className="text-2xl font-bold text-white">{stats.avgLikesPerBlog}</p>
                </div>
                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-xl border border-blue-500/30 shadow-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-white mb-1">Avg Comments/Blog</p>
                  <p className="text-2xl font-bold text-white">{stats.avgCommentsPerBlog}</p>
                </div>
                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-xl border border-blue-500/30 shadow-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-white mb-1">Blogs This Week</p>
                  <p className="text-2xl font-bold text-white">{stats.blogsThisWeek}</p>
                </div>
                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-xl border border-blue-500/30 shadow-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-white mb-1">Engagement Rate</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.totalBlogs > 0 ? ((stats.totalLikes + stats.totalComments) / stats.totalBlogs).toFixed(1) : 0}
                  </p>
                </div>
                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Top Tags */}
          {stats.topTags && stats.topTags.length > 0 && (
            <div className="bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-xl border border-blue-500/30 shadow-lg p-6 mb-4 max-w-md">
              <h3 className="text-lg font-bold text-white mb-4">Top Tags</h3>
              <div className="flex flex-wrap gap-2">
                {stats.topTags.map((tagData, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-800/50 rounded-lg text-xs border border-gray-700/50"
                  >
                    <span className="font-medium text-white">#{tagData.tag}</span>
                    <span className="text-gray-300">({tagData.count})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          </>
        )}

        {/* Blogs Tab */}
        {activeTab === 'blogs' && (
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 p-4">
            <h3 className="text-lg font-semibold mb-3 text-white">All Blogs ({blogs.length})</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700/50">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white400 uppercase tracking-wider">Title</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white400 uppercase tracking-wider">Author</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white400 uppercase tracking-wider">Likes</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white400 uppercase tracking-wider">Comments</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white400 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800/50 divide-y divide-gray-700/50">
                  {blogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-gray-800/70 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <a href={`/blog/${blog.id}`} className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
                          {blog.title}
                        </a>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-white400">
                        {blog.author?.username}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-white400">
                        {blog.likeCount || 0}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-white400">
                        {blog.commentCount || 0}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-white400">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 p-4">
            <h3 className="text-lg font-semibold mb-3 text-white">All Users ({users.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {users.map((user) => (
                <div key={user.id} className="p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-colors border border-gray-700/30">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white200">{user.username}</p>
                      <p className="text-xs text-white400">{user.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;

