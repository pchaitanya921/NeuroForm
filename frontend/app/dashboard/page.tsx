'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import {
    Search, LayoutDashboard, FileText, PieChart, Puzzle, Bell, Settings,
    MoreHorizontal, ChevronLeft, ChevronRight, Plus, Server, CheckCircle2,
    CircleDashed, MoreVertical, LogOut, ArrowUpRight, Zap, Target,
    Brain, BarChart3, Users, Crown, Share2
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, AreaChart, Area
} from 'recharts';
import ResponsesTab from './ResponsesTab';
import AnalyticsTab from './AnalyticsTab';
import InsightsTab from './InsightsTab';
import IntegrationsTab from './IntegrationsTab';
import SettingsTab from './SettingsTab';

export interface Form {
    _id: string;
    title: string;
    description: string;
    isPublished: boolean;
    responseCount: number;
    createdAt: string;
    goal?: string;
    status?: 'Live' | 'Draft';
}

const StatCard = ({ label, val, trend, icon, color, sparkPath, progress }: any) => (
    <div
        style={{ background: 'var(--bg-dashboard-card, white)', padding: '1.5rem', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid var(--border-dashboard, #F1F5F9)', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 20px -5px rgba(0,0,0,0.1)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)'; }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-dashboard-secondary, #64748B)', fontWeight: 600 }}>{label}</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
                {icon}
            </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-dashboard-primary, #0F172A)' }}>{val}</span>
            {trend && <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700, padding: '0.2rem 0.5rem', background: '#DCFCE7', borderRadius: '20px' }}>{trend}</span>}
        </div>
        <div style={{ height: '40px', width: '100%' }}>
            {progress ? (
                <div style={{ position: 'relative', width: '40px', height: '40px' }}>
                    <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx="18" cy="18" r="16" fill="none" stroke="#F1F5F9" strokeWidth="4" />
                        <circle cx="18" cy="18" r="16" fill="none" stroke="#3B82F6" strokeWidth="4" strokeDasharray={`${progress}, 100`} strokeLinecap="round" />
                    </svg>
                    <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '0.6rem', fontWeight: 800 }}>{progress}%</span>
                </div>
            ) : (
                <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                    <path d={sparkPath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
                </svg>
            )}
        </div>
    </div>
);

const chartData = [
    { name: 'Jan', responses: 50, completion: 40 },
    { name: 'Feb', responses: 120, completion: 60 },
    { name: 'Mar', responses: 220, completion: 110 },
    { name: 'Apr', responses: 150, completion: 80 },
    { name: 'May', responses: 240, completion: 140 },
    { name: 'Jun', responses: 320, completion: 190 },
    { name: 'Jul', responses: 250, completion: 120 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: 'var(--bg-dashboard-card, white)',
                padding: '1.2rem',
                borderRadius: '20px',
                boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                border: '1px solid var(--border-dashboard, #F1F5F9)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem'
            }}>
                <p style={{ fontWeight: 800, color: 'var(--text-dashboard-secondary, #64748B)', marginBottom: '0.25rem', fontSize: '0.9rem' }}>{label}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF3366' }} />
                        <span style={{ fontWeight: 800, color: 'var(--text-dashboard-primary, #0F172A)' }}>{payload[0].value}</span>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#A162F7' }} />
                        <span style={{ fontWeight: 800, color: 'var(--text-dashboard-primary, #0F172A)' }}>{payload[1].value}%</span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

export default function DashboardPage() {
    const router = useRouter();
    const [forms, setForms] = useState<Form[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('af_user');
        if (!stored) { router.push('/login'); return; }
        setUser(JSON.parse(stored));
        fetchForms();

        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');
        if (tab) setActiveTab(tab);
    }, []);

    const fetchForms = async () => {
        try {
            const data = await api.getForms();
            if (data.success) {
                setForms(data.forms.map((f: any) => ({ ...f, status: f.isPublished ? 'Live' : 'Draft' })));
            } else router.push('/login');
        } catch { router.push('/login'); }
        setLoading(false);
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.preventDefault(); e.stopPropagation();
        if (!confirm('Delete this form?')) return;
        await api.deleteForm(id);
        setForms(forms.filter(f => f._id !== id));
    };

    const handleShare = (id: string, e: React.MouseEvent) => {
        e.preventDefault(); e.stopPropagation();
        const link = `${window.location.origin}/form/${id}`;
        navigator.clipboard.writeText(link);
        alert('Public form link copied to clipboard!');
    };

    const handleToggleLive = async (id: string, e: React.MouseEvent) => {
        e.preventDefault(); e.stopPropagation();
        try {
            const data = await api.publishForm(id);
            if (data.success) {
                setForms(forms.map(f => f._id === id ? { ...f, isPublished: data.form.isPublished, status: data.form.isPublished ? 'Live' : 'Draft' } : f));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const totalForms = forms.length;
    const totalResponses = forms.reduce((acc, f) => acc + (f.responseCount || 0), 0);
    const avgCompletion = totalForms > 0 ? 87 : 0;
    const aiInsights = totalForms > 0 ? 36 : 0;
    const recentFormsList = [...forms].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);

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
                        { icon: <LayoutDashboard size={22} />, label: 'Dashboard' },
                        { icon: <FileText size={22} />, label: 'Forms' },
                        { icon: <CheckCircle2 size={22} />, label: 'Responses' },
                        { icon: <BarChart3 size={22} />, label: 'Analytics' },
                        { icon: <Zap size={22} />, label: 'Insights' },
                        { icon: <Plus size={22} />, label: 'Integrations' },
                        { icon: <Settings size={22} />, label: 'Settings' },
                    ].map(item => {
                        const active = activeTab === item.label;
                        return (
                            <div key={item.label} onClick={() => setActiveTab(item.label)} style={{
                                display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 1.25rem', borderRadius: '16px',
                                background: active ? 'linear-gradient(135deg, #FF3366, #FF9933)' : 'transparent',
                                color: active ? 'white' : 'var(--text-dashboard-secondary, #64748B)',
                                fontWeight: active ? 800 : 600, cursor: 'pointer', transition: 'all 0.2s',
                                boxShadow: active ? '0 8px 16px -4px rgba(255, 51, 102, 0.3)' : 'none'
                            }}>
                                {item.icon} <span style={{ fontSize: '1rem' }}>{item.label}</span>
                            </div>
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
                        <div onClick={() => alert('No new notifications!')} style={{ position: 'relative', cursor: 'pointer' }}>
                            <Bell size={24} color="var(--text-dashboard-secondary, #64748B)" />
                            <div style={{ position: 'absolute', top: -2, right: -2, width: 10, height: 10, background: '#FF3366', borderRadius: '50%', border: '2px solid var(--bg-dashboard-card, white)' }} />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <div onClick={() => setIsProfileOpen(!isProfileOpen)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-dashboard-card, white)', padding: '0.5rem 1rem', borderRadius: '100px', border: '1px solid var(--border-dashboard-darker, #E2E8F0)', cursor: 'pointer', transition: 'box-shadow 0.2s' }} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)'} onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                                <img src="https://i.pravatar.cc/100?u=ravi" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }} />
                                <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{user?.name?.split(' ')[0] || 'User'}</span>
                                <ChevronRight size={16} color="var(--text-dashboard-secondary, #64748B)" style={{ transform: isProfileOpen ? 'rotate(-90deg)' : 'rotate(90deg)', transition: 'transform 0.2s' }} />
                            </div>
                            {isProfileOpen && (
                                <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, background: 'var(--bg-dashboard-card, white)', borderRadius: '16px', border: '1px solid var(--border-dashboard-darker, #E2E8F0)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', padding: '0.5rem', width: '200px', zIndex: 50, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-dashboard-darker, #E2E8F0)', marginBottom: '0.25rem' }}>
                                        <div style={{ fontWeight: 800, color: 'var(--text-dashboard-primary, #0F172A)', fontSize: '0.9rem' }}>{user?.name || 'My Profile'}</div>
                                        <div style={{ color: 'var(--text-dashboard-secondary, #64748B)', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
                                    </div>
                                    <button onClick={() => { setActiveTab('Settings'); setIsProfileOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'transparent', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, color: 'var(--text-dashboard-secondary, #64748B)', textAlign: 'left', width: '100%' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-dashboard, #F8FAFC)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <Settings size={18} /> Settings
                                    </button>
                                    <button onClick={() => { localStorage.removeItem('af_user'); router.push('/login'); }} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: '#FEF2F2', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 800, color: '#EF4444', textAlign: 'left', width: '100%' }} onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'} onMouseLeave={e => e.currentTarget.style.background = '#FEF2F2'}>
                                        <LogOut size={18} /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                        <div onClick={() => { localStorage.removeItem('af_user'); router.push('/login'); }} style={{ width: '44px', height: '44px', borderRadius: '14px', border: '1px solid var(--border-dashboard-darker, #E2E8F0)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'var(--bg-dashboard-card, white)', transition: 'background-color 0.3s' }} onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'} onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-dashboard-card, white)'} title="Sign Out">
                            <LogOut size={22} color="var(--text-dashboard-secondary, #64748B)" />
                        </div>
                    </div>
                </header>

                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                    {activeTab === 'Dashboard' ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2.8fr) minmax(0, 1.2fr)', gap: '2rem' }}>
                            {/* Left Col */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {/* Hero */}
                                <div style={{
                                    background: 'url(/hero_bg.png) no-repeat right bottom, #F8FAFC',
                                    backgroundSize: 'contain',
                                    borderRadius: '32px',
                                    padding: '2rem 3rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    boxShadow: '0 15px 35px rgba(0,0,0,0.05)',
                                    border: '1px solid #F1F5F9',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    minHeight: '220px'
                                }}>
                                    <div style={{ zIndex: 1, maxWidth: '500px' }}>
                                        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.5rem', letterSpacing: '-0.04em' }}>Welcome Back, {user?.name?.split(' ')[0] || 'Ravi'}!</h2>
                                        <p style={{ color: '#64748B', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Manage your AI-powered forms & insights</p>
                                        <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '1.25rem' }}>
                                            <button onClick={() => router.push('/create')} style={{
                                                padding: '0.8rem 1.8rem',
                                                background: 'linear-gradient(to right, #E91E63, #FF9100)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '16px',
                                                fontWeight: 800,
                                                fontSize: '1rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                whiteSpace: 'nowrap',
                                                gap: '0.75rem',
                                                boxShadow: '0 10px 20px rgba(233, 30, 99, 0.3)',
                                                cursor: 'pointer',
                                                transition: 'transform 0.2s'
                                            }}><Plus size={22} strokeWidth={3} /> New Form with AI</button>
                                            <button onClick={() => setActiveTab('Integrations')} style={{
                                                padding: '0.8rem 2rem',
                                                background: 'rgba(255, 255, 255, 0.7)',
                                                color: '#0F172A',
                                                border: '1px solid #E2E8F0',
                                                borderRadius: '16px',
                                                fontWeight: 800,
                                                fontSize: '1rem',
                                                cursor: 'pointer',
                                                boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                                                backdropFilter: 'blur(4px)'
                                            }}>Discover</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                                    <StatCard label="Total Forms" val={totalForms} icon={<FileText size={20} />} color="#FF9933" sparkPath="M 0 25 Q 25 10 50 20 T 100 15" />
                                    <StatCard label="Total Responses" val={totalResponses} trend={totalForms > 0 ? "+12%" : undefined} icon={<Users size={20} />} color="#10B981" sparkPath="M 0 25 Q 25 22 50 15 T 100 20" />
                                    <StatCard label="Avg. Completion" val={`${avgCompletion}%`} icon={<CircleDashed size={20} />} color="#3B82F6" progress={avgCompletion} />
                                    <StatCard label="AI Insights" val={aiInsights} icon={<Plus size={20} />} color="#A162F7" sparkPath="M 0 20 Q 25 28 50 12 T 100 18" />
                                </div>

                                {/* Performance Chart */}
                                <div
                                    style={{ background: 'var(--bg-dashboard-card, white)', padding: '2rem', borderRadius: '32px', border: '1px solid var(--border-dashboard, #F1F5F9)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', transition: 'transform 0.3s, box-shadow 0.3s' }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 20px -5px rgba(0,0,0,0.1)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.02)'; }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-dashboard-primary, #0F172A)' }}>Form Performance</h3>
                                        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', fontWeight: 700 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF3366' }} /> Responses</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#A162F7' }} /> Completion %</div>
                                        </div>
                                    </div>
                                    <div style={{ height: '300px', width: '100%', position: 'relative' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={chartData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                                                <XAxis
                                                    dataKey="name"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 700 }}
                                                    dy={15}
                                                />
                                                <YAxis
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 700 }}
                                                />
                                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }} />
                                                <Line
                                                    type="monotone"
                                                    dataKey="responses"
                                                    stroke="#FF3366"
                                                    strokeWidth={4}
                                                    dot={{ fill: 'white', stroke: '#FF3366', strokeWidth: 3, r: 6 }}
                                                    activeDot={{ r: 8, strokeWidth: 0, fill: '#FF3366' }}
                                                    animationDuration={2500}
                                                    animationEasing="ease-in-out"
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="completion"
                                                    stroke="#A162F7"
                                                    strokeWidth={4}
                                                    dot={{ fill: 'white', stroke: '#A162F7', strokeWidth: 3, r: 6 }}
                                                    activeDot={{ r: 8, strokeWidth: 0, fill: '#A162F7' }}
                                                    animationDuration={2500}
                                                    animationBegin={500}
                                                    animationEasing="ease-in-out"
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* AI Insights Widget - Bottom Specific Mockup item */}
                                <div
                                    style={{ background: 'var(--bg-dashboard-card, white)', padding: '2rem', borderRadius: '32px', border: '1px solid var(--border-dashboard, #F1F5F9)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', transition: 'transform 0.3s, box-shadow 0.3s' }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 20px -5px rgba(0,0,0,0.1)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.02)'; }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-dashboard-primary, #0F172A)' }}>AI Insights</h3>
                                        <div style={{ background: '#FFF7ED', color: '#EA580C', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 800 }}>Response Overview</div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-primary)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFB800' }} />
                                                <span style={{ fontWeight: 700 }}>Sentiment Analysis</span>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#F0FDF4', color: '#15803D', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800 }}>
                                                    <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'linear-gradient(45deg, #34D399, #60A5FA)' }} />
                                                    Positive
                                                </div>
                                            </div>
                                            <span style={{ fontWeight: 900, color: '#10B981', fontSize: '1.1rem' }}>82%</span>
                                        </div>
                                        <div style={{ height: '10px', background: 'var(--border-dashboard, #F1F5F9)', borderRadius: '10px', overflow: 'hidden' }}>
                                            <div style={{ width: '82%', height: '100%', background: '#10B981', borderRadius: '10px' }} />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-dashboard-secondary, #64748B)', fontSize: '0.9rem', fontWeight: 600 }}>
                                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF3366' }} />
                                            Top Issue: Workload & Support
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Col */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div
                                    style={{ background: 'var(--bg-dashboard-card, white)', padding: '2rem', borderRadius: '32px', border: '1px solid var(--border-dashboard, #F1F5F9)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', transition: 'transform 0.3s, box-shadow 0.3s' }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 20px -5px rgba(0,0,0,0.1)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.02)'; }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-dashboard-primary, #0F172A)' }}>This Month</h3>
                                        <div style={{ display: 'flex', gap: '0.2rem', color: '#FF9900' }}><Zap size={16} fill="#FF9900" /> <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>AI Trend</span></div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
                                        {[
                                            { color: '#FF3366', val: totalForms, label: 'Forms' },
                                            { color: '#8B5CF6', val: totalResponses, label: 'Responses' },
                                            { color: '#3B82F6', val: aiInsights, label: 'Insights' }
                                        ].map((m, i) => (
                                            <div key={i} style={{ flex: 1 }}>
                                                <div style={{ background: `${m.color}15`, width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', color: m.color }}>
                                                    {i === 0 ? <Plus size={18} /> : i === 1 ? <Users size={18} /> : <Zap size={18} />}
                                                </div>
                                                <div style={{ color: m.color, fontWeight: 900, fontSize: '1.1rem' }}>{m.val}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-dashboard-secondary, #64748B)', fontWeight: 700, marginTop: '0.25rem' }}>{m.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div
                                    style={{ background: 'var(--bg-dashboard-card, white)', padding: '2rem', borderRadius: '32px', border: '1px solid var(--border-dashboard, #F1F5F9)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', flex: 1, transition: 'transform 0.3s, box-shadow 0.3s' }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 20px -5px rgba(0,0,0,0.1)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.02)'; }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-dashboard-primary, #0F172A)' }}>Recent Forms</h3>
                                        <div onClick={() => setActiveTab('Forms')} style={{ color: '#FF3366', fontSize: '0.875rem', fontWeight: 800, cursor: 'pointer' }}>View All</div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        {recentFormsList.length > 0 ? recentFormsList.map((f, i) => (
                                            <div key={i} style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                                                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--bg-dashboard, #F8FAFC)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-dashboard, #F1F5F9)' }}>
                                                    {i % 2 === 1 ? <Settings size={22} color="var(--text-dashboard-secondary, #64748B)" /> : <FileText size={22} color="#FF3366" />}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-dashboard-primary, #0F172A)' }}>{f.title}</div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-dashboard-secondary, #94A3B8)', fontWeight: 500 }}>{f.responseCount || 0} responses • {new Date(f.createdAt).toLocaleDateString()}</div>
                                                </div>
                                                <div style={{
                                                    fontSize: '0.8rem', padding: '0.3rem 0.75rem', borderRadius: '20px',
                                                    background: f.status === 'Live' ? '#F0FDF4' : '#EFF6FF',
                                                    color: f.status === 'Live' ? '#10B981' : '#3B82F6', fontWeight: 800,
                                                    border: `1px solid ${f.status === 'Live' ? '#DCFCE7' : '#DBEAFE'}`,
                                                    display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', transition: 'all 0.2s'
                                                }} onClick={(e) => handleToggleLive(f._id, e)} title={`Click to change to ${f.status === 'Live' ? 'Draft' : 'Live'}`}>
                                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: f.status === 'Live' ? '#10B981' : '#3B82F6' }} />
                                                    {f.status}
                                                </div>
                                            </div>
                                        )) : (
                                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dashboard-secondary, #94A3B8)', fontSize: '0.9rem', fontWeight: 600 }}>No recent forms.</div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    ) : activeTab === 'Forms' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-dashboard-primary, #0F172A)' }}>My Forms</h1>
                                <button onClick={() => router.push('/create')} style={{ background: 'linear-gradient(135deg, #FF3366, #FF9933)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(255, 51, 102, 0.2)' }}>
                                    <Plus size={20} strokeWidth={3} /> Create Form
                                </button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                                {forms.map(form => (
                                    <div key={form._id} style={{ background: 'var(--bg-dashboard-card, white)', padding: '1.5rem', borderRadius: '24px', border: '1px solid var(--border-dashboard, #F1F5F9)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 20px -5px rgba(0,0,0,0.1)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.02)'; }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--bg-dashboard, #F8FAFC)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF3366', border: '1px solid var(--border-dashboard-darker, #E2E8F0)' }}><FileText size={22} /></div>
                                                <div>
                                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-dashboard-primary, #0F172A)' }}>{form.title}</h3>
                                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-dashboard-secondary, #64748B)' }}>{new Date(form.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div style={{ background: form.status === 'Live' ? '#F0FDF4' : '#EFF6FF', color: form.status === 'Live' ? '#10B981' : '#3B82F6', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, border: `1px solid ${form.status === 'Live' ? '#DCFCE7' : '#DBEAFE'}`, display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', transition: 'all 0.2s' }} onClick={(e) => handleToggleLive(form._id, e)} title={`Click to change to ${form.status === 'Live' ? 'Draft' : 'Live'}`}>
                                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: form.status === 'Live' ? '#10B981' : '#3B82F6' }} />
                                                {form.status}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-dashboard-darker, #E2E8F0)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Users size={16} color="var(--text-dashboard-secondary, #64748B)" />
                                                <div style={{ fontWeight: 800, color: 'var(--text-dashboard-primary, #0F172A)', fontSize: '0.9rem' }}>{form.responseCount} <span style={{ fontWeight: 600, color: 'var(--text-dashboard-secondary, #64748B)' }}>Responses</span></div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                <button onClick={(e) => handleShare(form._id, e)} style={{ padding: '0.5rem', background: 'var(--bg-dashboard, #F8FAFC)', color: '#3B82F6', border: '1px solid var(--border-dashboard-darker, #E2E8F0)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Copy Public Link"><Share2 size={16} /></button>
                                                <button onClick={() => router.push(`/results/${form._id}`)} style={{ padding: '0.5rem 1rem', background: 'var(--bg-dashboard, #F8FAFC)', color: 'var(--text-dashboard-primary, #0F172A)', border: '1px solid var(--border-dashboard-darker, #E2E8F0)', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>Results</button>
                                                <button onClick={(e) => handleDelete(form._id, e)} style={{ padding: '0.5rem', background: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Delete Form"><LogOut size={16} style={{ transform: 'rotate(180deg)' }} /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {forms.length === 0 && (
                                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', background: 'var(--bg-dashboard-card, white)', borderRadius: '24px', border: '1px dashed var(--border-dashboard-darker, #E2E8F0)', color: 'var(--text-dashboard-secondary, #64748B)' }}>
                                        <FileText size={48} color="#CBD5E1" style={{ margin: '0 auto 1rem' }} />
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dashboard-primary, #0F172A)', marginBottom: '0.5rem' }}>No Forms Yet</h3>
                                        <p style={{ marginBottom: '1.5rem' }}>Create your first AI-powered form to start collecting responses.</p>
                                        <button onClick={() => router.push('/create')} style={{ background: 'linear-gradient(135deg, #FF3366, #FF9933)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Plus size={20} /> Create Form
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : activeTab === 'Responses' ? (
                        <ResponsesTab forms={forms} />
                    ) : activeTab === 'Analytics' ? (
                        <AnalyticsTab forms={forms} />
                    ) : activeTab === 'Insights' ? (
                        <InsightsTab />
                    ) : activeTab === 'Integrations' ? (
                        <IntegrationsTab />
                    ) : activeTab === 'Settings' ? (
                        <SettingsTab user={user} />
                    ) : null}
                </div>
            </main>
        </div>
    );
}
