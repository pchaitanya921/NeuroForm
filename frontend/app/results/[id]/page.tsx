'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';
import {
    LayoutDashboard, PieChart, ChevronRight, Share2, Globe, Sparkles, MessageSquare, Smile, CheckCircle2, FileText, Loader2, X, ChevronLeft, Brain, AlertTriangle, Rocket, Search, Bell, LogOut, Settings
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

interface Insight {
    totalResponses: number;
    sentimentScore: number;
    sentimentLabel: string;
    keyThemes: string[];
    painPoints: string[];
    positiveHighlights: string[];
    actionableRecommendations: string[];
    executiveSummary: string;
    questionInsights?: { questionId: string; questionText: string; topAnswers: string[]; insight: string }[];
    generatedAt: string;
}

const StatCard = ({ label, val, icon, color, trend }: any) => (
    <div style={{
        background: 'var(--bg-dashboard-card, white)',
        padding: '1.5rem',
        borderRadius: '24px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
        border: '1px solid var(--border-dashboard, #F1F5F9)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dashboard-secondary, #64748B)', fontWeight: 700, textTransform: 'uppercase' }}>{label}</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
                {icon}
            </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-dashboard-primary, #0F172A)' }}>{val}</span>
            {trend && <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700, padding: '0.2rem 0.5rem', background: '#DCFCE7', borderRadius: '20px' }}>{trend}</span>}
        </div>
    </div>
);

export default function ResultsPage() {
    const params = useParams();
    const formId = params.id as string;
    const router = useRouter();
    const [form, setForm] = useState<{ title: string; goal?: string; responseCount: number } | null>(null);
    const [responses, setResponses] = useState<{ _id: string; submittedAt: string; respondentName?: string; respondentEmail?: string; answers: { questionText: string; answer: string | number }[] }[]>([]);
    const [insight, setInsight] = useState<Insight | null>(null);
    const [loading, setLoading] = useState(true);
    const [generatingInsights, setGeneratingInsights] = useState(false);
    const [activeTab, setActiveTab] = useState<'responses' | 'insights'>('insights');
    const [selectedResponse, setSelectedResponse] = useState<any | null>(null);
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('af_user');
        if (!stored) { router.push('/login'); return; }
        setUser(JSON.parse(stored));
        loadData();
    }, [formId]);

    const loadData = async () => {
        try {
            const [formData, responsesData, insightData] = await Promise.all([
                api.getForm(formId),
                api.getResponses(formId),
                api.getInsights(formId),
            ]);
            if (formData.success) setForm(formData.form);
            if (responsesData.success) setResponses(responsesData.responses);
            if (insightData.success) setInsight(insightData.insight);
            else setInsight(null);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleGenerateInsights = async () => {
        setGeneratingInsights(true);
        try {
            const data = await api.generateInsights(formId);
            if (data.success) {
                setInsight(data.insight);
                loadData();
            } else alert(data.message || 'Insight generation failed');
        } catch { alert('Failed to generate insights.'); }
        setGeneratingInsights(false);
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-dashboard, #F8FAFC)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 size={36} color="#FF3366" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
    );

    return (
        <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-dashboard, #F8FAFC)', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
            {/* Sidebar */}
            <aside style={{ width: '280px', background: 'var(--bg-dashboard-card, white)', borderRight: '1px solid var(--border-dashboard-darker, #E2E8F0)', display: 'flex', flexDirection: 'column', padding: '1.5rem', flexShrink: 0 }}>
                <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
                    <div style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #FF3366, #FF9933)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Brain size={26} color="white" />
                    </div>
                    <span style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-dashboard-primary, #0F172A)' }}>
                        Neuro<span style={{ color: '#FF3366' }}>Form</span>
                    </span>
                </Link>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div onClick={() => router.push('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 1.25rem', borderRadius: '16px', color: '#64748B', fontWeight: 600, cursor: 'pointer' }}>
                        <LayoutDashboard size={22} /> Dashboard
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 1.25rem', borderRadius: '16px', background: 'linear-gradient(135deg, #FF3366, #FF9933)', color: 'white', fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 16px -4px rgba(255, 51, 102, 0.3)' }}>
                        <PieChart size={22} /> Form Results
                    </div>
                </nav>

                <div onClick={() => router.push('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '16px', border: '1px solid #E2E8F0', cursor: 'pointer', fontWeight: 700, color: '#0F172A', marginTop: 'auto' }}>
                    <ChevronLeft size={20} /> Back to Dashboard
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem 2rem', overflowY: 'auto' }}>
                <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                    <div style={{ position: 'relative', width: '400px' }}>
                        <Search size={20} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input type="text" placeholder="Search forms, responses..." style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 3.5rem', background: 'var(--bg-dashboard-card, white)', border: '1px solid var(--border-dashboard-darker, #E2E8F0)', borderRadius: '14px', outline: 'none', fontSize: '0.95rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <ThemeToggle />
                        <div onClick={() => alert('No new notifications!')} style={{ position: 'relative', cursor: 'pointer' }}>
                            <Bell size={24} color="#64748B" />
                            <div style={{ position: 'absolute', top: -2, right: -2, width: 10, height: 10, background: '#FF3366', borderRadius: '50%', border: '2px solid white' }} />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <div onClick={() => setIsProfileOpen(!isProfileOpen)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-dashboard-card, white)', padding: '0.4rem 0.8rem', borderRadius: '100px', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
                                <img src="https://i.pravatar.cc/100?u=ravi" style={{ width: 30, height: 30, borderRadius: '50%' }} />
                                <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{user?.name?.split(' ')[0] || 'User'}</span>
                            </div>
                            {isProfileOpen && (
                                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', overflow: 'hidden', width: '180px', zIndex: 50 }}>
                                    <button onClick={() => { localStorage.removeItem('af_user'); router.push('/login'); }} style={{ width: '100%', padding: '0.75rem 1rem', background: 'transparent', border: 'none', textAlign: 'left', fontWeight: 700, color: '#EF4444', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}><LogOut size={16} /> Sign Out</button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748B', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                            Forms <ChevronRight size={14} /> Results
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-dashboard-primary, #0F172A)', letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>{form?.title}</h1>
                        <p style={{ color: '#64748B', fontWeight: 600, fontSize: '1.1rem' }}>{form?.goal || 'Qualitative analysis results'}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => window.open(`${window.location.origin}/form/${formId}`, '_blank')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white', color: '#0F172A', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                            <Share2 size={18} /> Share Form
                        </button>
                        <button onClick={() => window.open(`${window.location.origin}/insight/${formId}`, '_blank')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white', color: '#0F172A', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                            <Globe size={18} /> Public Insights
                        </button>
                        <button onClick={handleGenerateInsights} disabled={generatingInsights || responses.length === 0} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #FF3366, #FF9933)', color: 'white', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(255, 51, 102, 0.2)' }}>
                            {generatingInsights ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={18} />}
                            Generate AI Insights
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    <StatCard label="Total Responses" val={responses.length} icon={<MessageSquare size={20} />} color="#FF3366" />
                    <StatCard label="AI Sentiment" val={insight?.sentimentLabel?.toUpperCase() || 'N/A'} icon={<Smile size={20} />} color="#FF9933" />
                    <StatCard label="Pain Points" val={insight?.painPoints?.length || 0} icon={<AlertTriangle size={20} />} color="#EF4444" />
                    <StatCard label="Actionable" val={insight?.actionableRecommendations?.length || 0} icon={<CheckCircle2 size={20} />} color="#10B981" />
                </div>

                <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #E2E8F0', marginBottom: '2.5rem' }}>
                    <button onClick={() => setActiveTab('insights')} style={{ padding: '0.75rem 0.5rem', border: 'none', background: 'transparent', color: activeTab === 'insights' ? '#FF3366' : '#64748B', fontWeight: 800, fontSize: '1rem', borderBottom: activeTab === 'insights' ? '3px solid #FF3366' : '3px solid transparent', cursor: 'pointer' }}>AI Insights</button>
                    <button onClick={() => setActiveTab('responses')} style={{ padding: '0.75rem 0.5rem', border: 'none', background: 'transparent', color: activeTab === 'responses' ? '#FF3366' : '#64748B', fontWeight: 800, fontSize: '1rem', borderBottom: activeTab === 'responses' ? '3px solid #FF3366' : '3px solid transparent', cursor: 'pointer' }}>Raw Responses</button>
                </div>

                {activeTab === 'insights' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {!insight ? (
                            <div style={{ padding: '5rem', background: 'white', borderRadius: '32px', border: '1px dashed #E2E8F0', textAlign: 'center', color: '#64748B' }}>
                                <Brain size={48} color="#CBD5E1" style={{ margin: '0 auto 1.5rem' }} />
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>No insights available</h3>
                                <p style={{ marginBottom: '2rem' }}>Generate AI insights to see qualitative analysis of your form responses.</p>
                                <button onClick={handleGenerateInsights} disabled={responses.length === 0} style={{ padding: '0.75rem 2rem', background: '#0F172A', color: 'white', borderRadius: '12px', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Generate Now</button>
                            </div>
                        ) : (
                            <>
                                <div style={{ background: 'white', padding: '2.5rem', borderRadius: '32px', border: '1px solid #F1F5F9', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><FileText size={22} color="#FF3366" /> Executive Summary</h3>
                                    <p style={{ color: '#475569', lineHeight: 1.8, fontSize: '1.1rem' }}>{insight.executiveSummary}</p>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                    <div style={{ background: 'white', padding: '2.5rem', borderRadius: '32px', border: '1px solid #F1F5F9', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#EF4444', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><AlertTriangle size={20} /> Pain Points</h3>
                                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {insight.painPoints?.map((p, i) => (
                                                <li key={i} style={{ display: 'flex', gap: '0.75rem', color: '#445164', fontSize: '1rem', fontWeight: 600 }}>
                                                    <X size={18} color="#EF4444" style={{ flexShrink: 0, marginTop: '0.15rem' }} /> {p}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div style={{ background: 'white', padding: '2.5rem', borderRadius: '32px', border: '1px solid #F1F5F9', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#10B981', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Rocket size={20} /> Recommendations</h3>
                                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {insight.actionableRecommendations?.map((r, i) => (
                                                <li key={i} style={{ display: 'flex', gap: '0.75rem', color: '#445164', fontSize: '1rem', fontWeight: 600 }}>
                                                    <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0, marginTop: '0.15rem' }} /> {r}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div style={{ background: 'white', borderRadius: '32px', border: '1px solid #F1F5F9', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                <tr>
                                    <th style={{ padding: '1.25rem 2rem', fontWeight: 800, color: '#64748B', fontSize: '0.85rem', textTransform: 'uppercase' }}>Respondent</th>
                                    <th style={{ padding: '1.25rem 2rem', fontWeight: 800, color: '#64748B', fontSize: '0.85rem', textTransform: 'uppercase' }}>Date Submitted</th>
                                    <th style={{ padding: '1.25rem 2rem', fontWeight: 800, color: '#64748B', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {responses.map((row, i) => (
                                    <tr key={row._id} style={{ borderBottom: i === responses.length - 1 ? 'none' : '1px solid #F1F5F9' }}>
                                        <td style={{ padding: '1.25rem 2rem', fontWeight: 700, color: 'var(--text-dashboard-primary, #0F172A)' }}>{row.respondentName || row.respondentEmail || 'Anonymous Respondent'}</td>
                                        <td style={{ padding: '1.25rem 2rem', color: '#64748B', fontWeight: 600 }}>{new Date(row.submittedAt).toLocaleDateString()}</td>
                                        <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                                            <button onClick={() => setSelectedResponse(row)} style={{ padding: '0.5rem 1.25rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', color: '#0F172A', fontWeight: 800, cursor: 'pointer' }}>View Details</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {/* Response Detail Modal */}
            {selectedResponse && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '2rem' }} onClick={() => setSelectedResponse(null)}>
                    <div style={{ background: 'white', borderRadius: '40px', padding: '3rem', maxWidth: '700px', width: '100%', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 900 }}>Submission Details</h2>
                            <button onClick={() => setSelectedResponse(null)} style={{ background: '#F1F5F9', border: 'none', width: '40px', height: '40px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} /></button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {selectedResponse.answers.map((ans: any, i: number) => (
                                <div key={i}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{ans.questionText}</div>
                                    <div style={{ fontSize: '1.1rem', color: '#0F172A', fontWeight: 600, lineHeight: 1.6 }}>{String(ans.answer) || '—'}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
