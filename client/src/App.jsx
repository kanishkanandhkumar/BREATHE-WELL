import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Auth from './components/Auth';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ExerciseHistory from './components/ExerciseHistory';
import ExerciseList from './components/ExerciseList';
import SymptomTracker from './components/SymptomTracker';
import Home from './pages/Home';
import { authApi } from './lib/api';
import { supabase } from './lib/supabase';

const ProtectedLayout = ({ darkMode, toggleDarkMode, onLogout }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Header
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      onLogout={onLogout}
    />
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exercises" element={<ExerciseList />} />
        <Route path="/tracker" element={<SymptomTracker />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history" element={<ExerciseHistoryPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  </div>
);

const ExerciseHistoryPage = () => (
  <div className="container-custom py-8">
    <ExerciseHistory />
  </div>
);

function App() {
  const [user, setUser] = useState(() => {
    try {
      return localStorage.getItem('breatheWellToken')
        ? JSON.parse(localStorage.getItem('breatheWellUser') || 'null')
        : null;
    } catch {
      return null;
    }
  });
  const [checkingSession, setCheckingSession] = useState(true);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('breatheWellDarkMode') === 'true'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('breatheWellDarkMode', String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    if (!checkingSession) return;
    authApi.me()
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch(() => {
        localStorage.removeItem('breatheWellToken');
        localStorage.removeItem('breatheWellUser');
        setUser(null);
      })
      .finally(() => setCheckingSession(false));
  }, [checkingSession]);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
        localStorage.removeItem('breatheWellUser');
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogin = (nextUser) => {
    localStorage.setItem('breatheWellUser', JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('breatheWellToken');
    localStorage.removeItem('breatheWellUser');
    supabase.auth.signOut();
    setUser(null);
  };

  return (
    <BrowserRouter>
      {checkingSession ? (
        <div className="flex min-h-screen items-center justify-center text-gray-500">
          Loading your account...
        </div>
      ) : user ? (
        <ProtectedLayout
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode((current) => !current)}
          onLogout={handleLogout}
        />
      ) : (
        <Routes>
          <Route path="*" element={<Auth onLogin={handleLogin} />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
