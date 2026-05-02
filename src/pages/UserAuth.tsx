import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, LogIn, UserPlus } from 'lucide-react';
import { apiCall } from '../services/api';

export default function UserAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showForgotHint, setShowForgotHint] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setShowForgotHint(false);

    if (isForgotPassword) {
      try {
        await apiCall('/api/auth/forgot', 'POST', { email });
        setMessage('Password reset notification sent successfully. Please check your inbox.');
        setTimeout(() => setIsForgotPassword(false), 3000);
      } catch (err: any) {
        setError('Failed to process request.');
      }
      return;
    }

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const res = await apiCall(endpoint, 'POST', { email, password });
      
      if (res.token) {
        localStorage.setItem('userToken', res.token);
        localStorage.setItem('userEmail', email);
        setMessage('Success! Redirecting...');
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (err: any) {
      const errMessage = err.response?.data?.error || 'Authentication failed. Server error.';
      setError(errMessage);
      
      if (isLogin && (errMessage.toLowerCase().includes('password') || errMessage.toLowerCase().includes('credential'))) {
        setShowForgotHint(true);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="bg-white p-8 rounded-sm border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
          <div className="flex items-center">
            {isForgotPassword ? <User className="w-5 h-5 mr-3 text-red-600" /> : isLogin ? <LogIn className="w-5 h-5 mr-3 text-red-600" /> : <UserPlus className="w-5 h-5 mr-3 text-red-600" />}
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">
              {isForgotPassword ? 'Reset Password' : isLogin ? 'User Login' : 'Create Account'}
            </h2>
          </div>
        </div>
        
        {error && <div className="p-3 mb-6 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest border border-red-200 rounded-sm">{error}</div>}
        {message && <div className="p-3 mb-6 bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-widest border border-emerald-200 rounded-sm">{message}</div>}
        {showForgotHint && (
          <div className="p-3 mb-6 bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-widest border border-amber-200 rounded-sm flex justify-between items-center">
            <span>Forgot your password?</span>
            <button 
              type="button" 
              onClick={() => { setIsForgotPassword(true); setShowForgotHint(false); setError(''); }}
              className="bg-amber-600 text-white px-2 py-1 rounded"
            >
              Reset
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:bg-white focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none transition-colors text-sm font-medium"
              required
              placeholder="you@example.com"
            />
          </div>
          {!isForgotPassword && (
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:bg-white focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none transition-colors text-sm font-medium"
                required
                placeholder="********"
              />
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            className="w-full py-4 px-4 bg-red-600 text-white font-bold rounded-sm uppercase tracking-widest text-xs hover:bg-red-700 transition-colors"
          >
            {isForgotPassword ? 'Send Reset Link' : isLogin ? 'Sign In' : 'Sign Up'}
          </motion.button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center flex flex-col gap-3">
          {!isForgotPassword && (
            <button 
              type="button" 
              onClick={() => { setIsLogin(!isLogin); setError(''); setShowForgotHint(false); }}
              className="text-[10px] uppercase font-bold tracking-widest text-slate-500 hover:text-red-600 transition-colors"
            >
              {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </button>
          )}
          {isForgotPassword && (
            <button 
              type="button" 
              onClick={() => { setIsForgotPassword(false); setIsLogin(true); setError(''); }}
              className="text-[10px] uppercase font-bold tracking-widest text-slate-500 hover:text-red-600 transition-colors"
            >
              Back to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
