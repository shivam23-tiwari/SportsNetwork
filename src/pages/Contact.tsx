import React, { useState } from 'react';
import { submitContact } from '../services/api';
import { motion } from 'motion/react';
import { Mail } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: '', text: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'info', text: 'Sending...' });
    try {
      await submitContact(formData);
      setStatus({ type: 'success', text: 'Message sent successfully! We will get back to you soon.' });
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', text: 'Failed to send message. Please try again later.' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 mt-8">
      <div className="bg-slate-800 rounded-md p-8 sm:p-12 border border-slate-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent"></div>
        <div className="relative z-10">
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight italic mb-4">Contact Us</h1>
          <p className="text-slate-300 font-medium">Have a tip, feedback, or a partnership inquiry? Drop us a message.</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-sm border border-slate-200">
        <div className="flex items-center mb-6 border-b border-slate-100 pb-4">
          <Mail className="w-5 h-5 mr-3 text-red-600" />
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">Send a Message</h2>
        </div>

        {status.text && (
          <div className={`p-4 mb-6 rounded-sm text-sm font-bold uppercase tracking-widest ${
            status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 
            status.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-blue-50 text-blue-600 border border-blue-200'
          }`}>
            {status.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:bg-white focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none transition-colors text-sm font-medium"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:bg-white focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none transition-colors text-sm font-medium"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:bg-white focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none transition-colors text-sm font-medium"
              required
            ></textarea>
          </div>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            className="py-4 px-8 bg-red-600 text-white font-bold rounded-sm uppercase tracking-widest text-xs hover:bg-red-700"
          >
            Submit Message
          </motion.button>
        </form>
      </div>
    </div>
  );
}
