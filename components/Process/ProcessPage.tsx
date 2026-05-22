
import React from 'react';
import { motion } from 'framer-motion';
import { PageSectionContent } from '../../types';

interface ProcessPageProps {
  pageContent?: PageSectionContent[];
}

const steps = [
  {
    number: '01',
    title: 'Consultation',
    description: 'Understanding your vision and budget.',
    image: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?auto=format&fit=crop&q=80&w=800'
  },
  {
    number: '02',
    title: 'Design & Planning',
    description: 'Our team creates detailed designs and plans, collaborating with you to refine every aspect.',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800'
  },
  {
    number: '03',
    title: 'Material Selection',
    description: 'Choose from premium materials and finishes with guidance from our design experts.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800'
  },
  {
    number: '04',
    title: 'Construction',
    description: 'Our skilled craftsmen bring your vision to life with meticulous attention to detail.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800'
  },
  {
    number: '05',
    title: 'Final Walkthrough',
    description: 'We conduct a comprehensive inspection to ensure everything meets our high standards.',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800'
  }
];

const ProcessPage: React.FC<ProcessPageProps> = ({ pageContent }) => {
  const heroContent = pageContent?.find(c => c.section_key === 'process_hero');
  return (
    <div className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-royal-blue mb-4 uppercase tracking-tight"
          >
            {heroContent?.title || 'Our Process'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg font-light"
          >
            {heroContent?.description || 'Proven methodology for smooth project delivery.'}
          </motion.p>
        </div>

        {/* Steps */}
        <div className="space-y-32">
          {steps.map((step, index) => {
            const isEven = index % 2 === 1;
            return (
              <motion.div 
                key={step.number}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className={`flex flex-col ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 lg:gap-24`}
              >
                {/* Image side */}
                <div className="w-full md:w-1/2 relative">
                  <div className="absolute -top-4 -left-4 z-20 w-10 h-10 bg-royal-blue text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                    {step.number}
                  </div>
                  <div className="overflow-hidden rounded-2xl shadow-2xl">
                    <img 
                      src={step.image} 
                      alt={step.title} 
                      className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>

                {/* Content side */}
                <div className={`w-full md:w-1/2 text-left`}>
                  <h3 className="text-3xl md:text-4xl font-bold text-royal-blue mb-6">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-lg md:text-xl leading-relaxed max-w-lg">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProcessPage;
