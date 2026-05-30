import React from 'react';; // Add curly braces here!
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-white">
        {/* Navigation Header bar placeholder */}
        <nav className="p-4 bg-slate-950 border-b border-slate-800 flex gap-4">
          <a href="/" className="text-emerald-400 font-bold hover:underline">📋 Issues Feed</a>
          <a href="/create-issue" className="text-emerald-400 font-bold hover:underline">🚨 Report Issue</a>
        </nav>

        <Routes>
          <Route path="/" element={<IssuesFeed />} />
          <Route path="/create-issue" element={<CreateIssue />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;