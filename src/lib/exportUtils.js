/**
 * Export student records to a downloadable CSV file
 */
export function exportToCSV(students, filename = 'student_directory.csv') {
  if (!students || students.length === 0) {
    alert('No students to export.');
    return;
  }

  const headers = [
    'Student ID',
    'First Name',
    'Last Name',
    'Email',
    'Phone',
    'Date of Birth',
    'Gender',
    'Department',
    'Program',
    'Degree Level',
    'Academic Year',
    'Semester',
    'Study Mode',
    'Status',
    'GPA',
    'Emergency Contact',
    'Emergency Phone',
    'Home Address',
    'Registration Date'
  ];

  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = students.map(s => [
    escapeCSV(s.student_id),
    escapeCSV(s.first_name),
    escapeCSV(s.last_name),
    escapeCSV(s.email),
    escapeCSV(s.phone),
    escapeCSV(s.date_of_birth),
    escapeCSV(s.gender),
    escapeCSV(s.department),
    escapeCSV(s.program),
    escapeCSV(s.degree_level),
    escapeCSV(s.academic_year),
    escapeCSV(s.semester),
    escapeCSV(s.study_mode),
    escapeCSV(s.status),
    escapeCSV(s.gpa),
    escapeCSV(s.emergency_contact_name ? `${s.emergency_contact_name} (${s.emergency_contact_relation || ''})` : ''),
    escapeCSV(s.emergency_contact_phone),
    escapeCSV(s.home_address),
    escapeCSV(s.created_at ? new Date(s.created_at).toLocaleDateString() : '')
  ]);

  const csvContent = [headers.map(h => `"${h}"`).join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export student records to a formatted JSON file
 */
export function exportToJSON(students, filename = 'student_directory.json') {
  if (!students || students.length === 0) {
    alert('No students to export.');
    return;
  }

  const jsonStr = JSON.stringify(students, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
