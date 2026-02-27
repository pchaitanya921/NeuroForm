'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu, X, Facebook, Twitter, Chrome, Linkedin, Instagram,
  Brain, FileText, CheckCircle2, ArrowRight, BarChart3, Plus
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function LandingPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    // Check auth state
    const token = localStorage.getItem('af_token');
    const user = localStorage.getItem('af_user');
    if (token && user) {
      setIsLoggedIn(true);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#' },
    { label: 'Features', href: '#features' },
    { label: 'Social Media', href: '#social' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'Contact Us', href: '#contact' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'system-ui, -apple-system, sans-serif', overflowX: 'hidden', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
      {/* Dark Blue Background Base */}

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        padding: '1rem 3rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: scrolled ? 'var(--bg-card)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : 'none',
        transition: 'all 0.3s'
      }}>
        <div style={{ maxWidth: 1400, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="flex">
            <Brain size={24} color="#F59E0B" />
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>Neuro<span style={{ color: '#F59E0B' }}>Form</span></span>
          </div>

          {/* Desktop target nav */}
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="hidden md:flex">
            {navLinks.map((link, i) => (
              <a key={i} href={link.href} style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none', opacity: 0.9, transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = '0.9'}>
                {link.label}
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }} className="hidden md:flex">
            <ThemeToggle />
            {isLoggedIn ? (
              <Link href="/dashboard">
                <button style={{ padding: '0.5rem 1.2rem', background: '#A855F7', color: 'white', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onMouseEnter={e => e.currentTarget.style.background = '#9333EA'} onMouseLeave={e => e.currentTarget.style.background = '#A855F7'}>
                  Dashboard <ArrowRight size={16} />
                </button>
              </Link>
            ) : (
              <>
                <Link href="/login" style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none', opacity: 0.9, transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = '0.9'}>
                  Login
                </Link>
                <Link href="/register">
                  <button style={{ padding: '0.5rem 1.2rem', background: '#A855F7', color: 'white', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#9333EA'} onMouseLeave={e => e.currentTarget.style.background = '#A855F7'}>
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Part 1: Hero Section (Dynamic Theme bg) */}
      <section style={{
        padding: '10rem 2rem 8rem',
        background: 'var(--bg-hero)',
        textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.3s ease'
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontSize: '4.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
            Forms that <span style={{ color: 'var(--accent-highlight)' }}>think</span>,<br />
            <span style={{ color: '#2DD4BF' }}>adapt</span>,<br />
            and <span style={{ color: '#FB7185' }}>decide</span> for you.
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', fontWeight: 500, lineHeight: 1.6, maxWidth: 600, margin: '0 auto 2.5rem', transition: 'color 0.3s ease' }}>
            NeuroForm is the world's first AI-native form platform that auto-creates adaptive questions and converts responses into actionable business intelligence.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '4rem' }}>
            <Link href="/register">
              <button style={{ padding: '0.8rem 2.5rem', background: '#A855F7', color: 'white', borderRadius: '8px', fontSize: '1rem', fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#9333EA'} onMouseLeave={e => e.currentTarget.style.background = '#A855F7'}>
                Start Now
              </button>
            </Link>
            <Link href="/create">
              <button style={{ padding: '0.8rem 2.5rem', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; e.currentTarget.style.borderColor = 'var(--accent-purple)' }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)' }}>
                Trial <ArrowRight size={18} />
              </button>
            </Link>
          </div>

          {/* Dashboard Style Hero Card */}
          <div style={{
            background: 'url(/hero_bg.png) no-repeat right bottom, #F8FAFC',
            backgroundSize: 'contain',
            borderRadius: '32px',
            padding: '3rem 4rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            border: '1px solid rgba(255,255,255,0.2)',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '280px',
            maxWidth: '850px',
            margin: '0 auto',
            textAlign: 'left'
          }}>
            <div style={{ zIndex: 1, maxWidth: '60%' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.5rem', letterSpacing: '-0.04em' }}>Welcome Back, explorer!</h2>
              <p style={{ color: '#64748B', marginBottom: '2rem', fontSize: '1.15rem', fontWeight: 600 }}>Manage your AI-powered forms & insights</p>
              <div style={{ display: 'flex', gap: '1.25rem' }}>
                <Link href="/create">
                  <button style={{
                    padding: '1rem 2rem',
                    background: 'linear-gradient(to right, #E91E63, #FF9100)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    boxShadow: '0 10px 20px rgba(233, 30, 99, 0.3)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                  }}><Plus size={24} strokeWidth={3} /> New Form with AI</button>
                </Link>
                <Link href="#features">
                  <button style={{
                    padding: '1rem 2rem',
                    background: 'rgba(255, 255, 255, 0.7)',
                    color: '#0F172A',
                    border: '1px solid #E2E8F0',
                    borderRadius: '16px',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                    backdropFilter: 'blur(4px)'
                  }}>Discover</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* Part 2: What makes it NeuroForm? (White Background, Light Blue slant) */}
      < section id="features" style={{
        background: 'var(--bg-card)', padding: '8rem 2rem', textAlign: 'center', position: 'relative',
        clipPath: 'polygon(0 4vw, 100% 0, 100% 100%, 0 100%)',
        marginTop: '-4vw',
        transition: 'background-color 0.3s ease'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '5rem', letterSpacing: '-0.02em', transition: 'color 0.3s ease' }}>
            What makes it <span style={{ color: 'var(--accent-highlight)' }}>NeuroForm</span>?
          </h2>

          {/* Orbit Graphic */}
          <div style={{ position: 'relative', width: '400px', height: '400px', margin: '0 auto 8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

            {/* SVG Background for connections & rings */}
            <svg width="400" height="400" viewBox="0 0 400 400" style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, pointerEvents: 'none' }}>
              <defs>
                <path id="path-fb" d="M 230 230 Q 260 120 194 54" fill="none" stroke="var(--text-primary)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.8" />
                <path id="path-x" d="M 230 230 Q 130 280 34 194" fill="none" stroke="var(--text-primary)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.8" />
                <path id="path-ig" d="M 230 230 Q 350 250 344 184" fill="none" stroke="var(--text-primary)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.8" />
                <path id="path-in" d="M 230 230 Q 260 350 174 334" fill="none" stroke="var(--text-primary)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.8" />
              </defs>

              {/* Offset Dotted Circle */}
              <circle cx="230" cy="230" r="140" fill="none" stroke="var(--text-primary)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" className="spin-slow" style={{ transformOrigin: '230px 230px' }} />

              {/* Connecting Paths */}
              <use href="#path-fb" />
              <use href="#path-x" />
              <use href="#path-ig" />
              <use href="#path-in" />

              {/* Moving Nodes (Dots) */}
              <circle r="5" fill="#38BDF8">
                <animateMotion dur="4s" repeatCount="indefinite" path="M 230 230 Q 260 120 194 54" />
              </circle>
              <circle r="5" fill="var(--text-primary)">
                <animateMotion dur="5s" repeatCount="indefinite" path="M 230 230 Q 130 280 34 194" />
              </circle>
              <circle r="5" fill="#FB7185">
                <animateMotion dur="6s" repeatCount="indefinite" path="M 230 230 Q 350 250 344 184" />
              </circle>
              <circle r="4" fill="#38BDF8">
                <animateMotion dur="4.5s" repeatCount="indefinite" path="M 230 230 Q 260 350 174 334" />
              </circle>
            </svg>

            {/* Primary Solid Accuracy Circle */}
            <div style={{ position: 'absolute', top: 70, left: 40, width: '220px', height: '220px', borderRadius: '50%', background: 'var(--bg-card)', border: '4px solid var(--bg-card)', zIndex: 10 }} />
            <div style={{ position: 'absolute', top: 70, left: 40, width: '220px', height: '220px', borderRadius: '50%', borderTop: '4px solid #38BDF8', borderRight: '4px solid #F59E0B', borderBottom: '4px solid #38BDF8', borderLeft: '4px solid transparent', transform: 'rotate(45deg)', zIndex: 11 }} />

            {/* AI Accuracy Text */}
            <div style={{ position: 'absolute', top: 145, left: 85, textAlign: 'center', zIndex: 12, width: '130px' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>AI Accuracy</div>
              <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.02em', textShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>99%</div>
            </div>

            {/* Floating Social Nodes */}
            <div style={{ position: 'absolute', top: '40px', left: '180px', zIndex: 15, background: 'var(--bg-card)', borderRadius: '50%', padding: '0.2rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
              <Facebook color="#38BDF8" size={28} />
            </div>
            <div style={{ position: 'absolute', top: '180px', left: '20px', zIndex: 15, background: 'var(--bg-card)', borderRadius: '50%', padding: '0.2rem' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--text-primary)" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
            <div style={{ position: 'absolute', top: '170px', left: '330px', zIndex: 15, background: 'var(--bg-card)', padding: '0.2rem', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
              <Instagram color="#FB7185" size={28} />
            </div>
            <div style={{ position: 'absolute', top: '320px', left: '160px', zIndex: 15, background: 'var(--bg-card)', borderRadius: '50%', padding: '0.2rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
              <Linkedin color="#0077b5" size={28} />
            </div>

            <style jsx>{`
              .spin-slow {
                animation: spin 60s linear infinite;
              }
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>

          {/* Features Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              { title: 'AI Form Architect', icon: <Brain size={24} />, color: '#A855F7', tag: 'NLU Powered', desc: 'Type your goal — not questions. Our AI designs the full form structure, picks question types, and orders them.', bgImage: '/ai_form_architect_bg_1772150152480.png' },
              { title: 'Adaptive Question Flow', icon: <ArrowRight size={24} />, color: '#2DD4BF', tag: 'Dynamic Logic', desc: 'Forms that respond to answers in real-time. Low rating? AI adds a follow-up. High satisfaction? Skip the negatives.', bgImage: '/adaptive_question_flow_bg_1772150170496.png' },
              { title: 'AI Insight Engine', icon: <BarChart3 size={24} />, color: '#FB7185', tag: 'Sentiment AI', desc: 'Raw responses → pain points, sentiment scores, recurring themes, and concrete business recommendations.', bgImage: '/ai_insight_engine_bg_1772150184992.png' },
              { title: 'Executive Summary', icon: <FileText size={24} />, color: '#6366F1', tag: 'Automated Reports', desc: 'Instant, presentation-ready summaries generated by analyzing thousands of responses, saving you hours of manual review.', bgImage: '/executive_summary_bg_1772150199269.png' }
            ].map((feature, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '2.5rem 2rem', textAlign: 'left', transition: 'all 0.3s', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden', height: '100%', minHeight: '340px' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)'; const bg = e.currentTarget.querySelector('.hover-bg') as HTMLElement; if (bg) bg.style.opacity = '1'; const title = e.currentTarget.querySelector('h3') as HTMLElement; if (title) title.style.color = 'white'; const desc = e.currentTarget.querySelector('p') as HTMLElement; if (desc) desc.style.color = 'rgba(255,255,255,0.9)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.02)'; const bg = e.currentTarget.querySelector('.hover-bg') as HTMLElement; if (bg) bg.style.opacity = '0'; const title = e.currentTarget.querySelector('h3') as HTMLElement; if (title) title.style.color = 'var(--text-primary)'; const desc = e.currentTarget.querySelector('p') as HTMLElement; if (desc) desc.style.color = 'var(--text-secondary)'; }}>
                <div className="hover-bg" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url(${feature.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0, transition: 'opacity 0.3s', zIndex: 0 }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '12px', background: feature.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '1.5rem', opacity: 0.9 }}>
                    {feature.icon}
                  </div>
                  <div style={{ display: 'inline-block', padding: '0.2rem 0.8rem', background: `${feature.color}15`, color: feature.color, borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1rem' }}>
                    {feature.tag}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>{feature.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* Part 3: Integrated with Social Media */}
      < section id="social" style={{
        background: '#041F40', padding: '8rem 2rem', textAlign: 'center', position: 'relative',
        clipPath: 'polygon(0 0, 100% 4vw, 100% 100%, 0 100%)',
        marginTop: '-4vw',
        transition: 'background 0.3s ease'
      }}>
        <div style={{ maxWidth: 1200, margin: '4rem auto 0' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '4rem', letterSpacing: '-0.02em' }}>
            Integrated with Social Media
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { name: 'Facebook', icon: <Facebook size={40} color="#3B82F6" />, desc: 'Reach billions of users with integrated Facebook Insights. Understand your audience like never before.', bgImage: '/facebook_social_bg_1772150359762.png' },
              { name: 'X', icon: <svg viewBox="0 0 24 24" aria-hidden="true" width="40" height="40" fill="var(--text-primary)"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>, desc: 'Harness real-time conversations on X. Adaptive forms capture sentiment from every trending topic.', bgImage: '/x_social_bg_1772150375751.png' },
              { name: 'Google', icon: <Chrome size={40} color="#EA4335" />, desc: 'Sync with the Google ecosystem. Extract intelligence from search patterns and cloud data.', bgImage: '/google_social_bg_1772150391350.png' },
            ].map((social, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: '3rem 2rem', textAlign: 'center', transition: 'transform 0.3s', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  const bg = e.currentTarget.querySelector('.hover-bg-social') as HTMLElement;
                  if (bg) bg.style.opacity = '1';
                  const title = e.currentTarget.querySelector('h3') as HTMLElement;
                  if (title) title.style.color = 'white';
                  const desc = e.currentTarget.querySelector('p') as HTMLElement;
                  if (desc) desc.style.color = 'rgba(255,255,255,0.9)';
                  const iconSvg = e.currentTarget.querySelector('svg[fill="var(--text-primary)"]') as HTMLElement;
                  if (iconSvg && social.name === 'X') iconSvg.style.fill = 'white';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  const bg = e.currentTarget.querySelector('.hover-bg-social') as HTMLElement;
                  if (bg) bg.style.opacity = '0';
                  const title = e.currentTarget.querySelector('h3') as HTMLElement;
                  if (title) title.style.color = 'var(--text-primary)';
                  const desc = e.currentTarget.querySelector('p') as HTMLElement;
                  if (desc) desc.style.color = 'var(--text-secondary)';
                  const iconSvg = e.currentTarget.querySelector('svg[fill="white"]') as HTMLElement;
                  if (iconSvg && social.name === 'X') iconSvg.style.fill = 'var(--text-primary)';
                }}>
                <div className="hover-bg-social" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url(${social.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0, transition: 'opacity 0.3s', zIndex: 0 }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>{social.icon}</div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem', transition: 'color 0.3s' }}>{social.name}</h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem', transition: 'color 0.3s' }}>{social.desc}</p>
                  <button style={{ background: '#A855F7', color: 'white', padding: '0.6rem 2rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', border: 'none', width: '100%', cursor: 'pointer', transition: 'background 0.2s', position: 'relative', zIndex: 2 }} onMouseEnter={e => e.currentTarget.style.background = '#9333EA'} onMouseLeave={e => e.currentTarget.style.background = '#A855F7'}>Learn More</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* Part 4: 4 Steps (White background) */}
      < section id="how-it-works" style={{
        background: '#020C1B', padding: '8rem 2rem', textAlign: 'center', transition: 'background-color 0.3s'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '4rem', letterSpacing: '-0.02em' }}>
            From goal to insight in <span style={{ color: 'var(--accent-highlight)' }}>4 steps</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              { num: 'Step 01', color: '#3B82F6', title: 'Describe your goal', desc: 'Type what you want to understand — not the questions.', bg: '#E0E7FF', bgImage: '/step_describe_goal_bg_1772150539409.png' },
              { num: 'Step 02', color: '#F43F5E', title: 'AI builds the form', desc: 'Grok AI designs, structures, and adds adaptive logic for you.', bg: '#475569', bgImage: '/step_ai_builds_bg_1772150551990.png' },
              { num: 'Step 03', color: '#10B981', title: 'Collect responses', desc: 'Share your link. Every session is personalized by the adaptive engine.', bg: '#D1FAE5', bgImage: '/step_collect_responses_bg_1772150567865.png' },
              { num: 'Step 04', color: '#A855F7', title: 'Get intelligence', desc: 'AI synthesizes raw data into high-level business insights automatically.', bg: '#F3E8FF', bgImage: '/step_get_intelligence_bg_1772150582743.png' }
            ].map((step, i) => (
              <div key={i} className="group" style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '24px', padding: '2rem', textAlign: 'left',
                position: 'relative', overflow: 'hidden',
                transition: 'all 0.3s',
                boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
              }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)'; const bg = e.currentTarget.querySelector('.hover-bg-step') as HTMLElement; if (bg) bg.style.opacity = '1'; const title = e.currentTarget.querySelector('.step-title') as HTMLElement; if (title) title.style.color = 'white'; const desc = e.currentTarget.querySelector('.step-desc') as HTMLElement; if (desc) desc.style.color = 'rgba(255,255,255,0.8)'; const inner = e.currentTarget.querySelector('.step-inner-box') as HTMLElement; if (inner) inner.style.opacity = '0'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.02)'; const bg = e.currentTarget.querySelector('.hover-bg-step') as HTMLElement; if (bg) bg.style.opacity = '0'; const title = e.currentTarget.querySelector('.step-title') as HTMLElement; if (title) title.style.color = 'var(--text-primary)'; const desc = e.currentTarget.querySelector('.step-desc') as HTMLElement; if (desc) desc.style.color = 'var(--text-secondary)'; const inner = e.currentTarget.querySelector('.step-inner-box') as HTMLElement; if (inner) inner.style.opacity = '1'; }}>
                <div className="hover-bg-step" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url(${step.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0, transition: 'opacity 0.3s', zIndex: 0 }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div className="step-inner-box" style={{ background: step.bg, borderRadius: '12px', height: '140px', marginBottom: '2rem', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.3s' }}>
                    <div style={{ position: 'absolute', top: 12, left: 12, background: step.color, color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '4px' }}>{step.num}</div>
                    <div style={{ color: step.color, opacity: 0.6 }}>
                      {i === 0 && <span style={{ fontSize: 32 }}>◎</span>}
                      {i === 1 && <span style={{ fontSize: 32 }}>⚡</span>}
                      {i === 2 && <span style={{ fontSize: 32 }}>➔</span>}
                      {i === 3 && <span style={{ fontSize: 32 }}>✦</span>}
                    </div>
                  </div>
                  <h3 className="step-title" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.8rem', transition: 'color 0.3s' }}>{step.title}</h3>
                  <p className="step-desc" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.95rem', lineHeight: 1.6, transition: 'color 0.3s' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section >

      < section style={{
        background: 'var(--bg-social)', padding: '8rem 2rem', textAlign: 'center', color: 'white',
        transition: 'background 0.3s ease'
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Your work, everywhere<br />you are
          </h2>
          <p style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '3rem', opacity: 0.9, lineHeight: 1.6 }}>
            Access your forms, insights, and data from any device. Experience seamless integration from goal to analysis.
          </p>
          <button style={{ background: '#A855F7', color: 'white', padding: '1rem 3rem', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'background 0.2s', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }} onMouseEnter={e => e.currentTarget.style.background = '#9333EA'} onMouseLeave={e => e.currentTarget.style.background = '#A855F7'}>
            Try NeuroForm <ArrowRight size={20} />
          </button>
        </div>
      </section >

      {/* Footer */}
      < footer id="contact" style={{ background: '#0A2540', padding: '5rem 2rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem', paddingBottom: '4rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ gridColumn: '1 / span 2', maxWidth: 350 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <Brain size={28} color="#F59E0B" />
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>Neuro<span style={{ color: '#F59E0B' }}>Form</span></span>
              </div>
              <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: 1.6 }}>
                NeuroForm generates intelligent forms from a single goal, adapts questions in real-time, and converts responses into actionable business intelligence — automatically.
              </p>
            </div>
            <div>
              <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '1.5rem' }}>Features</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <a href="#" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.9rem' }}>AI Form Architect</a>
                <a href="#" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.9rem' }}>Adaptive Question Flow</a>
                <a href="#" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.9rem' }}>AI Insight Engine</a>
                <a href="#" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.9rem' }}>Executive Summary</a>
              </div>
            </div>
            <div>
              <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '1.5rem' }}>Contact Us</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#94A3B8', fontSize: '0.9rem' }}>
                <span style={{ color: 'white', fontWeight: 600 }}>P. Lakshmi Chaitanya Sai</span>
                <span>chaitanyasai9391@gmail.com</span>
                <span>+91 9944273645</span>
              </div>
            </div>
            <div>
              <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '1.5rem' }}>Try It Today</h4>
              <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Get started for free. No credit card required.</p>
              <Link href="/register">
                <button style={{ background: '#A855F7', color: 'white', padding: '0.6rem 1.5rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Start for free <ArrowRight size={16} /></button>
              </Link>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
              ©2026 NeuroForm LLC. All Rights Reserved.
            </div>
            <div style={{ display: 'flex', gap: '1rem', color: '#94A3B8' }}>
              <Facebook size={18} />
              <Twitter size={18} />
              <Instagram size={18} />
              <Linkedin size={18} />
            </div>
          </div>
        </div>
      </footer >
    </div >
  );
}
