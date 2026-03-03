/**
 * LandingPage.jsx — Premium public marketing page with live AI demo.
 * Uses the project's amber/gold (#F59E0B) accent + dark (#0A0F1E) theme.
 */
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendDemoMessage } from '../api/client';

/* ──────────────────────────────────────────────
   SVG ICON COMPONENTS
   ────────────────────────────────────────────── */
const IconChat = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
);
const IconMapPin = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
);
const IconNavigation = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>
);
const IconSparkle = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
);
const IconSend = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
);
const IconChevron = ({ open }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9" /></svg>
);

/* Feature SVG icons — minimal stroke style */
const IconBrain = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4c0 1.1-.9 2-2 2" /><path d="M12 2a4 4 0 0 0-4 4c0 1.1.9 2 2 2" /><path d="M16 6a4 4 0 0 1 2 7" /><path d="M8 6a4 4 0 0 0-2 7" /><path d="M18 13a4 4 0 0 1-1.5 5.5" /><path d="M6 13a4 4 0 0 0 1.5 5.5" /><path d="M12 22v-6" /><path d="M12 8v2" /><circle cx="12" cy="12" r="1" /></svg>
);
const IconLayers = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
);
const IconHistory = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /><path d="M4.93 4.93l2.83 2.83" /></svg>
);
const IconNavArrow = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>
);
const IconWifiOff = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23" /><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" /><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" /><path d="M10.71 5.05A16 16 0 0 1 22.56 9" /><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></svg>
);
const IconBarChart = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
);


/* ──────────────────────────────────────────────
   DEMO CHAT WIDGET (lives inside the hero)
   ────────────────────────────────────────────── */
function DemoChat({ onRequiresAuth }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const scrollRef = useRef(null);

    const CHIPS = [
        'Morning school run',
        'From depot to Oak Avenue',
        'My usual Monday route',
    ];

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, loading]);

    const send = async (text) => {
        if (!text.trim() || loading) return;
        const userMsg = { role: 'user', content: text.trim() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        const newHistory = [...history, userMsg];

        try {
            const data = await sendDemoMessage(text.trim(), newHistory);

            if (data.requires_auth) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
                onRequiresAuth();
                return;
            }

            const assistantMsg = { role: 'assistant', content: data.reply, stops: data.stops || [] };
            setMessages(prev => [...prev, assistantMsg]);
            setHistory([...newHistory, { role: 'assistant', content: data.reply }]);
        } catch (err) {
            const errMsg = err.response?.status === 429
                ? 'Demo limit reached — sign up for unlimited access!'
                : 'Something went wrong. Try again.';
            setMessages(prev => [...prev, { role: 'assistant', content: errMsg }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[520px] mx-auto rounded-3xl border border-white/[0.08] bg-surface/80 backdrop-blur-xl shadow-[0_8px_64px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col" style={{ height: 'min(440px, 60vh)' }}>
            {/* Chat header */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="w-9 h-9 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center p-1.5 shadow-lg shadow-amber-500/10">
                    <img src="/logo3_nobg.png" alt="AI Agent" className="w-full h-full object-contain" />
                </div>
                <div>
                    <p className="text-white text-[13px] font-semibold tracking-tight">Routigo AI Agent</p>
                    <p className="text-emerald-400 text-[11px] flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" /> Online</p>
                </div>
            </div>

            {/* Messages area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 hide-scrollbar">
                {messages.length === 0 && (
                    <div className="text-center pt-6">
                        <p className="text-white/40 text-[13px] mb-4">Try asking the AI agent:</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {CHIPS.map(chip => (
                                <button
                                    key={chip}
                                    onClick={() => send(chip)}
                                    className="px-3.5 py-2 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/70 text-[12px] hover:bg-amber-600/20 hover:border-amber-500/30 hover:text-white transition-all duration-200 cursor-pointer"
                                >
                                    {chip}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                            ? 'bg-amber-600 text-white rounded-br-md'
                            : 'bg-white/[0.06] text-white/90 rounded-bl-md border border-white/[0.06]'
                            }`}>
                            {msg.content}
                            {msg.stops?.length > 0 && (
                                <button
                                    onClick={() => onRequiresAuth()}
                                    className="mt-3 w-full py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-white text-[12px] font-bold hover:brightness-110 transition-all active:scale-95"
                                >
                                    Preview Route →
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white/[0.06] border border-white/[0.06] px-4 py-3 rounded-2xl rounded-bl-md">
                            <div className="flex gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-400/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-2 h-2 rounded-full bg-amber-400/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-2 h-2 rounded-full bg-amber-400/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2 px-4 py-3 border-t border-white/[0.06] bg-white/[0.02]">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Describe your route..."
                    className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2.5 text-[13px] text-white placeholder-white/30 outline-none focus:border-amber-500/40 transition-colors"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white disabled:opacity-30 hover:bg-amber-500 transition-colors active:scale-90 shrink-0"
                >
                    <IconSend />
                </button>
            </form>
        </div>
    );
}


/* ──────────────────────────────────────────────
   SIGNUP GATE MODAL
   ────────────────────────────────────────────── */
function SignupGateModal({ onClose }) {
    const navigate = useNavigate();
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="bg-surface border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mx-auto mb-5 shadow-lg shadow-amber-500/10 p-3">
                    <img src="/logo3_nobg.png" alt="AI Agent" className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]" />
                </div>
                <h3 className="text-white text-xl font-bold mb-2">Create a free account</h3>
                <p className="text-white/50 text-sm mb-6 leading-relaxed">Save your routes, launch in Google Maps, and get unlimited AI access.</p>
                <button
                    onClick={() => navigate('/login')}
                    className="w-full py-3.5 rounded-2xl bg-accent text-base font-bold text-[15px] hover:brightness-110 transition-colors active:scale-95 mb-3"
                >
                    Sign Up Free
                </button>
                <button
                    onClick={() => navigate('/login')}
                    className="w-full py-3 rounded-2xl bg-white/[0.05] border border-white/10 text-white/70 font-medium text-[14px] hover:bg-white/[0.08] transition-colors"
                >
                    I already have an account
                </button>
            </div>
        </div>
    );
}


/* ──────────────────────────────────────────────
   FAQ ACCORDION ITEM
   ────────────────────────────────────────────── */
function FAQItem({ q, a }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-white/[0.06] last:border-0">
            <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 px-1 text-left group">
                <span className="text-white text-[15px] font-medium pr-4 group-hover:text-accent transition-colors">{q}</span>
                <IconChevron open={open} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-40 pb-4' : 'max-h-0'}`}>
                <p className="text-white/50 text-[14px] leading-relaxed px-1">{a}</p>
            </div>
        </div>
    );
}


/* ──────────────────────────────────────────────
   MAIN LANDING PAGE
   ────────────────────────────────────────────── */
export default function LandingPage() {
    const navigate = useNavigate();
    const [showGateModal, setShowGateModal] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const FEATURES = [
        { icon: <IconBrain />, title: 'LangChain AI Agent', desc: 'Reasons through your request step by step using the ReAct architecture.' },
        { icon: <IconLayers />, title: 'Semantic Memory', desc: "Remembers your stops. Say \"the co-op\" and it knows exactly where you mean." },
        { icon: <IconHistory />, title: 'RAG Trip History', desc: 'Ask "have I been to Oak Ave before?" and get a real answer from your history.' },
        { icon: <IconNavArrow />, title: 'One-Tap Navigation', desc: 'Opens Google Maps or Apple Maps with all stops pre-loaded, ready to drive.' },
        { icon: <IconWifiOff />, title: 'Works Offline', desc: 'Saved trips available even without signal. Perfect for tunnels and rural areas.' },
        { icon: <IconBarChart />, title: 'Driving Stats', desc: 'Track your daily and weekly mileage, trip count, and driving patterns over time.' },
    ];

    const FAQ = [
        { q: 'Is Routigo free to use?', a: 'Yes, sign up free. No credit card needed.' },
        { q: 'Do I need to type exact addresses?', a: 'No. Just describe stops in plain language like "the school on Oak Avenue" — the AI figures it out.' },
        { q: 'Does it work on my phone?', a: 'Yes. Routigo is a Progressive Web App — add it to your home screen for a native app experience on iOS and Android.' },
        { q: 'What if I drive the same route every day?', a: 'Save it once, re-launch it in one tap. The AI also recognises it if you just say "my usual morning run."' },
        { q: 'Is my data private?', a: 'Yes. All your trips and history are private to your account and never shared.' },
    ];

    return (
        <div className="min-h-screen bg-base text-white overflow-x-hidden">

            {/* ═══ NAVBAR ═══ */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-base/90 backdrop-blur-xl border-b border-white/[0.06] shadow-lg' : ''}`}>
                <div className="max-w-6xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <img src="/logo3_nobg.png" alt="Routigo" className="w-12 h-12 object-contain drop-shadow-sm" />
                        <span className="text-accent font-bold text-2xl tracking-tight">Routigo</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/login')} className="hidden sm:block text-white/60 hover:text-white text-[13px] font-medium transition-colors px-3 py-2">
                            Sign In
                        </button>
                        <button onClick={() => navigate('/login')} className="px-5 py-2.5 rounded-xl bg-accent text-base text-[13px] font-bold hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-amber-500/20">
                            Get Started Free
                        </button>
                    </div>
                </div>
            </nav>


            {/* ═══ HERO ═══ */}
            <section className="relative pt-28 sm:pt-36 pb-20 px-5 sm:px-8">
                {/* Background effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-amber-500/[0.06] rounded-full blur-[120px]" />
                    <div className="absolute top-40 left-1/4 w-[400px] h-[400px] bg-amber-600/[0.04] rounded-full blur-[100px]" />
                    <div className="absolute top-60 right-1/4 w-[300px] h-[300px] bg-amber-400/[0.03] rounded-full blur-[80px]" />
                </div>

                <div className="relative max-w-6xl mx-auto">
                    {/* Badge */}
                    <div className="flex justify-center mb-6 animate-fade-up">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[12px] font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            Powered by LangChain ReAct Agent
                        </div>
                    </div>

                    {/* Headline */}
                    <h1 className="text-center text-[clamp(32px,6vw,64px)] font-extrabold leading-[1.08] tracking-tight mb-5 animate-fade-up" style={{ animationDelay: '80ms' }}>
                        <span className="bg-gradient-to-b from-white via-white to-white/50 bg-clip-text text-transparent">Describe your route.</span>
                        <br />
                        <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 bg-clip-text text-transparent">Drive in seconds.</span>
                    </h1>

                    <p className="text-center text-white/45 text-[clamp(15px,2vw,18px)] max-w-lg mx-auto mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: '160ms' }}>
                        Tell the AI where you need to go in plain English.<br className="hidden sm:block" /> It geocodes every stop and launches Google Maps — instantly.
                    </p>

                    {/* Demo Chat Widget */}
                    <div className="animate-fade-up" style={{ animationDelay: '240ms' }}>
                        <DemoChat onRequiresAuth={() => setShowGateModal(true)} />
                    </div>
                </div>
            </section>


            {/* ═══ HOW IT WORKS ═══ */}
            <section className="py-20 px-5 sm:px-8 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/[0.02] to-transparent pointer-events-none" />
                <div className="max-w-4xl mx-auto relative">
                    <h2 className="text-center text-2xl sm:text-3xl font-bold mb-3">How it works</h2>
                    <p className="text-center text-white/40 text-sm mb-12">Three steps to your next route.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                        {[
                            { step: '01', icon: <IconChat />, title: 'Describe your route', desc: 'Type or speak where you need to go — no addresses required.' },
                            { step: '02', icon: <IconMapPin />, title: 'AI resolves stops', desc: 'The agent geocodes each stop and checks your semantic memory.' },
                            { step: '03', icon: <IconNavigation />, title: 'Launch navigation', desc: 'One tap to open Google Maps with every stop pre-loaded.' },
                        ].map((item) => (
                            <div key={item.step} className="group relative text-center p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-amber-500/20 hover:bg-amber-600/[0.03] transition-all duration-300">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold tracking-widest">
                                    STEP {item.step}
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-400/5 border border-amber-500/10 flex items-center justify-center mx-auto mt-3 mb-4 text-amber-400 group-hover:scale-110 transition-transform duration-300">
                                    {item.icon}
                                </div>
                                <h3 className="text-white font-semibold text-[15px] mb-2">{item.title}</h3>
                                <p className="text-white/40 text-[13px] leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* ═══ FEATURES ═══ */}
            <section className="py-20 px-5 sm:px-8">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-center text-2xl sm:text-3xl font-bold mb-3">Built for real-world drivers</h2>
                    <p className="text-center text-white/40 text-sm mb-12">Enterprise-grade AI. Dead-simple interface.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {FEATURES.map((f) => (
                            <div key={f.title} className="group p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-amber-500/15 hover:bg-white/[0.04] transition-all duration-300">
                                <div className="text-amber-400 mb-3">{f.icon}</div>
                                <h3 className="text-white font-semibold text-[15px] mb-1.5">{f.title}</h3>
                                <p className="text-white/40 text-[13px] leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* ═══ SOCIAL PROOF / STATS ═══ */}
            <section className="py-20 px-5 sm:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                        {/* Card 1: AI Tools */}
                        <div className="group relative text-center p-10 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-amber-500/25 hover:shadow-[0_0_30px_rgba(245,158,11,0.06)] transition-all duration-300 overflow-hidden">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                            <div className="text-amber-400/60 mb-4 flex justify-center">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
                            </div>
                            <p className="text-[clamp(44px,6vw,60px)] font-extrabold bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600/60 bg-clip-text text-transparent leading-none mb-3">5</p>
                            <p className="text-white text-[14px] font-semibold mb-1.5">AI Tools</p>
                            <p className="text-white/30 text-[12px] leading-relaxed">Geocoding, semantic search, trip recall, history retrieval, RAG</p>
                        </div>

                        {/* Card 2: Response Time */}
                        <div className="group relative text-center p-10 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-amber-500/25 hover:shadow-[0_0_30px_rgba(245,158,11,0.06)] transition-all duration-300 overflow-hidden">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                            <div className="text-amber-400/60 mb-4 flex justify-center">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                            </div>
                            <p className="text-[clamp(44px,6vw,60px)] font-extrabold bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600/60 bg-clip-text text-transparent leading-none mb-3">&lt; 8s</p>
                            <p className="text-white text-[14px] font-semibold mb-1.5">Response Time</p>
                            <p className="text-white/30 text-[12px] leading-relaxed">Average agent reasoning chain completion</p>
                        </div>

                        {/* Card 3: Time to first route */}
                        <div className="group relative text-center p-10 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-amber-500/25 hover:shadow-[0_0_30px_rgba(245,158,11,0.06)] transition-all duration-300 overflow-hidden">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                            <div className="text-amber-400/60 mb-4 flex justify-center">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            </div>
                            <p className="text-[clamp(44px,6vw,60px)] font-extrabold bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600/60 bg-clip-text text-transparent leading-none mb-3">2 min</p>
                            <p className="text-white text-[14px] font-semibold mb-1.5">To Plan Your First Route</p>
                            <p className="text-white/30 text-[12px] leading-relaxed">From sign up to navigating your first route in under 2 minutes</p>
                        </div>

                    </div>
                </div>
            </section>


            {/* ═══ FAQ ═══ */}
            <section className="py-20 px-5 sm:px-8">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-center text-2xl sm:text-3xl font-bold mb-3">Questions?</h2>
                    <p className="text-center text-white/40 text-sm mb-10">Everything you need to know.</p>

                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] px-6">
                        {FAQ.map((item) => (
                            <FAQItem key={item.q} q={item.q} a={item.a} />
                        ))}
                    </div>
                </div>
            </section>


            {/* ═══ CTA BAND ═══ */}
            <section className="py-20 px-5 sm:px-8 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/[0.03] to-transparent pointer-events-none" />
                <div className="max-w-xl mx-auto text-center relative">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to try it?</h2>
                    <p className="text-white/40 text-sm mb-8">Free forever. No credit card. Set up in 30 seconds.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-8 py-4 rounded-2xl bg-accent text-base font-bold text-[16px] hover:brightness-110 transition-all active:scale-95 shadow-xl shadow-amber-500/25"
                    >
                        Get Started Free →
                    </button>
                </div>
            </section>


            {/* ═══ FOOTER ═══ */}
            <footer className="border-t border-white/[0.06] py-12 px-5 sm:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
                        {/* Brand */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <img src="/logo3_nobg.png" alt="Routigo" className="w-12 h-12 object-contain" />
                                <span className="text-accent font-bold text-2xl">Routigo</span>
                            </div>
                            <p className="text-white/30 text-[13px] leading-relaxed">AI-powered routing for drivers.<br />Describe your route. Drive in seconds.</p>
                        </div>

                        {/* Links 1 */}
                        <div>
                            <h4 className="text-white/60 text-[11px] font-bold tracking-widest uppercase mb-4">Product</h4>
                            <ul className="space-y-2.5">
                                <li><button onClick={() => navigate('/login')} className="text-white/40 text-[13px] hover:text-white transition-colors">Sign In</button></li>
                                <li><button onClick={() => navigate('/login')} className="text-white/40 text-[13px] hover:text-white transition-colors">Sign Up</button></li>
                                <li><a href="#how" className="text-white/40 text-[13px] hover:text-white transition-colors">How it works</a></li>
                            </ul>
                        </div>

                        {/* Links 2 */}
                        <div>
                            <h4 className="text-white/60 text-[11px] font-bold tracking-widest uppercase mb-4">Built With</h4>
                            <ul className="space-y-2.5">
                                <li><span className="text-white/40 text-[13px]">LangChain</span></li>
                                <li><span className="text-white/40 text-[13px]">ChromaDB</span></li>
                                <li><span className="text-white/40 text-[13px]">Groq AI</span></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/[0.06] pt-6 text-center">
                        <p className="text-white/20 text-[12px]">© 2026 Routigo. Built for drivers, powered by AI.</p>
                    </div>
                </div>
            </footer>


            {/* ═══ SIGNUP GATE MODAL ═══ */}
            {showGateModal && <SignupGateModal onClose={() => setShowGateModal(false)} />}
        </div>
    );
}
