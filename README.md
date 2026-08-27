# 🎓 EduPulse - Student Registration & Management System

EduPulse is a modern, responsive web application for managing student registrations, profiles, records, and administrative analytics. Built with Next.js (App Router), Supabase PostgreSQL backend, and a modern glassmorphism UI.

---

## ✨ Features

- **🚀 Real-time Registration**: Fast student onboarding with instant Student ID generation (`STU-YYYY-XXXX`).
- **📊 Admin Dashboard**:
  - Live statistics: Total students, active status, gender ratio, faculty distribution.
  - Interactive search, filter by faculty/status, and multi-column sorting.
  - Batch and individual status updates (Active, Inactive, Suspended, Graduated).
  - CSV export & formatted printable student ID cards / detail view.
- **⚡ Dual Storage Mode**: Seamlessly works with real-time **Supabase** backend or automatic fallback to high-fidelity **Demo / Mock Storage**.
- **🎨 Modern UI/UX**:
  - Dark mode aesthetic with glassmorphism, glowing accents, and micro-interactions.
  - Interactive toast notifications & celebratory confetti upon successful registration.
  - Fully responsive across desktop, tablet, and mobile devices.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, JavaScript)
- **Styling**: Vanilla CSS Design System with CSS variables and glassmorphic styling
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Effects**: Canvas Confetti

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/student-management-system.git
cd student-management-system
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables (Optional for Supabase)
Copy the example environment file:
```bash
cp .env.local.example .env.local
```
Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

> **Note**: If Supabase credentials are not provided, the application runs in local Mock Data mode automatically.

### 4. Database Setup (Supabase)
Run the SQL script found in [`supabase/schema.sql`](./supabase/schema.sql) in your Supabase SQL Editor.

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
student-management-system/
├── src/
│   ├── app/
│   │   ├── admin/page.jsx       # Admin management & analytics dashboard
│   │   ├── register/page.jsx    # Student registration form & live ID preview
│   │   ├── setup/page.jsx       # Supabase connection & quick setup guide
│   │   ├── globals.css          # Design system, theme tokens & styling
│   │   ├── layout.jsx           # Root layout & Navigation bar
│   │   └── page.jsx             # Landing page
│   ├── components/              # UI Components (StudentTable, Modal, Stats, etc.)
│   ├── lib/                     # Database client, services, and export utils
│   └── data/                    # Fallback mock dataset
└── supabase/
    └── schema.sql               # PostgreSQL schema & sample data
```

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
