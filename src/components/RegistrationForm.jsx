'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  User, Mail, Phone, Calendar, BookOpen, Building2,
  HeartHandshake, MapPin, CheckCircle, ArrowRight, ArrowLeft,
  Sparkles, RefreshCw, Award, Image as ImageIcon, Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DEPARTMENTS, SAMPLE_AVATARS } from '../data/mockStudents';
import { createStudent, generateStudentId } from '../lib/studentService';
import StudentIdPreview from './StudentIdPreview';
import { useToast } from './Toast';

export default function RegistrationForm() {
  const { addToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [registeredStudent, setRegisteredStudent] = useState(null);

  const [formData, setFormData] = useState({
    student_id: generateStudentId(),
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '2004-06-15',
    gender: 'Female',
    avatar_url: SAMPLE_AVATARS[0],
    department: DEPARTMENTS[0].name,
    program: DEPARTMENTS[0].programs[0],
    degree_level: 'Bachelor',
    academic_year: 'Year 1',
    semester: 'Semester 1',
    study_mode: 'Full-time',
    status: 'Active',
    emergency_contact_name: '',
    emergency_contact_relation: 'Parent / Guardian',
    emergency_contact_phone: '',
    home_address: '',
    gpa: '3.80'
  });

  const [errors, setErrors] = useState({});

  // When department changes, automatically update the program options
  const handleDepartmentChange = (deptName) => {
    const deptObj = DEPARTMENTS.find(d => d.name === deptName) || DEPARTMENTS[0];
    setFormData(prev => ({
      ...prev,
      department: deptName,
      program: deptObj.programs[0] || ''
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
      if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Enter a valid email address';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
    }

    if (step === 2) {
      if (!formData.department) newErrors.department = 'Please select a faculty department';
      if (!formData.program) newErrors.program = 'Please select a degree program';
    }

    if (step === 3) {
      if (!formData.emergency_contact_name.trim()) {
        newErrors.emergency_contact_name = 'Emergency contact name is required';
      }
      if (!formData.emergency_contact_phone.trim()) {
        newErrors.emergency_contact_phone = 'Emergency phone is required';
      }
      if (!formData.home_address.trim()) {
        newErrors.home_address = 'Address is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    } else {
      addToast('Please complete all required fields', 'error');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleRegenerateId = () => {
    setFormData(prev => ({ ...prev, student_id: generateStudentId() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) {
      addToast('Please fill all emergency details correctly', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await createStudent(formData);
      if (res.success) {
        setRegisteredStudent(res.data);
        addToast('Student registered successfully!', 'success');

        // Fire celebration confetti
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (err) {
          // ignore if canvas is blocked
        }
      } else {
        addToast(res.error || 'Failed to register student', 'error');
      }
    } catch (err) {
      addToast('An error occurred during registration', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setRegisteredStudent(null);
    setCurrentStep(1);
    setFormData({
      student_id: generateStudentId(),
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      date_of_birth: '2004-06-15',
      gender: 'Female',
      avatar_url: SAMPLE_AVATARS[0],
      department: DEPARTMENTS[0].name,
      program: DEPARTMENTS[0].programs[0],
      degree_level: 'Bachelor',
      academic_year: 'Year 1',
      semester: 'Semester 1',
      study_mode: 'Full-time',
      status: 'Active',
      emergency_contact_name: '',
      emergency_contact_relation: 'Parent / Guardian',
      emergency_contact_phone: '',
      home_address: '',
      gpa: '3.80'
    });
    setErrors({});
  };

  const activeDeptObj = DEPARTMENTS.find(d => d.name === formData.department) || DEPARTMENTS[0];

  // Success view after registration
  if (registeredStudent) {
    return (
      <div className="glass-panel" style={{ padding: '40px', maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--success-bg)',
            color: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            border: '2px solid var(--success-border)',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)'
          }}
        >
          <CheckCircle size={36} />
        </div>

        <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Registration Complete!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
          Student profile for <strong>{registeredStudent.first_name} {registeredStudent.last_name}</strong> has been created and synced with the registry database.
        </p>

        <div style={{ marginBottom: '32px' }}>
          <StudentIdPreview student={registeredStudent} />
        </div>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => window.print()} className="btn btn-secondary">
            <Printer size={18} />
            <span>Print Student Card</span>
          </button>
          <Link href="/admin" className="btn btn-primary">
            <BookOpen size={18} />
            <span>Go to Admin Directory</span>
          </Link>
          <button onClick={resetForm} className="btn btn-outline">
            <User size={18} />
            <span>Register Another Student</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '32px', alignItems: 'start' }}>
      {/* Form Left Side */}
      <div className="glass-panel" style={{ padding: '32px' }}>
        {/* Step Progress Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>New Student Enrollment</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Step {currentStep} of 3 • {currentStep === 1 ? 'Personal Profile' : currentStep === 2 ? 'Academic Details' : 'Emergency & Contact'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[1, 2, 3].map(step => (
              <div
                key={step}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  background: currentStep === step ? 'var(--accent-gradient)' : currentStep > step ? 'var(--success-bg)' : 'var(--bg-tertiary)',
                  color: currentStep === step ? '#ffffff' : currentStep > step ? 'var(--success)' : 'var(--text-muted)',
                  border: `1px solid ${currentStep === step ? 'transparent' : 'var(--border-color)'}`,
                  transition: 'all var(--transition-fast)'
                }}
              >
                {currentStep > step ? <CheckCircle size={16} /> : step}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* STEP 1: Personal Profile */}
          {currentStep === 1 && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Auto-Assigned ID
                </span>
                <button
                  type="button"
                  onClick={handleRegenerateId}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <RefreshCw size={12} /> Regenerate ID
                </button>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <input
                  type="text"
                  readOnly
                  value={formData.student_id}
                  className="form-input"
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: 'var(--primary)',
                    background: 'var(--primary-light)',
                    borderColor: 'var(--primary-glow)'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Elena"
                    className={`form-input ${errors.first_name ? 'error' : ''}`}
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                  />
                  {errors.first_name && <span className="form-error-msg">{errors.first_name}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Last Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Vance"
                    className={`form-input ${errors.last_name ? 'error' : ''}`}
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                  />
                  {errors.last_name && <span className="form-error-msg">{errors.last_name}</span>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    placeholder="student@university.edu"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                  {errors.email && <span className="form-error-msg">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                  {errors.phone && <span className="form-error-msg">{errors.phone}</span>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Date of Birth *</label>
                  <input
                    type="date"
                    className={`form-input ${errors.date_of_birth ? 'error' : ''}`}
                    value={formData.date_of_birth}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  />
                  {errors.date_of_birth && <span className="form-error-msg">{errors.date_of_birth}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-select"
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* Avatar Selector */}
              <div className="form-group" style={{ marginTop: '8px' }}>
                <label className="form-label">Choose Student Photo Avatar</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {SAMPLE_AVATARS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleInputChange('avatar_url', url)}
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        padding: 0,
                        border: formData.avatar_url === url ? '3px solid var(--primary)' : '2px solid var(--border-color)',
                        transform: formData.avatar_url === url ? 'scale(1.1)' : 'scale(1)',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="avatar option" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Academic Program */}
          {currentStep === 2 && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div className="form-group">
                <label className="form-label">Faculty / Department *</label>
                <select
                  className={`form-select ${errors.department ? 'error' : ''}`}
                  value={formData.department}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                >
                  {DEPARTMENTS.map(dept => (
                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
                {errors.department && <span className="form-error-msg">{errors.department}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Degree Program / Major *</label>
                <select
                  className={`form-select ${errors.program ? 'error' : ''}`}
                  value={formData.program}
                  onChange={(e) => handleInputChange('program', e.target.value)}
                >
                  {activeDeptObj.programs.map(prog => (
                    <option key={prog} value={prog}>{prog}</option>
                  ))}
                </select>
                {errors.program && <span className="form-error-msg">{errors.program}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Degree Level</label>
                  <select
                    className="form-select"
                    value={formData.degree_level}
                    onChange={(e) => handleInputChange('degree_level', e.target.value)}
                  >
                    <option value="Associate">Associate Degree</option>
                    <option value="Bachelor">Bachelor Degree</option>
                    <option value="Master">Master Degree</option>
                    <option value="Doctorate (Ph.D.)">Doctorate (Ph.D.)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Study Mode</label>
                  <select
                    className="form-select"
                    value={formData.study_mode}
                    onChange={(e) => handleInputChange('study_mode', e.target.value)}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Distance / Remote">Distance / Remote</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Academic Year</label>
                  <select
                    className="form-select"
                    value={formData.academic_year}
                    onChange={(e) => handleInputChange('academic_year', e.target.value)}
                  >
                    <option value="Year 1">Year 1 (Freshman)</option>
                    <option value="Year 2">Year 2 (Sophomore)</option>
                    <option value="Year 3">Year 3 (Junior)</option>
                    <option value="Year 4">Year 4 (Senior)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Semester</label>
                  <select
                    className="form-select"
                    value={formData.semester}
                    onChange={(e) => handleInputChange('semester', e.target.value)}
                  >
                    <option value="Semester 1">Semester 1 (Fall)</option>
                    <option value="Semester 2">Semester 2 (Spring)</option>
                    <option value="Summer Term">Summer Term</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Initial Enrollment Status</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <option value="Active">Active (Fully Registered)</option>
                  <option value="Pending">Pending Document Approval</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 3: Emergency Contact & Address */}
          {currentStep === 3 && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div className="form-group">
                <label className="form-label">Emergency Contact Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Eli Vance"
                  className={`form-input ${errors.emergency_contact_name ? 'error' : ''}`}
                  value={formData.emergency_contact_name}
                  onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                />
                {errors.emergency_contact_name && <span className="form-error-msg">{errors.emergency_contact_name}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Relationship to Student</label>
                  <select
                    className="form-select"
                    value={formData.emergency_contact_relation}
                    onChange={(e) => handleInputChange('emergency_contact_relation', e.target.value)}
                  >
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Parent / Guardian">Parent / Guardian</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Emergency Contact Phone *</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 987-6543"
                    className={`form-input ${errors.emergency_contact_phone ? 'error' : ''}`}
                    value={formData.emergency_contact_phone}
                    onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                  />
                  {errors.emergency_contact_phone && <span className="form-error-msg">{errors.emergency_contact_phone}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Residential Home Address *</label>
                <textarea
                  rows={3}
                  placeholder="Street Address, City, State/Province, Postal Code"
                  className={`form-textarea ${errors.home_address ? 'error' : ''}`}
                  value={formData.home_address}
                  onChange={(e) => handleInputChange('home_address', e.target.value)}
                />
                {errors.home_address && <span className="form-error-msg">{errors.home_address}</span>}
              </div>
            </div>
          )}

          {/* Form Nav Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
            {currentStep > 1 ? (
              <button type="button" onClick={prevStep} className="btn btn-secondary">
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
            ) : <div />}

            {currentStep < 3 ? (
              <button type="button" onClick={nextStep} className="btn btn-primary">
                <span>Continue</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button type="submit" disabled={submitting} className="btn btn-primary">
                <Sparkles size={16} />
                <span>{submitting ? 'Registering Student...' : 'Complete Registration'}</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Live Badge Preview Right Side */}
      <div style={{ position: 'sticky', top: '100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '14px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Live Student ID Badge Preview
          </span>
        </div>
        <StudentIdPreview student={formData} />
      </div>
    </div>
  );
}
