import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-200 border-t border-slate-300 py-6 mt-auto shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between text-[10px] sm:text-xs text-slate-500 font-bold space-y-4 md:space-y-0">
        <div className="flex flex-wrap justify-center gap-6 uppercase tracking-widest">
          <Link to="/search?q=stadium" className="hover:text-slate-800 transition-colors">About Stadiums</Link>
          <Link to="/contact" className="hover:text-slate-800 transition-colors">Contact</Link>
          <Link to="/terms" className="hover:text-slate-800 transition-colors">Terms of Service</Link>
        </div>
        <div className="uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Stadium Sports Network
        </div>
      </div>
    </footer>
  );
}
