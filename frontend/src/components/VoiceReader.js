import React, { useState, useEffect } from 'react';

const VoiceReader = ({ text, title = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechPitch, setSpeechPitch] = useState(1);
  const [speechVolume, setSpeechVolume] = useState(1);

  useEffect(() => {
    // Load available voices
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        
        // Only set default voice if none is selected
        if (!selectedVoice) {
          // Try to find a natural-sounding voice (prefer female voices or neural voices)
          const preferredVoice = availableVoices.find(voice => 
            voice.name.includes('Neural') || 
            voice.name.includes('Natural') ||
            voice.name.includes('Google') ||
            (voice.lang.startsWith('en') && voice.name.includes('David'))
          ) || availableVoices.find(voice => voice.lang.startsWith('en')) || availableVoices[0];
          
          if (preferredVoice) {
            setSelectedVoice(preferredVoice);
          }
        }
      }
    };

    // Load voices immediately
    loadVoices();
    
    // Some browsers load voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Also try loading after a short delay
    const timeout = setTimeout(loadVoices, 500);

    return () => {
      clearTimeout(timeout);
      // Clean up speech synthesis on unmount
      window.speechSynthesis.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const speak = () => {
    if (!text || text.trim() === '') {
      alert('No text available to read');
      return;
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    // Wait a bit to ensure cancellation is complete
    setTimeout(() => {
      // Reload voices to ensure they're available
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0 && voices.length === 0) {
        setVoices(availableVoices);
        const preferredVoice = availableVoices.find(v => v.name === selectedVoice?.name) || 
                              availableVoices.find(v => v.lang.startsWith('en')) || 
                              availableVoices[0];
        if (preferredVoice) {
          setSelectedVoice(preferredVoice);
        }
      }

      const utterance = new SpeechSynthesisUtterance();
      
      // Combine title and text
      const fullText = title ? `${title}. ${text}` : text;
      utterance.text = fullText;
      
      // Set voice properties - use current selectedVoice or find a default
      const voiceToUse = selectedVoice || 
                        voices.find(v => v.lang.startsWith('en')) || 
                        voices[0];
      
      if (voiceToUse) {
        utterance.voice = voiceToUse;
        utterance.lang = voiceToUse.lang;
      } else {
        utterance.lang = 'en-US';
      }
      
      utterance.rate = speechRate;
      utterance.pitch = speechPitch;
      utterance.volume = speechVolume;

      // Event handlers
      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
        console.log('Speech started');
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        console.log('Speech ended');
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsPlaying(false);
        setIsPaused(false);
        alert(`Error reading text: ${event.error}. Please try again.`);
      };

      try {
        window.speechSynthesis.speak(utterance);
        console.log('Speaking:', fullText.substring(0, 50) + '...');
      } catch (error) {
        console.error('Error starting speech:', error);
        alert('Error starting speech. Please try again.');
      }
    }, 100);
  };

  const pause = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  // Check if browser supports speech synthesis
  if (!window.speechSynthesis) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
        Your browser does not support text-to-speech. Please use Chrome, Edge, or Safari.
      </div>
    );
  }

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          AI Voice Reader
        </h3>
      </div>

      {/* Voice Controls */}
      <div className="flex flex-wrap gap-2">
        {!isPlaying && !isPaused && (
          <button
            onClick={speak}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
            Play
          </button>
        )}

        {isPlaying && !isPaused && (
          <button
            onClick={pause}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-semibold"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Pause
          </button>
        )}

        {isPaused && (
          <button
            onClick={resume}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
            Resume
          </button>
        )}

        {(isPlaying || isPaused) && (
          <button
            onClick={stop}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
            </svg>
            Stop
          </button>
        )}
      </div>

      {/* Voice Settings */}
      <div className="space-y-3 pt-2 border-t border-gray-700/50">
        {/* Voice Selection */}
        {voices.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-white mb-1">Voice</label>
            <select
              value={selectedVoice?.name || ''}
              onChange={(e) => {
                const voice = voices.find(v => v.name === e.target.value);
                setSelectedVoice(voice);
              }}
              className="w-full px-3 py-2 border border-gray-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-800/50"
              disabled={isPlaying || isPaused}
            >
              {voices.filter(v => v.lang.startsWith('en')).map((voice) => (
                <option key={voice.name} value={voice.name} className="bg-gray-800 text-white">
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Speech Rate */}
        <div>
          <label className="block text-sm font-semibold text-white mb-1">
            Speed: {speechRate.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={speechRate}
            onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
            className="w-full"
            disabled={isPlaying || isPaused}
          />
        </div>

        {/* Speech Pitch */}
        <div>
          <label className="block text-sm font-semibold text-white mb-1">
            Pitch: {speechPitch.toFixed(1)}
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={speechPitch}
            onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
            className="w-full"
            disabled={isPlaying || isPaused}
          />
        </div>

        {/* Speech Volume */}
        <div>
          <label className="block text-sm font-semibold text-white mb-1">
            Volume: {Math.round(speechVolume * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={speechVolume}
            onChange={(e) => setSpeechVolume(parseFloat(e.target.value))}
            className="w-full"
            disabled={isPlaying || isPaused}
          />
        </div>
      </div>
    </div>
  );
};

export default VoiceReader;

