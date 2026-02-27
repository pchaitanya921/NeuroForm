'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Brain, AlertTriangle, FileText, Smile, CheckCircle2, X, Rocket, Loader2, Sparkles, MessageSquare, Globe, ChevronLeft } from 'lucide-react';

interface Insight {
    totalResponses: number;
    sentimentScore: number;
    sentimentLabel: string;
    keyThemes: string[];
    painPoints: string[];
    positiveHighlights: string[];
    actionableRecommendations: string[];
    executiveSummary: string;
    generatedAt: string;
}

export default function PublicInsightPage() {
    const params = useParams();
    const formId = params.id as string;
    const router = useRouter();
    const [form, setForm] = useState<{ title: string; goal?: string } | null>(null);
    const [insight, setInsight] = useState<Insight | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [formId]);

    const loadData = async () => {
        try {
            const [formData, insightData] = await Promise.all([
                api.getForm(formId),
                api.getInsights(formId),
            ]);
            if (formData.success) setForm(formData.form);
            if (insightData.success) setInsight(insightData.insight);
            else setInsight(null);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 size={36} color="#FF3366" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: 'Inter, sans-serif', paddingBottom: '5rem' }}>
            {/* Minimal Header */}
            <header style={{ background: 'white', padding: '1.25rem 2rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #FF3366, #FF9933)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Brain size={22} color="white" />
                    </div>
                    <span style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#0F172A' }}>
                        Neuro<span style={{ color: '#FF3366' }}>Form</span>
                    </span>
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748B', fontWeight: 700, fontSize: '0.9rem' }}>
                    <Globe size={16} /> PUBLIC REPORT
                </div>
            </header>

            {!insight ? (
                <div style={{ maxWidth: '600px', margin: '10rem auto', textAlign: 'center', padding: '0 2rem' }}>
                    <div style={{ width: '80px', height: '80px', background: '#F1F5F9', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                        <Brain size={40} color="#CBD5E1" />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A', marginBottom: '1rem' }}>Insights not available</h1>
                    <p style={{ fontSize: '1.1rem', color: '#64748B', lineHeight: 1.6, marginBottom: '2rem' }}>
                        The creator of this form hasn't generated AI insights yet, or no responses have been submitted.
                    </p>
                    <button onClick={() => window.location.reload()} style={{ padding: '0.75rem 2rem', background: '#0F172A', color: 'white', borderRadius: '12px', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Refresh Page</button>
                </div>
            ) : (
                <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 2rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'white', padding: '0.6rem 1.25rem', borderRadius: '100px', border: '1px solid #E2E8F0', fontSize: '0.85rem', fontWeight: 800, color: '#FF3366', marginBottom: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                            <Sparkles size={16} /> AI GENERATED ANALYSIS
                        </div>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.05em', marginBottom: '1rem' }}>{form?.title}</h1>
                        <p style={{ fontSize: '1.25rem', color: '#64748B', fontWeight: 600, maxWidth: '700px', margin: '0 auto' }}>{form?.goal}</p>
                    </div>

                    {/* Stat Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                        {[
                            { label: 'Responses', val: insight.totalResponses, icon: <MessageSquare size={20} />, color: '#FF3366' },
                            { label: 'Sentiment', val: insight.sentimentLabel?.toUpperCase(), icon: <Smile size={20} />, color: '#FF9933' },
                            { label: 'Pain Points', val: insight.painPoints?.length || 0, icon: <AlertTriangle size={20} />, color: '#EF4444' },
                            { label: 'Recommendations', val: insight.actionableRecommendations?.length || 0, icon: <Rocket size={20} />, color: '#10B981' }
                        ].map((stat, i) => (
                            <div key={i} style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', border: '1px solid #F1F5F9', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>{stat.label}</span>
                                    <div style={{ color: stat.color }}>{stat.icon}</div>
                                </div>
                                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0F172A' }}>{stat.val}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Summary */}
                        <div style={{ background: 'white', padding: '3rem', borderRadius: '32px', border: '1px solid #F1F5F9', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ width: '48px', height: '48px', background: '#F0F9FF', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9' }}>
                                    <FileText size={24} />
                                </div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A' }}>Executive Summary</h2>
                            </div>
                            <p style={{ fontSize: '1.15rem', color: '#475569', lineHeight: 1.8 }}>{insight.executiveSummary}</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            {/* Pain Points */}
                            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '32px', border: '1px solid #F1F5F9', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#EF4444', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><AlertTriangle size={20} /> Critical Pain Points</h3>
                                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    {insight.painPoints?.map((p, i) => (
                                        <li key={i} style={{ display: 'flex', gap: '1rem', color: '#445164', fontSize: '1.05rem', lineHeight: 1.5, fontWeight: 500 }}>
                                            <div style={{ width: '8px', height: '8px', background: '#EF4444', borderRadius: '50%', marginTop: '0.6rem', flexShrink: 0 }} /> {p}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Recommendations */}
                            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '32px', border: '1px solid #F1F5F9', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#10B981', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><CheckCircle2 size={20} /> AI Recommendations</h3>
                                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    {insight.actionableRecommendations?.map((r, i) => (
                                        <li key={i} style={{ display: 'flex', gap: '1rem', color: '#445164', fontSize: '1.05rem', lineHeight: 1.5, fontWeight: 500 }}>
                                            <div style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%', marginTop: '0.6rem', flexShrink: 0 }} /> {r}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '6rem', opacity: 0.5 }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            Generated with <Brain size={16} /> NeuroForm AI
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

