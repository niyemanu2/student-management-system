'use client';
import React from 'react';
import { GraduationCap, QrCode, ShieldCheck, Sparkles, Building2, Calendar } from 'lucide-react';

export default function StudentIdPreview({ student }) {
  const fullName = `${student.first_name || 'Student'} ${student.last_name || 'Name'}`.trim();
  const studentId = student.student_id || 'STU-2026-XXXX';
  const program = student.program || 'Select a Degree Program';
  const department = student.department || 'Academic Department';
  const avatarUrl = student.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`;
  const status = student.status || 'Active';
  const year = student.academic_year || 'Year 1';

  return (
    <div
      className="student-id-badge"
      style={{
        background: 'linear-gradient(145deg, #1e1b4b 0%, #0f172a 60%, #1e1b4b 100%)',
        color: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        boxShadow: '0 20px 40px -15px rgba(79, 70, 229, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        position: 'relative',
        overflow: 'hidden',
        maxWidth: '420px',
        margin: '0 auto',
      }}
    >
      {/* Holographic glowing pattern */}
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      {/* Card Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          paddingBottom: '14px',
          marginBottom: '18px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <GraduationCap size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.04em' }}>
              ACADEMIA INSTITUTE
            </div>
            <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.06em' }}>
              OFFICIAL STUDENT IDENTIFICATION
            </div>
          </div>
        </div>

        {/* Security Hologram Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '4px 8px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.68rem',
            color: '#a78bfa',
            border: '1px solid rgba(167, 139, 250, 0.3)',
          }}
        >
          <ShieldCheck size={12} />
          <span>VERIFIED</span>
        </div>
      </div>

      {/* Main Body */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        {/* Photo Container */}
        <div style={{ flexShrink: 0, textAlign: 'center' }}>
          <div
            style={{
              width: '94px',
              height: '110px',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
              background: '#334155',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarUrl}
              alt={fullName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onError={(e) => {
                e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`;
              }}
            />
          </div>
          <div
            style={{
              marginTop: '6px',
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '4px',
              background: status === 'Active' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)',
              color: status === 'Active' ? '#34d399' : '#fbbf24',
              border: `1px solid ${status === 'Active' ? 'rgba(52, 211, 153, 0.4)' : 'rgba(251, 191, 36, 0.4)'}`,
              textTransform: 'uppercase',
            }}
          >
            {status}
          </div>
        </div>

        {/* Student Details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase' }}>
            Full Name
          </div>
          <div
            style={{
              fontFamily: 'Outfit',
              fontWeight: 700,
              fontSize: '1.2rem',
              lineHeight: 1.2,
              marginBottom: '8px',
              color: '#ffffff',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {fullName}
          </div>

          <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase' }}>
            Student ID
          </div>
          <div
            style={{
              fontFamily: 'monospace',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: '#38bdf8',
              letterSpacing: '0.05em',
              marginBottom: '8px',
            }}
          >
            {studentId}
          </div>

          <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase' }}>
            Program
          </div>
          <div
            style={{
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: 1.3,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {program}
          </div>
        </div>
      </div>

      {/* Card Footer & Barcode / QR Simulation */}
      <div
        style={{
          marginTop: '18px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.5)' }}>DEPARTMENT</div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)' }}>
            {department}
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.5)' }}>ACADEMIC STATUS</div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)' }}>
            {year} • {student.study_mode || 'Full-time'}
          </div>
        </div>
      </div>
    </div>
  );
}
