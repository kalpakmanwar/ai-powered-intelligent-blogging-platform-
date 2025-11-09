import React from 'react';
import { Link } from 'react-router-dom';

function BlogCard({ blog }) {
  return (
    <div className="bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-xl shadow-xl border border-blue-500/30 group hover:scale-[1.02] hover:border-blue-500/50 transition-all duration-200 cursor-pointer p-4">
      <Link to={`/blog/${blog.id}`} className="block">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-base font-medium text-white group-hover:text-blue-400 transition-colors line-clamp-2 flex-1">
            {blog.title}
          </h2>
          <div className="ml-2 p-1 bg-blue-900/50 rounded-md group-hover:bg-blue-800/50 transition-colors flex-shrink-0 border border-blue-700/30">
            <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        
        <p className="text-sm text-white400 mb-2 line-clamp-2 leading-snug font-light">
          {blog.summary || blog.content?.substring(0, 120) + '...'}
        </p>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs text-white400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="font-normal">{blog.author?.username}</span>
          </div>
          <span className="text-xs text-white500 font-light">
            {new Date(blog.createdAt).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </span>
        </div>
        
        {blog.tags && Array.isArray(blog.tags) && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gradient-to-r from-blue-900/50 to-indigo-900/50 text-white rounded-full text-xs font-normal border border-blue-700/30"
              >
                #{tag}
              </span>
            ))}
            {blog.tags.length > 3 && (
              <span className="px-2 py-0.5 bg-gray-700/50 text-white400 rounded-full text-xs font-normal border border-gray-600/30">
                +{blog.tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        <div className="flex items-center gap-4 pt-2 border-t border-blue-500/30">
          <div className="flex items-center gap-1.5 text-xs text-white400">
            <svg className="w-3.5 h-3.5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span className="font-normal">{blog.likeCount || 0}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white400">
            <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="font-normal">{blog.commentCount || 0}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default BlogCard;
