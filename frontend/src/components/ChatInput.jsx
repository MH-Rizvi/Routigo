/**
 * ChatInput.jsx — Dark enterprise input with amber focus ring.
 */
import { useState } from 'react';
import VoiceInputButton from './VoiceInputButton';

export default function ChatInput({ onSend, loading = false }) {
    const [text, setText] = useState('');
    const [isTranscribing, setIsTranscribing] = useState(false);

    const handleSubmit = () => {
        const trimmed = text.trim();
        if (!trimmed || loading) return;
        onSend(trimmed);
        setText('');
    };

    return (
        <div className="flex items-end gap-2 p-3 glass-bar border-t border-border">
            <VoiceInputButton
                onTranscript={(t) => setText((p) => p + (p && !p.endsWith(' ') ? ' ' : '') + t)}
                disabled={loading || isTranscribing}
                onTranscribing={setIsTranscribing}
            />
            <div className="flex-1 bg-[#111827] border border-[#1F2937] focus-within:border-[#F59E0B] rounded-[14px] flex items-center px-4 transition-colors">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
                    placeholder={loading ? 'Thinking…' : isTranscribing ? 'Transcribing audio…' : 'Describe your route…'}
                    disabled={loading || isTranscribing}
                    className="w-full bg-transparent py-3 text-base text-white placeholder:text-[#6B7280] outline-none disabled:opacity-50"
                />
            </div>
            <button
                onClick={handleSubmit}
                disabled={loading || isTranscribing || !text.trim()}
                className="min-w-touch min-h-touch rounded-xl btn-accent flex items-center justify-center disabled:opacity-30"
                aria-label="Send"
            >
                {loading ? (
                    <span className="typing-dots"><span /><span /><span /></span>
                ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                )}
            </button>
        </div>
    );
}
