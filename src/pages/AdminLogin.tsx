import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../services/api';
import { motion } from 'motion/react';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminLogin({ username, password });
      if (res.token) {
        localStorage.setItem('adminToken', res.token);
        navigate('/admin');
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="bg-white p-8 rounded-sm border border-slate-200">
        <div className="flex items-center mb-6 border-b border-slate-100 pb-4">
          <Lock className="w-5 h-5 mr-3 text-red-600" />
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">Admin Login</h2>
        </div>
        
        {error && <div className="text-red-600 text-xs font-bold uppercase mb-4">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Email / Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:bg-white focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none transition-colors text-sm font-medium"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:bg-white focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none transition-colors text-sm font-medium"
              required
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            className="w-full py-4 px-4 bg-red-600 text-white font-bold rounded-sm uppercase tracking-widest text-xs hover:bg-red-700"
          >
            Login
          </motion.button>
        </form>
      </div>
    </div>
  );
}
