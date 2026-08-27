'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, UserPlus, Sparkles } from 'lucide-react';
import RegistrationForm from '../../components/RegistrationForm';

export default function RegisterPage() {
  return (
    <div className="app-container">
      {/* Top Header */}
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-muted)',
              fontSize: '0.86rem',
              fontWeight: 500,
              marginBottom: '8px',
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={14} /> Back to Overview
          </Link>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Student Registration Portal</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Fill out the official enrollment application form. Your student identification card will be generated automatically.
          </p>
        </div>
      </div>

      {/* Main Registration Form */}
      <RegistrationForm />
    </div>
  );
}
