import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

interface PlayerCardProps {
  key?: React.Key;
  id: string;
  name: string;
  image: string;
  sport: string;
  description: string;
}

export default function PlayerCard({ id, name, image, sport, description }: PlayerCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="group bg-white border border-slate-200 rounded-sm overflow-hidden transition-all flex flex-col"
    >
      <Link to={`/player/${id}`} className="flex flex-col h-full">
        <div className="relative h-64 overflow-hidden bg-slate-900 shrink-0">
          <img
            src={image || 'https://via.placeholder.com/400x400?text=Player'}
            alt={name}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Player';
            }}
            className={`w-full h-full object-cover transition-all duration-500 hover:scale-105`}
            style={{ objectPosition: sport === 'nba' ? 'center 5%' : id === 'rahul-dravid' || id === 'ab-de-villiers' || id === 'pele' || id === 'cristiano-ronaldo' || id === 'lionel-messi' ? 'center 5%' : 'center 10%' }}
          />
        </div>
        <div className="p-4 flex flex-col flex-1 bg-white border-t border-slate-200">
           <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors uppercase tracking-tight leading-none mb-1">{name}</h3>
           <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{sport}</span>
        </div>
      </Link>
    </motion.div>
  );
}
