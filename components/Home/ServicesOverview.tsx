
import React from 'react';
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

  return (
    <section className="bg-brand-black py-20">
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

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {displayServices.slice(0, 4).map((service, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white group cursor-pointer overflow-hidden flex flex-col"
              onClick={() => navigateTo?.('Service', service.id)}
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={service.image_url} 
                  alt={service.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute bottom-0 right-0">
                  <div className="bg-royal-blue text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest flex items-center group-hover:bg-brand-black transition-colors">
                    Learn More
                  </div>
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-lg font-bold text-brand-black mb-4 leading-tight">
                  {service.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
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
