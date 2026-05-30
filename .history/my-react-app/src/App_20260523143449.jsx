import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import CreateIssue from './pages/CreateIssue';
import IssuesFeed from './pages/IssuesFeed';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AuthDashboard';

// 🟢 Home Page
const Home = () => {
  return (
    <div className="space-y-10">

      {/* Welcome Banner */}
      <div className="text-center mt-12 p-8 bg-slate-950 rounded-xl border border-slate-800 max-w-xl mx-auto shadow-2xl">
        
        <h1 className="text-3xl font-bold text-emerald-400 mb-4">
          🚨 Local Issue Tracker
        </h1>

        <p className="text-slate-400 mb-6">
          Track and report civic issues in your neighborhood instantly.
        </p>

        <Link
          to="/create-issue"
          className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-6 rounded transition duration-200"
        >
          Report a New Issue Now
        </Link>
      </div>

      {/* Live Feed */}
      <IssuesFeed />

    </div>
  );
};

function App() {

  // 🟢 Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const role = localStorage.getItem('role');
  // 🟢 Check token on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  // 🟢 Logout Function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    setIsAuthenticated(false);

    window.location.href = '/';

  };

  return (
    <Router>

      <div className="min-h-screen bg-slate-900 text-white">

        {/* ================= NAVBAR ================= */}
        <nav className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center shadow-md">

          {/* Left Side */}
          <div className="flex gap-6 items-center">

            <div className="text-xl font-bold text-emerald-400 mr-4">
              🚨 Issue Tracker
            </div>

            <Link
              to="/"
              className="text-slate-300 font-semibold hover:text-emerald-400 transition-colors"
            >
              🏠 Home
            </Link>

            <Link
              to="/create-issue"
              
              className="text-slate-300 font-semibold hover:text-emerald-400 transition-colors"
            >
              {role === "ADMIN" && (
            <Link
            to="/admin"
    className="text-slate-300 font-semibold hover:text-emerald-400 transition-colors"
  >
    🛠 Admin Dashboard
  </Link>
)}
              ➕ Report Issue
            </Link>

          </div>

          {/* Right Side */}
          <div className="flex gap-3 items-center">

            {isAuthenticated ? (

              // 🟢 SHOW LOGOUT BUTTON
              <button
                onClick={handleLogout}
                className="bg-red-950 hover:bg-red-900 text-red-200 border border-red-800 font-semibold py-1.5 px-4 rounded-xl transition duration-200 text-sm"
              >
                🛑 Sign Out
              </button>

            ) : (

              // 🟢 SHOW LOGIN + SIGNUP
              <>
                <Link
                  to="/login"
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold py-1.5 px-4 rounded-xl transition duration-200 text-sm"
                >
                  🔑 Sign In
                </Link>

                <Link
                  to="/signup"
                  className="bg-emerald-700 hover:bg-emerald-600 text-white font-semibold py-1.5 px-4 rounded-xl transition duration-200 text-sm"
                >
                  📝 Sign Up
                </Link>
              </>

            )}

          </div>

        </nav>

        {/* ================= ROUTES ================= */}
        <div className="container mx-auto px-4 py-6">

          <Routes>

            {/* Home */}
            <Route path="/" element={<Home />} />

            {/* Create Issue */}
            <Route path="/create-issue" element={<CreateIssue />} />

            {/* Login */}
            <Route
              path="/login"
              element={
                <Login setIsAuthenticated={setIsAuthenticated} />
              }
            />

            {/* Signup */}
            <Route
              path="/signup"
              element={<Signup />}
            />
            <Route path="/admin" element={<AdminDashboard />} />

          </Routes>

        </div>

      </div>

    </Router>
  );
}

export default App;