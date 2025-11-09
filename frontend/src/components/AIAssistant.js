import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';

function AIAssistant({ text, title = '', onSuggestionAccept }) {
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const debounceTimer = useRef(null);

  useEffect(() => {
    if (text && text.trim().length >= 20) {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        fetchSuggestion(text, title);
      }, 1500); // Wait 1.5 seconds after user stops typing
    } else {
      setSuggestion('');
      setShowSuggestion(false);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [text, title]);

  const fetchSuggestion = async (text, context = '') => {
    if (!text || text.trim().length < 20) {
      setSuggestion('');
      setShowSuggestion(false);
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/blogs/suggest', {
        text: text,
        context: context
      });
      
      if (response.data.suggestion && response.data.suggestion.trim()) {
        setSuggestion(response.data.suggestion);
        setShowSuggestion(true);
      } else {
        setSuggestion('');
        setShowSuggestion(false);
      }
    } catch (error) {
      console.error('Error fetching suggestion:', error);
      setSuggestion('');
      setShowSuggestion(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    if (onSuggestionAccept && suggestion) {
      onSuggestionAccept(suggestion);
      setShowSuggestion(false);
      setSuggestion('');
    }
  };

  const handleDismiss = () => {
    setShowSuggestion(false);
    setSuggestion('');
  };

  if (!showSuggestion && !loading) {
    return null;
  }

  return (
    <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg">
      {loading ? (
        <div className="flex items-center gap-2 text-blue-600">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="text-sm font-medium">AI is thinking...</span>
        </div>
      ) : showSuggestion && suggestion ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="text-sm font-semibold text-blue-800">AI Suggestion:</span>
          </div>
          <p className="text-sm text-white700 bg-white p-3 rounded border border-blue-200">
            {suggestion}
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleAccept}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Accept
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 bg-gray-200 text-white700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-semibold"
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default AIAssistant;

