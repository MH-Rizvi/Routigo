/**
 * SemanticSearchBar.jsx — Themed search bar with school bus colors.
 */
import { useState, useRef, useCallback } from 'react';
import useTripStore from '../store/tripStore';

export default function SemanticSearchBar() {
    const { searchTrips, clearSearch } = useTripStore();
    const [query, setQuery] = useState('');
    const timerRef = useRef(null);

    const handleChange = useCallback((e) => {
        const value = e.target.value;
        setQuery(value);

        clearTimeout(timerRef.current);

        if (!value.trim()) {
            clearSearch();
            return;
        }

        timerRef.current = setTimeout(() => {
            searchTrips(value.trim());
        }, 300);
    }, [searchTrips, clearSearch]);

    const handleClear = () => {
        setQuery('');
        clearSearch();
    };

    return (
        <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-chalk-400 text-lg">🔍</span>
            <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Search trips by meaning…"
                className="w-full min-h-touch rounded-2xl border border-chalk-300 pl-11 pr-10 py-3 text-base text-body bg-chalk-50 placeholder:text-chalk-400"
            />
            {query && (
                <button
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-chalk-200 hover:bg-chalk-300 flex items-center justify-center text-chalk-600 text-sm transition-colors"
                >
                    ✕
                </button>
            )}
        </div>
    );
}
