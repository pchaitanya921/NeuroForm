'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem('af_token'));
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem('af_token');
        localStorage.removeItem('af_user');
        router.push('/');
    };

    const isDark = theme === 'dark';

    return (
        <nav style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 4rem',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid #e2e8f0',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            transition: 'all 0.3s ease',
        }}>
            {/* Logo */}
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Image
                    src="/logo_transparent.png?v=2"
                    alt="NeuroForm Logo"
                    width={210}
                    height={80}
                    style={{ objectFit: 'contain' }}
                    unoptimized
                />
            </Link>

            {/* Nav Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
                <Link href="/" style={{ color: '#6A7E9A', fontSize: '0.95rem', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#043873')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#6A7E9A')}>
                    Home
                </Link>
                <Link href="/#features" style={{ color: '#6A7E9A', fontSize: '0.95rem', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#043873')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#6A7E9A')}>
                    Features
                </Link>
                <Link href="/#social" style={{ color: '#6A7E9A', fontSize: '0.95rem', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#043873')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#6A7E9A')}>
                    Social Media
                </Link>
                <Link href="/#how-it-works" style={{ color: '#6A7E9A', fontSize: '0.95rem', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#043873')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#6A7E9A')}>
                    How it works
                </Link>
                {pathname === '/' ? (
                    <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} style={{ background: 'transparent', border: 'none', color: '#6A7E9A', fontSize: '0.95rem', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s', cursor: 'pointer', padding: 0 }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#043873')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#6A7E9A')}>
                        Contact Us
                    </button>
                ) : (
                    <Link href="/#contact" style={{ color: '#6A7E9A', fontSize: '0.95rem', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#043873')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#6A7E9A')}>
                        Contact Us
                    </Link>
                )}

                {/* 🌙 Dark / Light Toggle */}
                <button
                    onClick={toggleTheme}
                    title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                    style={{
                        width: 40, height: 40,
                        borderRadius: 12,
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)'}`,
                        background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.1rem',
                        transition: 'all 0.3s ease',
                        color: 'var(--text-primary)',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = isDark ? 'rgba(108,99,255,0.15)' : 'rgba(108,99,255,0.1)';
                        e.currentTarget.style.borderColor = '#6c63ff';
                        e.currentTarget.style.transform = 'scale(1.08)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
                        e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)';
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {isLoggedIn ? (
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button className="btn-primary" onClick={() => router.push('/dashboard')} style={{ padding: '0.6rem 1.4rem', fontSize: '0.9rem', background: '#4F9CF9' }}>Dashboard</button>
                        <button onClick={handleLogout} style={{ padding: '0.6rem 1.4rem', border: 'none', background: 'transparent', color: '#6A7E9A', fontWeight: 600, cursor: 'pointer' }}>
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <button onClick={() => router.push('/login')} style={{ background: '#FFE492', color: '#043873', padding: '0.6rem 1.8rem', borderRadius: 8, fontWeight: 700, border: 'none', cursor: 'pointer' }}>Login</button>
                        <button onClick={() => router.push('/register')} style={{ background: '#4F9CF9', color: 'white', padding: '0.6rem 1.6rem', borderRadius: 8, fontWeight: 600, border: 'none', cursor: 'pointer' }}>Sign Up</button>
                    </div>
                )}
            </div>
        </nav >
    );
}
