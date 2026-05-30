
import React, { useState, useEffect } from 'react';
import { Service, View, GalleryProject } from '../../types';
import { CheckCircle, ArrowRight, Home, Hammer, Layout, Bath, Layers, ChefHat, DoorOpen, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ServiceDetailProps {
  serviceId: string;
  navigateTo: (view: View, id?: string) => void;
  services: Service[];
  projects?: GalleryProject[];
  onOpenQuote: () => void;
}

const getIcon = (iconName?: string) => {
  switch (iconName) {
    case 'Home': return <Home size={24} />;
    case 'Hammer': return <Hammer size={24} />;
    case 'Layout': return <Layout size={24} />;
    case 'Bath': return <Bath size={24} />;
    case 'Layers': return <Layers size={24} />;
    case 'ChefHat': return <ChefHat size={24} />;
    case 'DoorOpen': return <DoorOpen size={24} />;
    case 'Building2': return <Building2 size={24} />;
    default: return <Home size={24} />;
  }
};

const ServiceDetail: React.FC<ServiceDetailProps> = ({ serviceId, navigateTo, services, projects = [], onOpenQuote }) => {
  const service = services.find(s => s.id === serviceId);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (service && service.images && service.images.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % service.images!.length);
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [service]);

  const serviceToProjectMap: Record<string, string> = {
    'home-renovation': 'LOUNGE LIVING SPACES',
    'modular-kitchen': 'KITCHEN RENOVATION',
    'legal-basements': 'LEGAL BASEMENTS PERMIT SUITES',
    'luxury-washrooms': 'BATHROOM RENOVATIONS',
    'custom-closets': 'CLOSETS CUSTOM STORAGE'
  };

  const relatedProjectName = serviceToProjectMap[serviceId];
  const relatedProject = projects.find(p => p.name === relatedProjectName);

  if (!service) return <div className="py-20 text-center">Service not found.</div>;

  return (
    <div className="animate-in fade-in duration-700">
      {/* Service Banner */}
      <section className="relative h-[60vh] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={service.image_url} alt={service.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-brand-black/60 backdrop-blur-[2px]"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            {service.title}
          </motion.h1>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3 }}
            className="w-24 h-1 bg-royal-blue mx-auto mb-6"
          ></motion.div>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-white/80 font-light max-w-2xl mx-auto"
          >
            Professional {service.title} across Toronto and the Greater Toronto Area.
          </motion.p>
        </div>
      </section>

      {/* Service Content */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-20">
            <div className="lg:w-2/3">
              <h2 className="text-3xl font-bold text-royal-blue mb-8">Premium Craftsmanship & Legality</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {service.long_description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {service.benefits && service.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-sm border border-gray-100">
                    <CheckCircle className="text-royal-blue mt-1 flex-shrink-0" size={18} />
                    <span className="font-semibold text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-royal-blue text-white rounded-sm shadow-xl">
                <h3 className="text-2xl font-bold mb-4">Start Your Transformation Today</h3>
                <p className="mb-8 opacity-80">Ready to build your Divine Space? Get a transparent cost breakdown and architectural consultation.</p>
                <button 
                  onClick={onOpenQuote}
                  className="px-10 py-4 bg-white text-royal-blue font-bold tracking-widest uppercase hover:bg-gray-100 transition-all flex items-center group"
                >
                  Book Free Consultation <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </button>
              </div>
            </div>

            <div className="lg:w-1/3 space-y-10">
              <div className="p-8 border border-gray-100 shadow-sm rounded-sm">
                <h4 className="text-xl font-bold text-royal-blue mb-6 border-b border-gray-50 pb-4">Our Services</h4>
                <ul className="space-y-4">
                  {services.map(s => (
                    <li key={s.id}>
                      <button 
                        onClick={() => navigateTo('Service' as View, s.id)}
                        className={`text-sm font-bold w-full text-left transition-colors ${s.id === serviceId ? 'text-royal-blue' : 'text-gray-400 hover:text-royal-blue'}`}
                      >
                        {s.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative overflow-hidden group rounded-sm">
                <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=600" alt="Consultation" className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-royal-blue/80 flex flex-col justify-center p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <h5 className="text-white font-bold text-xl mb-2">Speak with an Architect</h5>
                  <p className="text-white/80 text-sm mb-6">Discuss your site-specific requirements with our lead designer.</p>
                  <button className="text-white border border-white/40 py-2 font-bold uppercase tracking-widest text-xs">Call Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Gallery */}
      {service.images && service.images.length > 0 ? (
        <section className="py-24 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-royal-blue mb-2 text-center">Portfolio & Inspiration</h2>
            <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">Explore some of our recently completed {service.title.toLowerCase()} projects across the GTA.</p>
            
            <div className="relative w-full max-w-4xl mx-auto aspect-[16/9] rounded-sm overflow-hidden shadow-xl border border-gray-100">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={currentImageIndex}
                  src={service.images[currentImageIndex]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
            </div>
          </div>
        </section>
      ) : relatedProject && relatedProject.images && relatedProject.images.length > 0 && (
        <section className="py-24 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-royal-blue mb-2 text-center">Portfolio & Inspiration</h2>
            <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">Explore some of our recently completed {service.title.toLowerCase()} projects across the GTA.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProject.images.map((img, idx) => (
                <div key={idx} className="relative aspect-[4/3] rounded-sm overflow-hidden group shadow-sm border border-gray-100">
                  <img src={img} alt={`${service.title} Project ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-royal-blue/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ServiceDetail;
