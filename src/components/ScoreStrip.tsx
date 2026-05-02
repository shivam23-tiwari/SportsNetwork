import { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, X, MapPin, Trophy, Activity } from 'lucide-react';

export default function ScoreStrip() {
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchFixtures() {
      try {
        const response = await fetch('/api/fixtures');
        if (response.ok) {
          const data = await response.json();
          const allMatches = [];
          
          // Combine all sports and categories (upcoming, completed)
          for (const sport in data) {
            if (data[sport].upcoming) {
              data[sport].upcoming.forEach((match: any) => {
                allMatches.push({ ...match, sport, status: match.status === 'Live' ? 'Live' : (match.time || match.status || 'Upcoming') });
              });
            }
            if (data[sport].completed) {
              data[sport].completed.forEach((match: any) => {
                allMatches.push({ ...match, sport, status: 'Final' });
              });
            }
          }
          if (allMatches.length > 0) {
              setFixtures(allMatches);
          }
        }
      } catch (err) {
        // Silently fail if server is unreachable (e.g. restarting)
        // console.error('Failed to fetch fixtures', err);
      }
    }
    
    fetchFixtures();
    const intervalId = setInterval(fetchFixtures, 30000); // Poll every 30 seconds
    return () => clearInterval(intervalId);
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (!fixtures.length) {
    return (
      <div className="h-16 bg-white border-b border-slate-300 flex items-center px-4 overflow-hidden shrink-0 hidden sm:flex">
         <div className="h-4 w-4 rounded-full border-2 border-red-600 border-t-transparent animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <>
    <div className="h-[88px] bg-slate-900 border-b border-slate-800 flex items-center pl-4 relative shrink-0 w-full z-10">
      <div className="border-r border-slate-700 pr-4 shrink-0 flex flex-col justify-center h-full">
        <span className="text-[10px] font-black text-white px-2 py-1 bg-red-600 uppercase tracking-widest rounded-sm mb-1">Live</span>
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Scores</span>
      </div>
      
      <button onClick={scrollLeft} className="z-10 h-full px-2 bg-slate-900 text-slate-400 hover:text-white flex items-center shrink-0 border-r border-slate-800">
        <ChevronLeft size={20} />
      </button>

      <div 
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto no-scrollbar items-center flex-grow h-full py-2 scroll-smooth ml-2 mr-2"
      >
        {fixtures.map((match, idx) => (
          <div key={`${match.id}-${idx}`} onClick={() => setSelectedMatch(match)} className="flex flex-col justify-between w-[220px] min-w-[220px] shrink-0 bg-slate-800 rounded-sm border border-slate-700 hover:bg-slate-700 hover:border-slate-500 transition-colors cursor-pointer p-2 h-full overflow-hidden">
            {match.race ? (
              // F1 Template
               <div className="flex flex-col h-full justify-center">
                  <div className="text-[9px] font-bold text-slate-400 uppercase mb-1">{match.sport} • {match.status}</div>
                  <div className="text-xs font-bold text-white truncate">{match.race}</div>
                  <div className="text-[10px] text-slate-300 truncate">{match.results ? match.results[0] : match.country}</div>
               </div>
            ) : (
              // Standard Team vs Team Template
              <div className="flex flex-col h-full justify-between overflow-hidden">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex justify-between gap-2 overflow-hidden items-center">
                  <div className="flex items-center gap-1 overflow-hidden truncate">
                    <span className="truncate">{match.sport}</span>
                    {match.venue && <span className="text-slate-500 truncate hidden sm:inline-block border-l border-slate-600 pl-1 ml-1">{match.venue}</span>}
                  </div>
                  {match.status === 'Final' ? <span className="text-slate-300 shrink-0">FT</span> : <span className="text-red-500 font-bold shrink-0 truncate flex items-center gap-1">{match.status === 'Live' ? <><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>LIVE</> : match.date || match.status}</span>}
                </div>
                
                <div className="flex items-center justify-between gap-2 overflow-hidden">
                  <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                    {match.logo1 ? (
                       <div className="w-5 h-5 shrink-0 bg-white rounded-sm flex flex-col items-center justify-center overflow-hidden">
                         <img src={match.logo1} alt={match.team1} className="w-full h-full object-contain" />
                       </div>
                    ) : (
                      <div className="w-5 h-5 rounded-sm bg-slate-600 flex items-center justify-center text-[8px] font-bold text-white shrink-0">T1</div>
                    )}
                    <span className="text-[11px] font-bold text-white truncate">{match.team1}</span>
                  </div>
                  <span className={`text-[11px] font-black shrink-0 text-right ${match.score1 ? 'text-white' : 'text-slate-500'}`}>
                    {match.score1 || (match.status === 'Upcoming' ? '-' : '0')}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-1 gap-2 overflow-hidden">
                  <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                    {match.logo2 ? (
                       <div className="w-5 h-5 shrink-0 bg-white rounded-sm flex flex-col items-center justify-center overflow-hidden">
                         <img src={match.logo2} alt={match.team2} className="w-full h-full object-contain" />
                       </div>
                    ) : (
                      <div className="w-5 h-5 rounded-sm bg-slate-600 flex items-center justify-center text-[8px] font-bold text-white shrink-0">T2</div>
                    )}
                    <span className="text-[11px] font-bold text-white truncate">{match.team2}</span>
                  </div>
                  <span className={`text-[11px] font-black shrink-0 text-right ${match.score2 ? 'text-white' : 'text-slate-500'}`}>
                    {match.score2 || (match.status === 'Upcoming' ? '-' : '0')}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={scrollRight} className="z-10 h-full px-2 bg-slate-900 text-slate-400 hover:text-white flex items-center border-l border-slate-800 shrink-0">
        <ChevronRight size={20} />
      </button>
    </div>

    {/* Match Details Modal */}
    {selectedMatch && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedMatch(null)}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden relative"
          onClick={e => e.stopPropagation()}
        >
          <button onClick={() => setSelectedMatch(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full p-1 z-10">
            <X size={20} />
          </button>
          
          <div className="bg-slate-900 text-white p-6 relative overflow-hidden">
             {selectedMatch.status === 'Live' && (
               <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-pulse" />
             )}
            <div className="flex justify-between items-center mb-6">
               <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{selectedMatch.sport}</span>
               <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-sm ${selectedMatch.status === 'Live' ? 'bg-red-600 text-white' : selectedMatch.status === 'Final' ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-300'}`}>
                 {selectedMatch.status === 'Live' ? 'Live Now' : selectedMatch.status === 'Final' ? 'Final Score' : selectedMatch.date || selectedMatch.status}
               </span>
            </div>

            {selectedMatch.race ? (
               <div className="text-center py-4">
                 <h2 className="text-2xl font-black mb-2">{selectedMatch.race}</h2>
                 <p className="text-slate-300">{selectedMatch.circuit}</p>
                 <p className="text-slate-400 text-sm mt-1">{selectedMatch.country}</p>
               </div>
            ) : (
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center flex-1">
                    {selectedMatch.logo1 ? (
                      <div className="w-16 h-16 bg-white rounded-full p-2 mb-2 flex items-center justify-center shadow-lg">
                        <img src={selectedMatch.logo1} alt={selectedMatch.team1} className="max-w-full max-h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-slate-800 rounded-full mb-2 border-2 border-slate-700 shadow-lg" />
                    )}
                    <span className="font-bold text-center text-sm">{selectedMatch.team1}</span>
                  </div>
                  
                  <div className="flex flex-col items-center flex-1 px-4">
                    <div className="text-4xl font-black tracking-tighter tabular-nums whitespace-nowrap">
                      {selectedMatch.score1 !== undefined ? selectedMatch.score1 : '-'} <span className="text-slate-600 font-normal mx-1">-</span> {selectedMatch.score2 !== undefined ? selectedMatch.score2 : '-'}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center flex-1">
                    {selectedMatch.logo2 ? (
                      <div className="w-16 h-16 bg-white rounded-full p-2 mb-2 flex items-center justify-center shadow-lg">
                        <img src={selectedMatch.logo2} alt={selectedMatch.team2} className="max-w-full max-h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-slate-800 rounded-full mb-2 border-2 border-slate-700 shadow-lg" />
                    )}
                    <span className="font-bold text-center text-sm">{selectedMatch.team2}</span>
                  </div>
                </div>
            )}
          </div>
          
          <div className="p-6 bg-slate-50 border-t border-slate-200">
            <div className="flex flex-col gap-4">
              {selectedMatch.venue && (
                <div className="flex items-start gap-3">
                  <div className="bg-slate-200 p-2 rounded-full text-slate-600 shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase">Venue</h4>
                    <p className="text-slate-900 font-medium">{selectedMatch.venue}</p>
                  </div>
                </div>
              )}
              {selectedMatch.status === 'Live' && (
                <div className="flex items-start gap-3">
                  <div className="bg-red-100 p-2 rounded-full text-red-600 shrink-0">
                    <Activity size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase">Match Status</h4>
                    <p className="text-slate-900 font-medium tracking-tight">Currently In Progress</p>
                  </div>
                </div>
              )}
               {selectedMatch.status === 'Final' && (
                <div className="flex items-start gap-3">
                  <div className="bg-slate-200 p-2 rounded-full text-slate-700 shrink-0">
                    <Trophy size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase">Match Status</h4>
                    <p className="text-slate-900 font-medium tracking-tight">Completed</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    )}
    </>
  );
}
