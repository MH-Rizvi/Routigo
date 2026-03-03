import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import useAuthStore from '../store/authStore';
import { logout } from '../api/client';

export default function LogoutModal({ onClose }) {
    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    const handleConfirm = () => {
        useAuthStore.getState().clearUser();
        logout();
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/80 px-4 py-8 pointer-events-auto">
            <div className="bg-surface border border-border rounded-2xl w-full max-w-sm shadow-card-lg animate-slide-up overflow-hidden relative z-[1000000]">
                <div className="h-1 bg-red-500" />
                <div className="p-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-text-primary mb-2">Log Out</h2>
                    <p className="text-sm text-text-secondary mb-6">
                        Are you sure you want to securely log out of your session? You will need to sign in again to access your routes.
                    </p>

                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 min-h-touch rounded-xl btn-surface text-base border border-border-hl hover:bg-border transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleConfirm} className="flex-1 min-h-touch rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-base transition-all shadow-lg shadow-red-900/20 border border-red-500/50">
                            Log out
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
