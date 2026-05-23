
import React, { useState } from 'react';
import { SERVICES } from '../../constants.tsx';
import { motion } from 'framer-motion';
import { View, PageSectionContent, Service } from '../../types';

interface ServicesOverviewProps {
  navigateTo?: (view: View, serviceId?: string) => void;
  content?: PageSectionContent;
  services?: Service[];
  onOpenQuote?: () => void;
}

const ServicesOverview: React.FC<ServicesOverviewProps> = ({ navigateTo, content, services = [], onOpenQuote }) => {
  const displayServices = services.length > 0 ? services : SERVICES;
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="services-section" className="bg-brand-black py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 uppercase tracking-tight">
            {content?.title || 'Your Premier Construction Partner in Toronto'}
          </h2>
          <div className="w-20 h-1 bg-royal-blue mx-auto mb-8"></div>
          <p className="text-gray-300 max-w-3xl mx-auto text-sm md:text-base leading-relaxed mb-4">
            {content?.subtitle || 'One of Toronto and the GTA\'s leading construction companies, Divine Space offers a complete range of design and construction services to meet your needs.'}
          </p>
          <p className="text-white text-sm font-bold mb-8">
            {content?.description || 'No need to pick and choose the construction service you require. We provide:'}
          </p>
          
          <button 
            onClick={onOpenQuote}
            className="bg-royal-blue text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-royal-blue transition-all duration-300 shadow-xl"
          >
            Request a Consultation
          </button>
        </motion.div>

        {/* Services Tab Layout */}
        <div className="flex flex-col md:flex-row gap-8 mb-16 max-w-5xl mx-auto">
          {/* Tabs list */}
          <div className="flex flex-col gap-2 md:w-1/3">
            {displayServices.map((service, index) => (
              <button 
                key={service.id} 
                onClick={() => setActiveTab(index)}
                className={`p-5 text-left font-bold uppercase tracking-widest text-xs border-l-4 transition-all duration-300 ${
                  activeTab === index 
                    ? 'border-royal-blue bg-white text-brand-black shadow-lg' 
                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-lg ${activeTab === index ? 'text-royal-blue' : 'text-gray-500'}`}>0{index + 1}</span>
                  {service.title}
                </div>
              </button>
            ))}
          </div>
          
          {/* Active Tab Content */}
          <div className="md:w-2/3 bg-white p-2 shadow-2xl relative group cursor-pointer h-[500px] flex flex-col" onClick={() => navigateTo?.('Service', displayServices[activeTab].id)}>
            <div className="relative flex-grow w-full overflow-hidden mb-4">
              <motion.img 
                key={activeTab}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                src={displayServices[activeTab].image_url} 
                alt={displayServices[activeTab].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6">
                 <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-md">{displayServices[activeTab].title}</h3>
                 <p className="text-gray-200 text-sm drop-shadow-md line-clamp-2 max-w-md">{displayServices[activeTab].description}</p>
              </div>
            </div>
            
            <div className="px-6 py-4 flex justify-between items-center border-t border-gray-100 bg-gray-50">
               <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Explore This Service</span>
               <div className="w-8 h-8 rounded-full bg-brand-black flex items-center justify-center group-hover:bg-royal-blue transition-colors">
                 <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                 </svg>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Call to Action Band */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#2c3e50] py-4 text-center cursor-pointer hover:bg-royal-blue transition-colors group shadow-2xl"
          onClick={() => navigateTo?.('About')}
        >
          <span className="text-white text-xs md:text-sm font-bold uppercase tracking-[0.2em]">
            Contact Us Now For A Fast Response
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesOverview;
