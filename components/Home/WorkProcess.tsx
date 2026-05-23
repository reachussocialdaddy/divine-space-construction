
import React from 'react';
import { motion } from 'framer-motion';
// Added PageSectionContent import
import { PageSectionContent } from '../../types';

// Defined WorkProcessProps to accept content passed from HomePage.tsx
interface WorkProcessProps {
  content?: PageSectionContent;
}

const WorkProcess: React.FC<WorkProcessProps> = ({ content }) => {
  const steps = [
    { number: '01', title: 'Design & Planning', description: 'Collaborating with you to understand your vision, requirements, and aesthetic preferences.', image: 'https://images.unsplash.com/photo-1503387762-592ded58c45a?auto=format&fit=crop&q=80&w=600' },
    { number: '02', title: 'Design Estimate', description: 'Providing a comprehensive cost breakdown and material selection to ensure budget alignment.', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600' },
    { number: '03', title: 'Build Phase', description: 'Executing the project with professional project management and top-tier craftsmanship.', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600' },
  ];

  return (
    <section className="py-24 bg-brand-black text-white overflow-hidden relative border-t border-white/5">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-royal-blue/5 skew-x-12 transform translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <span className="text-royal-blue font-bold tracking-widest text-sm uppercase mb-3 block">Roadmap</span>
          <h2 className="text-3xl md:text-5xl font-bold">{content?.title || 'Our Work Process'}</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="relative group"
            >
              <div className="text-8xl font-black text-white/5 absolute -top-8 -left-4 group-hover:text-royal-blue/20 transition-colors">
                {step.number}
              </div>
              <div className="relative pt-8">
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <div className="w-12 h-1 bg-royal-blue mb-6 group-hover:w-20 transition-all duration-500"></div>
                <div className="mb-6 h-48 overflow-hidden rounded-md opacity-80 group-hover:opacity-100 transition-opacity">
                  <img src={step.image} alt={step.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                </div>
                <p className="text-white/60 leading-relaxed text-sm">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkProcess;
