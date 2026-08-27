'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { LayoutDashboard, UserPlus, RefreshCw, Database, Download } from 'lucide-react';
import { getStudents, getStudentStats } from '../../lib/studentService';
import AdminStats from '../../components/AdminStats';
import StudentTable from '../../components/StudentTable';
import StudentModal from '../../components/StudentModal';
import { useToast } from '../../components/Toast';

export default function AdminDashboardPage() {
  const { addToast } = useToast();
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [studentsRes, statsData] = await Promise.all([
        getStudents(),
        getStudentStats()
      ]);
      setStudents(studentsRes.data || []);
      setStats(statsData);
    } catch (e) {
      console.error('Error fetching admin data', e);
      addToast('Failed to load student registry', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="app-container">
      {/* Admin Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-active">Admin Center</span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Academic Year 2026</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Student Directory & Records</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Manage student registrations, review verification statuses, and export institutional data.
          </p>
        </div>

        {/* Top Header Actions */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={loadData}
            disabled={loading}
            className="btn btn-secondary btn-sm"
            title="Refresh database records"
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>

          <Link href="/register" className="btn btn-primary btn-sm">
            <UserPlus size={15} />
            <span>New Student</span>
          </Link>
        </div>
      </div>

      {/* Analytics KPI Section */}
      <AdminStats stats={stats} />

      {/* Main Student Directory Table */}
      <StudentTable
        students={students}
        loading={loading}
        onSelectStudent={(student) => setSelectedStudent(student)}
        onRefresh={loadData}
      />

      {/* Student Dossier Modal */}
      {selectedStudent && (
        <StudentModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onRefresh={loadData}
        />
      )}
    </div>
  );
}
