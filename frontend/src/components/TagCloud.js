import React, { useState, useEffect } from 'react';
import api from '../services/api';

function TagCloud({ onTagClick }) {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await api.get('/blogs/trending-tags');
      const tagArray = Object.entries(response.data)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count);
      setTags(tagArray);
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTagSize = (count, maxCount) => {
    const minSize = 0.8;
    const maxSize = 2.5;
    const ratio = count / maxCount;
    return minSize + (maxSize - minSize) * ratio;
  };

  const getTagColor = (index) => {
    const colors = [
      'text-blue-600 bg-blue-100 hover:bg-blue-200',
      'text-purple-600 bg-purple-100 hover:bg-purple-200',
      'text-pink-600 bg-pink-100 hover:bg-pink-200',
      'text-indigo-600 bg-indigo-100 hover:bg-indigo-200',
      'text-green-600 bg-green-100 hover:bg-green-200',
      'text-red-600 bg-red-100 hover:bg-red-200',
      'text-yellow-600 bg-yellow-100 hover:bg-yellow-200',
      'text-teal-600 bg-teal-100 hover:bg-teal-200',
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 p-3">
        <div className="flex items-center gap-2 text-sm text-white600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
          <span>Loading tag cloud...</span>
        </div>
      </div>
    );
  }

  if (tags.length === 0) {
    return null;
  }

  const maxCount = Math.max(...tags.map(t => t.count));

  return (
    <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 p-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>
        <h3 className="text-base font-medium text-white800">Tag Cloud</h3>
      </div>
      
      <div className="flex flex-wrap gap-2 items-center justify-center py-2">
        {tags.map((tagData, index) => {
          const size = getTagSize(tagData.count, maxCount);
          const colorClass = getTagColor(index);
          
          return (
            <button
              key={tagData.tag}
              onClick={() => onTagClick && onTagClick(tagData.tag)}
              className={`px-2.5 py-1 rounded-full font-normal transition-all duration-200 transform hover:scale-105 ${colorClass}`}
              style={{ fontSize: `${Math.min(size, 1.2)}rem` }}
              title={`${tagData.count} blog${tagData.count !== 1 ? 's' : ''}`}
            >
              {tagData.tag} ({tagData.count})
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TagCloud;

