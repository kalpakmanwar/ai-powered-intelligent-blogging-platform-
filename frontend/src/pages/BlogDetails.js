import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import AIInsights from '../components/AIInsights';
import VoiceReader from '../components/VoiceReader';

function BlogDetails() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetchBlog();
    fetchComments();
    if (isAuthenticated) {
      checkLiked();
      checkBookmarked();
      if (blog?.author?.id) {
        checkFollowing();
      }
    }
    fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAuthenticated, blog?.author?.id]);

  const fetchBlog = async () => {
    try {
      const response = await api.get(`/blogs/${id}`);
      setBlog(response.data);
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get(`/blogs/${id}/comments`);
      // Ensure response.data is an array
      if (Array.isArray(response.data)) {
        setComments(response.data);
      } else {
        console.error('Invalid response format:', response.data);
        setComments([]);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    }
  };

  const checkLiked = async () => {
    try {
      const response = await api.get(`/blogs/${id}/liked`);
      setLiked(response.data.liked);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const checkBookmarked = async () => {
    try {
      const response = await api.get(`/users/blogs/${id}/bookmarked`);
      setBookmarked(response.data.bookmarked);
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  };

  const checkFollowing = async () => {
    if (!blog?.author?.id) return;
    try {
      const response = await api.get(`/users/${blog.author.id}/following`);
      setFollowing(response.data.following);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      // Use AI-based recommendations
      const response = await api.get(`/blogs/${id}/ai-recommendations`);
      // Ensure response.data is an array
      if (Array.isArray(response.data)) {
        setRecommendations(response.data);
      } else {
        console.error('Invalid response format:', response.data);
        setRecommendations([]);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      // Fallback to regular recommendations
      try {
        const fallbackResponse = await api.get(`/blogs/${id}/recommendations`);
        if (Array.isArray(fallbackResponse.data)) {
          setRecommendations(fallbackResponse.data);
        } else {
          setRecommendations([]);
        }
      } catch (fallbackError) {
        console.error('Error fetching fallback recommendations:', fallbackError);
        setRecommendations([]);
      }
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert('Please login to like blogs');
      return;
    }
    try {
      const response = await api.post(`/blogs/${id}/like`);
      setLiked(response.data.liked);
      fetchBlog();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      alert('Please login to bookmark blogs');
      return;
    }
    try {
      const response = await api.post(`/users/blogs/${id}/bookmark`);
      setBookmarked(response.data.bookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handleFollow = async () => {
    if (!isAuthenticated) {
      alert('Please login to follow users');
      return;
    }
    if (!blog?.author?.id) return;
    try {
      const response = await api.post(`/users/${blog.author.id}/follow`);
      setFollowing(response.data.following);
    } catch (error) {
      console.error('Error toggling follow:', error);
      alert(error.response?.data?.error || 'Error following user');
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
      await api.post(`/blogs/${id}/comments`, { content: newComment });
      setNewComment('');
      fetchComments();
      fetchBlog();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400 mx-auto mb-4"></div>
          <p className="text-xl text-gray-300 font-light">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Blog not found</h2>
          <Link to="/" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-xl shadow-xl border border-blue-500/30 p-6 mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{blog.title}</h1>
              
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-blue-500/30">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                      {blog.author?.username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-gray-200">{blog.author?.username}</span>
                  </div>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400 font-light">{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
                {isAuthenticated && blog.author?.id && (
                  <button
                    onClick={handleFollow}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      following
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-800/50 text-white hover:bg-gray-800 border border-gray-700/50'
                    }`}
                  >
                    {following ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>

              {blog.tags && Array.isArray(blog.tags) && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-blue-900/50 to-indigo-900/50 text-white rounded-full font-medium border border-blue-700/30"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* AI Voice Reader */}
              <div className="mb-6">
                <VoiceReader text={blog.content} title={blog.title} />
              </div>

              <div className="prose max-w-none mb-6">
                <p className="text-white leading-relaxed text-lg whitespace-pre-wrap font-light">
                  {blog.content}
                </p>
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-blue-500/30">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    liked
                      ? 'bg-red-900/50 text-red-300 hover:bg-red-900/70 border border-red-700/50'
                      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 border border-gray-700/50'
                  }`}
                >
                  <svg className="w-6 h-6" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {liked ? 'Liked' : 'Like'} ({blog.likeCount || 0})
                </button>
                {isAuthenticated && (
                  <button
                    onClick={handleBookmark}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      bookmarked
                        ? 'bg-yellow-900/50 text-yellow-300 hover:bg-yellow-900/70 border border-yellow-700/50'
                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 border border-gray-700/50'
                    }`}
                  >
                    <svg className="w-6 h-6" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    {bookmarked ? 'Bookmarked' : 'Bookmark'}
                  </button>
                )}
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-xl shadow-xl border border-blue-500/30 p-6">
              <h3 className="text-2xl font-bold text-white mb-6">Comments ({blog.commentCount || 0})</h3>
              
              {isAuthenticated ? (
                <form onSubmit={handleComment} className="mb-6">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    rows="3"
                    required
                    className="w-full px-4 py-3 border border-gray-700/50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 bg-gray-900/50 text-gray-200 placeholder-gray-500 mb-3"
                  />
                  <button type="submit" className="btn-primary">
                    Post Comment
                  </button>
                </form>
              ) : (
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 rounded-xl text-center border border-blue-500/20">
                  <p className="text-white font-light">
                    <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                      Login
                    </Link>
                    {' '}to post comments
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {!Array.isArray(comments) || comments.length === 0 ? (
                  <p className="text-center text-white py-8 font-light">No comments yet. Be the first to comment!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="p-4 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 rounded-xl border border-blue-500/20">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {comment.user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-200">{comment.user?.username}</span>
                        <span className="text-sm text-gray-400 font-light">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-300 font-light">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <AIInsights
                summary={blog.summary}
                tags={blog.tags}
                relatedBlogs={recommendations}
                loading={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetails;

