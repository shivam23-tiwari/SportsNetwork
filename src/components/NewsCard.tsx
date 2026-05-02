import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

interface NewsCardProps {
  key?: React.Key;
  id: string;
  title: string;
  image: string;
  category: string;
  source: string;
}

export default function NewsCard({ id, title, image, category, source }: NewsCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="group relative flex flex-col bg-white border-b border-slate-200 pb-4 h-full"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-slate-100 mb-3 border border-slate-200">
        <img
          src={image || 'https://via.placeholder.com/800x600?text=News'}
          alt={title}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=News';
          }}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col flex-grow">
        <h3 className="text-[13px] sm:text-[15px] font-bold text-slate-900 leading-snug mb-1 group-hover:text-red-600 transition-colors">
          <Link to={`/news/${id}`}>
            {title}
          </Link>
        </h3>
        <div className="mt-auto pt-1">
          <span className="text-[10px] text-slate-500 font-bold tracking-wider">{source} • {category}</span>
        </div>
      </div>
    </motion.div>
  );
}
