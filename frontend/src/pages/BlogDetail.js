import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './BlogDetail.css';

function BlogDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetchBlog();
    fetchComments();
    if (isAuthenticated) {
      checkLiked();
    }
    fetchRecommendations();
  }, [id, isAuthenticated]);

  const fetchBlog = async () => {
    try {
      const response = await api.get(`/api/blogs/${id}`);
      setBlog(response.data);
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get(`/api/blogs/${id}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const checkLiked = async () => {
    try {
      const response = await api.get(`/api/blogs/${id}/liked`);
      setLiked(response.data.liked);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await api.get(`/api/blogs/${id}/recommendations`);
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert('Please login to like blogs');
      return;
    }
    try {
      const response = await api.post(`/api/blogs/${id}/like`);
      setLiked(response.data.liked);
      fetchBlog(); // Refresh to get updated like count
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login to comment');
      return;
    }
    if (!newComment.trim()) return;

    try {
      await api.post(`/api/blogs/${id}/comments`, { content: newComment });
      setNewComment('');
      fetchComments();
      fetchBlog(); // Refresh to get updated comment count
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (loading) {
    return <div className="container"><div className="loading">Loading blog...</div></div>;
  }

  if (!blog) {
    return <div className="container"><div className="error">Blog not found</div></div>;
  }

  return (
    <div className="container">
      <div className="blog-detail">
        <div className="blog-content">
          <h1>{blog.title}</h1>
          <div className="blog-meta">
            <span>By {blog.author?.username}</span>
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="blog-tags">
            {blog.tags && blog.tags.map((tag, index) => (
              <span key={index} className="tag">#{tag}</span>
            ))}
          </div>
          <div className="blog-body">{blog.content}</div>
          <div className="blog-actions">
            <button
              onClick={handleLike}
              className={`btn ${liked ? 'btn-danger' : 'btn-primary'}`}
            >
              {liked ? '❤️ Liked' : '🤍 Like'} ({blog.likeCount || 0})
            </button>
          </div>
        </div>

        <div className="blog-sidebar">
          <div className="sidebar-section">
            <h3>Summary</h3>
            <p className="blog-summary">{blog.summary || 'No summary available'}</p>
          </div>

          {recommendations.length > 0 && (
            <div className="sidebar-section">
              <h3>Recommended Blogs</h3>
              <div className="recommendations">
                {recommendations.map((rec) => (
                  <Link key={rec.id} to={`/blog/${rec.id}`} className="recommendation-item">
                    <h4>{rec.title}</h4>
                    <p>{rec.summary || rec.content.substring(0, 100) + '...'}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="comments-section">
        <h3>Comments ({blog.commentCount || 0})</h3>
        {isAuthenticated ? (
          <form onSubmit={handleComment} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows="3"
              required
            />
            <button type="submit" className="btn btn-primary">Post Comment</button>
          </form>
        ) : (
          <p className="login-prompt">
            <Link to="/login">Login</Link> to post comments
          </p>
        )}
        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <strong>{comment.user?.username}</strong>
                  <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="comment-body">{comment.content}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default BlogDetail;

