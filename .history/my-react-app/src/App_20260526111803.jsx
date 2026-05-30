import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import CreateIssue from './pages/CreateIssue';
import IssuesFeed from './pages/IssuesFeed';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AuthDashboard';
import { Toaster, toast } from "sonner";

// 🟢 HOME PAGE
const Home = () => {
  return (
    <div className="space-y-10">

      {/* WELCOME BANNER */}
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

      {/* LIVE FEED */}
      <IssuesFeed />

    </div>
  );
};

function App() {

  // 🟢 AUTH STATE
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 🟢 USER ROLE
  const role = localStorage.getItem('role');

  // 🟢 CHECK TOKEN ON LOAD
  useEffect(() => {

    const token = localStorage.getItem('token');

    setIsAuthenticated(!!token);

  }, []);

  // 🟢 LOGOUT
  const handleLogout = () => {

    localStorage.removeItem('token');
    localStorage.removeItem('role');

    setIsAuthenticated(false);

    window.location.href = '/';
  };

  return (

    <Router>
      <Toaster position="top-right" />

      <div className="min-h-screen bg-slate-900 text-white">

        {/* ================= NAVBAR ================= */}
        <nav className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center shadow-md">

          {/* LEFT SIDE */}
          <div className="flex gap-6 items-center">

            {/* LOGO */}
            <div className="text-xl font-bold text-emerald-400 mr-4">
              🚨 Issue Tracker
            </div>

            {/* HOME */}
            <Link
              to="/"
              className="text-slate-300 font-semibold hover:text-emerald-400 transition-colors"
            >
              🏠 Home
            </Link>

            {/* USER ONLY */}
            {role !== "ADMIN" && (

              <Link
                to="/create-issue"
                className="text-slate-300 font-semibold hover:text-emerald-400 transition-colors"
              >
                ➕ Report Issue
              </Link>

            )}

            {/* ADMIN ONLY */}
            {role === "ADMIN" && (

              <Link
                to="/admin"
                className="text-slate-300 font-semibold hover:text-emerald-400 transition-colors"
              >
                🛠 Admin Dashboard
              </Link>

            )}

          </div>

          {/* RIGHT SIDE */}
          <div className="flex gap-3 items-center">

            {isAuthenticated ? (

              // 🟢 LOGOUT BUTTON
              <button
                onClick={handleLogout}
                className="bg-red-950 hover:bg-red-900 text-red-200 border border-red-800 font-semibold py-1.5 px-4 rounded-xl transition duration-200 text-sm"
              >
                🛑 Sign Out
              </button>

            ) : (

              // 🟢 LOGIN + SIGNUP
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

            {/* HOME */}
            <Route
              path="/"
              element={<Home />}
            />

            {/* USER ONLY CREATE ISSUE */}
            <Route
              path="/create-issue"
              element={
                role !== "ADMIN"
                  ? <CreateIssue />
                  : <Home />
              }
            />

            {/* LOGIN */}
            <Route
              path="/login"
              element={
                <Login setIsAuthenticated={setIsAuthenticated} />
              }
            />

            {/* SIGNUP */}
            <Route
              path="/signup"
              element={<Signup />}
            />

            {/* ADMIN DASHBOARD */}
            <Route
              path="/admin"
              element={
                role === "ADMIN"
                  ? <AdminDashboard />
                  : <Home />
              }
            />

          </Routes>

        </div>

      </div>

    </Router>
  );
}

export default App;