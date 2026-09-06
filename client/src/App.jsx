import React, { useEffect, useState } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ExerciseHistory from './components/ExerciseHistory';
import ExerciseList from './components/ExerciseList';
import SymptomTracker from './components/SymptomTracker';
import Home from './pages/Home';

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
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('breatheWellDarkMode') === 'true'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('breatheWellDarkMode', String(darkMode));
  }, [darkMode]);

  return (
    <HashRouter>
      <ProtectedLayout
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode((current) => !current)}
        onLogout={() => localStorage.clear()}
      />
    </HashRouter>
  );
}

export default App;
