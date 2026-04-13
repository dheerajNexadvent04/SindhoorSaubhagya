"use client";

import Link from 'next/link';

export default function PlansPage() {
    return (
        <div style={{ padding: '24px', border: '1px solid #fee2e2', borderRadius: '16px', background: '#fff' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1f2937', marginBottom: '12px' }}>Membership Plans</h1>
            <p style={{ color: '#6b7280', maxWidth: '720px', lineHeight: 1.7, marginBottom: '16px' }}>
                Explore available plans to unlock premium profile visibility, faster connections, and dedicated matchmaking support.
            </p>
            <Link
                href="/membership"
                style={{
                    display: 'inline-block',
                    background: '#dc2626',
                    color: '#fff',
                    fontWeight: 600,
                    textDecoration: 'none',
                    borderRadius: '9999px',
                    padding: '10px 18px',
                }}
            >
                View Membership Plans
            </Link>
        </div>
    );
}
