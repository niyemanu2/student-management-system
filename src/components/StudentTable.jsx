'use client';
import React, { useState, useMemo } from 'react';
import {
  Search, Filter, Download, ArrowUpDown, Eye,
  Trash2, RefreshCw, FileSpreadsheet, FileJson, CheckCircle2, AlertCircle, Sparkles
} from 'lucide-react';
import { exportToCSV, exportToJSON } from '../lib/exportUtils';
import { DEPARTMENTS } from '../data/mockStudents';
import { resetDemoData } from '../lib/studentService';
import { useToast } from './Toast';

export default function StudentTable({ students, loading, onSelectStudent, onRefresh }) {
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [resetting, setResetting] = useState(false);

  // Filtered & Sorted in memory for ultra-responsive instant live search
  const filteredStudents = useMemo(() => {
    let result = [...students];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(s =>
        (s.first_name || '').toLowerCase().includes(q) ||
        (s.last_name || '').toLowerCase().includes(q) ||
        (s.student_id || '').toLowerCase().includes(q) ||
        (s.email || '').toLowerCase().includes(q) ||
        (s.program || '').toLowerCase().includes(q) ||
        (s.department || '').toLowerCase().includes(q)
      );
    }

    if (selectedDept !== 'All') {
      result = result.filter(s => s.department === selectedDept);
    }

    if (selectedStatus !== 'All') {
      result = result.filter(s => s.status === selectedStatus);
    }

    if (selectedYear !== 'All') {
      result = result.filter(s => s.academic_year === selectedYear);
    }

    result.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === 'name') {
        valA = `${a.first_name} ${a.last_name}`.toLowerCase();
        valB = `${b.first_name} ${b.last_name}`.toLowerCase();
      } else if (sortBy === 'gpa') {
        valA = parseFloat(a.gpa) || 0;
        valB = parseFloat(b.gpa) || 0;
      } else if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = (valB || '').toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [students, search, selectedDept, selectedStatus, selectedYear, sortBy, sortOrder]);

  const handleResetDemo = async () => {
    if (!confirm('Reset all student data back to initial demo seeds?')) return;
    setResetting(true);
    try {
      await resetDemoData();
      addToast('Demo database restored to default seeds', 'success');
      onRefresh();
    } catch (e) {
      addToast('Failed to reset demo data', 'error');
    } finally {
      setResetting(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedDept('All');
    setSelectedStatus('All');
    setSelectedYear('All');
  };

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      {/* Top Bar: Search & Action Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px'
        }}
      >
        {/* Search input */}
        <div style={{ position: 'relative', flex: '1', minWidth: '280px', maxWidth: '450px' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          />
          <input
            type="text"
            placeholder="Search by name, student ID, email, or major..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '40px' }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 700
              }}
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Action buttons (Export, Reset Demo) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => exportToCSV(filteredStudents)}
            className="btn btn-secondary btn-sm"
            title="Download CSV file of current records"
          >
            <FileSpreadsheet size={15} color="var(--success)" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => exportToJSON(filteredStudents)}
            className="btn btn-secondary btn-sm"
            title="Download JSON data"
          >
            <FileJson size={15} color="var(--primary)" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handleResetDemo}
            disabled={resetting}
            className="btn btn-outline btn-sm"
            title="Restore sample demo students"
          >
            <RefreshCw size={14} className={resetting ? 'spin' : ''} />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          marginBottom: '24px',
          padding: '14px',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)'
        }}
      >
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
            Faculty Department
          </label>
          <select
            className="form-select"
            style={{ padding: '8px 12px', fontSize: '0.86rem' }}
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            <option value="All">All Departments ({students.length})</option>
            {DEPARTMENTS.map(d => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
            Enrollment Status
          </label>
          <select
            className="form-select"
            style={{ padding: '8px 12px', fontSize: '0.86rem' }}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending Approval</option>
            <option value="On Leave">On Leave</option>
            <option value="Graduated">Graduated</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
            Academic Year
          </label>
          <select
            className="form-select"
            style={{ padding: '8px 12px', fontSize: '0.86rem' }}
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="All">All Years</option>
            <option value="Year 1">Year 1</option>
            <option value="Year 2">Year 2</option>
            <option value="Year 3">Year 3</option>
            <option value="Year 4">Year 4</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
            Sort Order
          </label>
          <div style={{ display: 'flex', gap: '6px' }}>
            <select
              className="form-select"
              style={{ padding: '8px 12px', fontSize: '0.86rem', flex: 1 }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="created_at">Date Enrolled</option>
              <option value="name">Student Name</option>
              <option value="student_id">Student ID</option>
              <option value="gpa">GPA Score</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0 10px' }}
              title={`Sorting: ${sortOrder.toUpperCase()}`}
            >
              <ArrowUpDown size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Results Header Counter */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <span>Showing <strong>{filteredStudents.length}</strong> of {students.length} student records</span>
        {(search || selectedDept !== 'All' || selectedStatus !== 'All' || selectedYear !== 'All') && (
          <button
            onClick={clearFilters}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Students Data Table */}
      <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <th style={{ padding: '14px 18px' }}>Student</th>
              <th style={{ padding: '14px 18px' }}>Student ID</th>
              <th style={{ padding: '14px 18px' }}>Department & Major</th>
              <th style={{ padding: '14px 18px' }}>Year / Mode</th>
              <th style={{ padding: '14px 18px' }}>GPA</th>
              <th style={{ padding: '14px 18px' }}>Status</th>
              <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  Loading student registry...
                </td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '48px 20px' }}>
                  <AlertCircle size={36} color="var(--text-muted)" style={{ margin: '0 auto 10px' }} />
                  <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '6px' }}>No student records found</div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '14px' }}>
                    Try refining your search query or clear active filters.
                  </p>
                  <button onClick={clearFilters} className="btn btn-secondary btn-sm">
                    Clear Active Filters
                  </button>
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => {
                const statusSlug = (student.status || 'Active').toLowerCase().replace(/\s+/g, '');
                return (
                  <tr
                    key={student.id || student.student_id}
                    onClick={() => onSelectStudent(student)}
                    style={{
                      borderBottom: '1px solid var(--border-color)',
                      transition: 'background-color var(--transition-fast)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {/* Student Info & Photo */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--border-color)', flexShrink: 0 }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={student.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${student.first_name}`}
                            alt={student.first_name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                            {student.first_name} {student.last_name}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Student ID */}
                    <td style={{ padding: '14px 18px', fontFamily: 'monospace', fontWeight: 600, color: 'var(--primary)' }}>
                      {student.student_id}
                    </td>

                    {/* Department & Program */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.86rem' }}>
                        {student.program}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        {student.department}
                      </div>
                    </td>

                    {/* Academic Year & Study Mode */}
                    <td style={{ padding: '14px 18px', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                      <div>{student.academic_year}</div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{student.study_mode}</div>
                    </td>

                    {/* GPA */}
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--success)', background: 'var(--success-bg)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.85rem' }}>
                        {student.gpa ? parseFloat(student.gpa).toFixed(2) : '3.75'}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '14px 18px' }}>
                      <span className={`badge badge-${statusSlug}`}>
                        {student.status || 'Active'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStudent(student);
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '6px 10px' }}
                        title="View full dossier"
                      >
                        <Eye size={14} />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
