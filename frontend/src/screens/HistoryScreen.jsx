/**
 * HistoryScreen.jsx — History + RAG with school bus theme.
 */
import { useEffect, useState } from 'react';
import useTripStore from '../store/tripStore';
import { queryRAG } from '../api/client';

const RAG_EXAMPLES = [
    'What route did I do last Friday?',
    'Have I been to Oak Avenue?',
    'How many stops does my morning run have?',
    'What was my most recent trip?',
];

export default function HistoryScreen() {
    const { history, loading: histLoading, fetchHistory } = useTripStore();
    const [ragQuestion, setRagQuestion] = useState('');
    const [ragAnswer, setRagAnswer] = useState(null);
    const [ragError, setRagError] = useState(null);
    const [ragLoading, setRagLoading] = useState(false);

    useEffect(() => { fetchHistory(); }, [fetchHistory]);

    const handleAskRAG = async (question) => {
        const q = question || ragQuestion.trim();
        if (!q) return;
        setRagError(null);
        setRagAnswer(null);
        setRagLoading(true);
        try {
            const result = await queryRAG(q);
            if (result) setRagAnswer(result);
            else setRagError('Could not get an answer right now.');
        } catch {
            setRagError('Something went wrong. Please try again.');
        } finally {
            setRagLoading(false);
        }
    };

    return (
        <div className="min-h-full">
            {/* Header */}
            <div className="bus-stripe px-5 pt-6 pb-4">
                <h1 className="text-2xl font-extrabold text-bus-900">History</h1>
            </div>

            <div className="px-4 pt-4 pb-4">
                {/* RAG Q&A Panel */}
                <section className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-bus-100 flex items-center justify-center">
                            <span className="text-sm">🤖</span>
                        </div>
                        <h2 className="text-lg font-bold text-body">Ask About Your History</h2>
                    </div>

                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            value={ragQuestion}
                            onChange={(e) => setRagQuestion(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAskRAG()}
                            placeholder="Ask a question about your trips…"
                            className="flex-1 min-h-touch rounded-2xl border border-chalk-300 px-4 py-3 text-base text-body bg-chalk-50 placeholder:text-chalk-400 disabled:opacity-50"
                            disabled={ragLoading}
                        />
                        <button
                            onClick={() => handleAskRAG()}
                            disabled={ragLoading || !ragQuestion.trim()}
                            className="min-w-touch min-h-touch rounded-2xl btn-primary px-4 font-bold disabled:opacity-40"
                        >
                            {ragLoading ? '⏳' : 'Ask'}
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {RAG_EXAMPLES.map((q) => (
                            <button
                                key={q}
                                onClick={() => { setRagQuestion(q); handleAskRAG(q); }}
                                disabled={ragLoading}
                                className="chip min-h-touch px-3 py-2 rounded-full text-sm disabled:opacity-50"
                            >
                                {q}
                            </button>
                        ))}
                    </div>

                    {/* AI answer */}
                    {ragAnswer && (
                        <div className="bg-bus-50 border border-bus-200 rounded-2xl p-4 animate-fade-in">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">🤖</span>
                                <span className="text-sm font-bold text-bus-800">AI Answer</span>
                                <span className="text-xs text-chalk-400">Based on your history</span>
                            </div>
                            <p className="text-base text-body whitespace-pre-wrap">
                                {typeof ragAnswer === 'string'
                                    ? ragAnswer
                                    : ragAnswer.answer || JSON.stringify(ragAnswer)}
                            </p>
                            {ragAnswer.sources_used > 0 && (
                                <p className="text-xs text-chalk-400 mt-2">
                                    📚 Based on {ragAnswer.sources_used} source{ragAnswer.sources_used !== 1 ? 's' : ''}
                                </p>
                            )}
                        </div>
                    )}

                    {ragError && (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-3 animate-fade-in">
                            <p className="text-danger text-sm">⚠️ {ragError}</p>
                        </div>
                    )}
                </section>

                {/* Recent Launches */}
                <section>
                    <h2 className="text-sm font-semibold text-chalk-500 uppercase tracking-wider mb-3">
                        Recent Launches
                    </h2>

                    {histLoading && history.length === 0 && (
                        <div className="flex flex-col gap-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="skeleton rounded-2xl h-16" />
                            ))}
                        </div>
                    )}

                    {!histLoading && history.length === 0 && (
                        <div className="text-center py-8 animate-fade-in">
                            <p className="text-chalk-400">No launches yet. Navigate a trip to see it here.</p>
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        {history.map((h, idx) => {
                            const date = new Date(h.launched_at);
                            let stopsCount = 0;
                            try { stopsCount = JSON.parse(h.stops_json || '[]').length; } catch { stopsCount = 0; }

                            return (
                                <div
                                    key={h.id}
                                    className="bg-card border border-chalk-200 rounded-2xl p-4 card-hover animate-fade-in"
                                    style={{ animationDelay: `${idx * 40}ms` }}
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-base font-bold text-body truncate">
                                            {h.trip_name || 'Unnamed Trip'}
                                        </h3>
                                        <span className="text-xs text-chalk-400 shrink-0 ml-2">
                                            {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}{' '}
                                            {date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-chalk-500 mt-1 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-bus-400 inline-block" />
                                        {stopsCount} stop{stopsCount !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
}
