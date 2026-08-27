'use client';
import React from 'react';
import { Users, UserCheck, Clock, Award, BookOpen, TrendingUp } from 'lucide-react';

export default function AdminStats({ stats }) {
  if (!stats) return null;

  const statCards = [
    {
      title: 'Total Enrolled',
      value: stats.total || 0,
      subtext: 'Registered across all faculties',
      icon: Users,
      color: 'var(--primary)',
      bg: 'var(--primary-light)',
      border: 'var(--primary-glow)'
    },
    {
      title: 'Active Students',
      value: stats.active || 0,
      subtext: `${stats.total ? Math.round((stats.active / stats.total) * 100) : 0}% of total registry`,
      icon: UserCheck,
      color: 'var(--success)',
      bg: 'var(--success-bg)',
      border: 'var(--success-border)'
    },
    {
      title: 'Pending Review',
      value: stats.pending || 0,
      subtext: 'Awaiting doc verification',
      icon: Clock,
      color: 'var(--warning)',
      bg: 'var(--warning-bg)',
      border: 'var(--warning-border)'
    },
    {
      title: 'Average GPA',
      value: stats.averageGpa || '3.75',
      subtext: 'Overall cohort performance',
      icon: Award,
      color: 'var(--accent)',
      bg: 'var(--accent-gradient-subtle)',
      border: 'rgba(168, 85, 247, 0.3)'
    }
  ];

  return (
    <div style={{ marginBottom: '32px' }}>
      {/* 4 KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '24px'
        }}
      >
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="glass-panel"
              style={{
                padding: '22px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderLeft: `4px solid ${card.color}`,
              }}
            >
              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                  {card.title}
                </div>
                <div style={{ fontFamily: 'Outfit', fontSize: '2rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '4px' }}>
                  {card.value}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {card.subtext}
                </div>
              </div>

              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  background: card.bg,
                  color: card.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${card.border}`,
                  flexShrink: 0
                }}
              >
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Department Breakdown Mini-Bar */}
      {stats.departmentCounts && Object.keys(stats.departmentCounts).length > 0 && (
        <div className="glass-panel" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.92rem' }}>
              <BookOpen size={16} color="var(--primary)" />
              <span>Department Distribution</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {Object.keys(stats.departmentCounts).length} active faculties
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            {Object.entries(stats.departmentCounts).map(([dept, count]) => {
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={dept} style={{ background: 'var(--bg-tertiary)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '130px' }} title={dept}>
                      {dept}
                    </span>
                    <span style={{ color: 'var(--primary)' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: 'var(--accent-gradient)',
                        borderRadius: '3px',
                        transition: 'width 0.5s ease-out'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
