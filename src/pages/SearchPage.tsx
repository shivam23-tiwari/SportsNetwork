import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { searchGlobal } from '../services/api';
import NewsCard from '../components/NewsCard';
import PlayerCard from '../components/PlayerCard';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{players: any[], stadiums: any[], news: any[]}>({players: [], stadiums: [], news: []});
  const [loading, setLoading] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [location]);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm) {
      setResults({players: [], stadiums: [], news: []});
      return;
    }
    setLoading(true);
    try {
      const data = await searchGlobal(searchTerm);
      setResults(data);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    navigate(`/search?q=${encodeURIComponent(val)}`, { replace: true });
    // Implicit live search since we navigate which triggers useEffect, or we can just call it
    performSearch(val);
  };

  const hasResults = results.players.length > 0 || results.stadiums.length > 0 || results.news.length > 0;

  return (
    <div className="space-y-8 mt-4">
      <div className="bg-white p-6 rounded-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={query}
            onChange={handleSearchChange}
            placeholder="Search players, teams, news, or stadiums..."
            className="flex-1 px-4 py-4 bg-slate-50 border border-slate-200 rounded-sm focus:bg-white focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none transition-colors text-lg font-bold"
            autoFocus
          />
        </div>
      </div>

      {loading ? (
        <div className="flex h-40 justify-center items-center">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Players Results */}
          {results.players.length > 0 && (
            <section>
              <div className="p-4 mb-6 border-b border-slate-100 flex items-center bg-white rounded-sm border border-slate-200">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-600">Athletes Found</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {results.players.map((p: any) => (
                  <PlayerCard key={p.id} id={p.id} name={p.name} sport={p.sport} image={p.image} description={p.description || p.team} />
                ))}
              </div>
            </section>
          )}

          {/* Stadiums Results */}
          {results.stadiums.length > 0 && (
            <section>
              <div className="p-4 mb-6 border-b border-slate-100 flex items-center bg-white rounded-sm border border-slate-200">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-600">Stadiums Found</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.stadiums.map((stad: any) => (
                  <Link key={stad.id} to={`/stadium/${stad.id}`} className="group block">
                    <div className="bg-white border border-slate-200 rounded-sm overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow">
                      <div className="h-56 relative overflow-hidden bg-slate-900 border-b border-slate-200">
                        <img src={stad.image} alt={stad.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Stadium'; }} />
                        <div className="absolute top-2 left-2 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest rounded-sm">{stad.location}</div>
                      </div>
                      <div className="p-4 bg-white flex flex-col flex-grow">
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight group-hover:text-red-600 transition-colors">{stad.name}</h3>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Capacity: {stad.capacity}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* News Results */}
          {results.news.length > 0 && (
            <section>
              <div className="p-4 mb-6 border-b border-slate-100 flex items-center bg-white rounded-sm border border-slate-200">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-600">News Articles Found</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.news.map((item: any) => (
                  <NewsCard
                    key={item.id || item._id}
                    id={item.id || item._id}
                    title={item.title}
                    category={item.category}
                    image={item.image}
                    source={item.source}
                  />
                ))}
              </div>
            </section>
          )}

          {query && !loading && !hasResults && (
            <div className="text-center py-20 bg-white border border-slate-200 rounded-sm">
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-800">No Results Found</h2>
              <p className="text-slate-500 font-medium mt-2">Try searching for "Messi", "Lakers", or "Stadium".</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
