import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import CreateIssue from './pages/CreateIssue';
import IssuesFeed from './pages/IssuesFeed';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AuthDashboard';
import API from './services/api';
import { Toaster } from 'sonner';

// ─── STAT CARD ───────────────────────────────────────────────────────────────
const StatCard = ({ label, count, color, icon, delay }) => {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(count) || 0;
    if (end === 0) return;
    const duration = 1200;
    const stepTime = Math.max(Math.floor(duration / end), 20);
    const timer = setTimeout(() => {
      const counter = setInterval(() => {
        start += 1;
        setDisplayed(start);
        if (start >= end) clearInterval(counter);
      }, stepTime);
      return () => clearInterval(counter);
    }, delay || 0);
    return () => clearTimeout(timer);
  }, [count]);

  const colors = {
    amber:  { border: '#d97706', glow: 'rgba(217,119,6,0.15)',  text: '#fbbf24', bg: 'rgba(217,119,6,0.07)'  },
    green:  { border: '#16a34a', glow: 'rgba(22,163,74,0.15)',  text: '#4ade80', bg: 'rgba(22,163,74,0.07)'  },
    blue:   { border: '#2563eb', glow: 'rgba(37,99,235,0.15)',  text: '#60a5fa', bg: 'rgba(37,99,235,0.07)'  },
    red:    { border: '#dc2626', glow: 'rgba(220,38,38,0.15)',  text: '#f87171', bg: 'rgba(220,38,38,0.07)'  },
  };
  const c = colors[color] || colors.amber;

  return (
    <div style={{
      border: `1px solid ${c.border}`,
      background: c.bg,
      boxShadow: `0 0 24px ${c.glow}, inset 0 1px 0 rgba(255,255,255,0.04)`,
      borderRadius: '4px',
      padding: '28px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      position: 'relative',
      overflow: 'hidden',
      animation: `fadeSlideUp 0.6s ease both`,
      animationDelay: `${(delay || 0) / 1000}s`,
    }}>
      {/* corner accent */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '40px', height: '40px',
        borderBottom: `1px solid ${c.border}`,
        borderLeft: `1px solid ${c.border}`,
        borderBottomLeftRadius: '4px',
        opacity: 0.4,
      }} />
      <span style={{ fontSize: '22px' }}>{icon}</span>
      <div style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '42px', fontWeight: 700, color: c.text, lineHeight: 1, letterSpacing: '-1px' }}>
        {displayed.toString().padStart(2, '0')}
      </div>
      <div style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>
        {label}
      </div>
    </div>
  );
};

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
const Home = () => {
  const [stats, setStats] = useState({ PENDING: 0, IN_PROGRESS: 0, RESOLVED: 0, REJECTED: 0 });
  const [total, setTotal] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    API.get('/issues')
      .then(res => {
        const issues = res.data || [];
        const counts = { PENDING: 0, IN_PROGRESS: 0, RESOLVED: 0, REJECTED: 0 };
        issues.forEach(i => {
          const s = i.status?.toUpperCase();
          if (counts[s] !== undefined) counts[s]++;
        });
        setStats(counts);
        setTotal(issues.length);
      })
      .catch(() => {})
      .finally(() => setLoadingStats(false));
  }, []);

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px' }}>

      {/* ── HERO ── */}
      <div style={{ marginBottom: '52px', position: 'relative' }}>
        <div style={{
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase',
          color: '#d97706', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <span style={{ display: 'inline-block', width: '20px', height: '1px', background: '#d97706' }} />
          CIVIC INFRASTRUCTURE MONITOR — v2.1.0
        </div>

        <h1 style={{
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: 'clamp(28px, 5vw, 52px)',
          fontWeight: 700, color: '#f5f0e8',
          lineHeight: 1.1, marginBottom: '20px',
          letterSpacing: '-1px',
        }}>
          LOCAL ISSUE<br />
          <span style={{ color: '#d97706' }}>TRACKER_</span>
        </h1>

        <p style={{ color: 'rgba(245,240,232,0.5)', fontSize: '15px', lineHeight: 1.7, maxWidth: '480px', marginBottom: '32px' }}>
          A transparent system for citizens to report, track, and resolve civic infrastructure problems in real time.
        </p>

        <Link to="/issues" style={{
          display: 'inline-flex', alignItems: 'center', gap: '10px',
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase',
          color: '#0d0d0d', background: '#d97706',
          padding: '12px 28px', borderRadius: '3px',
          textDecoration: 'none', fontWeight: 700,
          transition: 'background 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = '#b45309'}
          onMouseLeave={e => e.currentTarget.style.background = '#d97706'}
        >
          ▶ View All Issues
        </Link>
      </div>

      {/* ── DIVIDER ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '36px' }}>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
        <span style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>
          LIVE DASHBOARD — {total} TOTAL REPORTS
        </span>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
      </div>

      {/* ── STAT GRID ── */}
      {loadingStats ? (
        <div style={{ fontFamily: "'JetBrains Mono', monospace", color: '#d97706', fontSize: '13px', letterSpacing: '0.1em' }}>
          LOADING SYSTEM DATA...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
          <StatCard label="Pending" count={stats.PENDING} color="amber" icon="⏳" delay={0} />
          <StatCard label="In Progress" count={stats.IN_PROGRESS} color="blue" icon="🔧" delay={150} />
          <StatCard label="Resolved" count={stats.RESOLVED} color="green" icon="✅" delay={300} />
          <StatCard label="Rejected" count={stats.REJECTED} color="red" icon="🚫" delay={450} />
        </div>
      )}

      {/* ── TICKER LINE ── */}
      <div style={{
        marginTop: '48px', borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingTop: '20px',
        fontFamily: "'JetBrains Mono', monospace", fontSize: '11px',
        color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em',
        display: 'flex', gap: '32px', flexWrap: 'wrap'
      }}>
        <span>SYS: ONLINE</span>
        <span>DB: CONNECTED</span>
        <span>LAST SYNC: {new Date().toLocaleTimeString()}</span>
      </div>

    </div>
  );
};

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
const Navbar = ({ isAuthenticated, role, handleLogout }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const navLink = (to, label) => (
    <Link to={to} style={{
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase',
      color: isActive(to) ? '#d97706' : 'rgba(245,240,232,0.5)',
      textDecoration: 'none', padding: '4px 0',
      borderBottom: isActive(to) ? '1px solid #d97706' : '1px solid transparent',
      transition: 'color 0.2s, border-color 0.2s',
    }}
      onMouseEnter={e => { if (!isActive(to)) e.currentTarget.style.color = '#f5f0e8'; }}
      onMouseLeave={e => { if (!isActive(to)) e.currentTarget.style.color = 'rgba(245,240,232,0.5)'; }}
    >
      {label}
    </Link>
  );

  return (
    <nav style={{
      background: 'rgba(8,8,8,0.95)',
      borderBottom: '1px solid rgba(217,119,6,0.2)',
      padding: '0 32px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: '56px',
      backdropFilter: 'blur(12px)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      {/* LEFT */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px', height: '28px', border: '1px solid #d97706',
            borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px',
          }}>⚡</div>
          <span style={{
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontWeight: 700, fontSize: '13px', color: '#f5f0e8', letterSpacing: '0.08em',
          }}>CIVICTRACK</span>
        </Link>

        <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          {navLink('/', 'Home')}
          {navLink('/issues', 'Issues')}
          {/* Only logged-in non-admin users see Report Issue */}
          {isAuthenticated && role !== 'ADMIN' && navLink('/create-issue', '+ Report')}
          {/* Only admin sees Authority Dashboard */}
          {isAuthenticated && role === 'ADMIN' && navLink('/admin', 'Authority')}
        </div>
      </div>

      {/* RIGHT */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {isAuthenticated ? (
          <button onClick={handleLogout} style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase',
            background: 'transparent', border: '1px solid rgba(220,38,38,0.4)',
            color: '#f87171', padding: '7px 16px', borderRadius: '3px',
            cursor: 'pointer', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.1)'; e.currentTarget.style.borderColor = '#dc2626'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(220,38,38,0.4)'; }}
          >
            ⏏ Sign Out
          </button>
        ) : (
          <>
            <Link to="/login" style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase',
              background: 'transparent', border: '1px solid rgba(245,240,232,0.15)',
              color: 'rgba(245,240,232,0.6)', padding: '7px 16px', borderRadius: '3px',
              textDecoration: 'none', transition: 'all 0.2s', display: 'inline-block',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,240,232,0.4)'; e.currentTarget.style.color = '#f5f0e8'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(245,240,232,0.15)'; e.currentTarget.style.color = 'rgba(245,240,232,0.6)'; }}
            >
              Sign In
            </Link>
            <Link to="/signup" style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase',
              background: '#d97706', border: '1px solid #d97706',
              color: '#0d0d0d', padding: '7px 16px', borderRadius: '3px',
              textDecoration: 'none', fontWeight: 700, transition: 'background 0.2s',
              display: 'inline-block',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#b45309'}
              onMouseLeave={e => e.currentTarget.style.background = '#d97706'}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

// ─── APP ─────────────────────────────────────────────────────────────────────
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const role = localStorage.getItem('role');

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
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
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Syne:wght@400;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        body {
          margin: 0;
          background: #080808;
          background-image:
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(217,119,6,0.06) 0%, transparent 60%),
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 100% 100%, 40px 40px, 40px 40px;
          color: #f5f0e8;
          min-height: 100vh;
          font-family: 'Syne', sans-serif;
        }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0d0d0d; }
        ::-webkit-scrollbar-thumb { background: rgba(217,119,6,0.3); border-radius: 3px; }
      `}</style>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#111',
            border: '1px solid rgba(217,119,6,0.3)',
            color: '#f5f0e8',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px',
          }
        }}
      />

      <Navbar isAuthenticated={isAuthenticated} role={role} handleLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/issues" element={<IssuesFeed />} />
        <Route
          path="/create-issue"
          element={isAuthenticated && role !== 'ADMIN' ? <CreateIssue /> : <Home />}
        />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/admin"
          element={role === 'ADMIN' ? <AdminDashboard /> : <Home />}
        />
      </Routes>
    </Router>
  );
}

export default App;