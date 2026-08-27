-- ==============================================================================
-- Student Registration & Administration Management System - Supabase Schema
-- ==============================================================================

-- 1. Create the students table
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
    status VARCHAR(50) NOT NULL DEFAULT 'Active', -- 'Active', 'Pending', 'On Leave', 'Graduated'
    emergency_contact_name VARCHAR(150),
    emergency_contact_relation VARCHAR(50),
    emergency_contact_phone VARCHAR(50),
    home_address TEXT,
    gpa NUMERIC(3,2) DEFAULT 3.65,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create index for fast lookups & search
CREATE INDEX IF NOT EXISTS idx_students_student_id ON public.students(student_id);
CREATE INDEX IF NOT EXISTS idx_students_department ON public.students(department);
CREATE INDEX IF NOT EXISTS idx_students_status ON public.students(status);
CREATE INDEX IF NOT EXISTS idx_students_created_at ON public.students(created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- 4. Policy: Allow public read and write access for registration and administration
DROP POLICY IF EXISTS "Allow public access for students" ON public.students;
CREATE POLICY "Allow public access for students"
ON public.students
FOR ALL
USING (true)
WITH CHECK (true);

-- 5. Seed initial realistic student data
INSERT INTO public.students (
    student_id, first_name, last_name, email, phone, date_of_birth, gender, avatar_url,
    department, program, degree_level, academic_year, semester, study_mode, status,
    emergency_contact_name, emergency_contact_relation, emergency_contact_phone, home_address, gpa
) VALUES
(
    'STU-2026-1042', 'Elena', 'Vance', 'elena.vance@university.edu', '+1 (555) 234-5678',
    '2003-04-14', 'Female', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    'Computer Science & IT', 'B.S. in Software Engineering', 'Bachelor', 'Year 3', 'Semester 1', 'Full-time', 'Active',
    'Eli Vance', 'Father', '+1 (555) 987-6543', '124 Science Park Blvd, Seattle, WA', 3.88
),
(
    'STU-2026-1089', 'Marcus', 'Chen', 'marcus.chen@university.edu', '+1 (555) 345-6789',
    '2002-11-20', 'Male', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    'Business & Economics', 'B.B.A. in International Finance', 'Bachelor', 'Year 4', 'Semester 2', 'Full-time', 'Active',
    'Linda Chen', 'Mother', '+1 (555) 876-5432', '742 Market Street, San Francisco, CA', 3.75
),
(
    'STU-2026-2150', 'Amara', 'Okonkwo', 'amara.okonkwo@university.edu', '+1 (555) 456-7890',
    '2004-02-18', 'Female', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    'Health Sciences & Medicine', 'B.S. in Biomedical Science', 'Bachelor', 'Year 2', 'Semester 1', 'Full-time', 'Pending',
    'Chidi Okonkwo', 'Guardian', '+1 (555) 765-4321', '88 University Ave, Austin, TX', 3.92
),
(
    'STU-2026-3021', 'Julian', 'Novak', 'julian.novak@university.edu', '+1 (555) 567-8901',
    '2001-08-09', 'Male', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    'Engineering & Robotics', 'M.S. in Autonomous Systems', 'Master', 'Year 1', 'Semester 2', 'Full-time', 'Active',
    'Miriam Novak', 'Mother', '+1 (555) 654-3210', '512 Tech Crest Rd, Boston, MA', 3.95
),
(
    'STU-2026-4112', 'Sophia', 'Rodriguez', 'sophia.rodriguez@university.edu', '+1 (555) 678-9012',
    '2003-09-25', 'Female', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    'Arts, Media & Design', 'B.A. in Digital Arts & Animation', 'Bachelor', 'Year 3', 'Semester 2', 'Part-time', 'Active',
    'Carlos Rodriguez', 'Father', '+1 (555) 543-2109', '304 Sunset Blvd, Los Angeles, CA', 3.60
),
(
    'STU-2026-5231', 'David', 'Kim', 'david.kim@university.edu', '+1 (555) 789-0123',
    '2002-05-30', 'Male', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    'Computer Science & IT', 'B.S. in Artificial Intelligence & Data', 'Bachelor', 'Year 4', 'Semester 1', 'Full-time', 'On Leave',
    'Hannah Kim', 'Sister', '+1 (555) 432-1098', '192 Pine Valley Dr, Chicago, IL', 3.82
)
ON CONFLICT (student_id) DO NOTHING;
