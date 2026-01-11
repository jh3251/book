
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mockAuth } from '../services/mockFirebase';
import { User } from '../types';

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(mockAuth.getCurrentUser());
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(mockAuth.getCurrentUser());
    };
    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  const handleLogout = () => {
    mockAuth.logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-accent/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-accent p-1.5 rounded-lg group-hover:rotate-6 transition-transform">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-black">BookSwap</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-black hover:text-accent font-medium transition-colors">Browse Books</Link>
          <Link to="/sell" className="text-black hover:text-accent font-medium transition-colors">Sell a Book</Link>
          {user ? (
            <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
              <Link to="/dashboard" className="text-black hover:text-accent font-medium transition-colors">Dashboard</Link>
              <button 
                onClick={handleLogout}
                className="bg-accent/10 text-accent px-4 py-2 rounded-full font-semibold hover:bg-accent hover:text-white transition-all"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-black hover:text-accent font-medium transition-colors">Log In</Link>
              <Link to="/login" className="bg-accent text-white px-5 py-2 rounded-full font-semibold shadow-lg shadow-accent/20 hover:scale-105 transition-transform">Sign Up</Link>
            </div>
          )}
        </nav>

        <div className="md:hidden flex items-center gap-4">
          <Link to="/sell" className="bg-accent p-2 rounded-full text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
          </Link>
          {user ? (
             <Link to="/dashboard" className="text-accent font-bold">Dashboard</Link>
          ) : (
             <Link to="/login" className="text-accent font-bold">Log In</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
