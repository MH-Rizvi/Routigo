/**
 * App.jsx — Root component with React Router v6.
 * School bus themed bottom tab bar navigation.
 */
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';

import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import PreviewScreen from './screens/PreviewScreen';
import TripsScreen from './screens/TripsScreen';
import TripDetailScreen from './screens/TripDetailScreen';
import HistoryScreen from './screens/HistoryScreen';
import LLMLogsScreen from './screens/LLMLogsScreen';

const TABS = [
    { path: '/', label: 'Home', icon: '🏠', activeIcon: '🏡' },
    { path: '/chat', label: 'Chat', icon: '💬', activeIcon: '🗨️' },
    { path: '/trips', label: 'Trips', icon: '🗺️', activeIcon: '🚌' },
    { path: '/history', label: 'History', icon: '📋', activeIcon: '📖' },
    { path: '/admin/logs', label: 'Logs', icon: '📊', activeIcon: '📈' },
];

function BottomTabBar() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 glass-bar border-t border-chalk-200 safe-area-bottom">
            <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
                {TABS.map((tab) => (
                    <NavLink
                        key={tab.path}
                        to={tab.path}
                        end={tab.path === '/'}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center min-w-touch min-h-touch px-2 py-1 rounded-xl transition-all duration-200 ${isActive
                                ? 'text-bus-800 font-semibold scale-110'
                                : 'text-chalk-500 hover:text-chalk-700'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <span className={`text-xl leading-none transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                                    {isActive ? tab.activeIcon : tab.icon}
                                </span>
                                <span className={`text-[11px] mt-0.5 transition-colors ${isActive ? 'text-bus-700' : ''}`}>
                                    {tab.label}
                                </span>
                                {isActive && (
                                    <div className="absolute bottom-1 w-1 h-1 rounded-full bg-bus-500" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}

function AppShell() {
    const location = useLocation();
    const hideTabBar = location.pathname.startsWith('/preview');

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <main className={`flex-1 overflow-y-auto ${hideTabBar ? '' : 'pb-20'}`}>
                <Routes>
                    <Route path="/" element={<HomeScreen />} />
                    <Route path="/chat" element={<ChatScreen />} />
                    <Route path="/preview" element={<PreviewScreen />} />
                    <Route path="/trips" element={<TripsScreen />} />
                    <Route path="/trips/:tripId" element={<TripDetailScreen />} />
                    <Route path="/history" element={<HistoryScreen />} />
                    <Route path="/admin/logs" element={<LLMLogsScreen />} />
                </Routes>
            </main>
            {!hideTabBar && <BottomTabBar />}
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AppShell />
        </BrowserRouter>
    );
}
