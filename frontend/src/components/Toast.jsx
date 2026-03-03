import React, { useEffect, useState } from 'react';
import useToastStore from '../store/toastStore';

export default function Toast() {
    const { message, type, action, isVisible, hideToast } = useToastStore();
    const [render, setRender] = useState(isVisible);

    // Handle out-animation
    useEffect(() => {
        if (isVisible) {
            setRender(true);
        } else {
            const timer = setTimeout(() => setRender(false), 300); // 300ms transition time
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    if (!render) return null;

    const themes = {
        success: {
            bg: 'bg-gradient-to-r from-emerald-600/90 to-emerald-800/90 border border-emerald-500/30',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-100">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            )
        },
        error: {
            bg: 'bg-gradient-to-r from-red-600/90 to-rose-900/90 border border-red-500/30',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-100">
                    <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
            )
        },
        info: {
            bg: 'bg-gradient-to-r from-surface to-elevated border border-border',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                    <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
            )
        },
        google: {
            bg: 'bg-gradient-to-r from-[#4285F4]/90 via-[#34A853]/90 to-[#EA4335]/90 border border-white/20',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                </svg>
            )
        },
        apple: {
            bg: 'bg-gradient-to-r from-gray-100/90 to-gray-300/90 border border-white/40 shadow-[0_4px_30px_rgba(255,255,255,0.1)]',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-black">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.05 2.53.81 3.19.81.79 0 2.21-1.01 3.84-.86 1.63.13 3.13.84 4.02 2.11-3.41 1.98-2.88 6.51.35 7.84-.79 1.83-2.09 3.85-3.4 5.07zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.28-1.9 4.2-3.74 4.25z" />
                </svg>
            )
        }
    };

    const currentTheme = themes[type] || themes.info;
    const textColor = type === 'apple' ? 'text-black' : 'text-white';

    return (
        <div className="fixed top-12 sm:top-6 left-1/2 -translate-x-1/2 z-[9999999] w-11/12 max-w-sm pointer-events-none">
            <div
                className={`flex items-center justify-between px-4 py-3 rounded-2xl shadow-xl backdrop-blur-md pointer-events-auto transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-6 scale-95'
                    } ${currentTheme.bg} ${textColor}`}
                role="alert"
            >
                <div className="flex flex-1 items-center gap-3">
                    <span className="flex items-center justify-center shrink-0" aria-hidden="true">{currentTheme.icon}</span>
                    <span className="font-semibold tracking-wide text-[14px] leading-tight break-words">{message.replace(/^(✅|⚠️|🚌)\s*/, '')}</span>
                </div>

                <div className="flex items-center gap-2 pl-3">
                    {action && (
                        <button
                            onClick={() => {
                                action.onClick();
                                hideToast();
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors ${type === 'apple' ? 'bg-black/10 hover:bg-black/20 text-black' : 'bg-white/20 hover:bg-white/30 text-white'}`}
                        >
                            {action.label}
                        </button>
                    )}

                    <button
                        onClick={hideToast}
                        className={`p-1 rounded-full opacity-60 hover:opacity-100 transition-all active:scale-95 shrink-0 ${type === 'apple' ? 'hover:bg-black/10' : 'hover:bg-white/20'}`}
                        aria-label="Close notification"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
