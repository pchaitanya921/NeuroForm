'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import {
    Search, LayoutDashboard, FileText, CheckCircle2,
    BarChart3, Plus, Settings, LogOut, ChevronRight, Zap, Bell,
    Brain, AlertTriangle, ArrowRight, Crown
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const EXAMPLE_GOALS = [
    'Understand why users are uninstalling my fintech app',
    'Collect feedback on our new onboarding experience',
    'Measure employee satisfaction after remote work transition',
    'Find out why customers abandon their shopping cart',
    'Evaluate conference speaker quality and session value',
];

export default function CreatePage() {
    const router = useRouter();
    const [goal, setGoal] = useState('');
    const [loading, setLoading] = useState(false);
    const [stage, setStage] = useState<'idle' | 'thinking' | 'building' | 'done'>('idle');
    const [error, setError] = useState('');
    const [formCount, setFormCount] = useState(0);
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);

    const thinkingMessages = [
        'Analyzing your goal...',
        'Identifying key research areas...',
        'Designing question structure...',
        'Adding adaptive logic flows...',
        'Finalizing your form...',
    ];
    const [thinkingMsg, setThinkingMsg] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem('af_user');
        if (!stored) { router.push('/login'); return; }
        setUser(JSON.parse(stored));
    }, [router]);

    const handleGenerate = async () => {
        if (!goal.trim()) return;
        const token = localStorage.getItem('af_token');
        if (!token) { router.push('/login'); return; }

        setLoading(true);
        setError('');
        setStage('thinking');

        // Cycle through thinking messages
        let idx = 0;
        setThinkingMsg(thinkingMessages[0]);
        const interval = setInterval(() => {
            idx = (idx + 1) % thinkingMessages.length;
            setThinkingMsg(thinkingMessages[idx]);
        }, 2000);

        try {
            setStage('building');
            const data = await api.generateForm(goal);
            clearInterval(interval);
            if (data.success) {
                setStage('done');
                setFormCount(data.form.questions?.length || 0);
                setTimeout(() => router.push(`/results/${data.form._id}`), 1500);
            } else {
                setError(data.message || 'AI generation failed. Check your Grok API key.');
                setStage('idle');
            }
        } catch {
            clearInterval(interval);
            setError('Failed to connect. Ensure the backend is running and your Grok API key is configured.');
            setStage('idle');
        }
        setLoading(false);
    };

    return (
        <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-dashboard, #F8FAFC)', color: 'var(--text-dashboard-primary, #0F172A)', transition: 'all 0.3s', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
            {/* Sidebar */}
            <aside style={{ width: '280px', background: 'var(--bg-dashboard-card, white)', borderRight: '1px solid var(--border-dashboard-darker, #E2E8F0)', display: 'flex', flexDirection: 'column', padding: '1.5rem', flexShrink: 0, transition: 'all 0.3s' }}>
                <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem', padding: '0 0.5rem', cursor: 'pointer' }}>
                    <div style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #FF3366, #FF9933)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(255, 51, 102, 0.2)' }}>
                        <Brain size={26} color="white" />
                    </div>
                    <span style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-dashboard-primary, #0F172A)' }}>
                        Neuro<span style={{ color: '#FF3366' }}>Form</span>
                    </span>
                </Link>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[
                        { icon: <LayoutDashboard size={22} />, label: 'Dashboard', path: '/dashboard?tab=Dashboard' },
                        { icon: <FileText size={22} />, label: 'Forms', path: '/dashboard?tab=Forms' },
                        { icon: <CheckCircle2 size={22} />, label: 'Responses', path: '/dashboard?tab=Responses' },
                        { icon: <BarChart3 size={22} />, label: 'Analytics', path: '/dashboard?tab=Analytics' },
                        { icon: <Zap size={22} />, label: 'Insights', path: '/dashboard?tab=Insights' },
                        { icon: <Plus size={22} />, label: 'Integrations', path: '/dashboard?tab=Integrations' },
                        { icon: <Settings size={22} />, label: 'Settings', path: '/dashboard?tab=Settings' },
                    ].map(item => {
                        // In create page, nothing in sidebar is active
                        const active = false;
                        return (
                            <Link key={item.label} href={item.path} style={{ textDecoration: 'none' }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 1.25rem', borderRadius: '16px',
                                    background: active ? 'linear-gradient(135deg, #FF3366, #FF9933)' : 'transparent',
                                    color: active ? 'white' : 'var(--text-dashboard-secondary, #64748B)',
                                    fontWeight: active ? 800 : 600, cursor: 'pointer', transition: 'all 0.2s',
                                    boxShadow: active ? '0 8px 16px -4px rgba(255, 51, 102, 0.3)' : 'none'
                                }}>
                                    {item.icon} <span style={{ fontSize: '1rem' }}>{item.label}</span>
                                </div>
                            </Link>
                        )
                    })}
                </nav>

                <div style={{ background: 'var(--bg-dashboard, #F8FAFC)', borderRadius: '24px', padding: '1.5rem', textAlign: 'center', marginTop: 'auto', border: '1px solid var(--border-dashboard, #F1F5F9)', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: -15, left: '50%', transform: 'translateX(-50%)', background: 'var(--bg-dashboard-card, white)', borderRadius: '50%', padding: '0.6rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                        <div style={{ background: '#FF9900', borderRadius: '50%', padding: '0.4rem' }}>
                            <Crown size={20} color="white" />
                        </div>
                    </div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem', marginTop: '1rem' }}>Upgrade to Premium</h4>
                    <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.5rem' }}>Unlock AI Insights & Export</p>
                    <button onClick={() => alert('Premium plan is currently in Beta and free for all users!')} style={{ width: '100%', padding: '0.9rem', background: '#8B5CF6', color: 'white', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 800, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)' }}>Upgrade Now</button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem 2rem', overflowY: 'auto' }}>
                <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <div style={{ position: 'relative', width: '450px' }}>
                        <Search size={20} color="var(--text-dashboard-secondary, #94A3B8)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input type="text" placeholder="Search forms, responses..." style={{ width: '100%', padding: '1rem 1rem 1rem 3.5rem', background: 'var(--bg-dashboard-card, white)', border: '1px solid var(--border-dashboard-darker, #E2E8F0)', borderRadius: '16px', outline: 'none', fontSize: '1rem', color: 'var(--text-dashboard-primary, #0F172A)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', transition: 'background-color 0.3s, color 0.3s, border-color 0.3s' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <ThemeToggle />
                        <div style={{ position: 'relative', cursor: 'pointer' }}>
                            <Bell size={24} color="var(--text-dashboard-secondary, #64748B)" />
                            <div style={{ position: 'absolute', top: -2, right: -2, width: 10, height: 10, background: '#FF3366', borderRadius: '50%', border: '2px solid var(--bg-dashboard-card, white)' }} />
                        </div>
                        <div onClick={() => router.push('/dashboard?tab=Settings')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-dashboard-card, white)', padding: '0.5rem 1rem', borderRadius: '100px', border: '1px solid var(--border-dashboard-darker, #E2E8F0)', cursor: 'pointer' }}>
                            <img src="https://i.pravatar.cc/100?u=ravi" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }} alt="Avatar" />
                            <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{user?.name || 'Ravi Teja'}</span>
                            <ChevronRight size={16} color="var(--text-dashboard-secondary, #64748B)" style={{ transform: 'rotate(90deg)' }} />
                        </div>
                        <div onClick={() => { localStorage.removeItem('af_user'); router.push('/'); }} style={{ width: '44px', height: '44px', borderRadius: '14px', border: '1px solid var(--border-dashboard-darker, #E2E8F0)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'var(--bg-dashboard-card, white)', transition: 'background-color 0.3s' }}>
                            <LogOut size={22} color="var(--text-dashboard-secondary, #64748B)" />
                        </div>
                    </div>
                </header>

                <div style={{ flex: 1, padding: '1rem 0' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        {/* Header */}
                        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                            <div style={{ background: '#FFF1F2', color: '#E91E63', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <Brain size={16} /> AI Form Generator
                            </div>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-dashboard-primary, #0F172A)', marginBottom: '0.75rem', letterSpacing: '-0.03em' }}>
                                Create New Form with AI
                            </h1>
                            <p style={{ color: 'var(--text-dashboard-secondary, #64748B)', fontSize: '1.1rem', fontWeight: 500 }}>
                                Tell the AI what you want to understand. It will design the full form, pick question types, and add adaptive logic automatically.
                            </p>
                        </div>

                        {/* Input Card */}
                        <div style={{
                            background: 'url(/hero_bg.png) no-repeat right center',
                            backgroundSize: 'cover',
                            padding: '3.5rem',
                            borderRadius: '24px',
                            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
                            border: '1px solid var(--border-dashboard, #F1F5F9)',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center'
                        }}>
                            <div style={{ width: '100%', maxWidth: '700px' }}>
                                <label style={{ display: 'block', fontWeight: 800, fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--text-dashboard-primary, #0F172A)' }}>
                                    What do you want to understand? <span style={{ color: '#E91E63' }}>*</span>
                                </label>

                                <textarea
                                    rows={4}
                                    placeholder="e.g. &quot;I want to understand why users are uninstalling my fintech app&quot;"
                                    value={goal} onChange={e => setGoal(e.target.value)}
                                    disabled={loading}
                                    style={{
                                        width: '100%',
                                        resize: 'none',
                                        fontSize: '1.1rem',
                                        lineHeight: 1.6,
                                        padding: '1.5rem',
                                        borderRadius: '16px',
                                        border: '1px solid var(--border-dashboard-darker, #E2E8F0)',
                                        background: 'rgba(255, 255, 255, 0.95)',
                                        color: 'var(--text-dashboard-primary, #0F172A)',
                                        outline: 'none',
                                        transition: 'border-color 0.2s, box-shadow 0.2s',
                                        marginBottom: '1.5rem',
                                        fontFamily: 'inherit',
                                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#FF3366'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--border-dashboard-darker, #E2E8F0)'}
                                />

                                {/* AI Status / Thinking */}
                                {stage !== 'idle' && stage !== 'done' && (
                                    <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '1.25rem', background: '#FFF1F2', borderRadius: '16px', border: '1px solid #FFE4E6' }}>
                                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                            {[0, 1, 2, 3, 4].map(i => (
                                                <div key={i} style={{ width: '4px', height: '16px', background: '#E91E63', borderRadius: '2px', animation: `pulse 1s infinite alternate ${i * 0.15}s` }} />
                                            ))}
                                        </div>
                                        <span style={{ color: '#E91E63', fontWeight: 700, fontSize: '0.95rem' }}>{thinkingMsg}</span>
                                    </div>
                                )}

                                {stage === 'done' && (
                                    <div style={{ marginBottom: '1.5rem', padding: '1.25rem', background: '#F0FDF4', borderRadius: '16px', border: '1px solid #DCFCE7', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontWeight: 700 }}>
                                        <CheckCircle2 size={20} /> Form created with {formCount} questions! Redirecting to results...
                                    </div>
                                )}

                                {error && (
                                    <div style={{ marginBottom: '1.5rem', padding: '1.25rem', background: '#FEF2F2', borderRadius: '16px', border: '1px solid #FEE2E2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontWeight: 700 }}>
                                        <AlertTriangle size={20} /> {error}
                                    </div>
                                )}

                                <button onClick={handleGenerate} disabled={loading || !goal.trim()} style={{
                                    width: '100%',
                                    padding: '1.25rem',
                                    background: (loading || !goal.trim()) ? 'var(--border-dashboard-darker, #E2E8F0)' : 'rgba(241, 245, 249, 0.9)',
                                    color: (loading || !goal.trim()) ? 'var(--text-dashboard-secondary, #94A3B8)' : 'var(--text-dashboard-secondary, #64748B)',
                                    border: '1px solid rgba(255,255,255,0.5)',
                                    borderRadius: '16px',
                                    fontSize: '1.1rem',
                                    fontWeight: 800,
                                    cursor: (loading || !goal.trim()) ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                                    transition: 'all 0.3s',
                                    backdropFilter: 'blur(4px)'
                                }}
                                    onMouseEnter={e => { if (!loading && goal.trim()) { e.currentTarget.style.background = 'rgba(226, 232, 240, 0.9)'; e.currentTarget.style.color = 'var(--text-dashboard-primary, #0F172A)'; } }}
                                    onMouseLeave={e => { if (!loading && goal.trim()) { e.currentTarget.style.background = 'rgba(241, 245, 249, 0.9)'; e.currentTarget.style.color = 'var(--text-dashboard-secondary, #64748B)'; } }}
                                >
                                    {loading ? 'Building Form...' : <><Brain size={22} strokeWidth={2.5} /> Generate Form</>}
                                </button>
                            </div>
                        </div>

                        {/* Example Goals */}
                        <div style={{ marginTop: '2.5rem' }}>
                            <p style={{ color: 'var(--text-dashboard-secondary, #64748B)', fontSize: '0.9rem', fontWeight: 700, marginBottom: '1.25rem' }}>Or try one of these examples:</p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                                {EXAMPLE_GOALS.map(eg => (
                                    <div key={eg} onClick={() => setGoal(eg)} style={{
                                        background: 'var(--bg-dashboard-card, white)',
                                        border: '1px solid var(--border-dashboard-darker, #E2E8F0)',
                                        borderRadius: '16px',
                                        padding: '1.2rem',
                                        color: 'var(--text-dashboard-secondary, #64748B)',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        transition: 'all 0.2s',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF3366'; e.currentTarget.style.color = 'var(--text-dashboard-primary, #0F172A)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-dashboard-darker, #E2E8F0)'; e.currentTarget.style.color = 'var(--text-dashboard-secondary, #64748B)'; e.currentTarget.style.transform = 'translateY(0)' }}>
                                        <div style={{ background: '#FFF1F2', padding: '0.4rem', borderRadius: '10px', color: '#E91E63' }}>
                                            <ArrowRight size={16} strokeWidth={3} />
                                        </div>
                                        {eg}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </main>
            <style jsx>{`
                @keyframes pulse {
                    from { opacity: 0.4; transform: scaleY(0.8); }
                    to { opacity: 1; transform: scaleY(1.2); }
                }
            `}</style>
        </div>
    );
}
