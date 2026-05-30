import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import CreateIssue from './pages/CreateIssue';
import IssuesFeed from './pages/IssuesFeed';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AuthDashboard';
import API from './services/api';
import { Toaster } from 'sonner';

// ── ANIMATED COUNTER ──────────────────────────────────────────────────────────
const useCounter = (target, delay = 0) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const end = parseInt(target) || 0;
    if (end === 0) { setVal(0); return; }
    let current = 0;
    const step = Math.max(Math.ceil(end / 40), 1);
    const t = setTimeout(() => {
      const id = setInterval(() => {
        current = Math.min(current + step, end);
        setVal(current);
        if (current >= end) clearInterval(id);
      }, 30);
      return () => clearInterval(id);
    }, delay);
    return () => clearTimeout(t);
  }, [target, delay]);
  return val;
};

// ── STAT CARD ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, count, emoji, bg, textColor, numColor, delay }) => {
  const displayed = useCounter(count, delay);
  return (
    <div style={{
      background: bg,
      borderRadius: '20px',
      padding: '28px 24px',
      display: 'flex', flexDirection: 'column', gap: '8px',
      animation: 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
      animationDelay: `${delay}ms`,
    }}>
      <span style={{ fontSize: '32px', lineHeight: 1 }}>{emoji}</span>
      <div style={{ fontSize: '44px', fontWeight: 800, color: numColor, lineHeight: 1, letterSpacing: '-2px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {displayed}
      </div>
      <div style={{ fontSize: '14px', fontWeight: 600, color: textColor, letterSpacing: '0.01em' }}>
        {label}
      </div>
    </div>
  );
};

// ── HOME ──────────────────────────────────────────────────────────────────────
const Home = () => {
  const [stats, setStats] = useState({ PENDING: 0, IN_PROGRESS: 0, RESOLVED: 0, REJECTED: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/issues')
      .then(res => {
        const issues = res.data || [];
        const c = { PENDING: 0, IN_PROGRESS: 0, RESOLVED: 0, REJECTED: 0 };
        issues.forEach(i => { const s = i.status?.toUpperCase(); if (c[s] !== undefined) c[s]++; });
        setStats({ ...c, total: issues.length });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '56px 24px 80px' }}>

      {/* HERO */}
      <div style={{ textAlign: 'center', marginBottom: '64px', animation: 'fadeUp 0.6s ease both' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: '#FFF0F9', border: '1px solid #F9C0E0',
          borderRadius: '99px', padding: '6px 16px',
          fontSize: '13px', fontWeight: 600, color: '#C2185B',
          marginBottom: '24px',
        }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#E91E8C', display: 'inline-block', animation: 'pulse 2s ease infinite' }} />
          Live Community Dashboard
        </div>

        <h1 style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 'clamp(32px, 6vw, 58px)',
          fontWeight: 800, color: '#1E1B2E',
          lineHeight: 1.1, margin: '0 0 18px',
          letterSpacing: '-1.5px',
        }}>
          Your Neighbourhood,<br />
          <span style={{ color: '#7C3AED' }}>Your Voice</span>
        </h1>

        <p style={{ fontSize: '17px', color: '#6B6B80', lineHeight: 1.75, maxWidth: '500px', margin: '0 auto' }}>
          Report local issues, track their progress, and see your community problems get resolved — transparently.
        </p>
      </div>

      {/* DIVIDER LABEL */}
      <div style={{ textAlign: 'center', marginBottom: '32px', animation: 'fadeUp 0.6s ease 0.1s both' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#9B9BAA', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {loading ? 'Loading stats...' : `${stats.total} total reports`}
        </span>
      </div>

      {/* STAT GRID */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '16px', marginBottom: '48px' }}>
          <StatCard label="Pending Review"  count={stats.PENDING}     emoji="⏳" bg="#FFF8E6" textColor="#92600A" numColor="#D97706" delay={0}   />
          <StatCard label="In Progress"     count={stats.IN_PROGRESS} emoji="🔧" bg="#EEF3FF" textColor="#3B4CB8" numColor="#4F46E5" delay={100} />
          <StatCard label="Resolved"        count={stats.RESOLVED}    emoji="✅" bg="#EDFAF4" textColor="#1A7A4A" numColor="#16A34A" delay={200} />
          <StatCard label="Rejected"        count={stats.REJECTED}    emoji="❌" bg="#FFF0F0" textColor="#9B1C1C" numColor="#DC2626" delay={300} />
        </div>
      )}

      {/* HOW IT WORKS */}
      <div style={{
        background: '#F8F7FF', borderRadius: '24px', padding: '40px 36px',
        animation: 'fadeUp 0.6s ease 0.3s both',
      }}>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '22px', fontWeight: 700, color: '#1E1B2E', margin: '0 0 28px', textAlign: 'center' }}>
          How it works
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '24px', textAlign: 'center' }}>
          {[
            { step: '1', emoji: '📝', title: 'Sign Up', desc: 'Create a free account in seconds' },
            { step: '2', emoji: '📸', title: 'Report', desc: 'Submit an issue with photos & location' },
            { step: '3', emoji: '🔔', title: 'Track', desc: 'Follow your report live as it progresses' },
            { step: '4', emoji: '🎉', title: 'Resolved', desc: 'Authority fixes it and marks it done' },
          ].map(item => (
            <div key={item.step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '16px',
                background: '#EDE9FF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '24px',
              }}>{item.emoji}</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1E1B2E' }}>{item.title}</div>
              <div style={{ fontSize: '13px', color: '#6B6B80', lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

// ── NAVBAR ────────────────────────────────────────────────────────────────────
const Navbar = ({ isAuthenticated, role, handleLogout }) => {
  const location = useLocation();
  const active = (path) => location.pathname === path;

  const NavLink = ({ to, children }) => (
    <Link to={to} style={{
      fontSize: '14px', fontWeight: 600,
      color: active(to) ? '#7C3AED' : '#4B4B60',
      textDecoration: 'none',
      padding: '6px 14px', borderRadius: '99px',
      background: active(to) ? '#F0EBFF' : 'transparent',
      transition: 'all 0.15s',
    }}
      onMouseEnter={e => { if (!active(to)) { e.currentTarget.style.background = '#F5F3FF'; e.currentTarget.style.color = '#7C3AED'; } }}
      onMouseLeave={e => { if (!active(to)) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4B4B60'; } }}
    >
      {children}
    </Link>
  );

  return (
    <nav style={{
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid #EEEEF5',
      padding: '0 28px',
      height: '64px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      {/* LOGO */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px', boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
        }}>🚨</div>
        <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '16px', color: '#1E1B2E', letterSpacing: '-0.3px' }}>
          CivicTrack
        </span>
      </Link>

      {/* LINKS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/issues">Issues</NavLink>
        {isAuthenticated && role !== 'ADMIN' && <NavLink to="/create-issue">+ Report Issue</NavLink>}
        {isAuthenticated && role === 'ADMIN' && <NavLink to="/admin">Authority Dashboard</NavLink>}
      </div>

      {/* AUTH BUTTONS */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {isAuthenticated ? (
          <button onClick={handleLogout} style={{
            fontSize: '14px', fontWeight: 600,
            background: '#FFF0F0', border: '1px solid #FECACA',
            color: '#DC2626', padding: '8px 18px', borderRadius: '99px',
            cursor: 'pointer', transition: 'all 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'}
            onMouseLeave={e => e.currentTarget.style.background = '#FFF0F0'}
          >
            Sign Out
          </button>
        ) : (
          <>
            <Link to="/login" style={{
              fontSize: '14px', fontWeight: 600, color: '#4B4B60',
              textDecoration: 'none', padding: '8px 18px', borderRadius: '99px',
              border: '1px solid #EEEEF5', background: 'white',
              transition: 'all 0.15s', display: 'inline-block',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#C4B5FD'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#EEEEF5'}
            >
              Sign In
            </Link>
            <Link to="/signup" style={{
              fontSize: '14px', fontWeight: 700, color: 'white',
              textDecoration: 'none', padding: '8px 20px', borderRadius: '99px',
              background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
              boxShadow: '0 4px 12px rgba(124,58,237,0.35)',
              transition: 'all 0.15s', display: 'inline-block',
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 16px rgba(124,58,237,0.45)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(124,58,237,0.35)'}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

// ── APP ───────────────────────────────────────────────────────────────────────
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const role = localStorage.getItem('role');

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  return (
    <Router>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #FAFAFA;
          color: #1E1B2E;
          min-height: 100vh;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.85); }
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #F0EEFF; }
        ::-webkit-scrollbar-thumb { background: #C4B5FD; border-radius: 99px; }
      `}</style>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '14px',
            borderRadius: '14px',
          }
        }}
      />

      <Navbar isAuthenticated={isAuthenticated} role={role} handleLogout={handleLogout} />

      <Routes>
        <Route path="/"             element={<Home />} />
        <Route path="/issues"       element={<IssuesFeed />} />
        <Route path="/create-issue" element={isAuthenticated && role !== 'ADMIN' ? <CreateIssue /> : <Home />} />
        <Route path="/login"        element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup"       element={<Signup />} />
        <Route path="/admin"        element={role === 'ADMIN' ? <AdminDashboard /> : <Home />} />
      </Routes>
    </Router>
  );
}

export default App;