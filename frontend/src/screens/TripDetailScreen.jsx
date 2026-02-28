/**
 * TripDetailScreen.jsx — Single trip view with school bus theme.
 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useTripStore from '../store/tripStore';
import MapPreview from '../components/MapPreview';
import { buildGoogleMapsUrl } from '../utils/mapsLinks';

export default function TripDetailScreen() {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const { currentTrip, loading, error, fetchTrip, launchCurrentTrip, removeTrip } = useTripStore();
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (tripId) fetchTrip(Number(tripId));
    }, [tripId, fetchTrip]);

    const handleNavigate = async () => {
        if (!currentTrip?.stops?.length) return;
        await launchCurrentTrip(currentTrip.id);
        const url = buildGoogleMapsUrl(currentTrip.stops);
        if (url) window.open(url, '_blank');
    };

    const handleDelete = async () => {
        if (!currentTrip) return;
        setDeleting(true);
        await removeTrip(currentTrip.id);
        setDeleting(false);
        navigate('/trips');
    };

    if (loading && !currentTrip) {
        return (
            <div className="flex items-center justify-center min-h-full">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-bus-100 flex items-center justify-center animate-pulse">
                        <span className="text-2xl">🚌</span>
                    </div>
                    <p className="text-chalk-400">Loading trip…</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-full">
                <div className="bus-stripe px-4 pt-4 pb-3">
                    <button onClick={() => navigate(-1)} className="min-h-touch text-bus-900 font-semibold">← Back</button>
                </div>
                <div className="px-4 pt-4">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                        <p className="text-danger">⚠️ {error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!currentTrip) {
        return (
            <div className="px-4 pt-6 text-center py-16 animate-fade-in">
                <p className="text-chalk-500 text-lg">Trip not found</p>
                <button onClick={() => navigate('/trips')} className="mt-4 min-h-touch px-6 rounded-2xl btn-primary font-bold">
                    Go to Trips
                </button>
            </div>
        );
    }

    const stops = currentTrip.stops || [];

    return (
        <div className="min-h-full pb-6">
            {/* Header */}
            <div className="bus-stripe px-4 pt-4 pb-3">
                <button onClick={() => navigate(-1)} className="min-h-touch flex items-center gap-1 text-bus-900 font-semibold">
                    ← Back
                </button>
            </div>

            <div className="px-4 pt-4 animate-fade-in">
                <h1 className="text-2xl font-bold text-body mb-1">{currentTrip.name}</h1>
                {currentTrip.notes && (
                    <p className="text-chalk-500 text-sm mb-4">{currentTrip.notes}</p>
                )}

                {stops.length > 0 && <MapPreview stops={stops} />}

                <div className="mt-4 mb-2">
                    <h2 className="text-sm font-semibold text-chalk-500 uppercase tracking-wider">
                        {stops.length} Stop{stops.length !== 1 ? 's' : ''}
                    </h2>
                </div>

                <div className="flex flex-col gap-2 mb-6">
                    {stops.map((stop, i) => (
                        <div
                            key={stop.id || i}
                            className="flex items-center gap-3 bg-card rounded-2xl px-4 py-3 border border-chalk-200 shadow-card animate-fade-in"
                            style={{ animationDelay: `${i * 40}ms` }}
                        >
                            <div className="w-8 h-8 rounded-full bg-bus-500 text-bus-900 font-bold text-sm flex items-center justify-center shrink-0">
                                {i + 1}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-base font-semibold text-body truncate">{stop.label || stop.resolved}</p>
                                {stop.resolved && stop.resolved !== stop.label && (
                                    <p className="text-sm text-chalk-400 truncate">{stop.resolved}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleNavigate}
                        disabled={stops.length < 2}
                        className="w-full min-h-touch rounded-2xl btn-primary text-lg flex items-center justify-center gap-2 disabled:opacity-40"
                    >
                        🧭 Navigate Now
                    </button>

                    <button
                        onClick={() => navigate('/preview', { state: { stops, tripId: currentTrip.id } })}
                        className="w-full min-h-touch rounded-2xl bg-chalk-100 hover:bg-chalk-200 text-body font-semibold text-lg flex items-center justify-center gap-2 transition-colors"
                    >
                        ✏️ Edit Route
                    </button>

                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="w-full min-h-touch rounded-2xl border-2 border-red-300 text-danger font-semibold text-lg flex items-center justify-center gap-2 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                        {deleting ? (
                            <span className="typing-dots"><span /><span /><span /></span>
                        ) : '🗑️ Delete Trip'}
                    </button>
                </div>
            </div>
        </div>
    );
}
