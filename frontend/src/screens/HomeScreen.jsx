/**
 * HomeScreen.jsx — Quick launch grid with school bus theme.
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useTripStore from '../store/tripStore';
import TripCard from '../components/TripCard';

export default function HomeScreen() {
    const navigate = useNavigate();
    const { trips, loading, error, fetchTrips, clearError } = useTripStore();

    useEffect(() => {
        fetchTrips();
    }, [fetchTrips]);

    const topTrips = [...trips]
        .sort((a, b) => {
            if (!a.last_used && !b.last_used) return 0;
            if (!a.last_used) return 1;
            if (!b.last_used) return -1;
            return new Date(b.last_used) - new Date(a.last_used);
        })
        .slice(0, 6);

    return (
        <div className="min-h-full">
            {/* Hero header with bus stripe */}
            <div className="bus-stripe px-5 pt-8 pb-6">
                <div className="flex items-center gap-3 mb-1">
                    <span className="text-3xl">🚌</span>
                    <h1 className="text-2xl font-extrabold text-bus-900">RouteEasy</h1>
                </div>
                <p className="text-bus-800 text-base ml-12">
                    Your routes, ready to roll
                </p>
            </div>

            <div className="px-4 pt-5 pb-4">
                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 animate-fade-in">
                        <p className="text-danger text-sm">⚠️ {error}</p>
                        <button
                            onClick={clearError}
                            className="text-sm text-bus-700 mt-1 underline min-h-touch"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {/* Loading skeleton */}
                {loading && trips.length === 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="skeleton rounded-2xl h-36" />
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && trips.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
                        <div className="w-20 h-20 rounded-full bg-bus-100 flex items-center justify-center mb-4">
                            <span className="text-4xl">🗺️</span>
                        </div>
                        <h2 className="text-xl font-bold text-body mb-2">No trips yet</h2>
                        <p className="text-secondary mb-6 max-w-xs">
                            Tap the button below to describe your first route to the AI assistant
                        </p>
                        <button
                            onClick={() => navigate('/chat')}
                            className="btn-primary min-h-touch px-8 rounded-2xl text-lg"
                        >
                            + Plan Your First Route
                        </button>
                    </div>
                )}

                {/* Section label */}
                {topTrips.length > 0 && (
                    <h2 className="text-sm font-semibold text-chalk-500 uppercase tracking-wider mb-3">
                        Recent Routes
                    </h2>
                )}

                {/* Trip grid */}
                {topTrips.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {topTrips.map((trip, idx) => (
                            <div key={trip.id} className="animate-fade-in" style={{ animationDelay: `${idx * 60}ms` }}>
                                <TripCard trip={trip} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Floating + button */}
            {trips.length > 0 && (
                <button
                    onClick={() => navigate('/chat')}
                    className="fixed bottom-24 right-5 z-40 w-14 h-14 rounded-full btn-primary text-2xl shadow-card-lg flex items-center justify-center"
                    aria-label="Plan a new route"
                >
                    +
                </button>
            )}
        </div>
    );
}
