import { create } from 'zustand';

const useToastStore = create((set, get) => ({
    message: '',
    type: 'info', // 'success', 'error', 'info', 'google', 'apple'
    action: null, // { label: string, onClick: function }
    isVisible: false,
    timeoutId: null,

    showToast: (message, type = 'info', action = null, duration = 3000) => {
        const currentTimeout = get().timeoutId;
        if (currentTimeout) {
            clearTimeout(currentTimeout);
        }

        const newTimeoutId = setTimeout(() => {
            set({ isVisible: false });
        }, duration);

        set({
            message,
            type,
            action,
            isVisible: true,
            timeoutId: newTimeoutId,
        });
    },

    hideToast: () => {
        const currentTimeout = get().timeoutId;
        if (currentTimeout) {
            clearTimeout(currentTimeout);
        }
        set({ isVisible: false, timeoutId: null, action: null });
    }
}));

export default useToastStore;
