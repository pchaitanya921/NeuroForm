import React, { useState } from 'react';
import { Zap, Link as LinkIcon, ToggleRight, ToggleLeft } from 'lucide-react';

export default function IntegrationsTab() {
    const [integrations, setIntegrations] = useState([
        { name: 'Google Sheets', desc: 'Send responses directly to a spreadsheet.', active: true, icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" fill="#10B981" /><path d="M14 2V8H20" fill="#059669" /><path d="M8 12H16" stroke="white" strokeWidth="2" strokeLinecap="round" /><path d="M8 16H16" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg> },
        { name: 'Slack', desc: 'Get notified of new submissions in a channel.', active: false, icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="12" fill="#E5A823" /><circle cx="9" cy="9" r="2" fill="white" /><circle cx="15" cy="9" r="2" fill="white" /><circle cx="9" cy="15" r="2" fill="white" /></svg> },
        { name: 'Notion', desc: 'Create database items for each response.', active: true, icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="black" /><path d="M7 6H17V18H7V6Z" fill="white" /></svg> },
        { name: 'Webhooks', desc: 'Send data to your custom endpoints.', active: false, icon: <LinkIcon size={32} color="#3B82F6" /> },
        { name: 'Zapier', desc: 'Connect to 5,000+ other applications.', active: false, icon: <Zap size={32} color="#FF9900" /> }
    ]);

    const handleToggle = (index: number) => {
        const newInts = [...integrations];
        newInts[index].active = !newInts[index].active;
        setIntegrations(newInts);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-dashboard-primary, #0F172A)' }}>Integrations</h1>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {integrations.map((int, i) => (
                    <div key={i} style={{ background: 'var(--bg-dashboard-card, white)', padding: '1.5rem', borderRadius: '24px', border: `1px solid ${int.active ? '#10B98140' : 'var(--border-dashboard, #F1F5F9)'}`, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'box-shadow 0.2s' }} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 12px 20px -5px rgba(0,0,0,0.05)'} onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.02)'}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ width: 48, height: 48, background: 'var(--bg-dashboard, #F8FAFC)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {int.icon}
                            </div>
                            <div style={{ cursor: 'pointer' }} onClick={() => handleToggle(i)}>
                                {int.active ? <ToggleRight size={32} color="#10B981" /> : <ToggleLeft size={32} color="var(--text-dashboard-secondary, #94A3B8)" />}
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-dashboard-primary, #0F172A)' }}>{int.name}</h3>
                                {int.active && <div style={{ background: '#F0FDF4', color: '#10B981', padding: '0.1rem 0.5rem', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800, border: '1px solid #DCFCE7' }}>Connected</div>}
                            </div>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-dashboard-secondary, #64748B)' }}>{int.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
