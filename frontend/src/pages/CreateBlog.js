import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AIInsights from '../components/AIInsights';
import VoiceInput from '../components/VoiceInput';
import AIAssistant from '../components/AIAssistant';

function CreateBlog() {
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiData, setAiData] = useState({ summary: '', tags: [], relatedBlogs: [], loading: false, error: null });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSuggestionAccept = (suggestion) => {
    setFormData({ ...formData, content: formData.content + ' ' + suggestion });
  };

  const generateAIInsights = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please enter both title and content to generate AI insights');
      return;
    }

    setAiData({ ...aiData, loading: true });
    
    try {
      // Call the analyze endpoint to get AI insights
      const response = await api.post('/blogs/analyze', {
        title: formData.title,
        content: formData.content
      });
      
      setAiData({
        summary: response.data.summary || '',
        tags: Array.isArray(response.data.tags) ? response.data.tags : [],
        relatedBlogs: Array.isArray(response.data.relatedBlogs) ? response.data.relatedBlogs : [],
        loading: false
      });
    } catch (error) {
      console.error('Error generating AI insights:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to generate AI insights';
      setAiData({ 
        summary: '',
        tags: [],
        relatedBlogs: [],
        loading: false,
        error: errorMessage
      });
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create new blog (AI insights are already generated and will be included)
      const response = await api.post('/blogs', formData);
      navigate(`/blog/${response.data.id}`);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center animate-slide-up">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Create New Blog Post
          </h1>
          <p className="text-white400 font-light">Share your thoughts and let AI enhance your content</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editor Section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 p-6">
              {error && (
                <div className="mb-6 p-4 bg-red-900/50 border border-red-700/50 rounded-xl text-red-300 font-medium">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-white300 font-semibold mb-2 text-lg">
                    Blog Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter a captivating title..."
                    className="w-full px-4 py-3 border border-gray-700/50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 bg-gray-900/50 text-white200 placeholder-gray-500 text-lg"
                  />
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-white300 font-semibold text-lg">
                      Content
                    </label>
                    <button
                      type="button"
                      onClick={generateAIInsights}
                      disabled={!formData.title.trim() || !formData.content.trim() || aiData.loading}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 relative overflow-hidden"
                    >
                      {aiData.loading && (
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse"></div>
                      )}
                      <div className="relative flex items-center gap-2">
                        {aiData.loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <span>Generate AI Insights</span>
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                  {/* Voice Input */}
                  <div className="mb-4">
                    <VoiceInput 
                      onTranscript={(transcript) => {
                        setFormData({ ...formData, content: transcript });
                      }}
                      placeholder="Click to start voice input for blog content..."
                    />
                  </div>
                  
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    placeholder="Write your blog content here... Or use voice input above! Let your creativity flow!"
                    rows="20"
                    className="w-full px-4 py-3 border border-gray-700/50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 bg-gray-900/50 text-white200 placeholder-gray-500 resize-none text-base leading-relaxed"
                  />
                  
                  {/* AI Assistant - shows suggestions while typing */}
                  <AIAssistant
                    text={formData.content}
                    title={formData.title}
                    onSuggestionAccept={handleSuggestionAccept}
                  />
                  <p className="mt-2 text-sm text-white400 font-light">
                    💡 Tip: Use voice input above or type your content, then click "Generate AI Insights" to see AI-generated summary and tags
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Publishing...
                      </span>
                    ) : (
                      'Publish Blog'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-gray-800/50 hover:bg-gray-800 text-white200 rounded-lg font-medium transition-colors border border-gray-700/50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* AI Insights Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {aiData.loading || aiData.summary || (aiData.tags && aiData.tags.length > 0) || aiData.error ? (
                <>
                  {aiData.error && (
                    <div className="mb-4 p-4 bg-red-900/50 border border-red-700/50 rounded-xl text-red-300 font-medium">
                      {aiData.error}
                    </div>
                  )}
                  <AIInsights
                    summary={aiData.summary}
                    tags={aiData.tags || []}
                    relatedBlogs={aiData.relatedBlogs || []}
                    loading={aiData.loading}
                  />
                </>
              ) : (
                <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 text-center py-12">
                  <svg className="w-16 h-16 text-white600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <h3 className="text-xl font-bold text-white mb-2">AI Insights</h3>
                  <p className="text-white400 mb-4 font-light">Click "Generate AI Insights" to see AI-generated summary and tags</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateBlog;
