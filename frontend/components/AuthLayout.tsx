'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            backgroundColor: '#E4F0FD',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Left side decorative background elements (Light blue area) */}
            {/* Top-left corner circle */}
            <div style={{
                position: 'absolute',
                top: '-5%',
                left: '-2%',
                width: '12vw',
                height: '12vw',
                borderRadius: '50%',
                border: '18px solid #92B8F8',
                opacity: 0.8,
            }} />
            {/* Top-edge small circle */}
            <div style={{
                position: 'absolute',
                top: '2%',
                left: '35%',
                width: '6vw',
                height: '6vw',
                borderRadius: '50%',
                border: '12px solid #92B8F8',
                opacity: 0.8,
            }} />
            {/* Top solid circle */}
            <div style={{
                position: 'absolute',
                top: '15%',
                left: '45%',
                width: '2vw',
                height: '2vw',
                borderRadius: '50%',
                backgroundColor: '#92B8F8',
                opacity: 0.8,
            }} />
            {/* Bottom-left overlapping circles */}
            <div style={{
                position: 'absolute',
                bottom: '-8%',
                left: '2%',
                width: '18vw',
                height: '18vw',
                borderRadius: '50%',
                border: '25px solid #E4F0FD', /* Transparent/outline over another */
                boxShadow: '0 0 0 25px #92B8F8',
                opacity: 0.8,
            }} />
            <div style={{
                position: 'absolute',
                bottom: '8%',
                left: '30%',
                width: '4vw',
                height: '4vw',
                borderRadius: '50%',
                backgroundColor: '#92B8F8',
                opacity: 0.8,
            }} />
            <div style={{
                position: 'absolute',
                bottom: '15%',
                left: '42%',
                width: '5vw',
                height: '5vw',
                borderRadius: '50%',
                border: '10px solid #92B8F8',
                opacity: 0.8,
            }} />

            {/* Main split layout container */}
            <div style={{ display: 'flex', width: '100%', zIndex: 10 }}>

                {/* Left Side (Form Area) */}
                <div style={{
                    flex: '1 1 50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    position: 'relative',
                    zIndex: 20
                }}>
                    <div style={{ width: '100%', maxWidth: 420, marginBottom: '1.5rem', marginLeft: '-20px' }}>
                        <Link href="/" style={{ color: '#043873', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                            <ArrowLeft size={16} /> Back to Home
                        </Link>
                    </div>

                    <div style={{
                        backgroundColor: '#92B8F8', /* Exact match to target form background */
                        borderRadius: '24px',
                        padding: '3.5rem 2.5rem',
                        width: '100%',
                        maxWidth: 420,
                        boxShadow: '0 15px 40px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(255,255,255,0.2)',
                        position: 'relative',
                        zIndex: 20
                    }}>
                        {children}
                    </div>
                </div>

                {/* Right Side (Graphics Area) */}
                <div style={{
                    flex: '1 1 50%',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'visible'
                }}>
                    {/* Outer Blue Circle (Vibrant Blue) */}
                    <div style={{
                        position: 'absolute',
                        right: '-20%',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '130vh',
                        height: '130vh',
                        borderRadius: '50%',
                        backgroundColor: '#1C5BDE',
                        zIndex: 1
                    }} />

                    {/* Inner Dark Blue Circle (Navy) */}
                    <div style={{
                        position: 'absolute',
                        right: '-30%',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '110vh',
                        height: '110vh',
                        borderRadius: '50%',
                        backgroundColor: '#053396',
                        zIndex: 2
                    }} />

                    {/* Darkest Blue Circle (Deep Navy right edge) */}
                    <div style={{
                        position: 'absolute',
                        right: '-45%',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '90vh',
                        height: '90vh',
                        borderRadius: '50%',
                        backgroundColor: '#021D5F',
                        zIndex: 3
                    }} />

                    {/* Graphic Floats on Right Side (inside the blues) */}
                    {/* Solid circle top-right */}
                    <div style={{ position: 'absolute', top: '15%', right: '15%', width: 80, height: 80, borderRadius: '50%', backgroundColor: '#4C7BD3', opacity: 0.8, zIndex: 4 }} />
                    {/* Outline circle middle-left */}
                    <div style={{ position: 'absolute', top: '35%', left: '5%', width: 90, height: 90, borderRadius: '50%', border: '20px solid rgba(255,255,255,0.15)', zIndex: 4 }} />
                    {/* Solid circle bottom-right */}
                    <div style={{ position: 'absolute', bottom: '25%', right: '10%', width: 70, height: 70, borderRadius: '50%', backgroundColor: '#2E5BB5', opacity: 0.9, zIndex: 4 }} />
                    {/* Outline circle bottom-middle */}
                    <div style={{ position: 'absolute', bottom: '10%', left: '20%', width: 110, height: 110, borderRadius: '50%', border: '25px solid rgba(255,255,255,0.1)', zIndex: 4 }} />

                    {/* Center Illustration Placeholder */}
                    <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', pointerEvents: 'none', marginLeft: '-15%' }}>
                        <img src="/floral_3d.png" alt="" style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain' }} onError={(e) => e.currentTarget.style.display = 'none'} />
                    </div>
                </div>
            </div>
        </div>
    );
}
