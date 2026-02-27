'use client';
import React, { useState, useEffect } from 'react';
import { Download, Filter, Calendar, Loader2, X, Eye, FileSpreadsheet } from 'lucide-react';
import { api } from '@/lib/api';

export default function ResponsesTab({ forms }: { forms: import('./page').Form[] }) {
    const [responses, setResponses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedResponse, setSelectedResponse] = useState<any | null>(null);

    useEffect(() => {
        const fetchAllResponses = async () => {
            setLoading(true);
            try {
                const formsWithResponses = forms.filter(f => f.responseCount > 0);
                const allResponsesData = await Promise.all(
                    formsWithResponses.map(f => api.getResponses(f._id))
                );

                let combined: any[] = [];
                allResponsesData.forEach((data, index) => {
                    if (data.success && data.responses) {
                        const formTitle = formsWithResponses[index].title;
                        const formatted = data.responses.map((r: any) => ({
                            ...r,
                            id: r._id,
                            name: r.respondentName || r.respondentEmail || 'Anonymous User',
                            form: formTitle,
                            formId: formsWithResponses[index]._id,
                            date: new Date(r.submittedAt || r.createdAt || Date.now()).toLocaleDateString(),
                            rawDate: new Date(r.submittedAt || r.createdAt || Date.now()),
                            status: 'Completed',
                            color: '#10B981'
                        }));
                        combined = [...combined, ...formatted];
                    }
                });

                combined.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
                setResponses(combined);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        if (forms && forms.length > 0) {
            fetchAllResponses();
        } else {
            setLoading(false);
        }
    }, [forms]);

    const handleExportCSV = () => {
        if (responses.length === 0) {
            alert('No responses to export.');
            return;
        }

        // Get all unique question texts for headers
        const allQuestions = Array.from(new Set(responses.flatMap(r => r.answers?.map((a: any) => a.questionText) || [])));
        const headers = ['Respondent', 'Email', 'Form', 'Date', ...allQuestions];

        const csvRows = responses.map(r => {
            const rowData = [
                r.respondentName || 'Anonymous',
                r.respondentEmail || 'N/A',
                r.form,
                r.date,
                ...allQuestions.map(q => {
                    const ans = r.answers?.find((a: any) => a.questionText === q);
                    return ans ? `"${String(ans.answer).replace(/"/g, '""')}"` : '""';
                })
            ];
            return rowData.join(',');
        });

        const csvContent = [headers.join(','), ...csvRows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'neuroform_responses_full.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-dashboard-primary, #0F172A)' }}>Global Responses</h1>
                <button onClick={handleExportCSV} style={{ padding: '0.75rem 1.5rem', background: '#0F172A', border: 'none', borderRadius: '12px', fontWeight: 700, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)' }}>
                    <Download size={18} /> Export Full Data (CSV)
                </button>
            </div>

            {/* Filter Bar */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border-dashboard-darker, #E2E8F0)', background: 'var(--bg-dashboard-card, white)', color: 'var(--text-dashboard-primary, #0F172A)' }}>
                    <Filter size={16} color="var(--text-dashboard-secondary, #64748B)" />
                    <select style={{ outline: 'none', border: 'none', background: 'transparent', color: 'inherit', fontWeight: 600 }}>
                        <option>All Forms</option>
                        {forms?.map((f: any) => <option key={f._id}>{f.title}</option>)}
                    </select>
                </div>
            </div>

            {/* Data Table */}
            <div style={{ background: 'var(--bg-dashboard-card, white)', borderRadius: '24px', border: '1px solid var(--border-dashboard, #F1F5F9)', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: 'var(--bg-dashboard, #F8FAFC)', borderBottom: '1px solid var(--border-dashboard-darker, #E2E8F0)' }}>
                        <tr>
                            <th style={{ padding: '1.25rem 1.5rem', fontWeight: 800, color: 'var(--text-dashboard-secondary, #64748B)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Respondent</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontWeight: 800, color: 'var(--text-dashboard-secondary, #64748B)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Form Name</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontWeight: 800, color: 'var(--text-dashboard-secondary, #64748B)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Submitted</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontWeight: 800, color: 'var(--text-dashboard-secondary, #64748B)', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dashboard-secondary, #64748B)' }}>
                                    <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem', color: '#FF3366' }} />
                                    Fetching all responses...
                                </td>
                            </tr>
                        ) : responses.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dashboard-secondary, #64748B)', fontWeight: 600 }}>
                                    No responses found.
                                </td>
                            </tr>
                        ) : responses.map((row, i) => (
                            <tr key={row.id} style={{ borderBottom: i === responses.length - 1 ? 'none' : '1px solid var(--border-dashboard-darker, #E2E8F0)' }}>
                                <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700, color: 'var(--text-dashboard-primary, #0F172A)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ width: 32, height: 32, borderRadius: '10px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', fontWeight: 800, fontSize: '0.8rem' }}>{row.name.charAt(0)}</div>
                                        {row.name}
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-dashboard-secondary, #64748B)', fontWeight: 600 }}>{row.form}</td>
                                <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-dashboard-secondary, #64748B)' }}>{row.date}</td>
                                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                    <button onClick={() => setSelectedResponse(row)} style={{ padding: '0.5rem 1rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', color: '#0F172A', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Eye size={16} /> View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {selectedResponse && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '2rem' }} onClick={() => setSelectedResponse(null)}>
                    <div style={{ background: 'white', borderRadius: '40px', padding: '3rem', maxWidth: '700px', width: '100%', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.25rem' }}>Response Detail</h2>
                                <p style={{ color: '#64748B', fontWeight: 600 }}>From: {selectedResponse.form}</p>
                            </div>
                            <button onClick={() => setSelectedResponse(null)} style={{ background: '#F1F5F9', border: 'none', width: '40px', height: '40px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} /></button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {selectedResponse.answers?.map((ans: any, i: number) => (
                                <div key={i}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{ans.questionText || `Question ${i + 1}`}</div>
                                    <div style={{ fontSize: '1.1rem', color: '#0F172A', fontWeight: 600, lineHeight: 1.6 }}>{String(ans.answer) || '—'}</div>
                                </div>
                            )) || <div style={{ textAlign: 'center', padding: '2rem', color: '#94A3B8' }}>No answer data recorded for this response.</div>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

