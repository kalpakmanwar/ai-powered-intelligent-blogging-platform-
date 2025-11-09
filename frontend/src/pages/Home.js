import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Home.css';

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await api.get('/api/blogs');
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchBlogs();
      return;
    }
    try {
      const response = await api.get(`/api/blogs/search?keyword=${encodeURIComponent(searchTerm)}`);
      setBlogs(response.data);
    } catch (error) {
      console.error('Error searching blogs:', error);
    }
  };

  if (loading) {
    return <div className="container"><div className="loading">Loading blogs...</div></div>;
  }

  return (
    <div className="container">
      <div className="home-header">
        <h1>AI Context Blog System</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>

      {blogs.length === 0 ? (
        <div className="no-blogs">No blogs found. Be the first to create one!</div>
      ) : (
        <div className="blogs-grid">
          {blogs.map((blog) => (
            <div key={blog.id} className="blog-card">
              <Link to={`/blog/${blog.id}`} className="blog-link">
                <h2>{blog.title}</h2>
              </Link>
              <p className="blog-summary">{blog.summary || blog.content.substring(0, 150) + '...'}</p>
              <div className="blog-meta">
                <span className="blog-author">By {blog.author?.username}</span>
                <span className="blog-date">{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="blog-tags">
                {blog.tags && blog.tags.map((tag, index) => (
                  <span key={index} className="tag">#{tag}</span>
                ))}
              </div>
              <div className="blog-stats">
                <span>❤️ {blog.likeCount || 0}</span>
                <span>💬 {blog.commentCount || 0}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;

