import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStadium } from '../services/api';
import { ArrowLeft, MapPin, Users } from 'lucide-react';
import { motion } from 'motion/react';

export default function StadiumDetail() {
  const { id } = useParams();
  const [stadium, setStadium] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStadiumData() {
      if (!id) return;
      try {
        const data = await getStadium(id);
        setStadium(data);
      } catch (err) {
        console.error('Failed to fetch stadium', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStadiumData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-64 justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!stadium) {
    return (
      <div className="text-center py-20 bg-white border border-slate-200 rounded-sm mt-8">
        <h2 className="text-xl font-black uppercase tracking-tight text-slate-800">Stadium Not Found</h2>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto mt-4">
      <Link to="/" className="inline-flex items-center text-red-600 hover:text-red-800 mb-6 text-xs font-bold uppercase tracking-widest">
        <ArrowLeft size={16} className="mr-2" />
        Back to Home
      </Link>

      <div className="bg-white rounded-sm overflow-hidden border border-slate-200">
        <div className="h-64 sm:h-96 w-full relative bg-slate-800">
          <img
            src={stadium.image}
            alt={stadium.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-4xl sm:text-6xl font-black text-white italic tracking-tight uppercase leading-tight">{stadium.name}</h1>
          </div>
        </div>

        <div className="p-8">
          <div className="flex flex-wrap gap-6 mb-8 border-b border-slate-100 pb-8">
            <div className="flex items-center text-slate-600">
              <MapPin size={20} className="mr-2 text-red-600" />
              <span className="text-sm font-bold uppercase tracking-widest">{stadium.location}</span>
            </div>
            <div className="flex items-center text-slate-600">
              <Users size={20} className="mr-2 text-red-600" />
              <span className="text-sm font-bold uppercase tracking-widest">Capacity: {stadium.capacity}</span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-100">About Stadium</h3>
            <p className="text-slate-700 leading-relaxed font-medium">
              {stadium.history}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-100">Home Teams</h3>
            <div className="flex flex-wrap gap-4">
              {stadium.teams.map((team: string, idx: number) => (
                <span key={idx} className="bg-slate-100 text-slate-800 text-xs font-bold px-4 py-2 uppercase tracking-widest rounded-sm">
                  {team}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
