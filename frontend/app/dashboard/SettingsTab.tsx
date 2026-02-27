import React from 'react';
import { Copy, Crown, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SettingsTab({ user }: { user: any }) {
    const router = useRouter();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-dashboard-primary, #0F172A)' }}>Settings</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) minmax(300px, 400px)', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Profile Settings */}
                    <div style={{ background: 'var(--bg-dashboard-card, white)', padding: '2rem', borderRadius: '32px', border: '1px solid var(--border-dashboard, #F1F5F9)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-dashboard-primary, #0F172A)', marginBottom: '1.5rem' }}>Profile Information</h3>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '2rem' }}>
                            <img src="https://i.pravatar.cc/150?u=ravi" style={{ width: 80, height: 80, borderRadius: '50%', border: '4px solid var(--border-dashboard, #F1F5F9)' }} alt="Avatar" />
                            <div>
                                <button style={{ padding: '0.5rem 1rem', background: 'var(--bg-dashboard, #F8FAFC)', border: '1px solid var(--border-dashboard-darker, #E2E8F0)', borderRadius: '10px', fontWeight: 700, color: 'var(--text-dashboard-primary, #0F172A)', cursor: 'pointer', marginBottom: '0.5rem' }}>Change Avatar</button>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-dashboard-secondary, #64748B)' }}>JPG, GIF or PNG. Max size of 800K</div>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-dashboard-primary, #0F172A)', marginBottom: '0.5rem' }}>Full Name</label>
                                <input type="text" defaultValue={user?.name || ''} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border-dashboard-darker, #E2E8F0)', background: 'var(--bg-dashboard-card, white)', color: 'var(--text-dashboard-primary, #0F172A)', outline: 'none', fontWeight: 600 }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-dashboard-primary, #0F172A)', marginBottom: '0.5rem' }}>Email Address</label>
                                <input type="email" defaultValue={user?.email || ''} disabled style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border-dashboard-darker, #E2E8F0)', background: 'var(--bg-dashboard, #F8FAFC)', color: 'var(--text-dashboard-secondary, #64748B)', outline: 'none', fontWeight: 600 }} />
                            </div>
                        </div>
                        <button style={{ marginTop: '2rem', padding: '0.75rem 2rem', background: 'var(--text-dashboard-primary, #0F172A)', color: 'white', borderRadius: '12px', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Save Changes</button>
                    </div>

                    {/* API Keys */}
                    <div style={{ background: 'var(--bg-dashboard-card, white)', padding: '2rem', borderRadius: '32px', border: '1px solid var(--border-dashboard, #F1F5F9)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-dashboard-primary, #0F172A)', marginBottom: '0.5rem' }}>API Keys</h3>
                        <p style={{ color: 'var(--text-dashboard-secondary, #64748B)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Use these keys to authenticate API requests.</p>

                        <div style={{ background: 'var(--bg-dashboard, #F8FAFC)', border: '1px solid var(--border-dashboard-darker, #E2E8F0)', padding: '1rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dashboard-secondary, #64748B)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Production Key</div>
                                <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', color: 'var(--text-dashboard-primary, #0F172A)', fontWeight: 600 }}>sk_prod_*********************</div>
                            </div>
                            <button style={{ padding: '0.5rem', background: 'white', border: '1px solid var(--border-dashboard-darker, #E2E8F0)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Copy size={16} color="var(--text-dashboard-secondary, #64748B)" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Plan / Billing */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ background: 'linear-gradient(135deg, #FF3366, #FF9933)', padding: '2rem', borderRadius: '32px', color: 'white', boxShadow: '0 10px 25px rgba(255, 51, 102, 0.2)' }}>
                        <Crown size={32} style={{ marginBottom: '1rem' }} />
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Pro Beta</h3>
                        <p style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '2rem' }}>You have access to all premium features during the beta period.</p>
                        <button style={{ width: '100%', padding: '0.75rem', background: 'white', color: '#FF3366', borderRadius: '12px', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Manage Subscription</button>
                    </div>

                    <div style={{ background: 'var(--bg-dashboard-card, white)', padding: '1.5rem', borderRadius: '24px', border: '1px solid var(--border-dashboard, #F1F5F9)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-dashboard-primary, #0F172A)', marginBottom: '1rem' }}>Danger Zone</h3>
                        <button onClick={() => { localStorage.removeItem('af_user'); router.push('/login'); }} style={{ width: '100%', padding: '0.75rem', background: '#FEF2F2', color: '#EF4444', borderRadius: '12px', border: '1px solid #FCA5A5', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <LogOut size={16} /> Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
