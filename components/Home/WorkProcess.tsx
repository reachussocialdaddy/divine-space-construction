
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
    { number: '01', title: 'Define Design', description: 'Collaborating with you to understand your vision, requirements, and aesthetic preferences.' },
    { number: '02', title: 'Estimate Design', description: 'Providing a comprehensive cost breakdown and material selection to ensure budget alignment.' },
    { number: '03', title: 'Build Design', description: 'Executing the project with professional project management and top-tier craftsmanship.' },
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
          <h2 className="text-4xl md:text-5xl font-bold">{content?.title || 'Our Work Process'}</h2>
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
                <p className="text-white/60 leading-relaxed text-lg">
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
