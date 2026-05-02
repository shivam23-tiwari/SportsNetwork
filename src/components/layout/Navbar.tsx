import { Link } from 'react-router-dom';
import { Menu, Search, User, Trophy, Globe, MapPin } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Football', path: '/category/football' },
    { name: 'Cricket', path: '/category/cricket' },
    { name: 'NBA', path: '/category/nba' },
    { name: 'F1', path: '/category/f1' },
    { name: 'IPL', path: '/category/ipl' },
    { name: 'The Best', path: '/the-best' },
  ];

  return (
    <header className="bg-[#cc0000] text-white sticky top-0 z-50 shrink-0">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-4">
        <div className="flex justify-between items-center h-[60px]">
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md hover:bg-black/10 focus:outline-none"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Left section: Logo & Nav */}
          <div className="flex items-center h-full">
            <Link to="/" className="flex items-center h-full">
              <span className="text-3xl font-black tracking-tighter italic mr-8">
                SportsNetwork
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex h-full">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="h-full px-4 flex items-center hover:bg-black/10 font-bold uppercase tracking-wider text-[11px] transition-colors border-b-4 border-transparent hover:border-black"
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/map" className="h-full px-4 flex items-center hover:bg-black/10 transition-colors border-b-4 border-transparent hover:border-black">
                <MapPin size={16} className="text-white" />
              </Link>
            </nav>
          </div>

          {/* Right section: Search & User */}
          <div className="flex items-center h-full">
            <Link to="/search" className="h-full px-4 hover:bg-black/10 transition-colors flex items-center justify-center border-l border-white/20">
              <Search size={18} className="text-white" />
            </Link>
            <Link to="/login" className="h-full px-4 hover:bg-black/10 transition-colors flex items-center justify-center border-l border-white/20 text-[10px] font-bold uppercase tracking-widest gap-2">
              <User size={16} /> <span className="hidden sm:inline">Log In</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white text-slate-800 border-b border-slate-200 overflow-hidden shadow-lg absolute w-full"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-3 rounded-md text-sm font-bold hover:bg-slate-50 uppercase tracking-widest border-b border-slate-100 last:border-0"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/map"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-3 rounded-md text-sm font-bold flex items-center gap-2 hover:bg-slate-50 uppercase tracking-widest border-b border-slate-100"
              >
                <MapPin size={16} className="text-slate-500" /> Map
              </Link>
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-3 rounded-md text-sm font-bold hover:bg-slate-50 uppercase tracking-widest border-b border-slate-100"
              >
                User Login / Register
              </Link>
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-3 rounded-md text-sm font-bold hover:bg-slate-50 uppercase tracking-widest"
              >
                Admin Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
