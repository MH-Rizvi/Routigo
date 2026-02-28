/**
 * SaveTripModal.jsx — School-bus-themed save modal.
 */
import { useState } from 'react';
import useTripStore from '../store/tripStore';

export default function SaveTripModal({ stops, onClose, onSaved }) {
    const { saveTrip, loading } = useTripStore();

    const defaultName =
        stops && stops.length >= 2
            ? `${stops[0].label} → ${stops[stops.length - 1].label}`
            : 'My Trip';

    const [name, setName] = useState(defaultName);
    const [notes, setNotes] = useState('');
    const [error, setError] = useState(null);

    const handleSave = async () => {
        if (!name.trim()) {
            setError('Please enter a trip name.');
            return;
        }
        setError(null);
        const tripData = {
            name: name.trim(),
            notes: notes.trim() || null,
            stops: stops.map((s, i) => ({
                label: s.label,
                resolved: s.resolved,
                lat: s.lat,
                lng: s.lng,
                note: s.note || null,
                position: i,
            })),
        };
        const saved = await saveTrip(tripData);
        if (saved) onSaved?.(saved);
        else setError('Something went wrong saving your trip.');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">
            <div className="bg-card rounded-3xl w-full max-w-md shadow-card-lg animate-slide-up overflow-hidden">
                {/* Yellow accent top */}
                <div className="bus-stripe h-2" />

                <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">💾</span>
                        <h2 className="text-xl font-bold text-body">Save This Trip</h2>
                    </div>

                    <label className="block text-sm font-semibold text-chalk-500 mb-1">
                        Trip Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full min-h-touch rounded-2xl border border-chalk-300 px-4 py-3 text-base text-body bg-chalk-50 mb-4"
                        placeholder="e.g. Morning School Run"
                    />

                    <label className="block text-sm font-semibold text-chalk-500 mb-1">
                        Notes (optional)
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="w-full rounded-2xl border border-chalk-300 px-4 py-3 text-base text-body bg-chalk-50 mb-4 resize-none"
                        placeholder="Any notes about this route…"
                    />

                    {error && (
                        <p className="text-danger text-sm mb-3 animate-fade-in">⚠️ {error}</p>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 min-h-touch rounded-2xl border border-chalk-300 text-body font-medium text-base hover:bg-chalk-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex-1 min-h-touch rounded-2xl bg-green-500 hover:bg-green-600 text-white font-bold text-base transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <span className="typing-dots"><span /><span /><span /></span>
                            ) : (
                                '💾 Save Trip'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
