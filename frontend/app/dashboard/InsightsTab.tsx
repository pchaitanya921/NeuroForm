'use client';
import React, { useState } from 'react';
import { api } from '@/lib/api';
import { Sparkles, Smile, MoreHorizontal, Frown, Bot, Send, Loader2 } from 'lucide-react';

export default function InsightsTab() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);

    const handleAsk = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim() || loading) return;

        const userMsg = query;
        setQuery('');
        setMessages([...messages, { role: 'user', content: userMsg }]);
        setLoading(true);

        try {
            const data = await api.askAI(userMsg);
            if (data.success) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.message || 'Could not reach AI'}` }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error while reaching the AI.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-dashboard-primary, #0F172A)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Sparkles color="#FF9900" size={28} /> AI Global Insights
                    </h1>
                    <p style={{ color: 'var(--text-dashboard-secondary, #64748B)', fontSize: '1rem', marginTop: '0.25rem', fontWeight: 600 }}>
                        Qualitative cross-form analysis and intelligent query engine.
                    </p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(400px, 2fr)', gap: '1.5rem' }}>
                {/* Sentiment */}
                <div style={{ background: 'var(--bg-dashboard-card, white)', padding: '2rem', borderRadius: '32px', border: '1px solid var(--border-dashboard, #F1F5F9)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-dashboard-primary, #0F172A)', marginBottom: '1.5rem' }}>Overall Sentiment</h3>
                    <div style={{ display: 'flex', gap: '1rem', height: '140px' }}>
                        {[
                            { label: 'Positive', val: 82, icon: <Smile size={24} color="#10B981" />, color: '#10B981' },
                            { label: 'Neutral', val: 12, icon: <MoreHorizontal size={24} color="#64748B" />, color: '#64748B' },
                            { label: 'Negative', val: 6, icon: <Frown size={24} color="#EF4444" />, color: '#EF4444' },
                        ].map((s, i) => (
                            <div key={i} style={{ flex: s.val, background: `${s.color}15`, borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: `1px solid ${s.color}30` }}>
                                {s.icon}
                                <div style={{ fontWeight: 900, fontSize: '1.5rem', color: s.color }}>{s.val}%</div>
                                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dashboard-secondary, #64748B)' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Key Themes */}
                <div style={{ background: 'var(--bg-dashboard-card, white)', padding: '2rem', borderRadius: '32px', border: '1px solid var(--border-dashboard, #F1F5F9)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-dashboard-primary, #0F172A)', marginBottom: '1.5rem' }}>Global Key Themes</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                        {[
                            { text: '"Fast UI/UX"', mentions: 124, color: '#3B82F6' },
                            { text: '"Premium Pricing"', mentions: 45, color: '#EF4444' },
                            { text: '"Elite Support"', mentions: 89, color: '#10B981' },
                            { text: '"API Flexibility"', mentions: 34, color: '#F59E0B' },
                            { text: '"Dark Mode Love"', mentions: 67, color: '#8B5CF6' }
                        ].map((t, i) => (
                            <div key={i} style={{ padding: '0.5rem 1rem', background: 'var(--bg-dashboard, #F8FAFC)', border: '1px solid var(--border-dashboard-darker, #E2E8F0)', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-dashboard-primary, #0F172A)' }}>
                                <span>{t.text}</span>
                                <span style={{ background: `${t.color}20`, color: t.color, padding: '0.1rem 0.5rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800 }}>{t.mentions}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* AI Chat Interface */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--bg-dashboard-card, white)', borderRadius: '40px', padding: '2.5rem', border: '1px solid var(--border-dashboard, #F1F5F9)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', minHeight: '400px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '1.5rem', marginBottom: '1rem' }}>
                    <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #FF3366, #FF9933)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><Bot size={24} /></div>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A' }}>Ask NeuroForm AI</h3>
                        <p style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Ask anything about your form responses</p>
                    </div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', maxHeight: '400px', paddingRight: '0.5rem' }}>
                    {messages.length === 0 ? (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', gap: '1rem' }}>
                            <Sparkles size={48} color="#E2E8F0" />
                            <p style={{ fontWeight: 600 }}>Try asking: "What are users saying about our new features?"</p>
                        </div>
                    ) : (
                        messages.map((m, i) => (
                            <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%', background: m.role === 'user' ? '#0F172A' : '#F1F5F9', color: m.role === 'user' ? 'white' : '#0F172A', padding: '1rem 1.5rem', borderRadius: m.role === 'user' ? '24px 24px 4px 24px' : '24px 24px 24px 4px', fontSize: '1rem', fontWeight: 600, lineHeight: 1.5 }}>
                                {m.content}
                            </div>
                        ))
                    )}
                    {loading && (
                        <div style={{ alignSelf: 'flex-start', background: '#F1F5F9', padding: '1rem 1.5rem', borderRadius: '24px 24px 24px 4px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Loader2 size={18} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                            <span style={{ fontWeight: 600, color: '#64748B' }}>Thinking...</span>
                        </div>
                    )}
                </div>

                <form onSubmit={handleAsk} style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask your AI Analyser..."
                        style={{ flex: 1, padding: '1.25rem 1.75rem', borderRadius: '20px', border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#0F172A', fontSize: '1rem', fontWeight: 600, outline: 'none', transition: 'border-color 0.2s' }}
                        onFocus={e => e.currentTarget.style.borderColor = '#FF3366'}
                        onBlur={e => e.currentTarget.style.borderColor = '#E2E8F0'}
                    />
                    <button type="submit" disabled={loading} style={{ width: '60px', height: '60px', borderRadius: '20px', background: '#0F172A', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                        <Send size={24} />
                    </button>
                </form>
            </div>
        </div>
    );
}

