import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPlayer } from '../services/api';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

export default function PlayerDetail() {
  const { id } = useParams();
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        const data = await getPlayer(id);
        setPlayer(data);
      } catch (error) {
        console.error('Failed to fetch player', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[60vh] justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!player) {
    return <div className="text-center py-20 text-xl font-bold">Player not found</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      <Link to={`/${player.sport}`} className="inline-flex items-center text-red-600 hover:text-red-800 mb-6 text-xs font-bold uppercase tracking-widest">
        <ArrowLeft size={16} className="mr-2" />
        Back to {player.sport}
      </Link>

      <div className="bg-white rounded-sm overflow-hidden border border-slate-200">
        <div className="h-80 sm:h-96 w-full relative bg-slate-900">
          <img
            src={player.image || 'https://via.placeholder.com/800x800?text=Player'}
            alt={player.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x800?text=Player';
            }}
            className="w-full h-full object-cover opacity-90"
            style={{ objectPosition: player.sport === 'nba' ? 'center 5%' : player.id === 'rahul-dravid' || player.id === 'ab-de-villiers' || player.id === 'pele' || player.id === 'cristiano-ronaldo' || player.id === 'lionel-messi' ? 'center 5%' : 'center 10%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <span className="bg-red-600 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest mb-3 inline-block">
              {player.sport}
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-white italic tracking-tight uppercase leading-tight">{player.name}</h1>
          </div>
        </div>
        <div className="p-8">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">About Player</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 bg-slate-50 p-4 rounded-sm border border-slate-200">
            {player.born && (
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Born</div>
                <div className="font-bold text-slate-800 text-sm mt-1">{player.born}</div>
              </div>
            )}
            {player.nationality && (
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Nationality</div>
                <div className="font-bold text-slate-800 text-sm mt-1">{player.nationality}</div>
              </div>
            )}
            {player.team && (
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Current Team</div>
                <div className="font-bold text-slate-800 text-sm mt-1">{player.team}</div>
              </div>
            )}
            {player.position && (
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Position</div>
                <div className="font-bold text-slate-800 text-sm mt-1">{player.position}</div>
              </div>
            )}
            {player.netWorth && (
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Net Worth</div>
                <div className="font-bold text-slate-800 text-sm mt-1">{player.netWorth}</div>
              </div>
            )}
            {player.previousTeams && (
              <div className="col-span-2 sm:col-span-3">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Previous Teams</div>
                <div className="font-bold text-slate-800 text-sm mt-1">{player.previousTeams}</div>
              </div>
            )}
          </div>

          <p className="text-slate-700 leading-relaxed whitespace-pre-line font-medium mb-8">
            {player.description}
          </p>

          {player.stats && player.stats.length > 0 && (
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">Career Stats</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {player.stats.map((stat: any, idx: number) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-sm flex flex-col items-center justify-center text-center">
                    <div className="text-3xl font-black text-white tracking-tighter mb-1">{stat.value}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
