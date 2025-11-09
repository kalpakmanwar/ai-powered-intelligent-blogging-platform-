import React, { useState, useEffect } from 'react';

const VoiceInput = ({ onTranscript, placeholder = 'Click to start voice input...' }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  useEffect(() => {
    if (!isListening) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Your browser does not support speech recognition. Please use Chrome or Edge.');
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setError(null);
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      const newTranscript = transcript + finalTranscript;
      setTranscript(newTranscript);
      if (onTranscript) {
        onTranscript(newTranscript + interimTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setError(`Error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      if (isListening) {
        // Restart recognition if still listening
        try {
          recognition.start();
        } catch (e) {
          // Recognition already started or ended
          setIsListening(false);
        }
      }
    };

    try {
      recognition.start();
    } catch (e) {
      setError('Could not start speech recognition. Please try again.');
      setIsListening(false);
    }

    return () => {
      try {
        recognition.stop();
      } catch (e) {
        // Recognition already stopped
      }
    };
  }, [isListening, transcript, onTranscript]);

  const startListening = () => {
    if (!isSupported) {
      setError('Your browser does not support speech recognition. Please use Chrome or Edge.');
      return;
    }
    setIsListening(true);
    setError(null);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const clearTranscript = () => {
    setTranscript('');
    if (onTranscript) {
      onTranscript('');
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
        Your browser does not support voice input. Please use Chrome or Edge.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        {!isListening ? (
          <button
            type="button"
            onClick={startListening}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
            Start Voice Input
          </button>
        ) : (
          <button
            type="button"
            onClick={stopListening}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold animate-pulse"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Stop Listening
          </button>
        )}

        {transcript && (
          <button
            type="button"
            onClick={clearTranscript}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Clear
          </button>
        )}
      </div>

      {isListening && (
        <div className="flex items-center gap-2 text-green-600 font-semibold">
          <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
          Listening...
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {transcript && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-white700 mb-2">Voice Input:</p>
          <p className="text-white800 whitespace-pre-wrap">{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;

