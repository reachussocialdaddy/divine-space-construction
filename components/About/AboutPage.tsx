import React from 'react';
import { Target, Eye, Heart, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageSectionContent } from '../../types';

interface AboutPageProps {
  pageContent?: PageSectionContent[];
}

interface CardData {
  icon: LucideIcon;
  title: string;
  content: string;
}

const AboutPage: React.FC<AboutPageProps> = ({ pageContent }) => {
  const heroContent = pageContent?.find(c => c.section_key === 'about_hero');
  const storyContent = pageContent?.find(c => c.section_key === 'about_story');

  const cards: CardData[] = [
    { icon: Target, title: 'Mission', content: 'To provide high-quality construction and design services that enhance the living standards of our clients through transparency and integrity.' },
    { icon: Eye, title: 'Vision', content: 'To be the most trusted and sought-after luxury construction partner in the Greater Toronto Area, recognized for our timeless quality.' },
    { icon: Heart, title: 'Values', content: 'Craftsmanship, Integrity, Responsibility, and Client Satisfaction are the pillars of every project we undertake at Divine Space.' },
  ];

  return (
    <div className="overflow-hidden">
      <section className="bg-royal-blue py-32 text-center text-white relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto px-4 relative z-10"
        >
          <h1 className="text-4xl md:text-7xl font-bold mb-8 uppercase tracking-tight">
            {heroContent?.title || 'Divine Space Construction Inc.'}
          </h1>
          <p className="text-xl md:text-2xl font-light text-white/80 max-w-3xl mx-auto leading-relaxed">
            {heroContent?.description || 'Your trusted partner in transforming living spaces across Toronto & GTA. We build luxury, we build trust.'}
          </p>
        </motion.div>
      </section>

      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
            <motion.div 
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
            >
              <div className="relative p-4">
                <div className="absolute inset-0 bg-royal-blue transform translate-x-4 translate-y-4"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800" 
                    alt="Construction Site" 
                    className="relative z-10 w-full h-[300px] md:h-[500px] object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                  />
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
            >
              <span className="text-royal-blue font-bold tracking-[0.3em] uppercase text-sm mb-4 block">
                {storyContent?.subtitle || 'Our Story'}
              </span>
              <h2 className="text-4xl font-bold text-royal-blue mb-8 uppercase tracking-tight">
                {storyContent?.title || 'Decades of Craftsmanship & Excellence'}
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
                {storyContent?.description ? (
                  <div className="whitespace-pre-line">{storyContent.description}</div>
                ) : (
                  <>
                    <p>
                      Founded on the principles of architectural integrity and modern engineering, Divine Space Construction has evolved into a premier boutique construction firm in the GTA.
                    </p>
                    <p>
                      From legal basement conversions to high-end modular kitchen installations, our team of licensed engineers and artisans work in harmony to deliver spaces that are as functional as they are beautiful.
                    </p>
                    <p>
                      We believe that a "Divine Space" is more than just four walls—it's a reflection of your legacy.
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2, duration: 0.6 }}
                  className="p-10 border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-2xl transition-all duration-500 group"
                >
                  <div className="w-16 h-16 bg-white flex items-center justify-center rounded-full mb-8 shadow-sm group-hover:bg-royal-blue group-hover:text-white transition-colors">
                    <Icon size={32} className="text-royal-blue group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold text-royal-blue mb-6 uppercase tracking-tight">{card.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-lg">
                    {card.content}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;