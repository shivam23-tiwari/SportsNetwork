import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, X } from 'lucide-react';

export default function TheBest() {
  const [selectedAthlete, setSelectedAthlete] = useState<any>(null);

  const top20Athletes = [
    { name: 'Lionel Messi', sport: 'Football', rank: 1, origin: 'Argentina', achievements: '8x Ballon d\'Or, World Cup Winner', image: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Lionel_Messi_WC2022.jpg' },
    { name: 'Michael Jordan', sport: 'Basketball', rank: 2, origin: 'USA', achievements: '6x NBA Champion, 5x MVP', image: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Michael_Jordan_in_2014.jpg' },
    { name: 'Muhammad Ali', sport: 'Boxing', rank: 3, origin: 'USA', achievements: '3x Heavyweight Champion', image: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Muhammad_Ali_1966.jpg' },
    { name: 'Serena Williams', sport: 'Tennis', rank: 4, origin: 'USA', achievements: '23x Grand Slam Champion', image: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Serena_Williams_at_2013_US_Open.jpg' },
    { name: 'Michael Phelps', sport: 'Swimming', rank: 5, origin: 'USA', achievements: '28 Olympic Medals (23 Gold)', image: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Michael_Phelps_Rio_Olympics_2016.jpg' },
    { name: 'Usain Bolt', sport: 'Track & Field', rank: 6, origin: 'Jamaica', achievements: '8x Olympic Gold, 100m & 200m Record', image: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Usain_Bolt_smiling_Berlin_2009.JPG' },
    { name: 'Cristiano Ronaldo', sport: 'Football', rank: 7, origin: 'Portugal', achievements: '5x Ballon d\'Or, All-time Top Scorer', image: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/President_Donald_Trump_meets_with_Cristiano_Ronaldo_in_the_Oval_Office_%2854933344262%29_%28cropped_and_rotated%29.jpg' },
    { name: 'Tom Brady', sport: 'Am. Football', rank: 8, origin: 'USA', achievements: '7x Super Bowl Champion, 3x MVP', image: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Tom_Brady_2017.JPG' },
    { name: 'Roger Federer', sport: 'Tennis', rank: 9, origin: 'Switzerland', achievements: '20x Grand Slam Champion', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Roger_Federer_2015_%28cropped%29.jpg/1280px-Roger_Federer_2015_%28cropped%29.jpg' },
    { name: 'Tiger Woods', sport: 'Golf', rank: 10, origin: 'USA', achievements: '15x Major Champion, 82 PGA Tour Wins', image: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/President_Donald_Trump_hosts_a_reception_honoring_Black_History_Month_%2854341713089%29_%28cropped%29.jpg' },
    { name: 'Wayne Gretzky', sport: 'Ice Hockey', rank: 11, origin: 'Canada', achievements: '4x Stanley Cup, All-time leading scorer', image: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Wayne_Gretzky_2006-02-18_Turin_001.jpg' },
    { name: 'Pelé', sport: 'Football', rank: 12, origin: 'Brazil', achievements: '3x World Cup Winner', image: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Pele_con_brasil_%28cropped%29.jpg' },
    { name: 'LeBron James', sport: 'Basketball', rank: 13, origin: 'USA', achievements: '4x NBA Champion, All-Time Leading Scorer', image: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/LeBron_James_%2851959977144%29_%28cropped2%29.jpg' },
    { name: 'Lewis Hamilton', sport: 'Formula 1', rank: 14, origin: 'UK', achievements: '7x World Champion, 105 Race Wins', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Prime_Minister_Keir_Starmer_meets_Sir_Lewis_Hamilton_%2854566928382%29_%28cropped%29.jpg/1280px-Prime_Minister_Keir_Starmer_meets_Sir_Lewis_Hamilton_%2854566928382%29_%28cropped%29.jpg' },
    { name: 'Rafael Nadal', sport: 'Tennis', rank: 15, origin: 'Spain', achievements: '22x Grand Slam Champion', image: 'https://upload.wikimedia.org/wikipedia/commons/7/71/Rafael_Nadal_en_2024_%28cropped%29.jpg' },
    { name: 'Novak Djokovic', sport: 'Tennis', rank: 16, origin: 'Serbia', achievements: '24x Grand Slam Champion', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Novak_Djokovic_2024_Paris_Olympics.jpg/1280px-Novak_Djokovic_2024_Paris_Olympics.jpg' },
    { name: 'Diego Maradona', sport: 'Football', rank: 17, origin: 'Argentina', achievements: 'World Cup Winner 1986', image: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Argentina_celebrando_copa_%28cropped%29.jpg' },
    { name: 'Martina Navratilova', sport: 'Tennis', rank: 18, origin: 'USA/Czech', achievements: '18x Grand Slam Singles, 31x Doubles', image: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Martina_Navratilova_Eastbourne_2011.jpg' },
    { name: 'Sachin Tendulkar', sport: 'Cricket', rank: 19, origin: 'India', achievements: 'World Cup Winner, 100 Int. Centuries', image: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Sachin_Tendulkar_at_MRF_Promotion_Event.jpg' },
    { name: 'Virat Kohli', sport: 'Cricket', rank: 20, origin: 'India', achievements: 'World Cup Winner, Most ODI Centuries', image: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Virat_Kohli_in_PMO_New_Delhi.jpg' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 mt-8 px-4">
      <div className="text-center pb-8 border-b border-slate-200">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-slate-900 mb-4 inline-flex items-center gap-4">
          <Trophy className="text-amber-500 w-10 h-10" /> 
          The Best (World Athletes)
          <Trophy className="text-amber-500 w-10 h-10" />
        </h1>
        <p className="text-slate-500 uppercase tracking-widest font-bold text-xs max-w-2xl mx-auto">
          The ultimate ranking of the 20 greatest athletes in human history across all fields
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {top20Athletes.map((athlete) => (
          <motion.div 
            key={athlete.rank}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedAthlete(athlete)}
            className="bg-white border rounded-sm overflow-hidden flex flex-col group relative cursor-pointer"
            style={{ 
              borderColor: athlete.rank <= 3 ? '#fbbf24' : '#e2e8f0',
              boxShadow: athlete.rank <= 3 ? '0 10px 15px -3px rgba(251, 191, 36, 0.2)' : 'none'
            }}
          >
            <div className="absolute top-3 left-3 bg-slate-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-black z-10">
              #{athlete.rank}
            </div>
            
            <div className="h-64 overflow-hidden bg-slate-50 flex items-center justify-center relative p-2 border-b border-slate-100">
               <img src={athlete.image} alt={athlete.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 rounded" />
            </div>
            
            <div className="p-5 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-black text-lg text-slate-800 uppercase tracking-tight">{athlete.name}</h3>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{athlete.sport} • {athlete.origin}</div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-1">Key Achievements</div>
                  <div className="font-bold text-sm text-slate-800 leading-snug">{athlete.achievements}</div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedAthlete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedAthlete(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedAthlete(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
              >
                <X size={16} />
              </button>
              
              <div className="h-64 sm:h-80 relative bg-slate-900 flex items-center justify-center">
                <img 
                  src={selectedAthlete.image} 
                  alt={selectedAthlete.name} 
                  className="w-full h-full object-contain opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-6 left-6 pr-6">
                  <div className="inline-block bg-amber-500 text-white text-xs font-black px-2 py-1 uppercase tracking-widest rounded mb-2">
                    Rank #{selectedAthlete.rank}
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-black text-white italic tracking-tight uppercase leading-tight mb-1">
                    {selectedAthlete.name}
                  </h2>
                  <p className="text-slate-300 font-bold tracking-widest text-sm uppercase">
                    {selectedAthlete.sport} • {selectedAthlete.origin}
                  </p>
                </div>
              </div>
              
              <div className="p-6 sm:p-8">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">Career & Achievements</h3>
                <p className="text-slate-800 text-lg font-medium leading-relaxed mb-6">
                  {selectedAthlete.name} is universally recognized as one of the greatest athletes to ever compete in {selectedAthlete.sport}. Originating from {selectedAthlete.origin}, their career is defined by historic feats and unparalleled dominance in their field.
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-md p-5 flex flex-col gap-3">
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 text-amber-600 p-2 rounded-full shrink-0">
                      <Trophy size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 uppercase tracking-widest mb-1">Major Honors</h4>
                      <p className="text-slate-600 font-medium">{selectedAthlete.achievements}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
