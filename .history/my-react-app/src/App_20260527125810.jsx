import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
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
const StatCard = ({ label, count, emoji, bg, textColor, numColor, borderColor, delay }) => {
  const displayed = useCounter(count, delay);
  return (
    <div style={{
      background: bg,
      border: `1.5px solid ${borderColor}`,
      borderRadius: '18px',
      padding: '28px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      animation: 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
      animationDelay: `${delay}ms`,
      transition: 'transform 0.18s ease, box-shadow 0.18s ease',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.07)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <span style={{ fontSize: '28px', lineHeight: 1 }}>{emoji}</span>
      <div style={{
        fontSize: '48px', fontWeight: 800, color: numColor,
        lineHeight: 1, letterSpacing: '-2px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        {displayed}
      </div>
      <div style={{ fontSize: '13px', fontWeight: 600, color: textColor, letterSpacing: '0.02em' }}>
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
    <div style={{ maxWidth: '880px', margin: '0 auto', padding: '60px 24px 100px' }}>

      {/* HERO */}
      <div style={{ textAlign: 'center', marginBottom: '56px', animation: 'fadeUp 0.6s ease both' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: '#F3F0FF', border: '1px solid #DDD6FE',
          borderRadius: '99px', padding: '6px 16px',
          fontSize: '12px', fontWeight: 700, color: '#6D28D9',
          marginBottom: '28px', letterSpacing: '0.05em', textTransform: 'uppercase',
        }}>
          <span style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: '#7C3AED', display: 'inline-block',
            animation: 'pulse 2s ease infinite',
          }} />
          Live Community Dashboard
        </div>

        <h1 style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 'clamp(34px, 6vw, 60px)',
          fontWeight: 800, color: '#0F0A1E',
          lineHeight: 1.08, margin: '0 0 20px',
          letterSpacing: '-2px',
        }}>
          Your Neighbourhood,<br />
          <span style={{
            background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>Your Voice</span>
        </h1>

        <p style={{
          fontSize: '17px', color: '#64637A',
          lineHeight: 1.8, maxWidth: '480px', margin: '0 auto',
        }}>
          Report local issues, track their progress, and see your community problems
          get resolved — transparently and in real time.
        </p>
      </div>

      {/* TOTAL COUNT LABEL */}
      <div style={{ textAlign: 'center', marginBottom: '24px', animation: 'fadeUp 0.6s ease 0.1s both' }}>
        <span style={{
          fontSize: '12px', fontWeight: 700, color: '#A09EBA',
          textTransform: 'uppercase', letterSpacing: '0.12em',
        }}>
          {loading ? 'Loading live stats…' : `${stats.total} total reports across your city`}
        </span>
      </div>

      {/* STAT GRID */}
      {loading ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px', marginBottom: '48px',
        }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{
              background: '#F7F6FF', border: '1.5px solid #EDE9FE',
              borderRadius: '18px', padding: '28px 24px', height: '140px',
              animation: 'pulse 1.4s ease infinite',
            }} />
          ))}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px', marginBottom: '56px',
        }}>
          <StatCard label="Pending Review"  count={stats.PENDING}     emoji="⏳" bg="#FFFBEB" borderColor="#FDE68A" textColor="#92600A" numColor="#D97706" delay={0}   />
          <StatCard label="In Progress"     count={stats.IN_PROGRESS} emoji="🔧" bg="#EEF2FF" borderColor="#C7D2FE" textColor="#3730A3" numColor="#4338CA" delay={100} />
          <StatCard label="Resolved"        count={stats.RESOLVED}    emoji="✅" bg="#ECFDF5" borderColor="#A7F3D0" textColor="#065F46" numColor="#059669" delay={200} />
          <StatCard label="Rejected"        count={stats.REJECTED}    emoji="❌" bg="#FFF1F2" borderColor="#FECDD3" textColor="#9F1239" numColor="#E11D48" delay={300} />
        </div>
      )}

      {/* HOW IT WORKS */}
      <div style={{
        background: '#FAFAFE', border: '1.5px solid #EDE9FE',
        borderRadius: '24px', padding: '44px 40px',
        animation: 'fadeUp 0.6s ease 0.3s both',
      }}>
        <h2 style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '20px', fontWeight: 700, color: '#0F0A1E',
          margin: '0 0 32px', textAlign: 'center', letterSpacing: '-0.5px',
        }}>
          How it works
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '28px', textAlign: 'center',
        }}>
          {[
            { emoji: '📝', title: 'Sign Up',   desc: 'Create a free account in seconds' },
            { emoji: '📸', title: 'Report',    desc: 'Submit an issue with photos & location' },
            { emoji: '🔔', title: 'Track',     desc: 'Follow your report live as it progresses' },
            { emoji: '🎉', title: 'Resolved',  desc: 'Authority fixes it and marks it done' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '54px', height: '54px', borderRadius: '16px',
                background: '#EDE9FF', border: '1.5px solid #DDD6FE',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '24px',
              }}>
                {item.emoji}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F0A1E' }}>{item.title}</div>
              <div style={{ fontSize: '13px', color: '#64637A', lineHeight: 1.6 }}>{item.desc}</div>
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
  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children }) => {
    const active = isActive(to);
    return (
      <Link
        to={to}
        style={{
          fontSize: '14px',
          fontWeight: 600,
          color: active ? '#7C3AED' : '#4B4B60',
          textDecoration: 'none',
          padding: '7px 15px',
          borderRadius: '99px',
          background: active ? '#F0EBFF' : 'transparent',
          border: active ? '1px solid #DDD6FE' : '1px solid transparent',
          transition: 'all 0.15s ease',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => {
          if (!active) {
            e.currentTarget.style.background = '#F5F3FF';
            e.currentTarget.style.color = '#7C3AED';
            e.currentTarget.style.borderColor = '#EDE9FE';
          }
        }}
        onMouseLeave={e => {
          if (!active) {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#4B4B60';
            e.currentTarget.style.borderColor = 'transparent';
          }
        }}
      >
        {children}
      </Link>
    );
  };

  return (
    <nav style={{
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid #EEEEF5',
      padding: '0 32px',
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
          fontSize: '18px', boxShadow: '0 4px 12px rgba(124,58,237,0.25)',
          flexShrink: 0,
        }}>🚨</div>
        <span style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 800, fontSize: '16px',
          color: '#0F0A1E', letterSpacing: '-0.3px',
        }}>
          UrbanVoice
        </span>
      </Link>

      {/* NAV LINKS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <NavLink to="/">🏠🏡Home</NavLink>

        {isAuthenticated && role !== 'ADMIN' && (
          <>
            <NavLink to="/issues">My Issues</NavLink>
            <NavLink to="/create-issue">+ Report Issue</NavLink>
          </>
        )}

        {isAuthenticated && role === 'ADMIN' && (
          <NavLink to="/admin">Authority Dashboard</NavLink>
        )}
      </div>

      {/* AUTH BUTTONS */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            style={{
              fontSize: '14px', fontWeight: 600,
              background: '#FFF1F2', border: '1px solid #FECDD3',
              color: '#E11D48', padding: '8px 18px', borderRadius: '99px',
              cursor: 'pointer', transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#FFE4E6';
              e.currentTarget.style.borderColor = '#FDA4AF';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#FFF1F2';
              e.currentTarget.style.borderColor = '#FECDD3';
            }}
          >
            Sign Out
          </button>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                fontSize: '14px', fontWeight: 600, color: '#4B4B60',
                textDecoration: 'none', padding: '8px 18px', borderRadius: '99px',
                border: '1px solid #E4E4EF', background: 'white',
                transition: 'all 0.15s ease', display: 'inline-block',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#C4B5FD';
                e.currentTarget.style.color = '#7C3AED';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#E4E4EF';
                e.currentTarget.style.color = '#4B4B60';
              }}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              style={{
                fontSize: '14px', fontWeight: 700, color: 'white',
                textDecoration: 'none', padding: '8px 20px', borderRadius: '99px',
                background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
                boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
                transition: 'all 0.15s ease', display: 'inline-block',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 18px rgba(124,58,237,0.45)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(124,58,237,0.3)'}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

// ── PROTECTED ROUTE ───────────────────────────────────────────────────────────
// Redirects to /login if not authenticated, instead of silently showing Home
const ProtectedRoute = ({ isAuthenticated, children, adminOnly = false, role }) => {
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && role !== 'ADMIN') return <Navigate to="/" replace />;
  if (!adminOnly && role === 'ADMIN') return <Navigate to="/admin" replace />;
  return children;
};

// ── APP ───────────────────────────────────────────────────────────────────────
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role') || '');

  // Keep auth state in sync if localStorage changes (e.g. after login)
  const handleLogin = () => {
    setIsAuthenticated(!!localStorage.getItem('token'));
    setRole(localStorage.getItem('role') || '');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setRole('');
    window.location.href = '/';
  };

  return (
    <Router>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #F9F8FF;
          color: #0F0A1E;
          min-height: 100vh;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.8); }
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
          },
        }}
      />

      <Navbar isAuthenticated={isAuthenticated} role={role} handleLogout={handleLogout} />

      <Routes>
        {/* Public — always accessible */}
        <Route path="/"       element={<Home />} />
        <Route path="/login"  element={<Login  setIsAuthenticated={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />

        {/* User-only routes */}
        <Route
          path="/issues"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} role={role}>
              <IssuesFeed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-issue"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} role={role}>
              <CreateIssue />
            </ProtectedRoute>
          }
        />

        {/* Admin-only route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} role={role} adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback — redirect unknown paths to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;