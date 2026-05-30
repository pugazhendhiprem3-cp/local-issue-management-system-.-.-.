import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import Home from './pages/Home';
import IssuesFeed from './pages/IssuesFeed';
import CreateIssue from './pages/CreateIssue';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AuthDashboard';

function App() {

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  const role = localStorage.getItem('role');

  useEffect(() => {

    const token = localStorage.getItem('token');

    setIsAuthenticated(!!token);

  }, []);

  return (

    <Router>

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