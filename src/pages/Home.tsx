import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import { getNews, getPlayers } from '../services/api';
import { motion } from 'motion/react';
import { Zap, PlayCircle, Trophy, Star, TrendingUp, CalendarDays, ChevronRight } from 'lucide-react';

export default function Home() {
  const [news, setNews] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [newsData, playersData] = await Promise.all([
          getNews(),
          getPlayers()
        ]);
        setNews(newsData);
        setPlayers(playersData);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const featuredNews = news[0];
  const centerNews = news.slice(1, 4);
  const sideNews = news.slice(4, 9);
  
  const quickLinks = [
    { name: 'IPL 2024', sport: 'cricket', link: '/category/ipl' },
    { name: 'T20 World Cup', sport: 'cricket', link: '/category/cricket' },
    { name: 'NBA Playoffs', sport: 'nba', link: '/category/nba' },
    { name: 'Champions League', sport: 'football', link: '/category/football' },
    { name: 'Formula 1', sport: 'f1', link: '/category/f1' },
    { name: 'Premier League', sport: 'football', link: '/category/football' }
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Sidebar - Quick Links (Hidden on mobile/tablet) */}
        <div className="hidden lg:block lg:col-span-2 space-y-4">
          <div className="bg-white border text-left border-slate-200 rounded-sm">
            <div className="p-3 border-b border-slate-200 bg-slate-50">
               <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                 <Star size={14} className="text-red-600" />
                 Favorites
               </h2>
            </div>
            <div className="p-3 text-xs text-slate-500 font-medium">
               Sign in to save your favorite teams and leagues.
               <button className="mt-2 text-white bg-slate-800 px-3 py-1.5 rounded-sm font-bold text-[10px] uppercase tracking-wider w-full hover:bg-slate-700 transition">Log In</button>
            </div>
          </div>

          <div className="bg-white border text-left border-slate-200 rounded-sm">
            <div className="p-3 border-b border-slate-200 bg-slate-50">
               <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                 <TrendingUp size={14} className="text-red-600" />
                 Quick Links
               </h2>
            </div>
            <ul className="divide-y divide-slate-100">
               {quickLinks.map((link, idx) => (
                 <li key={idx}>
                   <Link to={link.link} className="flex items-center justify-between p-3 hover:bg-slate-50 transition group">
                      <span className="text-xs font-bold text-slate-700 group-hover:text-red-600 truncate">{link.name}</span>
                      <ChevronRight size={14} className="text-slate-300 group-hover:text-red-600" />
                   </Link>
                 </li>
               ))}
            </ul>
          </div>
        </div>

        {/* Center Column - Main News */}
        <div className="col-span-1 lg:col-span-7 space-y-4">
          {featuredNews && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-sm border border-slate-200 overflow-hidden shadow-sm group block hover:shadow-md transition-shadow relative cursor-pointer"
            >
              <Link to={`/news/${featuredNews.id || featuredNews._id}`} className="block relative">
                <div className="relative h-[300px] sm:h-[450px] overflow-hidden bg-slate-900 border-b border-slate-200">
                  <img
                    src={featuredNews.image || 'https://via.placeholder.com/800x600'}
                    alt={featuredNews.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                  
                  <div className="absolute bottom-4 left-4 right-4">
                     {featuredNews.category && (
                        <span className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-1 block">{featuredNews.category}</span>
                     )}
                    <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight mb-2 uppercase tracking-tight">{featuredNews.title}</h2>
                    <p className="text-slate-200 text-xs sm:text-sm line-clamp-2 max-w-2xl">{featuredNews.content}</p>
                    <div className="flex items-center gap-2 mt-3 text-[10px] font-bold text-slate-300 uppercase">
                      <span>{featuredNews.source}</span>
                      <span>•</span>
                      <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Under featured - Grid/List mixes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {centerNews.map((item, idx) => (
              <motion.div
                key={item.id || item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="bg-white border-b border-slate-200 sm:border sm:rounded-sm overflow-hidden flex flex-row sm:flex-col group"
              >
                <Link to={`/news/${item.id || item._id}`} className="flex sm:flex-col w-full h-full">
                  <div className="w-1/3 sm:w-full h-24 sm:h-36 shrink-0 relative overflow-hidden bg-slate-100 border-r sm:border-r-0 sm:border-b border-slate-200">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" style={{ objectPosition: item.title?.includes('Kohli') ? 'top center' : 'center' }} />
                  </div>
                  <div className="p-3 flex flex-col justify-between flex-grow">
                     <div>
                       <span className="text-[9px] font-black text-red-600 uppercase tracking-widest block mb-1">{item.category}</span>
                       <h3 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-slate-600 line-clamp-3 sm:line-clamp-2">{item.title}</h3>
                     </div>
                     <span className="text-[10px] text-slate-500 font-medium mt-2 hidden sm:block">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Sidebar - Top Headlines & Players */}
        <div className="col-span-1 lg:col-span-3 space-y-4">
          <div className="bg-white border border-slate-200 rounded-sm">
            <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
              <Zap size={14} className="text-red-600" />
              <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-800">Top Headlines</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {sideNews.map((item) => (
                <Link key={item.id || item._id} to={`/news/${item.id || item._id}`} className="group p-3 flex gap-3 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col justify-center flex-grow">
                    <h3 className="text-xs font-bold text-slate-800 leading-snug group-hover:text-red-600 transition-colors line-clamp-2">{item.title}</h3>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-1">{item.category} • {item.source}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-sm overflow-hidden">
            <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy size={14} className="text-yellow-600" />
                <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-800">Trending Athletes</h2>
              </div>
            </div>
            <div className="p-3 grid grid-cols-1 gap-2">
              {players.slice(0, 3).map((player) => (
                <Link key={player.id || player._id} to={`/player/${player.id || player._id}`} className="group flex items-center gap-3 p-2 hover:bg-slate-50 rounded-sm transition text-left border border-transparent hover:border-slate-100">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-200 group-hover:border-red-500 transition-colors bg-slate-100">
                    <img src={player.image} alt={player.name} className="w-full h-full object-cover" style={{ objectPosition: player.sport === 'nba' ? 'center 5%' : player.id === 'rahul-dravid' || player.id === 'ab-de-villiers' || player.id === 'pele' || player.id === 'cristiano-ronaldo' || player.id === 'lionel-messi' ? 'center 5%' : 'center 10%' }} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-red-600 transition-colors">{player.name}</h4>
                    <span className="text-[9px] uppercase font-bold text-slate-500">{player.team} • {player.sport}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
