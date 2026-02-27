'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { AlertTriangle, Facebook } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
        setLoading(true);
        setError('');
        try {
            const data = await api.register(form);
            if (data.success) {
                localStorage.setItem('af_token', data.token);
                localStorage.setItem('af_user', JSON.stringify(data.user));
                router.push('/dashboard');
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch {
            setError('Connection error. Make sure the backend is running.');
        }
        setLoading(false);
    };

    return (
        <AuthLayout>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <h1 style={{ fontWeight: 800, fontSize: '2.2rem', letterSpacing: '-0.02em', color: 'white' }}>Create Account</h1>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                    <input className="input-field" type="text" required placeholder="Full Name"
                        style={{ background: '#F3F8FF', border: 'none', borderRadius: '6px', padding: '1rem', width: '100%', color: '#043873', fontSize: '0.95rem' }}
                        value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                    <input className="input-field" type="email" required placeholder="Email Address"
                        style={{ background: '#F3F8FF', border: 'none', borderRadius: '6px', padding: '1rem', width: '100%', color: '#043873', fontSize: '0.95rem' }}
                        value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                    <input className="input-field" type="password" required placeholder="Password"
                        style={{ background: '#F3F8FF', border: 'none', borderRadius: '6px', padding: '1rem', width: '100%', color: '#043873', fontSize: '0.95rem' }}
                        value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                </div>

                {error && (
                    <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 8, padding: '0.75rem 1rem', color: '#b91c1c', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertTriangle size={18} /> {error}
                    </div>
                )}

                <button type="submit" disabled={loading} style={{ background: '#1244A8', color: 'white', border: 'none', borderRadius: '6px', marginTop: '0.5rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '0.9rem', fontWeight: 800, fontSize: '1.05rem', cursor: 'pointer', transition: 'background 0.2s', letterSpacing: '0.5px' }} onMouseEnter={e => e.currentTarget.style.background = '#0C3282'} onMouseLeave={e => e.currentTarget.style.background = '#1244A8'}>
                    {loading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : 'SIGN UP'}
                </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                <p style={{ color: '#043873', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}>Or register with</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#F3F8FF', border: 'none', borderRadius: '6px', padding: '0.75rem', color: '#1877F2', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'white'} onMouseLeave={e => e.currentTarget.style.background = '#F3F8FF'}>
                        <Facebook size={18} /> Facebook
                    </button>
                    <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#F3F8FF', border: 'none', borderRadius: '6px', padding: '0.75rem', color: '#EA4335', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'white'} onMouseLeave={e => e.currentTarget.style.background = '#F3F8FF'}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /><path d="M1 1h22v22H1z" fill="none" /></svg>
                        Google
                    </button>
                </div>
            </div>

            <p style={{ textAlign: 'center', marginTop: '2rem', color: '#043873', fontSize: '0.95rem', fontWeight: 700 }}>
                Already a member?{' '}
                <Link href="/login" style={{ color: '#FFB800', textDecoration: 'none' }}>Login now</Link>
            </p>
        </AuthLayout>
    );
}

