/**
 * StopItem.jsx — Individual stop in the reorderable list.
 */
export default function StopItem({ stop, index, onDelete, dragHandleProps }) {
    return (
        <div className="flex items-center gap-3 bg-card border border-chalk-200 rounded-2xl p-3 shadow-card">
            {/* Drag handle */}
            <div
                {...dragHandleProps}
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-chalk-100 text-chalk-400 cursor-grab active:cursor-grabbing shrink-0"
            >
                ⠿
            </div>

            {/* Stop number badge */}
            <div className="w-8 h-8 rounded-full bg-bus-500 text-bus-900 flex items-center justify-center text-sm font-bold shrink-0">
                {index + 1}
            </div>

            {/* Stop info */}
            <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-body truncate">
                    {stop.label}
                </p>
                {stop.resolved && stop.resolved !== stop.label && (
                    <p className="text-xs text-chalk-400 truncate">
                        {stop.resolved}
                    </p>
                )}
            </div>

            {/* Delete button */}
            <button
                onClick={() => onDelete(index)}
                className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-danger flex items-center justify-center text-sm shrink-0 transition-colors"
                aria-label={`Delete stop ${index + 1}`}
            >
                ✕
            </button>
        </div>
    );
}
