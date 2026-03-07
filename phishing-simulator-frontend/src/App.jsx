import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, GraduationCap, ShieldAlert } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import LearningPage from './pages/LearningPage';
import PhishingPortal from './pages/PhishingPortal';
import './index.css';

// Reusable Layout Component
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isLearningRoute = location.pathname === '/learning';
  const isPortalRoute = location.pathname.startsWith('/portal');

  // Make the learning page and portal immersive (no sidebar)
  if (isLearningRoute || isPortalRoute) {
      return <div className="app-container">{children}</div>;
  }

  return (
    <div className="app-container">
      {/* Sidebar Area */}
      <aside style={{ width: '260px', borderRight: '1px solid var(--border-color)', padding: '1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', color: 'var(--accent-primary)' }}>
          <ShieldAlert size={28} />
          <h2 style={{ fontSize: '1.25rem' }}>PhishGuard</h2>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link to="/" style={{ 
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', 
              borderRadius: 'var(--radius-md)', backgroundColor: location.pathname === '/' ? 'var(--bg-tertiary)' : 'transparent',
              color: location.pathname === '/' ? 'var(--text-primary)' : 'var(--text-secondary)'
            }}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link to="/learning" style={{ 
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', 
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-secondary)'
            }}>
            <GraduationCap size={20} />
            Learning Demo
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/learning" element={<LearningPage />} />
          <Route path="/portal/:campaignId/:email" element={<PhishingPortal />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
