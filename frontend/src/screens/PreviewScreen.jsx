/**
 * PreviewScreen.jsx — Route preview with school bus theme.
 */
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StopList from '../components/StopList';
import MapPreview from '../components/MapPreview';
import SaveTripModal from '../components/SaveTripModal';
import { buildGoogleMapsUrl, buildAppleMapsUrl, isIOS } from '../utils/mapsLinks';
import useTripStore from '../store/tripStore';

export default function PreviewScreen() {
    const location = useLocation();
    const navigate = useNavigate();
    const { launchCurrentTrip } = useTripStore();

    const initialStops = location.state?.stops || [];
    const tripId = location.state?.tripId || null;

    const [stops, setStops] = useState(initialStops);
    const [showSaveModal, setShowSaveModal] = useState(false);

    const handleReorder = (reordered) => setStops(reordered);
    const handleDeleteStop = (index) => setStops((prev) => prev.filter((_, i) => i !== index));

    const handleOpenGoogleMaps = async () => {
        if (tripId) await launchCurrentTrip(tripId);
        const url = buildGoogleMapsUrl(stops);
        if (url) window.open(url, '_blank');
    };

    const handleOpenAppleMaps = () => {
        const url = buildAppleMapsUrl(stops);
        if (url) window.open(url, '_blank');
    };

    const tooManyStops = stops.length > 10;

    return (
        <div className="min-h-full pb-6">
            {/* Header with bus stripe */}
            <div className="bus-stripe px-4 pt-4 pb-3">
                <button
                    onClick={() => navigate(-1)}
                    className="min-h-touch flex items-center gap-1 text-bus-900 font-semibold"
                >
                    ← Back
                </button>
            </div>

            <div className="px-4 pt-4">
                <h1 className="text-2xl font-bold text-body mb-4">Route Preview</h1>

                {stops.length === 0 ? (
                    <div className="text-center py-16 animate-fade-in">
                        <div className="w-16 h-16 rounded-full bg-bus-100 flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">📍</span>
                        </div>
                        <p className="text-chalk-500 text-lg">No stops to preview</p>
                        <button
                            onClick={() => navigate('/chat')}
                            className="mt-4 min-h-touch px-6 rounded-2xl btn-primary"
                        >
                            Plan a Route
                        </button>
                    </div>
                ) : (
                    <>
                        <MapPreview stops={stops} />

                        <div className="flex items-center justify-between mt-4 mb-2">
                            <h2 className="text-lg font-bold text-body">
                                {stops.length} Stop{stops.length !== 1 ? 's' : ''}
                            </h2>
                            <p className="text-sm text-chalk-400">Drag to reorder</p>
                        </div>

                        {tooManyStops && (
                            <div className="bg-bus-50 border border-bus-200 rounded-2xl p-3 mb-3">
                                <p className="text-sm text-bus-800">
                                    ⚠️ Google Maps supports ~8 waypoints on free tier. Consider splitting the route.
                                </p>
                            </div>
                        )}

                        <StopList stops={stops} onReorder={handleReorder} onDelete={handleDeleteStop} />

                        <div className="flex flex-col gap-3 mt-6">
                            <button
                                onClick={handleOpenGoogleMaps}
                                disabled={stops.length < 2}
                                className="w-full min-h-touch rounded-2xl btn-primary text-lg flex items-center justify-center gap-2 disabled:opacity-40"
                            >
                                🧭 Open in Google Maps
                            </button>

                            {isIOS() && (
                                <button
                                    onClick={handleOpenAppleMaps}
                                    disabled={stops.length < 2}
                                    className="w-full min-h-touch rounded-2xl bg-chalk-800 hover:bg-chalk-900 text-white font-semibold text-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-40"
                                >
                                    🍎 Open in Apple Maps
                                </button>
                            )}

                            <button
                                onClick={() => setShowSaveModal(true)}
                                className="w-full min-h-touch rounded-2xl bg-green-500 hover:bg-green-600 text-white font-bold text-lg flex items-center justify-center gap-2 transition-colors"
                            >
                                💾 Save This Trip
                            </button>
                        </div>
                    </>
                )}
            </div>

            {showSaveModal && (
                <SaveTripModal
                    stops={stops}
                    onClose={() => setShowSaveModal(false)}
                    onSaved={(saved) => { setShowSaveModal(false); navigate(`/trips/${saved.id}`); }}
                />
            )}
        </div>
    );
}
