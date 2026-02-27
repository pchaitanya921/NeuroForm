'use client';
import { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // Simulated API call for password reset since the endpoint might not exist yet
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSuccess(true);
        } catch {
            setError('Connection error. Please try again.');
        }
        setLoading(false);
    };

    return (
        <AuthLayout>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <h1 style={{ fontWeight: 800, fontSize: '2.2rem', letterSpacing: '-0.02em', color: 'white' }}>Reset Password</h1>
                <p style={{ color: '#043873', marginTop: '0.5rem', fontSize: '0.95rem' }}>Enter your email to receive a reset link.</p>
            </div>

            {success ? (
                <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '1.5rem', color: '#166534', textAlign: 'center' }}>
                    <CheckCircle size={40} style={{ margin: '0 auto 1rem', color: '#166534' }} />
                    <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Check your email</h3>
                    <p style={{ fontSize: '0.9rem' }}>We've sent a password reset link to <strong style={{ color: '#14532d' }}>{email}</strong>.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <input className="input-field" type="email" required placeholder="Enter your email address"
                            style={{ background: '#F3F8FF', border: 'none', borderRadius: '6px', padding: '1rem', width: '100%', color: '#043873', fontSize: '0.95rem' }}
                            value={email} onChange={e => setEmail(e.target.value)} />
                    </div>

                    {error && (
                        <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 8, padding: '0.75rem 1rem', color: '#b91c1c', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AlertTriangle size={18} /> {error}
                        </div>
                    )}

                    <button type="submit" disabled={loading} style={{ background: '#1244A8', color: 'white', border: 'none', borderRadius: '6px', marginTop: '1rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '0.9rem', fontWeight: 800, fontSize: '1.05rem', cursor: 'pointer', transition: 'background 0.2s', letterSpacing: '0.5px' }} onMouseEnter={e => e.currentTarget.style.background = '#0C3282'} onMouseLeave={e => e.currentTarget.style.background = '#1244A8'}>
                        {loading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : 'SEND RESET LINK'}
                    </button>
                </form>
            )}

            <p style={{ textAlign: 'center', marginTop: '2.5rem', color: '#043873', fontSize: '0.95rem', fontWeight: 700 }}>
                Remembered your password?{' '}
                <Link href="/login" style={{ color: '#FFB800', textDecoration: 'none' }}>Login here</Link>
            </p>
        </AuthLayout>
    );
}
