/**
 * TripsScreen.jsx — Dark enterprise trips library with semantic search.
 */
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useTripStore from '../store/tripStore';
import SemanticSearchBar from '../components/SemanticSearchBar';

function TripRow({ trip, onDelete, onTap }) {
    const [offset, setOffset] = useState(0);
    const [swiping, setSwiping] = useState(false);
    const startX = useRef(0);

    const handleTouchStart = (e) => { startX.current = e.touches[0].clientX; setSwiping(true); };
    const handleTouchMove = (e) => { if (!swiping) return; const d = startX.current - e.touches[0].clientX; if (d > 0) setOffset(Math.min(d, 100)); };
    const handleTouchEnd = () => { setSwiping(false); if (offset > 60) onDelete(trip.id); setOffset(0); };

    const stopCount = trip.stops?.length || trip.stop_count || 0;
    const lastUsed = trip.last_used
        ? new Date(trip.last_used).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        : null;

    return (
        <div className="relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-danger flex items-center justify-end pr-6 rounded-2xl">
                <span className="text-white font-bold text-sm">Delete</span>
            </div>
            <div
                className="relative bg-[#111827] border-l-[3px] border-[#F59E0B] rounded-xl p-4 cursor-pointer transition-transform flex items-center justify-between"
                style={{ transform: `translateX(-${offset}px)` }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={() => onTap(trip.id)}
                role="button"
                tabIndex={0}
            >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="min-w-0">
                        <h3 className="text-[16px] font-semibold text-white truncate">{trip.name}</h3>
                        <div className="flex items-center gap-2 text-[13px] text-[#6B7280] mt-0.5">
                            <span>{stopCount} stops</span>
                            {lastUsed && <span>• last used {lastUsed}</span>}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    {trip.similarity !== undefined && (
                        <span className="px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold font-mono border border-accent/30">
                            {Math.round(trip.similarity * 100)}%
                        </span>
                    )}
                    <button
                        onClick={(e) => { e.stopPropagation(); /* launch logic handled by detail view conceptually, but here's the UI */ }}
                        className="bg-[#F59E0B]/10 text-[#F59E0B] text-[12px] font-bold px-3 py-1.5 rounded-full border border-[#F59E0B]/30 flex items-center gap-1 active:bg-[#F59E0B]/20"
                    >
                        ▶ Launch
                    </button>
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
        <div className="min-h-full pb-4">
            {/* Header */}
            <div className="h-14 flex items-center justify-between px-5 border-b border-[#1F2937] shrink-0">
                <div className="flex items-center gap-[10px]">
                    <img
                        src="/logo2_nobg.png"
                        alt="RouteEasy Icon"
                        className="w-[40px] h-[40px] object-contain"
                        style={{ filter: 'brightness(1.2) drop-shadow(0 0 4px rgba(245,158,11,0.3))' }}
                    />
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '20px' }}>
                        <span className="text-white font-bold tracking-tight">Route</span>
                        <span className="text-[#F59E0B] font-bold tracking-tight">Easy</span>
                    </div>
                </div>
                <span className="text-[#4B5563] text-[13px] font-medium">My Trips</span>
            </div>

            <div className="px-5 mt-5">
                <div className="mb-4"><SemanticSearchBar /></div>

                {error && (
                    <div className="card p-4 mb-4 border-danger/30 animate-fade-up">
                        <p className="text-danger text-sm">⚠ {error}</p>
                        <button onClick={clearError} className="text-sm text-accent mt-1 underline min-h-touch">Dismiss</button>
                    </div>
                )}

                {loading && displayTrips.length === 0 && (
                    <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="skeleton rounded-2xl h-20" />)}</div>
                )}

                {!loading && displayTrips.length === 0 && (
                    <div className="text-center py-16 animate-fade-up">
                        <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><circle cx="12" cy="10" r="3" /><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z" /></svg>
                        </div>
                        <p className="text-text-secondary">{isSearching ? 'No trips match your search' : 'No saved trips yet'}</p>
                    </div>
                )}

                {isSearching && displayTrips.length > 0 && (
                    <p className="text-xs text-text-muted mb-2 font-mono">{displayTrips.length} result{displayTrips.length !== 1 ? 's' : ''}</p>
                )}

                <div className="space-y-3">
                    {displayTrips.map((trip, i) => (
                        <div key={trip.id} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                            <TripRow trip={trip} onDelete={(id) => removeTrip(id)} onTap={(id) => navigate(`/trips/${id}`)} />
                        </div>
                    ))}
                </div>

                {!isSearching && trips.length > 0 && (
                    <p className="text-center text-xs text-text-muted mt-6">← Swipe left to delete</p>
                )}
            </div>
        </div>
    );
}
