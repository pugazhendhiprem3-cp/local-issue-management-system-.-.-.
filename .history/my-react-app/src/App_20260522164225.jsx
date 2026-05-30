import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import IssuesFeed from './Component/IssuesFeed';
import CreateIssue from './Component/CreateIssue';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-white">
        {/* Navigation Bar */}
        <nav className="p-4 bg-slate-950 border-b border-slate-800 flex gap-6 items-center shadow-md">
          <div className="text-xl font-bold text-emerald-400 mr-4">🚨 Local Issue Tracker</div>
          <Link to="/" className="text-slate-300 font-semibold hover:text-emerald-400 transition-colors">
            📋 Issues Feed
          </Link>
          <Link to="/create-issue" className="text-slate-300 font-semibold hover:text-emerald-400 transition-colors">
            ➕ Report Issue
          </Link>
        </nav>

        {/* Route Definitions */}
        <div className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<IssuesFeed />} />
            <Route path="/create-issue" element={<CreateIssue />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;