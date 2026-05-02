import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Real_Madrid_C.F._the_Winner_Of_The_Champions_League_in_2018_%281%29.jpg',
    title: 'THE FINAL SHOWDOWN',
    subtitle: 'Real Madrid reaches the Champions League climax',
  },
  {
    id: 2,
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Real_Madrid_C.F._the_Winner_Of_The_Champions_League_in_2018_%281%29.jpg',
    title: 'F1 WORLD CHAMPIONSHIP',
    subtitle: 'Verstappen powers to victory on the track',
  },
  {
    id: 3,
    image: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/2015_CWC_I_v_UAE_02-28_India_celebrates.jpg',
    title: 'WORLD CUP FEVER',
    subtitle: 'Team India celebrates a massive victory on their way to the finals',
  }
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative h-[60vh] w-full overflow-hidden rounded-md bg-slate-800">
      <AnimatePresence mode="wait">
        <motion.div
           key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 w-full max-w-3xl">
            <span className="bg-red-600 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest mb-3 inline-block">
              TOP STORY
            </span>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-2 uppercase tracking-tight italic"
            >
              {slides[current].title}
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-slate-300 text-sm md:text-base max-w-xl"
            >
              {slides[current].subtitle}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-6 right-6 z-30 flex space-x-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-12 h-1 rounded-full transition-colors ${
              idx === current ? 'bg-red-600' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
