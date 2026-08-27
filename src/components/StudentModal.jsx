'use client';
import React, { useState } from 'react';
import {
  X, Printer, Edit, Trash2, CheckCircle2,
  Mail, Phone, MapPin, Calendar, BookOpen, ShieldCheck, HeartHandshake, Award
} from 'lucide-react';
import StudentIdPreview from './StudentIdPreview';
import { updateStudent, deleteStudent } from '../lib/studentService';
import { useToast } from './Toast';

export default function StudentModal({ student, onClose, onRefresh }) {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('dossier'); // 'dossier' | 'idcard' | 'edit'
  const [currentStatus, setCurrentStatus] = useState(student.status || 'Active');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ ...student });
  const [updating, setUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setCurrentStatus(newStatus);
    const res = await updateStudent(student.id, { status: newStatus });
    if (res.success) {
      addToast(`Student status updated to ${newStatus}`, 'success');
      onRefresh();
    } else {
      addToast('Failed to update status', 'error');
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await updateStudent(student.id, formData);
      if (res.success) {
        addToast('Student details updated successfully', 'success');
        setEditing(false);
        onRefresh();
      } else {
        addToast('Failed to save changes', 'error');
      }
    } catch (err) {
      addToast('Error saving changes', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    const res = await deleteStudent(student.id);
    if (res.success) {
      addToast('Student record removed', 'info');
      onClose();
      onRefresh();
    } else {
      addToast('Failed to delete student', 'error');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2000,
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '850px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px',
          background: 'var(--bg-secondary)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '12px', overflow: 'hidden', border: '2px solid var(--primary)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={student.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${student.first_name}`}
                alt={student.first_name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '1.4rem' }}>{student.first_name} {student.last_name}</h2>
                <span className={`badge badge-${currentStatus.toLowerCase().replace(/\s+/g, '')}`}>
                  {currentStatus}
                </span>
              </div>
              <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                ID: {student.student_id} • Enrolled {student.created_at ? new Date(student.created_at).toLocaleDateString() : '2026'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={onClose}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <button
            onClick={() => setActiveTab('dossier')}
            className={`btn btn-sm ${activeTab === 'dossier' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Student Dossier
          </button>
          <button
            onClick={() => setActiveTab('idcard')}
            className={`btn btn-sm ${activeTab === 'idcard' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Digital ID Badge
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`btn btn-sm ${activeTab === 'edit' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Edit size={14} /> Edit Record
          </button>
        </div>

        {/* TAB 1: Complete Dossier */}
        {activeTab === 'dossier' && (
          <div>
            {/* Quick Status Bar */}
            <div style={{ background: 'var(--bg-tertiary)', padding: '14px 18px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Enrollment Status:</span>
                <select
                  className="form-select"
                  style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}
                  value={currentStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Graduated">Graduated</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="btn btn-sm btn-danger"
                >
                  <Trash2 size={14} /> Delete Student
                </button>
              </div>
            </div>

            {/* Information Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
              {/* Academic */}
              <div style={{ background: 'var(--bg-card)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.88rem', marginBottom: '12px' }}>
                  <BookOpen size={16} /> ACADEMIC PROGRAM
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div><strong>Department:</strong> {student.department}</div>
                  <div><strong>Major:</strong> {student.program}</div>
                  <div><strong>Level:</strong> {student.degree_level || 'Bachelor'} Degree</div>
                  <div><strong>Class:</strong> {student.academic_year} • {student.semester}</div>
                  <div><strong>Study Mode:</strong> {student.study_mode}</div>
                  <div><strong>Current GPA:</strong> <span style={{ color: 'var(--success)', fontWeight: 700 }}>{student.gpa || '3.75'}</span></div>
                </div>
              </div>

              {/* Personal Contact */}
              <div style={{ background: 'var(--bg-card)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontWeight: 700, fontSize: '0.88rem', marginBottom: '12px' }}>
                  <Mail size={16} /> CONTACT & PERSONAL
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div><strong>Email:</strong> <a href={`mailto:${student.email}`} style={{ color: 'var(--primary)', textDecoration: 'underline' }}>{student.email}</a></div>
                  <div><strong>Phone:</strong> {student.phone}</div>
                  <div><strong>Birth Date:</strong> {student.date_of_birth}</div>
                  <div><strong>Gender:</strong> {student.gender}</div>
                  <div><strong>Address:</strong> {student.home_address || 'Not specified'}</div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div style={{ background: 'var(--bg-card)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--warning)', fontWeight: 700, fontSize: '0.88rem', marginBottom: '12px' }}>
                  <HeartHandshake size={16} /> EMERGENCY GUARDIAN
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div><strong>Guardian Name:</strong> {student.emergency_contact_name || 'N/A'}</div>
                  <div><strong>Relationship:</strong> {student.emergency_contact_relation || 'Parent / Guardian'}</div>
                  <div><strong>Guardian Phone:</strong> {student.emergency_contact_phone || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ID Card Badge */}
        {activeTab === 'idcard' && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{ marginBottom: '24px' }}>
              <StudentIdPreview student={student} />
            </div>
            <button onClick={() => window.print()} className="btn btn-primary">
              <Printer size={16} />
              <span>Print Official Student ID Card</span>
            </button>
          </div>
        )}

        {/* TAB 3: Edit Form */}
        {activeTab === 'edit' && (
          <form onSubmit={handleSaveEdit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">GPA Score</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4.0"
                  className="form-input"
                  value={formData.gpa || 3.75}
                  onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Graduated">Graduated</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Home Address</label>
              <input
                type="text"
                className="form-input"
                value={formData.home_address || ''}
                onChange={(e) => setFormData({ ...formData, home_address: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button type="button" onClick={() => setActiveTab('dossier')} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={updating} className="btn btn-primary">
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              zIndex: 10
            }}
          >
            <div style={{ background: 'var(--bg-secondary)', padding: '28px', borderRadius: 'var(--radius-md)', maxWidth: '420px', textAlign: 'center', border: '1px solid var(--danger-border)' }}>
              <h3 style={{ color: 'var(--danger)', marginBottom: '12px', fontSize: '1.2rem' }}>Confirm Student Deletion</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Are you sure you want to remove <strong>{student.first_name} {student.last_name}</strong> ({student.student_id})? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button onClick={handleDelete} className="btn btn-danger">
                  Yes, Delete Record
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
