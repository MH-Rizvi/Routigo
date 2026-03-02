/**
 * ChatScreen.jsx — Dark enterprise agent chat interface.
 */
import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useChatStore from '../store/chatStore';
import MessageBubble from '../components/MessageBubble';
import ChatInput from '../components/ChatInput';
import useToastStore from '../store/toastStore';
import Header from '../components/Header';

const PROMPTS = [
    'Morning school run',
    'My usual Monday route',
    'What did I drive last week?',
    'From depot to Oak Avenue',
];

export default function ChatScreen() {
    const navigate = useNavigate();
    const { messages, lastRoute, loading, error, sendMessage, clearError, clearPendingStops, resetChat } = useChatStore();
    const scrollRef = useRef(null);

    useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

    useEffect(() => {
        if (error) {
            useToastStore.getState().showToast(error, 'error');
            clearError();
        }
    }, [error, clearError]);

    const handlePreviewRoute = (stops) => {
        if (!stops) return;
        navigate('/preview', { state: { stops } });
        clearPendingStops();
    };

    return (
        <div className="flex flex-col flex-1 w-full relative">
            <Header
                rightElement={messages.length > 0 && (
                    <button onClick={resetChat} className="min-h-touch px-3 text-sm text-accent font-bold tracking-wide hover:opacity-80 transition-opacity drop-shadow-md">
                        New Chat
                    </button>
                )}
            />

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 pb-4">
                {messages.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center h-full text-center animate-fade-up max-w-md mx-auto">
                        <div className="relative mb-6 group">
                            <div className="absolute inset-0 bg-accent/30 blur-2xl rounded-full opacity-50 group-hover:opacity-80 transition-opacity duration-700 mix-blend-screen" />
                            <div className="w-20 h-20 rounded-full bg-surface border border-border flex items-center justify-center relative z-10 shadow-xl">
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                            </div>
                        </div>
                        <h2 className="text-[28px] font-bold text-white mb-2 tracking-tight">Where to next?</h2>
                        <p className="text-text-secondary mb-8 text-[15px]">Describe your route in plain language</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                            {PROMPTS.map((p, i) => (
                                <button
                                    key={p}
                                    onClick={() => sendMessage(p)}
                                    className="bg-surface/50 hover:bg-surface border border-border hover:border-accent/50 rounded-[16px] p-4 text-left transition-all duration-300 group flex flex-col gap-2 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(245,158,11,0.08)]"
                                    style={{ animationDelay: `${i * 100}ms` }}
                                >
                                    <span className="text-accent max-w-min p-1.5 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                    </span>
                                    <span className="text-text-primary text-[14px] font-medium leading-tight">
                                        {p}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg) => (
                    <MessageBubble
                        key={msg.id}
                        role={msg.role}
                        content={msg.content}
                        timestamp={msg.timestamp}
                        routeStops={msg.routeStops}
                        onPreviewRoute={() => handlePreviewRoute(msg.routeStops)}
                    />
                ))}

                {loading && (
                    <div className="flex justify-start mb-3 animate-fade-up">
                        <div className="w-7 h-7 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mr-2 mt-1">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><circle cx="12" cy="10" r="3" /><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z" /></svg>
                        </div>
                        <div className="bg-surface border border-border rounded-2xl rounded-bl-md px-5 py-4">
                            <div className="typing-dots"><span /><span /><span /></div>
                        </div>
                    </div>
                )}

                <div ref={scrollRef} />
            </div>

            <ChatInput onSend={sendMessage} loading={loading} />
        </div>
    );
}
