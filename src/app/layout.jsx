import './globals.css';
import Navbar from '../components/Navbar';
import ConnectionBanner from '../components/ConnectionBanner';
import { ToastProvider } from '../components/Toast';

export const metadata = {
  title: 'AcademiaOS | Student Registration & Management System',
  description: 'Enterprise-grade student registration portal and administration records management dashboard powered by Next.js and Supabase.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <ToastProvider>
          {/* Ambient Lighting Background */}
          <div className="app-background">
            <div className="blob-1" />
            <div className="blob-2" />
            <div className="blob-3" />
          </div>

          {/* Database Live Status Ribbon */}
          <ConnectionBanner />

          {/* Main Navigation */}
          <Navbar />

          {/* Application Main Body */}
          <main className="main-content">
            {children}
          </main>

          {/* Global Footer */}
          <footer
            style={{
              borderTop: '1px solid var(--border-color)',
              padding: '28px 0',
              background: 'var(--bg-tertiary)',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              textAlign: 'center'
            }}
          >
            <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <strong>AcademiaOS</strong> • Student Registration & Record Management System
              </div>
              <div style={{ display: 'flex', gap: '18px' }}>
                <span>Next.js 15 App Router</span>
                <span>•</span>
                <span>Supabase PostgreSQL</span>
                <span>•</span>
                <span>Pure JavaScript</span>
              </div>
            </div>
          </footer>
        </ToastProvider>
      </body>
    </html>
  );
}
