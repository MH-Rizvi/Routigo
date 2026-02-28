/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{js,jsx}',
    ],
    theme: {
        extend: {
            colors: {
                // School bus yellow palette
                bus: {
                    50: '#FFF9E6',
                    100: '#FFF0B3',
                    200: '#FFE680',
                    300: '#FFD94D',
                    400: '#FFCC1A',
                    500: '#FFB800',  // Primary school bus yellow
                    600: '#E6A600',
                    700: '#CC9300',
                    800: '#996E00',
                    900: '#664A00',
                },
                // Warm neutrals
                chalk: {
                    50: '#FEFCF8',  // Page background — warm ivory
                    100: '#FDF8EF',
                    200: '#F5EFE6',
                    300: '#E8DFD3',
                    400: '#C4B8A8',
                    500: '#9A8E7E',
                    600: '#706557',
                    700: '#504538',
                    800: '#362E24',
                    900: '#1E1A14',
                },
                // Accent colors
                primary: '#FFB800',  // School bus yellow
                'primary-dark': '#E6A600',
                success: '#22C55E',
                danger: '#EF4444',
                background: '#FEFCF8',
                card: '#FFFFFF',
                body: '#1E1A14',
                secondary: '#706557',
                // Chat bubbles
                'user-bubble': '#FFB800',
                'agent-bubble': '#FDF8EF',
                // Tab bar
                'tab-active': '#FFB800',
                'tab-inactive': '#9A8E7E',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
            },
            fontSize: {
                base: ['16px', '24px'],
                lg: ['18px', '28px'],
                xl: ['20px', '30px'],
            },
            minWidth: {
                touch: '48px',
            },
            minHeight: {
                touch: '48px',
            },
            boxShadow: {
                'card': '0 2px 12px rgba(30, 26, 20, 0.06)',
                'card-lg': '0 4px 24px rgba(30, 26, 20, 0.10)',
                'glow': '0 0 20px rgba(255, 184, 0, 0.25)',
            },
            borderRadius: {
                '2xl': '16px',
                '3xl': '24px',
            },
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0', transform: 'translateY(8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'slide-up': {
                    '0%': { transform: 'translateY(100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'bounce-in': {
                    '0%': { transform: 'scale(0.9)', opacity: '0' },
                    '50%': { transform: 'scale(1.02)' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                'pulse-dot': {
                    '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.4' },
                    '40%': { transform: 'scale(1)', opacity: '1' },
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
            animation: {
                'fade-in': 'fade-in 0.3s ease-out',
                'slide-up': 'slide-up 0.3s ease-out',
                'bounce-in': 'bounce-in 0.4s ease-out',
                'pulse-dot': 'pulse-dot 1.4s infinite ease-in-out both',
                'shimmer': 'shimmer 1.5s infinite linear',
            },
        },
    },
    plugins: [],
};
