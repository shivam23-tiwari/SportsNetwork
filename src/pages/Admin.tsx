import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addPlayer, getAdminMessages, getAdminStats, deleteAdminMessage, uploadSmart, getAdminLogs } from '../services/api';
import { Settings, UserPlus, Inbox, Trash2, UploadCloud, Activity } from 'lucide-react';
import { motion } from 'motion/react';

export default function Admin() {
  const [formData, setFormData] = useState({
    name: '',
    sport: 'football',
    image: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [uploadMessage, setUploadMessage] = useState({ type: '', text: '' });
  const [stats, setStats] = useState<any>({});
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        const [statsData, messagesData, logsData] = await Promise.all([
          getAdminStats(),
          getAdminMessages(),
          getAdminLogs()
        ]);
        setStats(statsData);
        setContactMessages(messagesData);
        setAuditLogs(logsData);
      } catch (err) {
        if ((err as any).response?.status === 401 || (err as any).response?.status === 403) {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        }
      }
    };
    fetchDashboardData();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDeleteMessage = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteAdminMessage(id);
        setContactMessages(contactMessages.filter(m => m._id !== id && m.id !== id));
      } catch (err) {
        alert('Failed to delete message');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await addPlayer(formData);
      setMessage({ type: 'success', text: 'Player added successfully!' });
      setFormData({ name: '', sport: 'football', image: '', description: '' });
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        setMessage({ type: 'error', text: err.response.data.error });
      } else {
        setMessage({ type: 'error', text: 'Error adding player. Server might not be connected.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSmartUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    setUploadMessage({ type: '', text: '' });

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        const res = await uploadSmart(base64Image);
        setUploadMessage({ type: 'success', text: `Detected: ${res.type.toUpperCase()} - ${res.title}` });
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setUploadMessage({ type: 'error', text: 'Upload failed.' });
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 mt-4">
      <div className="bg-slate-800 rounded-md p-8 sm:p-12 border border-slate-700 text-white flex flex-col sm:flex-row items-center justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent"></div>
        <div className="z-10 flex items-center mb-4 sm:mb-0">
          <Settings className="w-8 h-8 mr-4 text-red-500" />
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight italic">Admin Dashboard</h1>
        </div>
        <button onClick={handleLogout} className="z-10 text-[10px] font-bold uppercase tracking-widest bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-sm transition-colors border border-slate-600">
          Logout
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-6 border border-slate-200 rounded-sm">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Total Visits</h3>
          <p className="text-3xl font-black text-slate-900">{stats.totalVisits || 0}</p>
        </div>
        <div className="bg-white p-6 border border-slate-200 rounded-sm">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Total News</h3>
          <p className="text-3xl font-black text-slate-900">{stats.totalNews || 0}</p>
        </div>
        <div className="bg-white p-6 border border-slate-200 rounded-sm">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Total Players</h3>
          <p className="text-3xl font-black text-slate-900">{stats.totalPlayers || 0}</p>
        </div>
        <div className="bg-white p-6 border border-slate-200 rounded-sm">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Messages</h3>
          <p className="text-3xl font-black text-slate-900">{stats.totalMessages || 0}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-sm border border-slate-200">
        <div className="flex items-center mb-6 border-b border-slate-100 pb-4">
          <UploadCloud className="w-5 h-5 mr-3 text-red-600" />
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">Smart Image Upload & Auto-Detect</h2>
        </div>
        <p className="text-xs font-medium text-slate-600 mb-6">Upload any image. Our AI will detect if it is a player, stadium, match, or team, and automatically categorize it and place it in the correct section of the live site.</p>
        
        {uploadMessage.text && (
          <div className={`p-4 mb-6 rounded-sm text-sm font-bold uppercase tracking-widest ${uploadMessage.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
            {uploadMessage.text}
          </div>
        )}

        <div className="relative border-2 border-dashed border-slate-300 rounded-sm p-12 text-center hover:bg-slate-50 transition-colors">
          <input type="file" accept="image/*" onChange={handleSmartUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          <UploadCloud className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-sm font-bold uppercase tracking-widest text-slate-600">
            {uploadLoading ? 'Processing Image with AI...' : 'Drag & Drop or Click to Upload'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-sm border border-slate-200 self-start">
          <div className="flex items-center mb-6 border-b border-slate-100 pb-4">
            <UserPlus className="w-5 h-5 mr-3 text-red-600" />
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">Add New Player</h2>
          </div>

          {message.text && (
            <div className={`p-4 mb-6 rounded-sm text-sm font-bold uppercase tracking-widest ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Player Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:bg-white focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none transition-colors text-sm font-medium"
                  placeholder="e.g. Cristiano Ronaldo"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Sport Category</label>
                <select
                  name="sport"
                  value={formData.sport}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:bg-white focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none transition-colors text-sm font-medium"
                >
                  <option value="football">Football</option>
                  <option value="cricket">Cricket</option>
                  <option value="nba">NBA</option>
                  <option value="f1">Formula 1</option>
                  <option value="ipl">IPL</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Image URL</label>
              <input
                type="url"
                name="image"
                required
                value={formData.image}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:bg-white focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none transition-colors text-sm font-medium"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Description</label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:bg-white focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none transition-colors text-sm font-medium"
                placeholder="Brief biography..."
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-4 bg-red-600 text-white font-bold rounded-sm uppercase tracking-widest text-xs ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-red-700'}`}
            >
              {loading ? 'Adding...' : 'Add Player'}
            </motion.button>
          </form>
        </div>

        <div className="bg-white p-8 rounded-sm border border-slate-200 self-start">
          <div className="flex items-center mb-6 border-b border-slate-100 pb-4">
            <Inbox className="w-5 h-5 mr-3 text-red-600" />
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">Messages</h2>
          </div>
          
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {contactMessages.length === 0 ? (
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center py-8">No messages found.</p>
            ) : (
              contactMessages.map((msg: any) => (
                <div key={msg._id || msg.id} className="bg-slate-50 border border-slate-200 p-4 rounded-sm flex flex-col group">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tight">{msg.name}</h4>
                      <a href={`mailto:${msg.email}`} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-red-600 transition-colors">{msg.email}</a>
                    </div>
                    <button onClick={() => handleDeleteMessage(msg._id || msg.id)} className="text-slate-400 hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-slate-700 font-medium mt-2">{msg.message}</p>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-4 pt-2 border-t border-slate-200">
                    {msg.date ? new Date(msg.date).toLocaleDateString() : 'Unknown Date'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-sm border border-slate-200 self-start lg:col-span-2">
          <div className="flex items-center mb-6 border-b border-slate-100 pb-4">
            <Activity className="w-5 h-5 mr-3 text-red-600" />
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">User Activity Logs (Login & Registrations)</h2>
          </div>
          
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {auditLogs.length === 0 ? (
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center py-8">No activity logs found yet. Users logging in will appear here.</p>
            ) : (
              auditLogs.map((log: any) => (
                <div key={log._id || Math.random().toString()} className="bg-slate-50 border border-slate-200 p-3 rounded-sm flex justify-between items-center hover:bg-white hover:border-slate-300 transition-all">
                  <div className="flex items-center space-x-4">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${log.action.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {log.action}
                    </span>
                    <div className="text-sm font-bold text-slate-800">{log.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">{log.details}</div>
                    <div className="text-[9px] font-bold tracking-widest uppercase text-slate-400 mt-1">
                      {log.date ? new Date(log.date).toLocaleString() : 'Just now'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
