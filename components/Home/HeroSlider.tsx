
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { View, HeroSlide } from '../../types';

interface HeroSliderProps {
  navigateTo: (view: View) => void;
  slides: HeroSlide[];
  onOpenQuote: () => void;
}

const DEFAULT_SLIDES = [
  {
    id: 'default-1',
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1920',
    title: 'We Built Beautifully with the Best Possible Materials',
    subtitle: 'Legal Basements | Renovations | Modular Kitchens | Custom Closets',
    button_text: 'Get Free Quote'
  }
];

const HeroSlider: React.FC<HeroSliderProps> = ({ navigateTo, slides, onOpenQuote }) => {
  const [current, setCurrent] = useState(0);
  const activeSlides = slides;

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeSlides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  if (activeSlides.length === 0) return null;

  return (
    <div className="relative h-[90vh] w-full overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/40 to-transparent z-10" />
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10 }}
            src={activeSlides[current].image_url} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 sm:px-12 lg:px-24 max-w-6xl">
            <motion.h1 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl sm:text-7xl lg:text-8xl text-white font-bold leading-[1.1] mb-8 drop-shadow-2xl"
            >
              {activeSlides[current].title}
            </motion.h1>
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl sm:text-2xl text-gray-200 mb-12 max-w-2xl font-light tracking-wide leading-relaxed border-l-4 border-royal-blue pl-6"
            >
              {activeSlides[current].subtitle}
            </motion.p>
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-wrap gap-6"
            >
              <button 
                onClick={onOpenQuote}
                className="px-10 py-5 bg-royal-blue text-white rounded-sm font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all transform hover:-translate-y-1 shadow-[0_15px_30px_rgba(227,30,36,0.3)]"
              >
                {activeSlides[current].button_text || 'Get Free Quote'}
              </button>
              <button 
                onClick={onOpenQuote}
                className="px-10 py-5 bg-white text-black rounded-sm font-bold tracking-widest uppercase hover:bg-royal-blue hover:text-white transition-all transform hover:-translate-y-1"
              >
                Request Consultation
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {activeSlides.length > 1 && (
        <div className="absolute bottom-12 right-12 z-30 flex items-center space-x-2">
          <button onClick={() => setCurrent((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)} className="p-4 border border-white/20 text-white hover:bg-royal-blue transition-all rounded-full"><ChevronLeft size={20} /></button>
          <button onClick={() => setCurrent((prev) => (prev + 1) % activeSlides.length)} className="p-4 border border-white/20 text-white hover:bg-royal-blue transition-all rounded-full"><ChevronRight size={20} /></button>
        </div>
      )}
    </div>
  );
};

export default HeroSlider;
