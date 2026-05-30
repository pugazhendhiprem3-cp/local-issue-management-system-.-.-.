import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CreateIssue from './pages/CreateIssue'; 
import IssuesFeed from './pages/IssuesFeed'; // 🟢 Import the Feed component
import Login from './pages/Login';           // 🟢 Import your Login component

// Landing page containing both the Welcome Box and the Live Feed Board
const Home = () => {
  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <div className="text-center mt-12 p-8 bg-slate-950 rounded-xl border border-slate-800 max-w-xl mx-auto shadow-2xl">
        <h1 className="text-3xl font-bold text-emerald-400 mb-4">🚨 Local Issue Tracker</h1>
        <p className="text-slate-400 mb-6">Track and report civic issues in your neighborhood instantly.</p>
        <Link to="/create-issue" className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-6 rounded transition duration-200">
          Report a New Issue Now
        </Link>
      </div>

      {/* 🟢 Live Feed directly visible below the welcome box */}
      <IssuesFeed />
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-white">
        
        {/* Navigation Bar */}
        <nav className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center shadow-md">
          <div className="flex gap-6 items-center">
            <div className="text-xl font-bold text-emerald-400 mr-4">🚨 Issue Tracker</div>
            <Link to="/" className="text-slate-300 font-semibold hover:text-emerald-400 transition-colors">
              🏠 Home
            </Link>
            <Link to="/create-issue" className="text-slate-300 font-semibold hover:text-emerald-400 transition-colors">
              ➕ Report Issue
            </Link>
          </div>
          
          {/* 🟢 Login route link added to the right side of the navbar */}
          <div>
            <Link to="/login" className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold py-1.5 px-4 rounded-xl transition duration-200 text-sm">
              🔑 Sign In
            </Link>
          </div>
        </nav>

        {/* Route Definitions Layout Container */}
        <div className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-issue" element={<CreateIssue />} />
            <Route path="/login" element={<Login />} /> {/* 🟢 Login page route registered */}
          </Routes>
        </div>

      </div>
    </Router>
  );
}

export default App;