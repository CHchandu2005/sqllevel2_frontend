import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Database } from 'lucide-react';
import Login from './components/Login';
import Instructions from './components/Instructions';
import Quiz from './components/Quiz';
import AuthContext from './AuthContext';
import ThankYou from './components/ThankYou';

// Navbar Component
function Navbar() {
  const { user } = useContext(AuthContext);

  return (
    <nav className="border-b border-gray-800 bg-black/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Database className="h-8 w-8 text-blue-400" />
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              SQL Escape Room
            </span>
          </div>
          {user && (
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-400" />
              <span className="text-sm text-green-400">{user.teckziteid}</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
function AppRoutes() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Store the current path in localStorage to retain it after refresh
  useEffect(() => {
    localStorage.setItem('lastPath', location.pathname);
  }, [location]);

  // Redirect to the last path stored in localStorage after refresh
  useEffect(() => {
    if (user) {
      console.log("User in App.jsx:",user);
      const lastPath = localStorage.getItem('lastPath');
      const timeleft = localStorage.getItem("quizTimeLeft");

      // If timeleft exists, redirect to /quiz
      if (timeleft) {
        navigate("/quiz");
      } else if (lastPath && lastPath !== location.pathname) {
        navigate(lastPath);
      }
      setIsCheckingAuth(false); // Stop checking once user is available
    }
  }, [user, navigate, location.pathname]);

  // Show a loading state while checking authentication
  if ( user && isCheckingAuth) {
    return <div>Loading...</div>; // Replace with your loading component
  }

  const timeleft = localStorage.getItem("quizTimeLeft");
  console.log("Time left:", timeleft);

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            timeleft ? (
              <Navigate to="/quiz" replace />
            ) : (
              <Navigate to="/instructions" replace />
            )
          ) : (
            <Login />
          )
        }
      />
      <Route path="/thankyou" element={user ? <ThankYou /> : <Navigate to="/" replace />} />
      <Route
        path="/instructions"
        element={
          user ? (
            timeleft ? (
              <Navigate to="/quiz" replace />
            ) : (
              <Instructions />
            )
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route path="/quiz" element={user ? <Quiz /> : <Navigate to="/" replace />} />
    </Routes>
  );
}

// Main App Component
function App() {
  return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900 via-gray-900 to-gray-900 opacity-50"></div>
        <div className="relative z-10">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AppRoutes />
          </main>
        </div>
      </div>
  );
}

export default App;

