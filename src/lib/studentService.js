import { supabase, isSupabaseConfigured } from './supabase';
import { INITIAL_STUDENTS } from '../data/mockStudents';

const LOCAL_STORAGE_KEY = 'edu_student_records_v1';

// Helper to get local data
function getLocalStudents() {
  if (typeof window === 'undefined') return INITIAL_STUDENTS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading localStorage', e);
    return INITIAL_STUDENTS;
  }
}

// Helper to save local data
function saveLocalStudents(students) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(students));
  } catch (e) {
    console.error('Error writing to localStorage', e);
  }
}

/**
 * Generate a unique Student ID (e.g. STU-2026-4891)
 */
export function generateStudentId() {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `STU-${year}-${randomNum}`;
}

/**
 * Fetch all students with optional filtering and sorting
 */
export async function getStudents({
  search = '',
  department = 'All',
  status = 'All',
  academicYear = 'All',
  sortBy = 'created_at',
  sortOrder = 'desc'
} = {}) {
  // If Supabase is configured, fetch from Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('students').select('*');

      if (department && department !== 'All') {
        query = query.eq('department', department);
      }
      if (status && status !== 'All') {
        query = query.eq('status', status);
      }
      if (academicYear && academicYear !== 'All') {
        query = query.eq('academic_year', academicYear);
      }

      if (search.trim()) {
        const term = search.trim();
        query = query.or(`first_name.ilike.%${term}%,last_name.ilike.%${term}%,student_id.ilike.%${term}%,email.ilike.%${term}%,program.ilike.%${term}%`);
      }

      const isAsc = sortOrder === 'asc';
      query = query.order(sortBy, { ascending: isAsc });

      const { data, error } = await query;
      if (error) throw error;
      return { data: data || [], source: 'supabase' };
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to LocalStorage:', err);
    }
  }

  // Fallback / Offline / LocalStorage Mode
  let list = getLocalStudents();

  if (search.trim()) {
    const s = search.toLowerCase().trim();
    list = list.filter(item =>
      (item.first_name || '').toLowerCase().includes(s) ||
      (item.last_name || '').toLowerCase().includes(s) ||
      (item.student_id || '').toLowerCase().includes(s) ||
      (item.email || '').toLowerCase().includes(s) ||
      (item.program || '').toLowerCase().includes(s) ||
      (item.department || '').toLowerCase().includes(s)
    );
  }

  if (department && department !== 'All') {
    list = list.filter(item => item.department === department);
  }

  if (status && status !== 'All') {
    list = list.filter(item => item.status === status);
  }

  if (academicYear && academicYear !== 'All') {
    list = list.filter(item => item.academic_year === academicYear);
  }

  // Sorting
  list.sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (sortBy === 'name') {
      valA = `${a.first_name} ${a.last_name}`.toLowerCase();
      valB = `${b.first_name} ${b.last_name}`.toLowerCase();
    } else if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = (valB || '').toLowerCase();
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return { data: list, source: 'local' };
}

/**
 * Get student by ID
 */
export async function getStudentById(id) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', id)
        .single();
      if (!error && data) return { data, source: 'supabase' };
    } catch (e) {
      console.warn('Supabase getStudentById error', e);
    }
  }

  const list = getLocalStudents();
  const student = list.find(s => s.id === id || s.student_id === id);
  return { data: student || null, source: 'local' };
}

/**
 * Register a new student
 */
export async function createStudent(formData) {
  const newStudent = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `std-${Date.now()}`,
    student_id: formData.student_id || generateStudentId(),
    first_name: formData.first_name?.trim() || '',
    last_name: formData.last_name?.trim() || '',
    email: formData.email?.trim().toLowerCase() || '',
    phone: formData.phone?.trim() || '',
    date_of_birth: formData.date_of_birth || '',
    gender: formData.gender || 'Other',
    avatar_url: formData.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formData.first_name + ' ' + formData.last_name)}`,
    department: formData.department || '',
    program: formData.program || '',
    degree_level: formData.degree_level || 'Bachelor',
    academic_year: formData.academic_year || 'Year 1',
    semester: formData.semester || 'Semester 1',
    study_mode: formData.study_mode || 'Full-time',
    status: formData.status || 'Active',
    emergency_contact_name: formData.emergency_contact_name || '',
    emergency_contact_relation: formData.emergency_contact_relation || '',
    emergency_contact_phone: formData.emergency_contact_phone || '',
    home_address: formData.home_address || '',
    gpa: parseFloat(formData.gpa) || 3.75,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // 1. Save to Supabase if configured
  let supabaseResult = null;
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert([newStudent])
        .select()
        .single();
      if (!error && data) {
        supabaseResult = data;
      } else if (error) {
        console.error('Supabase create error:', error);
      }
    } catch (e) {
      console.warn('Supabase create threw error:', e);
    }
  }

  // 2. Always maintain local cache
  const list = getLocalStudents();
  list.unshift(supabaseResult || newStudent);
  saveLocalStudents(list);

  return { success: true, data: supabaseResult || newStudent };
}

/**
 * Update an existing student record
 */
export async function updateStudent(id, updates) {
  const updatedData = {
    ...updates,
    updated_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('students')
        .update(updatedData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
    } catch (e) {
      console.warn('Supabase update failed:', e);
    }
  }

  const list = getLocalStudents();
  const idx = list.findIndex(s => s.id === id || s.student_id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updatedData };
    saveLocalStudents(list);
    return { success: true, data: list[idx] };
  }

  return { success: false, error: 'Student not found' };
}

/**
 * Delete a student record
 */
export async function deleteStudent(id) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);
      if (error) console.error('Supabase delete error', error);
    } catch (e) {
      console.warn('Supabase delete threw error:', e);
    }
  }

  const list = getLocalStudents();
  const filtered = list.filter(s => s.id !== id && s.student_id !== id);
  saveLocalStudents(filtered);
  return { success: true };
}

/**
 * Reset data back to default demo seeds
 */
export async function resetDemoData() {
  saveLocalStudents(INITIAL_STUDENTS);

  if (isSupabaseConfigured && supabase) {
    try {
      // Clean and re-insert
      await supabase.from('students').delete().neq('student_id', 'NON_EXISTENT');
      await supabase.from('students').insert(INITIAL_STUDENTS);
    } catch (e) {
      console.warn('Supabase reset error', e);
    }
  }

  return { success: true, data: INITIAL_STUDENTS };
}

/**
 * Get aggregated student statistics for Admin KPIs
 */
export async function getStudentStats() {
  const { data: students } = await getStudents();

  const total = students.length;
  const active = students.filter(s => s.status === 'Active').length;
  const pending = students.filter(s => s.status === 'Pending').length;
  const onLeave = students.filter(s => s.status === 'On Leave').length;
  const graduated = students.filter(s => s.status === 'Graduated').length;

  const departmentCounts = {};
  students.forEach(s => {
    const dept = s.department || 'Unassigned';
    departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
  });

  const averageGpa = total > 0
    ? (students.reduce((acc, curr) => acc + (parseFloat(curr.gpa) || 0), 0) / total).toFixed(2)
    : '0.00';

  return {
    total,
    active,
    pending,
    onLeave,
    graduated,
    departmentCounts,
    averageGpa
  };
}
