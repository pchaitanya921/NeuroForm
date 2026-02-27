'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Lock, PartyPopper, Zap, AlertTriangle, Check, X } from 'lucide-react';
import Image from 'next/image';

interface Question {
    id: string;
    type: string;
    question: string;
    placeholder?: string;
    options?: string[];
    required?: boolean;
    minRating?: number;
    maxRating?: number;
    conditionalLogic?: {
        enabled: boolean;
        triggerQuestionId?: string;
        triggerCondition?: string;
    };
}

export default function FormFillPage() {
    const params = useParams();
    const formId = params.id as string;
    const [form, setForm] = useState<{ title: string; description: string; questions: Question[]; settings: { thankYouMessage?: string; adaptiveFlow?: boolean; showProgressBar?: boolean } } | null>(null);
    const [answers, setAnswers] = useState<Record<string, string | number>>({});
    const [contactInfo, setContactInfo] = useState({ name: '', email: '' });
    const [currentIdx, setCurrentIdx] = useState(-1); // -1 is the intro/contact screen
    const [extraQuestions, setExtraQuestions] = useState<Question[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        loadForm();
    }, [formId]);

    const loadForm = async () => {
        try {
            const data = await api.getForm(formId);
            if (data.success && data.form.isPublished) {
                setForm(data.form);
            } else {
                setNotFound(true);
            }
        } catch { setNotFound(true); }
        setLoading(false);
    };

    const allQuestions = [...(form?.questions || []), ...extraQuestions];
    const currentQuestion = currentIdx >= 0 ? allQuestions[currentIdx] : null;
    const progress = form ? ((currentIdx + 1) / (allQuestions.length + 1)) * 100 : 0;

    const checkConditionalLogic = (question: Question, answer: string | number) => {
        // Check if any future questions should be hidden based on this answer
        const hiddenIds = new Set<string>();
        allQuestions.forEach(q => {
            if (q.conditionalLogic?.enabled && q.conditionalLogic.triggerQuestionId === question.id) {
                const condition = q.conditionalLogic.triggerCondition || '';
                const [op, val] = condition.split(':');
                const numAnswer = Number(answer);
                const numVal = Number(val);
                let shouldShow = false;
                if (op === 'lte') shouldShow = numAnswer <= numVal;
                else if (op === 'gte') shouldShow = numAnswer >= numVal;
                else if (op === 'eq') shouldShow = String(answer).toLowerCase() === val.toLowerCase();
                if (!shouldShow) hiddenIds.add(q.id);
            }
        });
        return hiddenIds;
    };

    const handleAnswer = (value: string | number) => {
        if (!currentQuestion) return;
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
    };

    const handleNext = async () => {
        if (!form) return;

        if (currentIdx === -1) {
            setCurrentIdx(0);
            return;
        }

        if (!currentQuestion) return;
        const answer = answers[currentQuestion.id];

        // Try to get adaptive follow-up
        if (form.settings?.adaptiveFlow && currentQuestion.type === 'rating' && answer !== undefined) {
            try {
                const result = await api.adaptiveNext({
                    questions: allQuestions,
                    answers: Object.entries(answers).map(([id, val]) => ({ questionId: id, answer: val })),
                    currentQuestionId: currentQuestion.id,
                });
                if (result.success?.result?.shouldAddFollowUp && result.result?.followUpQuestion) {
                    const fq = result.result.followUpQuestion;
                    if (!extraQuestions.find(q => q.id === fq.id)) {
                        setExtraQuestions(prev => [...prev, fq]);
                    }
                }
            } catch { /* silent fail */ }
        }

        setCurrentIdx(prev => prev + 1);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const answersArr = Object.entries(answers).map(([questionId, answer]) => {
                const q = allQuestions.find(q => q.id === questionId);
                return { questionId, questionText: q?.question || '', answer, questionType: q?.type || 'text' };
            });

            const data = await api.submitResponse(formId, {
                answers: answersArr,
                respondentName: contactInfo.name,
                respondentEmail: contactInfo.email,
                sessionId: `session_${Date.now()}`,
                metadata: { userAgent: navigator.userAgent }
            });

            if (data.success) setSubmitted(true);
            else setError(data.message || 'Failed to submit');
        } catch { setError('Failed to submit. Please try again.'); }
        setSubmitting(false);
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <span className="spinner" style={{ width: 36, height: 36 }} />
                <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Loading form...</p>
            </div>
        </div>
    );

    if (notFound) return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', color: 'var(--text-secondary)' }}><Lock size={48} /></div>
                <h2 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Form not available</h2>
                <p style={{ color: 'var(--text-secondary)' }}>This form doesn't exist or is not currently accepting responses.</p>
            </div>
        </div>
    );

    if (submitted) return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass animate-fade-in-up" style={{ maxWidth: 500, borderRadius: 24, padding: '4rem 3rem', textAlign: 'center', border: '1px solid rgba(74,222,128,0.2)' }}>
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', color: '#4ade80' }}><PartyPopper size={56} /></div>
                <h2 style={{ fontWeight: 800, fontSize: '1.8rem', marginBottom: '1rem', letterSpacing: '-0.02em' }}>Response submitted!</h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{form?.settings?.thankYouMessage || 'Thank you for your response! Your feedback helps us improve.'}</p>
                <div style={{ marginTop: '2rem', padding: '0.75rem 1.5rem', background: 'rgba(74,222,128,0.08)', borderRadius: 10, border: '1px solid rgba(74,222,128,0.2)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#4ade80', fontSize: '0.85rem', fontWeight: 600 }}>
                    Powered by <Image src="/logo_transparent.png?v=2" alt="NeuroForm Logo" width={120} height={60} style={{ objectFit: 'contain', marginLeft: '0.2rem' }} unoptimized />
                </div>
            </div>
        </div>
    );

    const isLast = currentIdx === allQuestions.length - 1;
    let canProceed = true;
    if (currentIdx === -1) {
        canProceed = contactInfo.name.trim() !== '' && contactInfo.email.trim() !== '';
    } else if (currentQuestion?.required) {
        canProceed = answers[currentQuestion?.id] !== undefined && answers[currentQuestion?.id] !== '';
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <div className="grid-bg" />

            {/* Progress bar */}
            {form?.settings?.showProgressBar !== false && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
                    <div className="progress-bar" style={{ borderRadius: 0, height: 3 }}>
                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            )}

            <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '4rem 2rem' }}>
                {/* Form Header */}
                {currentIdx === -1 && (
                    <div className="glass animate-fade-in-up" style={{ width: '100%', maxWidth: 600, borderRadius: 24, padding: '3rem 2.5rem', border: '1px solid rgba(108,99,255,0.15)', textAlign: 'center' }}>
                        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                            <Image src="/logo_transparent.png?v=2" alt="NeuroForm Logo" width={220} height={140} style={{ objectFit: 'contain' }} unoptimized />
                        </div>
                        <h1 style={{ fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.03em', marginBottom: '0.8rem' }}>{form?.title}</h1>
                        {form?.description && <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem', fontSize: '1.05rem' }}>{form.description}</p>}

                        <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h3 style={{ fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a78bfa' }}>
                                <Lock size={16} /> Contact Details (Required)
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 500 }}>Full Name</label>
                                    <input className="input-field" type="text" placeholder="John Doe" value={contactInfo.name} onChange={e => setContactInfo({ ...contactInfo, name: e.target.value })} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 500 }}>Email Address</label>
                                    <input className="input-field" type="email" placeholder="john@example.com" value={contactInfo.email} onChange={e => setContactInfo({ ...contactInfo, email: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '2.5rem' }}>
                            <button className="btn-primary" onClick={handleNext} disabled={!canProceed} style={{ padding: '0.9rem 2.5rem', fontSize: '1.1rem', width: '100%' }}>
                                Start Survey →
                            </button>
                        </div>
                    </div>
                )}

                {/* Question Card */}
                {currentQuestion && (
                    <div className="glass animate-fade-in-up" style={{ width: '100%', maxWidth: 640, borderRadius: 24, padding: '2.5rem', border: '1px solid rgba(108,99,255,0.15)' }} key={currentQuestion.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>Q{currentIdx + 1} of {allQuestions.length}</span>
                            {currentQuestion.required && <span style={{ color: '#f87171', fontSize: '0.8rem' }}>Required *</span>}
                        </div>

                        <h2 style={{ fontWeight: 700, fontSize: '1.2rem', lineHeight: 1.5, marginBottom: '1.8rem', color: 'var(--text-primary)' }}>{currentQuestion.question}</h2>

                        {/* Question Renderer */}
                        <QuestionInput question={currentQuestion} value={answers[currentQuestion.id]} onChange={handleAnswer} />

                        {error && <p style={{ color: '#f87171', fontSize: '0.87rem', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><AlertTriangle size={14} /> {error}</p>}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                            {currentIdx > 0 ? (
                                <button className="btn-secondary" onClick={() => setCurrentIdx(i => i - 1)} style={{ padding: '0.7rem 1.5rem' }}>← Back</button>
                            ) : <div />}
                            {isLast ? (
                                <button className="btn-primary" onClick={handleSubmit} disabled={submitting || !canProceed} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    {submitting ? <><span className="spinner" style={{ width: 18, height: 18 }} /> Submitting...</> : <><PartyPopper size={16} /> Submit Response</>}
                                </button>
                            ) : (
                                <button className="btn-primary" onClick={handleNext} disabled={!canProceed} style={{ padding: '0.7rem 1.8rem' }}>
                                    Next →
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function QuestionInput({ question, value, onChange }: { question: Question; value: string | number | undefined; onChange: (v: string | number) => void }) {
    const { type, placeholder, options, minRating = 1, maxRating = 5 } = question;

    if (type === 'rating') {
        const ratings = Array.from({ length: maxRating - minRating + 1 }, (_, i) => i + minRating);
        return (
            <div>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    {ratings.map(r => (
                        <button key={r} className={`rating-option ${value === r ? 'selected' : ''}`} onClick={() => onChange(r)}>{r}</button>
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '0.6rem' }}>
                    <span>Not at all</span><span>Extremely</span>
                </div>
            </div>
        );
    }

    if (type === 'mcq' && options) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                {options.map(opt => (
                    <button key={opt} onClick={() => onChange(opt)} style={{
                        background: value === opt ? 'rgba(108,99,255,0.15)' : 'rgba(255,255,255,0.03)',
                        border: `2px solid ${value === opt ? 'rgba(108,99,255,0.5)' : 'rgba(255,255,255,0.08)'}`,
                        borderRadius: 12, padding: '0.9rem 1.2rem', color: value === opt ? '#a78bfa' : '#f0f0ff',
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', fontSize: '0.95rem', fontWeight: value === opt ? 600 : 400,
                    }}>
                        <span style={{ marginRight: '0.75rem', color: value === opt ? '#6c63ff' : '#6666aa' }}>
                            {value === opt ? '●' : '○'}
                        </span>
                        {opt}
                    </button>
                ))}
            </div>
        );
    }

    if (type === 'yes_no') {
        return (
            <div style={{ display: 'flex', gap: '1rem' }}>
                {['Yes', 'No'].map(opt => (
                    <button key={opt} onClick={() => onChange(opt)} style={{
                        flex: 1, background: value === opt ? (opt === 'Yes' ? 'rgba(74,222,128,0.12)' : 'rgba(239,68,68,0.1)') : 'rgba(255,255,255,0.03)',
                        border: `2px solid ${value === opt ? (opt === 'Yes' ? 'rgba(74,222,128,0.4)' : 'rgba(239,68,68,0.4)') : 'rgba(255,255,255,0.08)'}`,
                        borderRadius: 14, padding: '1.1rem', cursor: 'pointer', fontSize: '1rem', fontWeight: 700,
                        color: value === opt ? (opt === 'Yes' ? '#4ade80' : '#f87171') : '#f0f0ff', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                    }}>
                        {opt === 'Yes' ? <><Check size={16} /> Yes</> : <><X size={16} /> No</>}
                    </button>
                ))}
            </div>
        );
    }

    if (type === 'scale') {
        const scale = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        return (
            <div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {scale.map(n => (
                        <button key={n} onClick={() => onChange(n)} style={{
                            width: 42, height: 42, borderRadius: 10, border: `2px solid ${value === n ? '#6c63ff' : 'rgba(255,255,255,0.08)'}`,
                            background: value === n ? 'rgba(108,99,255,0.2)' : 'rgba(255,255,255,0.03)',
                            color: value === n ? '#a78bfa' : '#f0f0ff', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.9rem',
                        }}>{n}</button>
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '0.6rem' }}>
                    <span>1 — Not likely</span><span>10 — Very likely</span>
                </div>
            </div>
        );
    }

    if (type === 'textarea') {
        return (
            <textarea className="input-field" rows={4} placeholder={placeholder || 'Type your answer here...'} value={String(value ?? '')}
                onChange={e => onChange(e.target.value)} style={{ resize: 'none' }} />
        );
    }

    return (
        <input className="input-field" type={type === 'email' ? 'email' : type === 'number' ? 'number' : 'text'}
            placeholder={placeholder || 'Type your answer here...'} value={String(value ?? '')}
            onChange={e => onChange(e.target.value)} />
    );
}
