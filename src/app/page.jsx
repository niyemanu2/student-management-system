'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap, LayoutDashboard, UserPlus, Database,
  ArrowRight, ShieldCheck, FileSpreadsheet, Sparkles, CheckCircle2, QrCode
} from 'lucide-react';
import { getStudentStats } from '../lib/studentService';

export default function HomePage() {
  const [stats, setStats] = useState({ total: 6, active: 4, pending: 1 });

  useEffect(() => {
    async function load() {
      const data = await getStudentStats();
      setStats(data);
    }
    load();
  }, []);

  return (
    <div className="app-container">
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '48px 0 36px', maxWidth: '840px', margin: '0 auto' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--accent-gradient-subtle)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            fontSize: '0.84rem',
            fontWeight: 600,
            color: 'var(--primary)',
            marginBottom: '20px'
          }}
        >
          <Sparkles size={14} /> Next.js & Supabase Academic Portal
        </div>

        <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '18px' }}>
          Modern Student Registration & <span className="hero-gradient-text">Administration System</span>
        </h1>

        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '36px' }}>
          An all-in-one institutional platform enabling seamless student self-registration, instant digital ID generation, and comprehensive administrative oversight with PostgreSQL database sync.
        </p>

        {/* Quick Access CTA Buttons */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" className="btn btn-primary btn-lg">
            <UserPlus size={19} />
            <span>Register New Student</span>
          </Link>
          <Link href="/admin" className="btn btn-secondary btn-lg">
            <LayoutDashboard size={19} />
            <span>Admin Records Portal</span>
          </Link>
        </div>
      </section>

      {/* Main Feature / Portal Cards */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', margin: '40px 0' }}>
        {/* Student Portal Card */}
        <div
          className="glass-panel"
          style={{
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderTop: '4px solid var(--primary)',
            transition: 'transform var(--transition-base)'
          }}
        >
          <div>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}
            >
              <UserPlus size={26} />
            </div>

            <h2 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>Student Registration Portal</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '20px', lineHeight: 1.5 }}>
              Self-service registration for incoming and continuing students. Includes real-time validation, degree major selection, and emergency contacts.
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '28px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--success)" /> Live interactive ID badge preview
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--success)" /> Automatic student ID assignment
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--success)" /> Printable registration pass
              </li>
            </ul>
          </div>

          <Link href="/register" className="btn btn-outline" style={{ width: '100%' }}>
            <span>Open Registration Form</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Admin Portal Card */}
        <div
          className="glass-panel"
          style={{
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderTop: '4px solid var(--accent)',
            transition: 'transform var(--transition-base)'
          }}
        >
          <div>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-gradient-subtle)',
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}
            >
              <LayoutDashboard size={26} />
            </div>

            <h2 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>Administrator Dashboard</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '20px', lineHeight: 1.5 }}>
              Centralized command center for school administrators to oversee enrollment numbers, search student files, edit statuses, and export directories.
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '28px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--success)" /> Real-time search & multi-level filter
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--success)" /> Status management (Active / Pending / Leave)
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--success)" /> CSV & JSON export + ID printing
              </li>
            </ul>
          </div>

          <Link href="/admin" className="btn btn-primary" style={{ width: '100%' }}>
            <span>Enter Admin Dashboard</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Supabase Database Card */}
        <div
          className="glass-panel"
          style={{
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderTop: '4px solid var(--success)',
            transition: 'transform var(--transition-base)'
          }}
        >
          <div>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--success-bg)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}
            >
              <Database size={26} />
            </div>

            <h2 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>Supabase Database</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '20px', lineHeight: 1.5 }}>
              Persistent PostgreSQL cloud database schema, Row Level Security policies, indexes, and ready-to-run setup scripts.
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '28px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--success)" /> One-click copy SQL migrations
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--success)" /> Zero-config LocalStorage fallback
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--success)" /> Real-time connection diagnostic tester
              </li>
            </ul>
          </div>

          <Link href="/setup" className="btn btn-secondary" style={{ width: '100%' }}>
            <span>Database Setup Guide</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
