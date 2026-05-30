import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate
} from 'react-router-dom';

import CreateIssue from './pages/CreateIssue';
import IssuesFeed from './pages/IssuesFeed';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AuthDashboard';
import API from './services/api';
import { Toaster } from 'sonner';


// ─────────────────────────────────────────────────────────────
// ANIMATED COUNTER
// ─────────────────────────────────────────────────────────────
const useCounter = (target, delay = 0) => {

  const [val, setVal] = useState(0);

  useEffect(() => {

    const end = parseInt(target) || 0;

    if (end === 0) {
      setVal(0);
      return;
    }

    let current = 0;

    const step = Math.max(Math.ceil(end / 40), 1);

    const t = setTimeout(() => {

      const id = setInterval(() => {

        current = Math.min(current + step, end);

        setVal(current);

        if (current >= end) {
          clearInterval(id);
        }

      }, 30);

      return () => clearInterval(id);

    }, delay);

    return () => clearTimeout(t);

  }, [target, delay]);

  return val;
};


// ─────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────
const StatCard = ({
  label,
  count,
  emoji,
  bg,
  textColor,
  numColor,
  delay
}) => {

  const displayed = useCounter(count, delay);

  return (

    <div
      style={{
        background: bg,
        borderRadius: '20px',
        padding: '28px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        animation: 'popIn 0.5s ease both',
        animationDelay: `${delay}ms`,
      }}
    >

      <span style={{ fontSize: '32px' }}>
        {emoji}
      </span>

      <div
        style={{
          fontSize: '42px',
          fontWeight: 800,
          color: numColor,
        }}
      >
        {displayed}
      </div>

      <div
        style={{
          fontSize: '14px',
          fontWeight: 600,
          color: textColor,
        }}
      >
        {label}
      </div>

    </div>
  );
};


// ─────────────────────────────────────────────────────────────
// HOME
// ─────────────────────────────────────────────────────────────
const Home = () => {

  const [stats, setStats] = useState({
    PENDING: 0,
    IN_PROGRESS: 0,
    RESOLVED: 0,
    REJECTED: 0,
    total: 0
  });

  useEffect(() => {

    API.get('/issues')

      .then((res) => {

        const issues = res.data || [];

        const c = {
          PENDING: 0,
          IN_PROGRESS: 0,
          RESOLVED: 0,
          REJECTED: 0
        };

        issues.forEach((i) => {

          const s = i.status?.toUpperCase();

          if (c[s] !== undefined) {
            c[s]++;
          }
        });

        setStats({
          ...c,
          total: issues.length
        });
      })

      .catch(() => {});

  }, []);

  return (

    <div
      style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '60px 24px'
      }}
    >

      {/* HERO */}

      <div
        style={{
          textAlign: 'center',
          marginBottom: '60px'
        }}
      >

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FCE7F3',
            border: '1px solid #F9A8D4',
            borderRadius: '999px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 700,
            color: '#BE185D',
            marginBottom: '24px',
          }}
        >

          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#EC4899'
            }}
          />

          Live Community Dashboard

        </div>

        <h1
          style={{
            fontSize: '58px',
            fontWeight: 800,
            color: '#111827',
            lineHeight: 1.1,
            marginBottom: '20px',
          }}
        >
          Your Community,<br />

          <span style={{ color: '#7C3AED' }}>
            Your Voice
          </span>

        </h1>

        <p
          style={{
            fontSize: '18px',
            color: '#6B7280',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.7,
          }}
        >
          Report issues around your neighbourhood and track them transparently.
        </p>

      </div>

      {/* STATS */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
          gap: '18px',
          marginBottom: '50px',
        }}
      >

        <StatCard
          label="Pending"
          count={stats.PENDING}
          emoji="⏳"
          bg="#FEF3C7"
          textColor="#92400E"
          numColor="#D97706"
          delay={0}
        />

        <StatCard
          label="In Progress"
          count={stats.IN_PROGRESS}
          emoji="🔧"
          bg="#DBEAFE"
          textColor="#1E40AF"
          numColor="#2563EB"
          delay={100}
        />

        <StatCard
          label="Resolved"
          count={stats.RESOLVED}
          emoji="✅"
          bg="#DCFCE7"
          textColor="#166534"
          numColor="#16A34A"
          delay={200}
        />

        <StatCard
          label="Rejected"
          count={stats.REJECTED}
          emoji="❌"
          bg="#FEE2E2"
          textColor="#991B1B"
          numColor="#DC2626"
          delay={300}
        />

      </div>

    </div>
  );
};


// ─────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────
const Navbar = ({
  isAuthenticated,
  role,
  handleLogout
}) => {

  const location = useLocation();

  const active = (path) =>
    location.pathname === path;

  const NavItem = ({
    to,
    children
  }) => (

    <Link
      to={to}
      style={{
        textDecoration: 'none',
        padding: '12px 22px',
        borderRadius: '18px',
        background: active(to)
          ? '#EDE9FE'
          : 'transparent',
        color: active(to)
          ? '#7C3AED'
          : '#374151',
        fontWeight: 700,
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      {children}
    </Link>
  );

  return (

    <nav
      style={{
        background: 'white',
        borderBottom: '1px solid #E5E7EB',
        height: '76px',
        padding: '0 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >

      {/* LOGO */}

      <Link
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          textDecoration: 'none',
        }}
      >

        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '14px',
            background:
              'linear-gradient(135deg,#7C3AED,#A855F7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '20px',
            fontWeight: 700,
          }}
        >
          🚨
        </div>

        <span
          style={{
            fontSize: '26px',
            fontWeight: 800,
            color: '#111827',
          }}
        >
          UrbanVoice
        </span>

      </Link>

      {/* LINKS */}

      <div
        style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
        }}
      >

        <NavItem to="/">
          🏠 Home
        </NavItem>

        {isAuthenticated && role !== 'ADMIN' && (
          <NavItem to="/issues">
            📋 My Issues
          </NavItem>
        )}

        {isAuthenticated && role !== 'ADMIN' && (
          <NavItem to="/create-issue">
            ➕ Report Issue
          </NavItem>
        )}

        {isAuthenticated && role === 'ADMIN' && (
          <NavItem to="/admin">
            🛡️ Authority Dashboard
          </NavItem>
        )}

      </div>

      {/* AUTH */}

      <div
        style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
        }}
      >

        {isAuthenticated ? (

          <button
            onClick={handleLogout}
            style={{
              padding: '12px 20px',
              borderRadius: '18px',
              border: '1px solid #FCA5A5',
              background: '#FEF2F2',
              color: '#DC2626',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Sign Out
          </button>

        ) : (

          <>
            <Link
              to="/login"
              style={{
                textDecoration: 'none',
                color: '#374151',
                fontWeight: 700,
              }}
            >
              Sign In
            </Link>

            <Link
              to="/signup"
              style={{
                textDecoration: 'none',
                background:
                  'linear-gradient(135deg,#7C3AED,#A855F7)',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '18px',
                fontWeight: 700,
              }}
            >
              Sign Up
            </Link>
          </>

        )}

      </div>

    </nav>
  );
};


// ─────────────────────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────────────────────
function App() {

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  const role = localStorage.getItem('role');

  useEffect(() => {

    setIsAuthenticated(
      !!localStorage.getItem('token')
    );

  }, []);

  const handleLogout = () => {

    localStorage.clear();

    setIsAuthenticated(false);

    window.location.href = '/login';
  };

  return (

    <Router>

      <style>{`

        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
        }

        body{
          font-family:'Plus Jakarta Sans',sans-serif;
          background:#FAFAFA;
          color:#111827;
        }

      `}</style>

      <Toaster />

      <Navbar
        isAuthenticated={isAuthenticated}
        role={role}
        handleLogout={handleLogout}
      />

      <Routes>

        {/* PUBLIC */}

        <Route
          path="/login"
          element={
            <Login
              setIsAuthenticated={setIsAuthenticated}
            />
          }
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* USER */}

        <Route
          path="/"
          element={
            isAuthenticated
              ? <Home />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/issues"
          element={
            isAuthenticated &&
            role !== 'ADMIN'
              ? <IssuesFeed />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/create-issue"
          element={
            isAuthenticated &&
            role !== 'ADMIN'
              ? <CreateIssue />
              : <Navigate to="/login" />
          }
        />

        {/* ADMIN */}

        <Route
          path="/admin"
          element={
            isAuthenticated &&
            role === 'ADMIN'
              ? <AdminDashboard />
              : <Navigate to="/login" />
          }
        />

      </Routes>

    </Router>
  );
}

export default App;