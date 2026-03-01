import { useState } from 'react';

export default function StopItem({ stop, index, onDelete, onUpdate, dragHandleProps }) {
    const [isEditingApproach, setIsEditingApproach] = useState(false);
    const [approachValue, setApproachValue] = useState(stop.approach_direction || '');

    const handleApproachBlur = () => {
        setIsEditingApproach(false);
        if (approachValue.trim() !== (stop.approach_direction || '')) {
            onUpdate(index, { ...stop, approach_direction: approachValue.trim() || null });
        }
    };

    return (
        <div className="flex flex-col card p-3 gap-2">
            <div className="flex items-center gap-3">
                <div {...dragHandleProps} className="flex items-center justify-center w-8 h-8 rounded-lg bg-elevated text-text-muted cursor-grab active:cursor-grabbing shrink-0 touch-none">
                    ⠿
                </div>
                <div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/50 text-accent flex items-center justify-center text-xs font-bold font-mono shrink-0">
                    {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">{stop.label}</p>
                    {stop.resolved && stop.resolved !== stop.label && (
                        <p className="text-xs text-text-muted truncate">{stop.resolved}</p>
                    )}
                </div>
                <button onClick={() => onDelete(index)} className="w-7 h-7 rounded-full bg-danger/10 hover:bg-danger/20 text-danger flex items-center justify-center text-xs shrink-0 transition-colors" aria-label={`Delete stop ${index + 1}`}>
                    ✕
                </button>
            </div>

            <div className="pl-14 pr-10">
                {isEditingApproach ? (
                    <input
                        autoFocus
                        type="text"
                        value={approachValue}
                        onChange={(e) => setApproachValue(e.target.value)}
                        onBlur={handleApproachBlur}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleApproachBlur(); }}
                        placeholder="e.g. approach westbound..."
                        className="w-full bg-elevated border border-accent-muted/30 rounded px-2 py-2 text-xs text-text-primary focus:outline-none focus:border-accent font-mono min-h-[48px]"
                    />
                ) : (
                    <div
                        onClick={() => setIsEditingApproach(true)}
                        className={`min-h-[48px] flex items-center px-2 cursor-pointer rounded border transition-colors ${stop.approach_direction ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-transparent border-dashed border-text-muted/30 text-text-muted hover:border-text-muted/50'}`}
                    >
                        <span className="text-xs font-mono select-none">
                            🚌 {stop.approach_direction ? stop.approach_direction : 'Add approach direction'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
