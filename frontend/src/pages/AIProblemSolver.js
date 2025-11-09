import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';

function AIProblemSolver() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedPrompts = [
    "Summarize my latest blog post",
    "Generate tags for a blog about technology",
    "How to improve blog engagement?",
    "What are trending topics in blogging?",
    "Help me write a blog introduction",
    "Suggest blog post ideas",
    "How to optimize blog SEO?",
    "Create a blog outline about AI"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    const userMessage = question.trim();
    setQuestion('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await api.post('/ai/solve', { question: userMessage });
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.answer }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = error.response?.data?.error || 'Failed to get AI response. Please try again.';
      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage, error: true }]);
    } finally {
      setLoading(false);
    }
  };

  const handlePromptClick = (prompt) => {
    setQuestion(prompt);
  };

  return (
    <div className="min-h-screen py-4 px-3 sm:px-4 lg:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 text-white">
            AI Problem Solver
          </h1>
          <p className="text-sm text-white font-light">Ask me anything, and I'll help you solve it!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-xl border border-blue-500/30 shadow-lg p-3 mb-3 h-[calc(100vh-250px)] flex flex-col">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto mb-3 space-y-3 pr-2">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-xl border border-blue-500/30 shadow-lg p-6 max-w-md text-center">
                      <svg className="w-12 h-12 text-white mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      <p className="text-lg text-white font-light">Hello! I'm here and ready to assist you. How can I help you today?</p>
                    </div>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-3 text-sm ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                            : message.error
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 backdrop-blur-sm border border-blue-500/30 shadow-lg text-white'
                        }`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                  ))
                )}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-white600">AI is thinking...</span>
                        <span className="text-xs text-white400 animate-pulse">This may take a few seconds...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Type your question here..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-700/50 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 bg-gray-900/50 text-white placeholder-gray-500 shadow-sm"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !question.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    'Send'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Suggested Prompts Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-xl border border-blue-500/30 shadow-lg p-3 sticky top-4">
              <h3 className="text-sm font-semibold text-white mb-2">Suggested Prompts</h3>
              <div className="space-y-2">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptClick(prompt)}
                    className="w-full text-left px-3 py-2 text-xs bg-gradient-to-r from-blue-900/50 to-indigo-900/50 hover:from-blue-800/50 hover:to-indigo-800/50 rounded-lg transition-all duration-200 text-white300 font-normal border border-blue-800/30 hover:border-blue-700/50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIProblemSolver;

