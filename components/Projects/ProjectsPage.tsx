
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GalleryProject, PageSectionContent } from '../../types';

interface ProjectsPageProps {
  projects: GalleryProject[];
  pageContent?: PageSectionContent[];
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ projects, pageContent }) => {
  const [activeCategory, setActiveCategory] = useState<string>('KITCHEN RENOVATION');

  const heroContent = pageContent?.find(c => c.section_key === 'projects_hero');
  const introContent = pageContent?.find(c => c.section_key === 'projects_intro');
  const contactContent = pageContent?.find(c => c.section_key === 'projects_contact');

  // Premium residential construction and millwork categories matching our Google Drive portfolio
  const categories = [
    { label: 'KITCHEN', sub: 'RENOVATION' },
    { label: 'BATHROOM', sub: 'RENOVATION' },
    { label: 'WASHROOMS', sub: 'SPA DESIGN' },
    { label: 'LEGAL BASEMENTS', sub: 'PERMIT SUITES' },
    { label: 'CLOSETS', sub: 'CUSTOM STORAGE' },
    { label: 'BEDROOMS', sub: 'LUXURY SUITES' },
    { label: 'LOUNGE', sub: 'LIVING SPACES' },
    { label: 'BOOKSHELF', sub: 'CUSTOM MILLWORK' },
    { label: 'MIRROR WORK', sub: 'CREATIVE GLASS' },
    { label: 'STAIRS', sub: 'CUSTOM CARPENTRY' },
  ];

  const currentProject = projects.find(p => p.name.toUpperCase() === activeCategory) || 
                         projects.find(p => p.category.toUpperCase() === activeCategory.split(' ')[0]) ||
                         (projects.length > 0 ? projects[0] : null);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center grayscale brightness-50 blur-[2px]" 
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1920)' }}
        />
        <div className="absolute inset-0 bg-black/30" />
        <h1 className="relative z-10 text-white text-6xl md:text-8xl font-bold tracking-wider uppercase drop-shadow-2xl">
          {heroContent?.title || 'OUR PROJECTS'}
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Title Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#2c3e50] mb-4">
            {introContent?.title || 'View Our Premium Construction Projects'}
          </h2>
          <div className="w-48 h-1 bg-royal-blue mx-auto mb-8"></div>
          <p className="text-gray-500 max-w-4xl mx-auto leading-relaxed text-lg">
            {introContent?.description || 'From custom luxurious kitchens to finished permit-compliant legal basements, Divine Space delivers peerless high-end craftsmanship throughout Ontario. View samples of our premium work below.'}
          </p>
        </div>

        {/* Category Grid (Tabs) */}
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-1 mb-16">
          {categories.map((cat, idx) => {
            const fullLabel = `${cat.label} ${cat.sub}`;
            const isActive = activeCategory === fullLabel;
            return (
              <button
                key={idx}
                onClick={() => setActiveCategory(fullLabel)}
                className={`flex flex-col text-center p-4 transition-all h-full justify-center ${
                  isActive ? 'bg-royal-blue text-white' : 'bg-[#111111] text-white hover:bg-royal-blue/90'
                }`}
              >
                <div className="font-bold text-[11px] uppercase tracking-wider mb-1">
                  {cat.label}
                </div>
                <div className="text-[9px] opacity-75 uppercase leading-tight font-medium">
                  {cat.sub}
                </div>
              </button>
            );
          })}
        </div>

        {/* Gallery Section */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-[#34495e] uppercase tracking-wide">
            {activeCategory}
          </h3>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="wait">
            {currentProject && currentProject.images && currentProject.images.length > 0 ? (
              currentProject.images.map((img, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="relative group overflow-hidden bg-gray-100 rounded-sm shadow-md aspect-video"
                >
                  <img src={img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={`Project ${idx}`} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-gray-400 italic">
                No project images uploaded for this category yet.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Blue Fast Response Section */}
      <section className="bg-[#34495e] py-24 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url(https://www.transparenttextures.com/patterns/cubes.png)]" />
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            {contactContent?.title || 'Contact Us Now for a Fast Response'}
          </h2>
          <p className="text-xl opacity-80 mb-12 font-light">
            {contactContent?.subtitle || 'You have deadlines and your time is valuable.'}
          </p>
          <div className="space-y-4 mb-16">
            <p className="text-xl md:text-2xl font-bold text-[#f1c40f]">
              {contactContent?.description?.split('\n')[0] || "Our promise: We'll respond to you quickly to discuss your requirements."}
            </p>
            <p className="text-xl md:text-2xl font-bold">
              {contactContent?.description?.split('\n')[1] || "Contact us right now to get your project in motion."}
            </p>
          </div>
          <button className="px-12 py-5 border-2 border-white text-white font-bold tracking-widest uppercase hover:bg-white hover:text-[#34495e] transition-all transform hover:-translate-y-1">
            {contactContent?.button_text || 'CONTACT US NOW!'}
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;
