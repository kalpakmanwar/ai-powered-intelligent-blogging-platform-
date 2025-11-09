import React, { useState, useEffect } from 'react';
import api from '../services/api';

function TrendingTags({ onTagClick }) {
  const [trendingTags, setTrendingTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingTags();
  }, []);

  const fetchTrendingTags = async () => {
    try {
      const response = await api.get('/blogs/trending-tags');
      const tags = Object.entries(response.data)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
      setTrendingTags(tags);
    } catch (error) {
      console.error('Error fetching trending tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTagClick = (tag) => {
    if (onTagClick) {
      onTagClick(tag);
    }
  };

  if (loading) {
    return (
      <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 p-3">
        <div className="flex items-center gap-2 text-sm text-white600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
          <span>Loading trending tags...</span>
        </div>
      </div>
    );
  }

  if (trendingTags.length === 0) {
    return null;
  }

  return (
    <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 p-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 bg-purple-500 rounded-md">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <h3 className="text-base font-medium text-white800">Trending Tags</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {trendingTags.map(({ tag, count }, index) => (
          <button
            key={index}
            onClick={() => handleTagClick(tag)}
            className="group relative px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-normal shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200"
          >
            <span>#{tag}</span>
            <span className="ml-1.5 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
              {count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default TrendingTags;

