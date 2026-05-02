import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getNews } from '../services/api';
import { motion } from 'motion/react';
import { ArrowLeft, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function NewsDetail() {
  const { id } = useParams();
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const allNews = await getNews();
        const found = allNews.find((n: any) => (n.id || n._id) === id);
        setNews(found);
      } catch (error) {
        console.error('Failed to fetch news', error);
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

  if (!news) {
    return <div className="text-center py-20 text-xl font-bold">News not found</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto bg-white p-6 sm:p-10 rounded-sm border border-slate-200"
    >
      <Link to="/" className="inline-flex items-center text-red-600 hover:text-red-800 mb-8 text-xs font-bold uppercase tracking-widest">
        <ArrowLeft size={16} className="mr-2" />
        Back to Home
      </Link>

      <div className="mb-8 border-b border-slate-100 pb-8">
        <div className="flex items-center space-x-3 mb-4">
          <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest rounded-sm">
            {news.category}
          </span>
          <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{news.source}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-4 italic tracking-tight">
          {news.title}
        </h1>
        <div className="flex items-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
          <Clock size={12} className="mr-1" />
          <span>{news.date ? format(new Date(news.date), 'MMM d, yyyy h:mm a') : 'Just now'}</span>
        </div>
      </div>

      <div className="w-full bg-slate-100 rounded-sm mb-8 overflow-hidden shadow-sm flex justify-center">
        <img
          src={news.image || 'https://via.placeholder.com/1200x600?text=News'}
          alt={news.title}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1200x600?text=News';
          }}
          className="w-full object-contain max-h-[70vh] sm:max-h-[80vh]"
        />
      </div>

      <div className="max-w-none text-slate-700 leading-relaxed font-medium">
        {news.content.split('\n').map((paragraph: string, idx: number) => (
          <p key={idx} className="mb-6">{paragraph}</p>
        ))}
      </div>
    </motion.div>
  );
}
