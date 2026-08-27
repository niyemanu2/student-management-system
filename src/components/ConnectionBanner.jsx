'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Database, ShieldCheck, Settings2, Info } from 'lucide-react';
import { testSupabaseConnection, isSupabaseConfigured } from '../lib/supabase';

export default function ConnectionBanner() {
  const [status, setStatus] = useState({
    checking: true,
    connected: false,
    error: null
  });

  useEffect(() => {
    async function verify() {
      if (!isSupabaseConfigured) {
        setStatus({ checking: false, connected: false, error: null });
        return;
      }
      const res = await testSupabaseConnection();
      setStatus({ checking: false, connected: res.connected, error: res.error });
    }
    verify();
  }, []);

  return (
    <div
      className="connection-banner"
      style={{
        background: status.connected
          ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 78, 59, 0.15) 100%)'
          : 'linear-gradient(90deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)',
        borderBottom: `1px solid ${status.connected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.25)'}`,
        padding: '8px 24px',
        fontSize: '0.84rem'
      }}
    >
      <div
        className="app-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {status.connected ? (
            <>
              <span
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  boxShadow: '0 0 8px #10b981'
                }}
              />
              <span style={{ fontWeight: 600, color: 'var(--success)' }}>
                Supabase PostgreSQL Live Connected
              </span>
              <span style={{ color: 'var(--text-muted)' }}>• All data syncs in real-time</span>
            </>
          ) : (
            <>
              <span
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#6366f1',
                  boxShadow: '0 0 8px #6366f1'
                }}
              />
              <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
                Demo / Local Storage Mode Active
              </span>
              <span style={{ color: 'var(--text-muted)' }}>
                • Fully operational without Supabase setup
              </span>
            </>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link
            href="/setup"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--primary)',
              fontWeight: 600,
              textDecoration: 'underline'
            }}
          >
            <Settings2 size={14} />
            <span>Supabase Database Setup Guide</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
