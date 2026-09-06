import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Moon, Sun, Heart, Wind, Home as HomeIcon, Activity, BarChart3, History } from 'lucide-react';

const Header = ({ darkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-600/25">
              <Wind className="h-6 w-6 animate-float" />
              <Heart className="absolute -right-1 -top-1 h-4 w-4 text-secondary-400" fill="currentColor" />
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

            <div className="hidden items-center gap-2 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 sm:flex">
              <Wind className="h-3.5 w-3.5" /> Demo mode
            </div>

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
                <HomeIcon className="mr-2 inline h-4 w-4" /> Home
              </Link>
              <Link to="/exercises" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                <Wind className="mr-2 inline h-4 w-4" /> Exercises
              </Link>
              <Link to="/tracker" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                <Activity className="mr-2 inline h-4 w-4" /> Tracker
              </Link>
              <Link to="/dashboard" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                <BarChart3 className="mr-2 inline h-4 w-4" /> Dashboard
              </Link>
              <Link to="/history" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                <History className="mr-2 inline h-4 w-4" /> History
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
