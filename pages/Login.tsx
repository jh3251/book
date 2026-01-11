
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAuth } from '../services/mockFirebase';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    mockAuth.login(email);
    navigate('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-accent/10 p-8 md:p-12">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-accent/20">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-black mb-2">
            {isRegistering ? 'Join BookSwap' : 'Welcome Back'}
          </h1>
          <p className="text-black/60 font-medium">
            {isRegistering ? 'Create an account to start selling' : 'Sign in to access your dashboard'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-black ml-1">Email Address</label>
            <input 
              required
              type="email"
              className="w-full bg-accent/5 border-none rounded-xl py-4 px-5 focus:ring-2 focus:ring-accent transition-all text-black"
              placeholder="you@university.edu.bd"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-black ml-1">Password</label>
            <input 
              required
              type="password"
              className="w-full bg-accent/5 border-none rounded-xl py-4 px-5 focus:ring-2 focus:ring-accent transition-all text-black"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-accent text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {isRegistering ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-accent/10">
          <p className="text-black/60 font-medium">
            {isRegistering ? 'Already have an account?' : 'New to BookSwap?'}
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="ml-2 font-bold text-accent hover:underline transition-all"
            >
              {isRegistering ? 'Log In' : 'Sign Up Free'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
