/**
 * ChatInput.jsx — Themed chat input with school bus colors.
 */
import { useState } from 'react';
import VoiceInputButton from './VoiceInputButton';

export default function ChatInput({ onSend, loading = false }) {
    const [text, setText] = useState('');

    const handleSubmit = () => {
        const trimmed = text.trim();
        if (!trimmed || loading) return;
        onSend(trimmed);
        setText('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="flex items-end gap-2 p-3 glass-bar border-t border-chalk-200">
            <VoiceInputButton
                onTranscript={(transcript) => setText((prev) => prev + transcript)}
                disabled={loading}
            />

            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={loading ? 'Thinking…' : 'Describe your route…'}
                disabled={loading}
                className="flex-1 min-h-touch rounded-2xl border border-chalk-300 px-4 py-3 text-base text-body bg-chalk-50 placeholder:text-chalk-400 disabled:opacity-50"
            />

            <button
                onClick={handleSubmit}
                disabled={loading || !text.trim()}
                className="min-w-touch min-h-touch rounded-2xl btn-primary flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Send message"
            >
                {loading ? (
                    <span className="typing-dots">
                        <span /><span /><span />
                    </span>
                ) : (
                    <span className="text-xl">➤</span>
                )}
            </button>
        </div>
    );
}
