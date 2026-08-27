'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  Database, ShieldCheck, Copy, Check, Terminal, ExternalLink,
  RefreshCw, CheckCircle2, AlertCircle, Sparkles, ArrowLeft
} from 'lucide-react';
import { testSupabaseConnection, isSupabaseConfigured } from '../../lib/supabase';
import { useToast } from '../../components/Toast';

const SQL_SCHEMA = `-- 1. Create the students table
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    avatar_url TEXT,
    department VARCHAR(100) NOT NULL,
    program VARCHAR(150) NOT NULL,
    degree_level VARCHAR(50) NOT NULL DEFAULT 'Bachelor',
    academic_year VARCHAR(50) NOT NULL,
    semester VARCHAR(50) NOT NULL,
    study_mode VARCHAR(50) NOT NULL DEFAULT 'Full-time',
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    emergency_contact_name VARCHAR(150),
    emergency_contact_relation VARCHAR(50),
    emergency_contact_phone VARCHAR(50),
    home_address TEXT,
    gpa NUMERIC(3,2) DEFAULT 3.65,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Indexes for instant lookup
CREATE INDEX IF NOT EXISTS idx_students_student_id ON public.students(student_id);
CREATE INDEX IF NOT EXISTS idx_students_department ON public.students(department);
CREATE INDEX IF NOT EXISTS idx_students_status ON public.students(status);

-- 3. Row Level Security
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access for students" ON public.students;
CREATE POLICY "Allow public access for students" ON public.students FOR ALL USING (true) WITH CHECK (true);`;

export default function SetupPage() {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const copySQL = async () => {
    try {
      await navigator.clipboard.writeText(SQL_SCHEMA);
      setCopied(true);
      addToast('SQL schema copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      addToast('Failed to copy to clipboard', 'error');
    }
  };

  const runTest = async () => {
    setTesting(true);
    try {
      const res = await testSupabaseConnection();
      setTestResult(res);
      if (res.connected) {
        addToast('Successfully connected to Supabase!', 'success');
      } else {
        addToast('Supabase connection could not be established', 'error');
      }
    } catch (err) {
      setTestResult({ connected: false, error: err.message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="app-container" style={{ maxWidth: '920px' }}>
      <div style={{ marginBottom: '28px' }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-muted)',
            fontSize: '0.86rem',
            marginBottom: '8px',
            textDecoration: 'none'
          }}
        >
          <ArrowLeft size={14} /> Back to Overview
        </Link>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Supabase Database Setup Guide</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Connect your Next.js application to your live Supabase PostgreSQL database in under 2 minutes.
        </p>
      </div>

      {/* Live Status Card */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px', borderLeft: '4px solid var(--primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Connection Diagnostic
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isSupabaseConfigured ? (
                <>
                  <CheckCircle2 size={20} color="var(--success)" />
                  <span>Credentials Detected in .env.local</span>
                </>
              ) : (
                <>
                  <AlertCircle size={20} color="var(--primary)" />
                  <span>Running in Offline / Demo Mode (LocalStorage)</span>
                </>
              )}
            </div>
          </div>

          <button onClick={runTest} disabled={testing} className="btn btn-primary btn-sm">
            <RefreshCw size={14} className={testing ? 'spin' : ''} />
            <span>{testing ? 'Testing...' : 'Test Connection Now'}</span>
          </button>
        </div>

        {testResult && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: testResult.connected ? 'var(--success-bg)' : 'var(--danger-bg)',
              color: testResult.connected ? 'var(--success)' : 'var(--danger)',
              border: `1px solid ${testResult.connected ? 'var(--success-border)' : 'var(--danger-border)'}`,
              fontSize: '0.88rem'
            }}
          >
            {testResult.connected ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} />
                <span>Success! Supabase database `students` table is reachable and ready.</span>
              </div>
            ) : (
              <div>
                <strong>Connection Error:</strong> {testResult.error || 'Check your URL and API key.'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3 Simple Setup Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Step 1 */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              1
            </div>
            <h3 style={{ fontSize: '1.2rem' }}>Create a Free Supabase Project</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '14px', lineHeight: 1.5 }}>
            Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline', fontWeight: 600 }}>Supabase.com</a>, log in or sign up, and create a new project (choose any name and secure database password).
          </p>
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex' }}
          >
            <ExternalLink size={14} /> Open Supabase Dashboard
          </a>
        </div>

        {/* Step 2 */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                2
              </div>
              <h3 style={{ fontSize: '1.2rem' }}>Execute SQL Migration in SQL Editor</h3>
            </div>

            <button onClick={copySQL} className="btn btn-secondary btn-sm">
              {copied ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
            </button>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '14px' }}>
            In your Supabase project dashboard, navigate to the <strong>SQL Editor</strong> tab on the left sidebar, paste the SQL below, and click <strong>RUN</strong>:
          </p>

          <div style={{ position: 'relative' }}>
            <pre
              style={{
                background: 'var(--bg-primary)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                overflowX: 'auto',
                border: '1px solid var(--border-color)',
                maxHeight: '260px',
                fontFamily: 'monospace'
              }}
            >
              {SQL_SCHEMA}
            </pre>
          </div>
        </div>

        {/* Step 3 */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              3
            </div>
            <h3 style={{ fontSize: '1.2rem' }}>Set Environment Variables in .env.local</h3>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '14px' }}>
            In your Supabase project, go to <strong>Project Settings &gt; API</strong>, copy your <strong>Project URL</strong> and <strong>anon public API key</strong>, and paste them into your project&apos;s <code>.env.local</code> file:
          </p>

          <pre
            style={{
              background: 'var(--bg-primary)',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              color: '#38bdf8',
              border: '1px solid var(--border-color)',
              fontFamily: 'monospace'
            }}
          >
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...your_anon_key`}
          </pre>
        </div>
      </div>
    </div>
  );
}
