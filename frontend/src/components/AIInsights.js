import React from 'react';
import { Link } from 'react-router-dom';

function AIInsights({ summary, tags, relatedBlogs, loading }) {
  return (
    <div className="mt-8 space-y-6 animate-fade-in">
      {/* Summary Section */}
      <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white">AI-Generated Summary</h3>
        </div>
        {loading ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-white">
              <div className="relative">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-700"></div>
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-400 absolute top-0 left-0"></div>
              </div>
              <span className="font-semibold">AI is analyzing your content...</span>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-700 rounded-full animate-pulse"></div>
              <div className="h-3 bg-gray-700 rounded-full animate-pulse w-5/6"></div>
              <div className="h-3 bg-gray-700 rounded-full animate-pulse w-4/6"></div>
            </div>
          </div>
        ) : (
          <p className="text-white leading-relaxed text-lg">{summary || 'Summary will appear here...'}</p>
        )}
      </div>

      {/* Tags Section */}
      {tags && Array.isArray(tags) && tags.length > 0 && (
        <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white">AI-Generated Tags</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gray-800/90 border border-gray-700/50 text-gray-300 rounded-full font-semibold shadow-md hover:shadow-lg hover:border-gray-600 hover:text-gray-200 transform hover:scale-105 transition-all duration-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Related Blogs Section */}
      {relatedBlogs && Array.isArray(relatedBlogs) && relatedBlogs.length > 0 && (
        <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white">Related Blogs</h3>
          </div>
          <div className="space-y-3">
            {relatedBlogs.map((blog) => (
              <Link
                key={blog.id}
                to={`/blog/${blog.id}`}
                className="block p-4 bg-gray-800/50 rounded-xl hover:shadow-lg transition-all duration-200 border border-gray-700/50 hover:border-blue-500/50"
              >
                <h4 className="font-bold text-white mb-2 hover:text-blue-400 transition-colors">
                  {blog.title}
                </h4>
                <p className="text-sm text-white line-clamp-2">
                  {blog.summary || blog.content?.substring(0, 100)}...
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AIInsights;

