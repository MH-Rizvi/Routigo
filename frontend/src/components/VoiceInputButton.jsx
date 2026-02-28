/**
 * VoiceInputButton.jsx — Themed voice input with school bus colors.
 */
import { useState, useRef } from 'react';

export default function VoiceInputButton({ onTranscript, disabled = false }) {
    const [recording, setRecording] = useState(false);
    const recognitionRef = useRef(null);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return null;

    const handleToggle = () => {
        if (recording) {
            recognitionRef.current?.stop();
            setRecording(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            onTranscript(transcript);
            setRecording(false);
        };

        recognition.onerror = () => setRecording(false);
        recognition.onend = () => setRecording(false);

        recognitionRef.current = recognition;
        recognition.start();
        setRecording(true);
    };

    return (
        <button
            onClick={handleToggle}
            disabled={disabled}
            className={`min-w-touch min-h-touch rounded-2xl flex items-center justify-center transition-all ${recording
                    ? 'bg-red-500 text-white shadow-glow animate-pulse'
                    : 'bg-chalk-100 text-chalk-500 hover:bg-chalk-200'
                } disabled:opacity-40`}
            aria-label={recording ? 'Stop recording' : 'Start voice input'}
        >
            <span className="text-xl">{recording ? '⏹️' : '🎤'}</span>
        </button>
    );
}
