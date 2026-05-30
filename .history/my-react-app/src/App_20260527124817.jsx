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

    <div style={{
      background: bg,
      borderRadius: '20px',
      padding: '28px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      animation: 'popIn 0.5s ease both',
      animationDelay: `${delay}ms`,
    }}>

      <span style={{
        fontSize: '32px',
        lineHeight: 1
      }}>
        {emoji}
      </span>

      <div style={{
        fontSize: '44px',
        fontWeight: 800,
        color: numColor,
        lineHeight: 1
      }}>
        {displayed}
      </div>

      <div style={{
        fontSize: '14px',
        fontWeight: 600,
        color: textColor
      }}>
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

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    API.get('/issues')

      .then(res => {

        const issues = res.data || [];

        const c = {
          PENDING: 0,
          IN_PROGRESS: 0,
          RESOLVED: 0,
          REJECTED: 0
        };

        issues.forEach(i => {

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

      .catch(() => {})

      .finally(() => setLoading(false));

  }, []);

  return (

    <div style={{
      maxWidth: '860px',
      margin: '0 auto',
      padding: '56px 24px 80px'
    }}>

      {/* HERO */}

      <div style={{
        textAlign: 'center',
        marginBottom: '64px'
      }}>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: '#FFF0F9',
          border: '1px solid #F9C0E0',
          borderRadius: '99px',
          padding: '6px 16px',
          fontSize: '13px',
          fontWeight: 600,
          color: '#C2185B',
          marginBottom: '24px',
        }}>

          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: '#E91E8C',
            display: 'inline-block',
          }} />

          Live Community Dashboard

        </div>

        <h1 style={{
          fontSize: 'clamp(32px, 6vw, 58px)',
          fontWeight: 800,
          color: '#1E1B2E',
          lineHeight: 1.1,
          margin: '0 0 18px',
        }}>
          Your Neighbourhood,<br />

          <span style={{
            color: '#7C3AED'
          }}>
            Your Voice
          </span>

        </h1>

        <p style={{
          fontSize: '17px',
          color: '#6B6B80',
          lineHeight: 1.75,
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          Report local issues, track their progress,
          and see your community problems get resolved.
        </p>

      </div>

      {/* STATS */}

      <div style={{
        textAlign: 'center',
        marginBottom: '32px'
      }}>

        <span style={{
          fontSize: '13px',
          fontWeight: 600,
          color: '#9B9BAA',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          {loading
            ? 'Loading stats...'
            : `${stats.total} total reports`
          }
        </span>

      </div>

      {!loading && (

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '16px',
          marginBottom: '48px'
        }}>

          <StatCard
            label="Pending Review"
            count={stats.PENDING}
            emoji="⏳"
            bg="#FFF8E6"
            textColor="#92600A"
            numColor="#D97706"
            delay={0}
          />

          <StatCard
            label="In Progress"
            count={stats.IN_PROGRESS}
            emoji="🔧"
            bg="#EEF3FF"
            textColor="#3B4CB8"
            numColor="#4F46E5"
            delay={100}
          />

          <StatCard
            label="Resolved"
            count={stats.RESOLVED}
            emoji="✅"
            bg="#EDFAF4"
            textColor="#1A7A4A"
            numColor="#16A34A"
            delay={200}
          />

          <StatCard
            label="Rejected"
            count={stats.REJECTED}
            emoji="❌"
            bg="#FFF0F0"
            textColor="#9B1C1C"
            numColor="#DC2626"
            delay={300}
          />

        </div>
      )}

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

  const NavLink = ({ to, children }) => (

    <Link
      to={to}
      style={{
        fontSize: '15px',
        fontWeight: 700,
        color: active(to)
          ? '#7C3AED'
          : '#4B4B60',
        textDecoration: 'none',
        padding: '10px 18px',
        borderRadius: '16px',
        background: active(to)
          ? '#F0EBFF'
          : 'transparent',
        transition: 'all 0.15s',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
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
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>

      {/* LOGO */}

      <Link
        to="/"
        style={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >

        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background:
            'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          color: 'white'
        }}>
          🚨
        </div>

        <span style={{
          fontWeight: 800,
          fontSize: '18px',
          color: '#1E1B2E'
        }}>
          UrbanVoice
        </span>

      </Link>

      {/* LINKS */}

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>

        <NavLink to="/">
          🏠 Home
        </NavLink>

        {isAuthenticated && role !== 'ADMIN' && (
          <NavLink to="/issues">
            📋 My Issues
          </NavLink>
        )}

        {isAuthenticated && role !== 'ADMIN' && (
          <NavLink to="/create-issue">
            ➕ Report Issue
          </NavLink>
        )}

        {isAuthenticated && role === 'ADMIN' && (
          <NavLink to="/admin">
            🛡️ Authority Dashboard
          </NavLink>
        )}

      </div>

      {/* AUTH */}

      <div style={{
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
      }}>

        {isAuthenticated ? (

          <button
            onClick={handleLogout}
            style={{
              fontSize: '14px',
              fontWeight: 700,
              background: '#FFF0F0',
              border: '1px solid #FECACA',
              color: '#DC2626',
              padding: '10px 18px',
              borderRadius: '99px',
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
                color: '#4B4B60',
                fontWeight: 700
              }}
            >
              Sign In
            </Link>

            <Link
              to="/signup"
              style={{
                textDecoration: 'none',
                color: 'white',
                padding: '10px 18px',
                borderRadius: '99px',
                background:
                  'linear-gradient(135deg, #7C3AED, #A855F7)',
                fontWeight: 700
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
          color:#1E1B2E;
          min-height:100vh;
        }
      `}</style>

      <Toaster />

      <Navbar
        isAuthenticated={isAuthenticated}
        role={role}
        handleLogout={handleLogout}
      />

      <Routes>

        {/* PUBLIC ROUTES */}

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

        {/* HOME */}

        <Route
          path="/"
          element={
            isAuthenticated
              ? <Home />
              : <Navigate to="/login" />
          }
        />

        {/* USER ROUTES */}

        <Route
          path="/issues"
          element={
            isAuthenticated && role !== 'ADMIN'
              ? <IssuesFeed />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/create-issue"
          element={
            isAuthenticated && role !== 'ADMIN'
              ? <CreateIssue />
              : <Navigate to="/login" />
          }
        />

        {/* ADMIN ROUTE */}

        <Route
          path="/admin"
          element={
            isAuthenticated && role === 'ADMIN'
              ? <AdminDashboard />
              : <Navigate to="/login" />
          }
        />

      </Routes>

    </Router>
  );
}

export default App;