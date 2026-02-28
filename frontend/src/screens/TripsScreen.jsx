/**
 * TripsScreen.jsx — Trips library with school bus theme.
 */
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useTripStore from '../store/tripStore';
import SemanticSearchBar from '../components/SemanticSearchBar';

function SwipeableTripRow({ trip, onDelete, onTap }) {
    const [offset, setOffset] = useState(0);
    const [swiping, setSwiping] = useState(false);
    const startX = useRef(0);

    const handleTouchStart = (e) => {
        startX.current = e.touches[0].clientX;
        setSwiping(true);
    };
    const handleTouchMove = (e) => {
        if (!swiping) return;
        const diff = startX.current - e.touches[0].clientX;
        if (diff > 0) setOffset(Math.min(diff, 100));
    };
    const handleTouchEnd = () => {
        setSwiping(false);
        if (offset > 60) onDelete(trip.id);
        setOffset(0);
    };

    const stopCount = trip.stops?.length || trip.stop_count || 0;
    const lastUsed = trip.last_used
        ? new Date(trip.last_used).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        : null;

    return (
        <div className="relative overflow-hidden rounded-2xl">
            {/* Delete backdrop */}
            <div className="absolute inset-0 bg-red-500 flex items-center justify-end pr-6 rounded-2xl">
                <span className="text-white font-bold">Delete</span>
            </div>

            {/* Card */}
            <div
                className="relative bg-card border border-chalk-200 rounded-2xl p-4 cursor-pointer card-hover transition-transform"
                style={{ transform: `translateX(-${offset}px)` }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={() => onTap(trip.id)}
                role="button"
                tabIndex={0}
            >
                <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-bold text-body truncate">{trip.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-chalk-500 mt-1">
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-bus-400 inline-block" />
                                {stopCount} stop{stopCount !== 1 ? 's' : ''}
                            </span>
                            {lastUsed && <span className="text-chalk-300">• {lastUsed}</span>}
                        </div>
                    </div>

                    {trip.similarity !== undefined && (
                        <span className="shrink-0 ml-3 px-3 py-1 rounded-full bg-bus-100 text-bus-800 text-sm font-bold border border-bus-200">
                            {Math.round(trip.similarity * 100)}%
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function TripsScreen() {
    const navigate = useNavigate();
    const { trips, searchResults, loading, error, fetchTrips, removeTrip, clearError } = useTripStore();

    useEffect(() => { fetchTrips(); }, [fetchTrips]);

    const isSearching = searchResults.length > 0;
    const displayTrips = isSearching ? searchResults : trips;

    return (
        <div className="min-h-full">
            {/* Header */}
            <div className="bus-stripe px-5 pt-6 pb-4">
                <h1 className="text-2xl font-extrabold text-bus-900">My Trips</h1>
            </div>

            <div className="px-4 pt-4 pb-4">
                <div className="mb-4">
                    <SemanticSearchBar />
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 animate-fade-in">
                        <p className="text-danger text-sm">⚠️ {error}</p>
                        <button onClick={clearError} className="text-sm text-bus-700 mt-1 underline min-h-touch">
                            Dismiss
                        </button>
                    </div>
                )}

                {loading && displayTrips.length === 0 && (
                    <div className="flex flex-col gap-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="skeleton rounded-2xl h-20" />
                        ))}
                    </div>
                )}

                {!loading && displayTrips.length === 0 && (
                    <div className="text-center py-16 animate-fade-in">
                        <div className="w-16 h-16 rounded-full bg-bus-100 flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">📭</span>
                        </div>
                        <p className="text-chalk-500 text-lg">
                            {isSearching ? 'No trips match your search' : 'No saved trips yet'}
                        </p>
                    </div>
                )}

                {isSearching && displayTrips.length > 0 && (
                    <p className="text-sm text-chalk-400 mb-2">
                        {displayTrips.length} result{displayTrips.length !== 1 ? 's' : ''} found
                    </p>
                )}

                <div className="flex flex-col gap-3">
                    {displayTrips.map((trip, idx) => (
                        <div key={trip.id} className="animate-fade-in" style={{ animationDelay: `${idx * 40}ms` }}>
                            <SwipeableTripRow
                                trip={trip}
                                onDelete={(id) => removeTrip(id)}
                                onTap={(id) => navigate(`/trips/${id}`)}
                            />
                        </div>
                    ))}
                </div>

                {!isSearching && trips.length > 0 && (
                    <p className="text-center text-xs text-chalk-400 mt-6">
                        ← Swipe left on a trip to delete
                    </p>
                )}
            </div>
        </div>
    );
}
