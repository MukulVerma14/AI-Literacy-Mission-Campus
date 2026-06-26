import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive(path)
        ? 'bg-slate-800 text-white border-b-2 border-primary'
        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
    }`;

  const mobileNavLinkClass = (path) =>
    `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
      isActive(path)
        ? 'bg-slate-800 text-white border-l-4 border-primary'
        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
    }`;

  return (
    <nav className="bg-darkbg text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                AILMC
              </span>
              <span className="hidden md:inline text-xs font-semibold text-slate-400 border-l border-slate-700 pl-2">
                AI Literacy Mission @ Campus
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className={navLinkClass('/login')}>
                  Login
                </Link>
                <Link
                  to="/register"
                  className="ml-2 px-4 py-2 rounded-md text-sm font-semibold bg-primary text-white hover:bg-blue-600 transition-colors shadow-sm"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                {/* MENTOR NAVIGATION */}
                {role === 'MENTOR' && (
                  <>
                    <Link to="/mentor/dashboard" className={navLinkClass('/mentor/dashboard')}>
                      Dashboard
                    </Link>
                    <Link to="/mentor/cohorts" className={navLinkClass('/mentor/cohorts')}>
                      My Cohorts
                    </Link>
                  </>
                )}

                {/* MENTEE NAVIGATION */}
                {role === 'MENTEE' && (
                  <>
                    <Link to="/mentee/dashboard" className={navLinkClass('/mentee/dashboard')}>
                      Dashboard
                    </Link>
                    <Link to="/mentee/cohorts" className={navLinkClass('/mentee/cohorts')}>
                      Browse Cohorts
                    </Link>
                    <Link to="/mentee/tracker" className={navLinkClass('/mentee/tracker')}>
                      Learning Tracker
                    </Link>
                    <Link to="/mentee/cert" className={navLinkClass('/mentee/cert')}>
                      My Certificate
                    </Link>
                  </>
                )}

                {/* ADMIN NAVIGATION */}
                {role === 'SUPER_ADMIN' && (
                  <>
                    <Link to="/admin/dashboard" className={navLinkClass('/admin/dashboard')}>
                      Dashboard
                    </Link>
                    <Link to="/admin/mentors" className={navLinkClass('/admin/mentors')}>
                      Mentors
                    </Link>
                    <Link to="/admin/cohorts" className={navLinkClass('/admin/cohorts')}>
                      Cohorts
                    </Link>
                    <Link to="/admin/mentees" className={navLinkClass('/admin/mentees')}>
                      Mentees
                    </Link>
                    <Link to="/admin/certs" className={navLinkClass('/admin/certs')}>
                      Certs & Payments
                    </Link>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="ml-4 px-3.5 py-1.5 rounded-md text-sm font-semibold border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-800" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium bg-primary text-white hover:bg-blue-600 text-center"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                {/* MENTOR NAVIGATION */}
                {role === 'MENTOR' && (
                  <>
                    <Link
                      to="/mentor/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className={mobileNavLinkClass('/mentor/dashboard')}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/mentor/cohorts"
                      onClick={() => setMobileMenuOpen(false)}
                      className={mobileNavLinkClass('/mentor/cohorts')}
                    >
                      My Cohorts
                    </Link>
                  </>
                )}

                {/* MENTEE NAVIGATION */}
                {role === 'MENTEE' && (
                  <>
                    <Link
                      to="/mentee/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className={mobileNavLinkClass('/mentee/dashboard')}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/mentee/cohorts"
                      onClick={() => setMobileMenuOpen(false)}
                      className={mobileNavLinkClass('/mentee/cohorts')}
                    >
                      Browse Cohorts
                    </Link>
                    <Link
                      to="/mentee/tracker"
                      onClick={() => setMobileMenuOpen(false)}
                      className={mobileNavLinkClass('/mentee/tracker')}
                    >
                      Learning Tracker
                    </Link>
                    <Link
                      to="/mentee/cert"
                      onClick={() => setMobileMenuOpen(false)}
                      className={mobileNavLinkClass('/mentee/cert')}
                    >
                      My Certificate
                    </Link>
                  </>
                )}

                {/* ADMIN NAVIGATION */}
                {role === 'SUPER_ADMIN' && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className={mobileNavLinkClass('/admin/dashboard')}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/mentors"
                      onClick={() => setMobileMenuOpen(false)}
                      className={mobileNavLinkClass('/admin/mentors')}
                    >
                      Mentors
                    </Link>
                    <Link
                      to="/admin/cohorts"
                      onClick={() => setMobileMenuOpen(false)}
                      className={mobileNavLinkClass('/admin/cohorts')}
                    >
                      Cohorts
                    </Link>
                    <Link
                      to="/admin/mentees"
                      onClick={() => setMobileMenuOpen(false)}
                      className={mobileNavLinkClass('/admin/mentees')}
                    >
                      Mentees
                    </Link>
                    <Link
                      to="/admin/certs"
                      onClick={() => setMobileMenuOpen(false)}
                      className={mobileNavLinkClass('/admin/certs')}
                    >
                      Certs & Payments
                    </Link>
                  </>
                )}

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
