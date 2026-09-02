import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Moon, Sun, User, Bell, Heart, LogOut } from 'lucide-react';

const Header = ({ darkMode, toggleDarkMode, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <span className="text-3xl animate-float">🌬️</span>
              <Heart className="absolute -top-1 -right-1 w-4 h-4 text-red-500 animate-pulse" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Breathe Well
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Asthma Management</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Home
            </Link>
            <Link to="/exercises" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Exercises
            </Link>
            <Link to="/tracker" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Tracker
            </Link>
            <Link to="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Dashboard
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            <button
              onClick={onLogout}
              className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors text-red-500 hover:text-red-600"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700 animate-slideDown">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                🏠 Home
              </Link>
              <Link to="/exercises" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                🫁 Exercises
              </Link>
              <Link to="/tracker" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                📊 Tracker
              </Link>
              <Link to="/dashboard" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                📈 Dashboard
              </Link>
              <Link to="/history" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                📜 History
              </Link>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  if (onLogout) onLogout();
                }}
                className="px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-left"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
