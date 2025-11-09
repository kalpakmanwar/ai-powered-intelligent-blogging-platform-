import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

/**
 * Rich Content Creation Page - Image to Summary Generation
 * 
 * This component allows users to upload images and get AI-powered summaries.
 * Features:
 * - Drag & drop image upload
 * - Image preview with validation
 * - AI-powered image analysis using OpenRouter API
 * - Save analysis as blog post
 * - Authentication required for AI features
 * 
 * @component
 * @returns {JSX.Element} RichContentCreation component
 */
function RichContentCreation() {
  const { isAuthenticated } = useAuth();
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [imageSummary, setImageSummary] = useState(null);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showTitleInput, setShowTitleInput] = useState(false);
  const [blogTitle, setBlogTitle] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Handle image file selection
  const handleImageSelect = (file) => {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('Image size should be less than 10MB');
      return;
    }
    
    setError(null);
    setImageSummary(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    handleImageSelect(file);
  };

  // Handle drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleImageSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Analyze image with AI
  const handleAnalyzeImage = async () => {
    if (!imagePreview) {
      setError('Please upload an image first');
      return;
    }
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      setError('Please login to analyze images. Redirecting to login page...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    setImageSummary(null);
    
    try {
      const response = await api.post('/ai/analyze-image', {
        imageBase64: imagePreview
      });
      
      if (response.data && response.data.summary) {
        setImageSummary(response.data.summary);
      } else {
        setError('Failed to get image summary. Please try again.');
      }
    } catch (err) {
      console.error('Error analyzing image:', err);
      
      // Handle 403 Forbidden error specifically
      if (err.response?.status === 403) {
        setError('Authentication required. Please login to use this feature.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const errorMessage = err.response?.data?.error || err.message || 'Failed to analyze image. Please try again.';
        setError(errorMessage);
      }
      
      // Log more details for debugging
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Reset image upload
  const handleResetImage = () => {
    setImagePreview(null);
    setImageSummary(null);
    setError(null);
    setShowTitleInput(false);
    setBlogTitle('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Generate title from summary
  const generateTitleFromSummary = (summary) => {
    if (!summary) return 'Image Analysis Blog Post';
    // Take first sentence or first 50 characters
    const firstSentence = summary.split('.')[0];
    if (firstSentence.length > 50) {
      return firstSentence.substring(0, 50) + '...';
    }
    return firstSentence || 'Image Analysis Blog Post';
  };

  // Save image summary as blog
  const handleSaveAsBlog = async () => {
    if (!imageSummary) {
      setError('No summary available to save');
      return;
    }

    // If title input is not shown, show it first
    if (!showTitleInput) {
      const autoTitle = generateTitleFromSummary(imageSummary);
      setBlogTitle(autoTitle);
      setShowTitleInput(true);
      return;
    }

    // If title is empty, use auto-generated title
    const title = blogTitle.trim() || generateTitleFromSummary(imageSummary);
    
    setIsSaving(true);
    setError(null);

    try {
      const response = await api.post('/blogs', {
        title: title,
        content: imageSummary
      });
      
      // Navigate to the created blog
      navigate(`/blog/${response.data.id}`);
    } catch (err) {
      console.error('Error saving blog:', err);
      setError(err.response?.data?.error || 'Failed to save blog. Please try again.');
      setIsSaving(false);
    }
  };

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
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Image to Summary Generator
          </h1>
          <p className="text-xl md:text-2xl text-white font-light mb-10 max-w-3xl mx-auto">
            Upload any image and get an AI-powered detailed summary. Perfect for creating blog content from images.
          </p>
        </div>

        {/* Image Upload Section */}
        <div className="mb-20">
          <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-700/50 shadow-2xl">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Upload Image & Generate Summary
                  </span>
                </h2>

                {/* Image Upload Area */}
                {!imagePreview ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="border-2 border-dashed border-gray-600 rounded-2xl p-12 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-800/50"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="text-6xl mb-6">📸</div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Drag & Drop or Click to Upload
                    </h3>
                    <p className="text-white font-light mb-4">
                      Upload an image (JPG, PNG, GIF - Max 10MB)
                    </p>
                    <p className="text-sm text-white">
                      We'll analyze it and generate a detailed summary
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Image Preview */}
                    <div className="relative rounded-2xl overflow-hidden border border-gray-700/50">
                      <img
                        src={imagePreview}
                        alt="Uploaded preview"
                        className="w-full h-auto max-h-96 object-contain bg-gray-900"
                      />
                      <button
                        onClick={handleResetImage}
                        className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Analyze Button */}
                    {!imageSummary && (
                      <div className="text-center space-y-4">
                        {!isAuthenticated && (
                          <div className="bg-yellow-900/50 border border-yellow-600 rounded-xl p-4 text-yellow-200">
                            <p className="font-semibold mb-1">⚠️ Authentication Required</p>
                            <p className="text-sm">Please <Link to="/login" className="underline hover:text-yellow-100">login</Link> to analyze images.</p>
                          </div>
                        )}
                        <button
                          onClick={handleAnalyzeImage}
                          disabled={isAnalyzing || !isAuthenticated}
                          className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:shadow-purple-500/50 transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {isAnalyzing ? (
                            <span className="flex items-center gap-3">
                              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Analyzing Image...
                            </span>
                          ) : (
                            <span className="flex items-center gap-3">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                              Generate AI Summary
                            </span>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Error Message */}
                    {error && (
                      <div className="bg-red-900/50 border border-red-600 rounded-xl p-4 text-red-200">
                        <p className="font-semibold">Error:</p>
                        <p>{error}</p>
                      </div>
                    )}

                    {/* AI Summary */}
                    {imageSummary && (
                      <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-2xl p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold text-white">AI-Generated Summary</h3>
                        </div>
                        <p className="text-white font-light leading-relaxed text-lg whitespace-pre-wrap">
                          {imageSummary}
                        </p>
                        
                        {/* Title Input for Blog */}
                        {showTitleInput && (
                          <div className="mt-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                            <label className="block text-sm font-semibold text-white mb-2">
                              Blog Title
                            </label>
                            <input
                              type="text"
                              value={blogTitle}
                              onChange={(e) => setBlogTitle(e.target.value)}
                              placeholder="Enter blog title..."
                              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                              disabled={isSaving}
                            />
                          </div>
                        )}

                        <div className="mt-6 flex flex-wrap gap-4">
                          <button
                            onClick={handleResetImage}
                            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors"
                            disabled={isSaving}
                          >
                            Upload Another Image
                          </button>
                          <button
                            onClick={handleSaveAsBlog}
                            disabled={isSaving}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSaving ? (
                              <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                              </span>
                            ) : showTitleInput ? (
                              'Save as Blog'
                            ) : (
                              'Save as Blog'
                            )}
                          </button>
                          <Link
                            to="/create"
                            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors"
                          >
                            Use in Blog Post
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

        {/* Final CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-3xl p-12 border border-blue-500/30 shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Create?
            </h2>
            <p className="text-xl text-white font-light mb-10 max-w-2xl mx-auto">
              Start writing your first blog post with AI-powered assistance
            </p>
            <Link
              to="/create"
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-purple-500/50 transform hover:-translate-y-2 transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Create Your Blog Post
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
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
    </div>
  );
}

export default RichContentCreation;
