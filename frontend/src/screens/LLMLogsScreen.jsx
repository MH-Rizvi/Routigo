/**
 * LLMLogsScreen.jsx — LLMOps dashboard with school bus theme.
 */
import { useEffect, useState } from 'react';
import { getLLMLogs } from '../api/client';

export default function LLMLogsScreen() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getLLMLogs();
                setLogs(data.items || []);
            } catch {
                setError('Could not load LLM logs.');
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const totalCalls = logs.length;
    const totalInputTokens = logs.reduce((sum, l) => sum + (l.input_tokens || 0), 0);
    const totalOutputTokens = logs.reduce((sum, l) => sum + (l.output_tokens || 0), 0);
    const totalTokens = totalInputTokens + totalOutputTokens;
    const avgLatency = totalCalls > 0
        ? Math.round(logs.reduce((sum, l) => sum + (l.latency_ms || 0), 0) / totalCalls)
        : 0;
    const successCount = logs.filter((l) => l.success).length;
    const successRate = totalCalls > 0 ? Math.round((successCount / totalCalls) * 100) : 0;

    return (
        <div className="min-h-full">
            {/* Header */}
            <div className="bus-stripe px-5 pt-6 pb-4">
                <h1 className="text-2xl font-extrabold text-bus-900">LLM Logs</h1>
                <p className="text-sm text-bus-800 mt-1">
                    Every AI call tracked for cost & performance observability
                </p>
            </div>

            <div className="px-4 pt-4 pb-4">
                {loading && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="skeleton rounded-2xl h-24" />
                        ))}
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 animate-fade-in">
                        <p className="text-danger text-sm">⚠️ {error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        {/* Summary cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                            <SummaryCard label="Total Calls" value={totalCalls} icon="📊" />
                            <SummaryCard label="Total Tokens" value={totalTokens.toLocaleString()} icon="🔤" />
                            <SummaryCard label="Avg Latency" value={`${avgLatency}ms`} icon="⚡" />
                            <SummaryCard
                                label="Success Rate"
                                value={`${successRate}%`}
                                icon={successRate >= 90 ? '✅' : '⚠️'}
                                highlight={successRate >= 90}
                            />
                        </div>

                        {logs.length === 0 ? (
                            <div className="text-center py-8 animate-fade-in">
                                <div className="w-16 h-16 rounded-full bg-bus-100 flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl">📊</span>
                                </div>
                                <p className="text-chalk-500">
                                    No LLM calls logged yet. Chat with the agent to generate logs.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto -mx-4">
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-chalk-200 text-left">
                                            <th className="px-4 py-3 font-semibold text-chalk-500 text-xs uppercase tracking-wider">Time</th>
                                            <th className="px-4 py-3 font-semibold text-chalk-500 text-xs uppercase tracking-wider">Model</th>
                                            <th className="px-4 py-3 font-semibold text-chalk-500 text-xs uppercase tracking-wider">Version</th>
                                            <th className="px-4 py-3 font-semibold text-chalk-500 text-xs uppercase tracking-wider text-right">In</th>
                                            <th className="px-4 py-3 font-semibold text-chalk-500 text-xs uppercase tracking-wider text-right">Out</th>
                                            <th className="px-4 py-3 font-semibold text-chalk-500 text-xs uppercase tracking-wider text-right">Latency</th>
                                            <th className="px-4 py-3 font-semibold text-chalk-500 text-xs uppercase tracking-wider text-center">OK</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logs.map((log, idx) => {
                                            const ts = new Date(log.timestamp);
                                            return (
                                                <tr
                                                    key={log.id}
                                                    className="border-b border-chalk-100 hover:bg-chalk-50 transition-colors animate-fade-in"
                                                    style={{ animationDelay: `${idx * 20}ms` }}
                                                >
                                                    <td className="px-4 py-3 whitespace-nowrap text-body">
                                                        {ts.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}{' '}
                                                        {ts.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                                                    </td>
                                                    <td className="px-4 py-3 text-body truncate max-w-[120px]">
                                                        {log.model}
                                                    </td>
                                                    <td className="px-4 py-3 text-chalk-500">{log.prompt_version}</td>
                                                    <td className="px-4 py-3 text-right text-body">{log.input_tokens ?? '—'}</td>
                                                    <td className="px-4 py-3 text-right text-body">{log.output_tokens ?? '—'}</td>
                                                    <td className="px-4 py-3 text-right text-body">
                                                        {log.latency_ms ? `${log.latency_ms}ms` : '—'}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        {log.success ? (
                                                            <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 inline-flex items-center justify-center text-xs font-bold">✓</span>
                                                        ) : (
                                                            <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 inline-flex items-center justify-center text-xs font-bold" title={log.error_message}>✗</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function SummaryCard({ label, value, icon, highlight = false }) {
    return (
        <div className={`rounded-2xl p-4 text-center border animate-fade-in ${highlight
                ? 'bg-bus-50 border-bus-200'
                : 'bg-card border-chalk-200 shadow-card'
            }`}>
            <span className="text-2xl">{icon}</span>
            <p className="text-xl font-extrabold text-body mt-1">{value}</p>
            <p className="text-xs text-chalk-400 mt-0.5">{label}</p>
        </div>
    );
}
