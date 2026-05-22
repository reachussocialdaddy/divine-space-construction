import React from 'react';
import { motion } from 'framer-motion';

const NaturalSelection: React.FC = () => {
  return (
    <section className="py-24 bg-white overflow-hidden relative border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2"
          >
            <span className="text-royal-blue font-bold tracking-widest text-[10px] uppercase mb-4 block">Natural Selection</span>
            <h2 className="text-3xl md:text-5xl font-bold text-brand-black mb-6 uppercase tracking-tighter leading-tight">
              See Your Design Before We Build
            </h2>
            <div className="w-16 h-1 bg-royal-blue mb-8" />
            <p className="text-gray-500 text-lg md:text-xl leading-relaxed mb-8 font-light">
              Experience the future of space planning. Gather around our design island with our experts to explore full 3D visualizations of your project. Select from our premium natural materials and watch your dream space come to life in real-time.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="absolute inset-0 bg-royal-blue/10 transform translate-x-4 translate-y-4 rounded-sm"></div>
            <div className="relative z-10 overflow-hidden rounded-sm shadow-2xl group">
              <img 
                src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&q=80&w=1200" 
                alt="People standing on island seeing 3D designs" 
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default NaturalSelection;
