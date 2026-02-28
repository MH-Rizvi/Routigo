/**
 * TripCard.jsx — School-bus-themed trip card with warm styling.
 */
import { useNavigate } from 'react-router-dom';
import useTripStore from '../store/tripStore';
import { buildGoogleMapsUrl } from '../utils/mapsLinks';

export default function TripCard({ trip }) {
    const navigate = useNavigate();
    const { launchCurrentTrip } = useTripStore();

    const stopCount = trip.stops?.length || 0;
    const lastUsed = trip.last_used
        ? new Date(trip.last_used).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
        })
        : 'Never';

    const handleNavigate = async (e) => {
        e.stopPropagation();
        if (!trip.stops || trip.stops.length < 2) {
            navigate(`/trips/${trip.id}`);
            return;
        }
        await launchCurrentTrip(trip.id);
        const url = buildGoogleMapsUrl(trip.stops);
        if (url) window.open(url, '_blank');
    };

    return (
        <div
            className="bg-card rounded-2xl shadow-card border border-chalk-200 p-5 flex flex-col gap-3 card-hover cursor-pointer"
            onClick={() => navigate(`/trips/${trip.id}`)}
            role="button"
            tabIndex={0}
        >
            {/* Yellow accent strip at top */}
            <div className="h-1 -mt-5 -mx-5 rounded-t-2xl bus-stripe" />

            {/* Trip name */}
            <h3 className="text-xl font-bold text-body truncate mt-2">
                {trip.name}
            </h3>

            {/* Meta */}
            <div className="flex items-center gap-3 text-chalk-500 text-sm">
                <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-bus-400 inline-block" />
                    {stopCount} stop{stopCount !== 1 ? 's' : ''}
                </span>
                <span className="text-chalk-300">•</span>
                <span>{lastUsed}</span>
            </div>

            {/* Navigate button */}
            <button
                onClick={handleNavigate}
                className="mt-1 w-full min-h-touch btn-primary rounded-xl text-lg flex items-center justify-center gap-2"
            >
                🧭 Navigate Now
            </button>
        </div>
    );
}
