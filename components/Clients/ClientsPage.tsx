import React from 'react';
import { motion } from 'framer-motion';
import { Client } from '../../types';

interface ClientsPageProps {
  clients: Client[];
}

const ClientsPage: React.FC<ClientsPageProps> = ({ clients }) => {
  // Updated categories to reflect the actual corporate and commercial segments of our new clients
  const categories = [
    'Retail & Luxury',
    'Healthcare & Wellness',
    'Creative & Corporate',
    'Logistics & Infrastructure'
  ];

  // Helper to render beautiful vector-designed client logos/badges if no logo_url is present or it fails
  const renderFallbackLogo = (name: string) => {
    // Generate initials
    const initials = name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    // Harmonic aesthetic colors based on name hashing
    const colors = [
      { bg: 'from-amber-500/10 to-yellow-600/5', border: 'border-amber-500/20', text: 'text-amber-600' },
      { bg: 'from-blue-600/10 to-indigo-700/5', border: 'border-blue-500/20', text: 'text-blue-600' },
      { bg: 'from-emerald-500/10 to-teal-600/5', border: 'border-emerald-500/20', text: 'text-emerald-600' },
      { bg: 'from-rose-500/10 to-red-600/5', border: 'border-rose-500/20', text: 'text-rose-600' },
    ];
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const theme = colors[hash % colors.length];

    return (
      <div className={`w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br ${theme.bg} border ${theme.border} rounded-sm transition-all duration-300 group-hover:scale-105`}>
        <div className="w-12 h-12 rounded-full border border-gray-200/50 bg-white shadow-sm flex items-center justify-center mb-3">
          <span className={`text-base font-black tracking-widest ${theme.text}`}>{initials}</span>
        </div>
        <span className="text-[11px] font-black uppercase tracking-[0.15em] text-brand-black text-center line-clamp-1 px-1">
          {name}
        </span>
        <span className="text-[7px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
          Partner Client
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-[450px] flex items-center justify-center overflow-hidden bg-brand-black">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 grayscale brightness-50" 
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1920)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent" />
        <div className="relative z-10 text-center px-4">
          <span className="text-royal-blue font-bold text-[10px] uppercase tracking-[0.5em] mb-4 block">Our Partners</span>
          <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tighter uppercase drop-shadow-2xl">
            OUR <span className="text-white/50 italic font-light">CLIENTS</span>
          </h1>
          <div className="w-16 h-1 bg-royal-blue mx-auto mt-6" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-24">
        {categories.map((category, catIdx) => {
          const categoryClients = clients.filter(c => c.category === category);
          
          return (
            <div key={catIdx} className="mb-20 last:mb-0">
              <div className="mb-10 flex items-center space-x-4">
                <h2 className="text-2xl font-bold text-brand-black uppercase tracking-tight">
                  {category}
                </h2>
                <div className="flex-grow h-[1px] bg-gray-100" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {categoryClients.length > 0 ? (
                  categoryClients.map((client) => (
                    <motion.div
                      key={client.id}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="group bg-white border border-gray-100 p-2 flex items-center justify-center h-44 shadow-sm hover:shadow-xl transition-all duration-300 rounded-sm relative overflow-hidden"
                    >
                      {/* Check if we have a real corporate logo URL, otherwise render typographic card */}
                      {client.logo_url && !client.logo_url.includes('unsplash.com') ? (
                        <img 
                          src={client.logo_url} 
                          alt={client.name} 
                          className="max-w-[80%] max-h-[80%] object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            // If the image fails to load, fallback to typographic badge
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              const fallbackContainer = document.createElement('div');
                              fallbackContainer.style.width = '100%';
                              fallbackContainer.style.height = '100%';
                              parent.appendChild(fallbackContainer);
                            }
                          }}
                        />
                      ) : (
                        renderFallbackLogo(client.name)
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs bg-gray-50/50 rounded-sm border border-dashed border-gray-200">
                    No clients added to this category yet.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Elegant Fast Response Section */}
      <section className="bg-brand-black py-24 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url(https://www.transparenttextures.com/patterns/cubes.png)]" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <span className="text-royal-blue font-bold text-[10px] uppercase tracking-[0.5em] mb-4 block">Let's Connect</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 uppercase tracking-tighter">Ready to Build Your Space?</h2>
          <p className="text-gray-400 text-lg mb-12 max-w-xl mx-auto font-light leading-relaxed">
            Your timeline is valuable. We pride ourselves on quick turnaround times, clear estimates, and premium execution.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => { window.history.pushState({}, '', '/Contact'); window.dispatchEvent(new PopStateEvent('popstate')); }}
              className="px-10 py-5 bg-royal-blue text-white rounded-sm font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all shadow-lg hover:-translate-y-1"
            >
              Get in Touch
            </button>
            <button 
              onClick={() => { window.history.pushState({}, '', '/Projects'); window.dispatchEvent(new PopStateEvent('popstate')); }}
              className="px-10 py-5 bg-white/10 text-white rounded-sm font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all hover:-translate-y-1 border border-white/10"
            >
              Browse Projects
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ClientsPage;
