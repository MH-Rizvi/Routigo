/**
 * ChatScreen.jsx — School-bus-themed agent chat interface.
 */
import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useChatStore from '../store/chatStore';
import MessageBubble from '../components/MessageBubble';
import ChatInput from '../components/ChatInput';

const EXAMPLE_PROMPTS = [
    { emoji: '🚌', text: 'Morning school run' },
    { emoji: '🔄', text: 'My usual Monday route' },
    { emoji: '📋', text: 'What did I drive last week?' },
    { emoji: '📍', text: 'From depot to Oak Avenue' },
];

export default function ChatScreen() {
    const navigate = useNavigate();
    const {
        messages, pendingStops, loading, error,
        sendMessage, clearError, clearPendingStops, resetChat,
    } = useChatStore();

    const scrollRef = useRef(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    const handleSend = (text) => sendMessage(text);

    const handlePreviewRoute = () => {
        if (!pendingStops) return;
        navigate('/preview', { state: { stops: pendingStops } });
        clearPendingStops();
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-chalk-200 glass-bar">
                <div className="flex items-center gap-2">
                    <span className="text-xl">🚌</span>
                    <h1 className="text-lg font-bold text-body">Chat with RouteEasy</h1>
                </div>
                {messages.length > 0 && (
                    <button
                        onClick={resetChat}
                        className="min-h-touch px-3 text-sm text-bus-700 font-medium hover:text-bus-900 transition-colors"
                    >
                        New Chat
                    </button>
                )}
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
                {/* Empty state */}
                {messages.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                        <div className="w-20 h-20 rounded-full bg-bus-100 flex items-center justify-center mb-4">
                            <span className="text-4xl">💬</span>
                        </div>
                        <h2 className="text-xl font-bold text-body mb-2">
                            Where are you heading today?
                        </h2>
                        <p className="text-chalk-500 mb-6 max-w-xs">
                            Describe your route in plain language — I'll plan it for you
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center max-w-sm">
                            {EXAMPLE_PROMPTS.map((p) => (
                                <button
                                    key={p.text}
                                    onClick={() => handleSend(p.text)}
                                    className="chip min-h-touch px-4 py-2 rounded-full text-sm font-medium"
                                >
                                    {p.emoji} {p.text}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Message bubbles */}
                {messages.map((msg) => (
                    <MessageBubble
                        key={msg.id}
                        role={msg.role}
                        content={msg.content}
                        timestamp={msg.timestamp}
                    />
                ))}

                {/* Typing indicator */}
                {loading && (
                    <div className="flex justify-start mb-3 animate-fade-in">
                        <div className="w-8 h-8 rounded-full bg-bus-100 flex items-center justify-center mr-2 mt-1">
                            <span className="text-sm">🚌</span>
                        </div>
                        <div className="bg-chalk-100 border border-chalk-200 rounded-2xl rounded-bl-md px-5 py-4">
                            <div className="typing-dots">
                                <span /><span /><span />
                            </div>
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-3 mb-3 animate-fade-in">
                        <p className="text-danger text-sm">⚠️ {error}</p>
                        <button
                            onClick={clearError}
                            className="text-xs text-bus-700 mt-1 underline min-h-touch"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {/* Preview Route button */}
                {pendingStops && pendingStops.length > 0 && (
                    <div className="mb-3 animate-bounce-in">
                        <button
                            onClick={handlePreviewRoute}
                            className="w-full min-h-touch rounded-2xl bg-green-500 hover:bg-green-600 text-white font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-card"
                        >
                            🗺️ Preview Route →
                        </button>
                    </div>
                )}

                <div ref={scrollRef} />
            </div>

            {/* Input */}
            <ChatInput onSend={handleSend} loading={loading} />
        </div>
    );
}
