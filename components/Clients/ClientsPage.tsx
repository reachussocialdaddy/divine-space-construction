
import React from 'react';
import { motion } from 'framer-motion';
import { Client } from '../../types';

interface ClientsPageProps {
  clients: Client[];
}

const ClientsPage: React.FC<ClientsPageProps> = ({ clients }) => {
  const categories = [
    'Bonded-Secured Sites & Distribution',
    'Education & Financial',
    'Health Care & High Rise Residential',
    'Hospitality & Food Service',
    'Infrastructure & Office Towers',
    'Power Distributors & Production Plants',
    'Third-Party Management'
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center grayscale brightness-50 blur-[2px]" 
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1920)' }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <h1 className="relative z-10 text-white text-6xl md:text-8xl font-bold tracking-wider uppercase drop-shadow-2xl">
          OUR CLIENTS
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        {categories.map((category, catIdx) => {
          const categoryClients = clients.filter(c => c.category === category);
          
          return (
            <div key={catIdx} className="mb-20">
              <h2 className="text-2xl font-bold text-[#34495e] mb-8 pb-2 border-b-2 border-[#f1c40f] inline-block">
                {category}
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {categoryClients.length > 0 ? (
                  categoryClients.map((client) => (
                    <motion.div
                      key={client.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="bg-white border border-gray-100 p-8 flex items-center justify-center h-40 shadow-sm hover:shadow-md transition-shadow rounded-sm"
                    >
                      <img 
                        src={client.logo_url} 
                        alt={client.name} 
                        className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-10 text-center text-gray-400 italic bg-gray-50 rounded-sm border border-dashed border-gray-200">
                    No clients added to this category yet.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Blue Fast Response Section (Same as Projects Page) */}
      <section className="bg-[#34495e] py-24 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url(https://www.transparenttextures.com/patterns/cubes.png)]" />
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Contact Us Now for a Fast Response</h2>
          <p className="text-xl opacity-80 mb-12 font-light">You have deadlines and your time is valuable.</p>
          <div className="space-y-4 mb-16">
            <p className="text-xl md:text-2xl font-bold text-[#f1c40f]">Our promise: We'll respond to you quickly to discuss your requirements.</p>
            <p className="text-xl md:text-2xl font-bold">Contact us right now to get your project in motion.</p>
          </div>
          <button className="px-12 py-5 border-2 border-white text-white font-bold tracking-widest uppercase hover:bg-white hover:text-[#34495e] transition-all transform hover:-translate-y-1">
            CONTACT US NOW!
          </button>
        </div>
      </section>
    </div>
  );
};

export default ClientsPage;
