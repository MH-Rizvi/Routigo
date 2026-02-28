/**
 * MessageBubble.jsx — Themed chat bubbles.
 * User: warm amber, right-aligned. Agent: ivory, left-aligned.
 */
export default function MessageBubble({ role, content, timestamp }) {
    const isUser = role === 'user';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 animate-fade-in`}>
            {/* Agent avatar */}
            {!isUser && (
                <div className="w-8 h-8 rounded-full bg-bus-100 flex items-center justify-center mr-2 mt-1 shrink-0">
                    <span className="text-sm">🚌</span>
                </div>
            )}

            <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${isUser
                        ? 'bg-bus-500 text-bus-900 rounded-br-md'
                        : 'bg-chalk-100 text-body rounded-bl-md border border-chalk-200'
                    }`}
            >
                <p className="text-base whitespace-pre-wrap break-words leading-relaxed">
                    {content}
                </p>

                {timestamp && (
                    <p className={`text-xs mt-1 ${isUser ? 'text-bus-700' : 'text-chalk-400'
                        }`}>
                        {new Date(timestamp).toLocaleTimeString(undefined, {
                            hour: 'numeric',
                            minute: '2-digit',
                        })}
                    </p>
                )}
            </div>
        </div>
    );
}
