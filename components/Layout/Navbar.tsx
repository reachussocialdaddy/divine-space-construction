
import React, { useState } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { View, SiteSettings, ProductCategory, ProductSubCategory, Service } from '../../types';
import { Logo } from '../../constants';

interface NavbarProps {
  currentView: View;
  selectedServiceId?: string | null;
  navigateTo: (view: View, id?: string) => void;
  settings: SiteSettings;
  categories: ProductCategory[];
  subCategories: ProductSubCategory[];
  services: Service[];
  onOpenQuote: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, selectedServiceId, navigateTo, settings, categories, subCategories, services, onOpenQuote }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const navItems = [
    { label: 'Home', view: 'Home' as View },
    { label: 'Our Process', view: 'Process' as View },
    { label: 'About Us', view: 'About' as View },
    { label: 'Contact', view: 'Contact' as View },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 mr-4 md:mr-8 lg:mr-12">
            <button 
              onClick={() => navigateTo('Home')}
              className="flex items-center space-x-2 md:space-x-4 group"
            >
              <div className={`${settings.logo_url ? 'h-10 md:h-14 w-auto' : ''} flex items-center justify-center transition-transform group-hover:scale-110`}>
                {settings.logo_url ? (
                  <img src={settings.logo_url} alt={settings.brand_name || "Logo"} className="h-full w-auto object-contain" />
                ) : (
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-royal-blue/10 rounded-sm flex items-center justify-center">
                    <Logo className="w-5 h-5 md:w-6 md:h-6 text-royal-blue" />
                  </div>
                )}
              </div>
              {!settings.logo_url && (
                <div className="flex flex-col text-left">
                  <span className="brand-font text-brand-black text-lg md:text-xl font-bold leading-none tracking-tight">
                    {settings.brand_name || 'DIVINE SPACE'}
                  </span>
                  <span className="text-[8px] md:text-[10px] tracking-[0.2em] font-bold text-gray-500 uppercase mt-0.5 md:mt-1">
                    {settings.brand_subtext || 'Construction Inc.'}
                  </span>
                </div>
              )}
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-4 lg:space-x-7">
            <button
              onClick={() => navigateTo('Home')}
              className={`text-[13px] font-bold tracking-wide transition-all whitespace-nowrap ${
                currentView === 'Home' ? 'text-royal-blue border-b-2 border-royal-blue pb-1' : 'text-gray-600 hover:text-royal-blue'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigateTo('Process')}
              className={`text-[13px] font-bold tracking-wide transition-all whitespace-nowrap ${
                currentView === 'Process' ? 'text-royal-blue border-b-2 border-royal-blue pb-1' : 'text-gray-600 hover:text-royal-blue'
              }`}
            >
              Our Process
            </button>

            {/* Services Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button
                className={`text-[13px] font-bold tracking-wide transition-all flex items-center whitespace-nowrap ${
                  currentView === 'Service' ? 'text-royal-blue border-b-2 border-royal-blue pb-1' : 'text-gray-600 hover:text-royal-blue'
                }`}
              >
                SERVICES <ChevronRight size={14} className={`ml-1 transition-transform ${isServicesOpen ? 'rotate-90' : ''}`} />
              </button>
              
              {isServicesOpen && services.length > 0 && (
                <div className="absolute top-full left-0 w-64 bg-white shadow-xl border border-gray-100 py-2 rounded-sm animate-in fade-in slide-in-from-top-2 duration-200">
                  {services.map((service) => (
                    <button 
                      key={service.id}
                      onClick={() => { navigateTo('Service', service.id); setIsServicesOpen(false); }}
                      className="w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors text-gray-600 hover:text-royal-blue"
                    >
                      {service.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Products Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setIsProductsOpen(true)}
              onMouseLeave={() => setIsProductsOpen(false)}
            >
              <button
                onClick={() => navigateTo('Products')}
                className={`text-[13px] font-bold tracking-wide transition-all flex items-center whitespace-nowrap ${
                  currentView === 'Products' ? 'text-royal-blue border-b-2 border-royal-blue pb-1' : 'text-gray-600 hover:text-royal-blue'
                }`}
              >
                PRODUCTS <ChevronRight size={14} className={`ml-1 transition-transform ${isProductsOpen ? 'rotate-90' : ''}`} />
              </button>
              
              {isProductsOpen && categories.length > 0 && (
                <div className="absolute top-full left-0 w-64 bg-white shadow-xl border border-gray-100 py-2 rounded-sm animate-in fade-in slide-in-from-top-2 duration-200">
                  {categories.map((cat) => {
                    const catSubCats = subCategories.filter(sc => sc.category_id === cat.id);
                    return (
                      <div key={cat.id} className="relative group/sub">
                        <button 
                          onClick={() => { navigateTo('Products', cat.name); setIsProductsOpen(false); }}
                          className="w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors text-gray-600 hover:text-royal-blue flex justify-between items-center group/item"
                        >
                          {cat.name}
                          {catSubCats.length > 0 && <ChevronRight size={12} className="opacity-50 group-hover/item:opacity-100 transition-opacity" />}
                        </button>
                        
                        {catSubCats.length > 0 && (
                          <div className="absolute left-full top-0 w-64 bg-white shadow-xl border border-gray-100 py-2 rounded-sm hidden group-hover/sub:block animate-in fade-in slide-in-from-left-2 duration-200">
                            {catSubCats.map(sub => (
                              <button
                                key={sub.id}
                                onClick={() => { navigateTo('Products', `sub:${sub.id}`); setIsProductsOpen(false); }}
                                className="w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors text-gray-500 hover:text-royal-blue"
                              >
                                {sub.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              onClick={() => navigateTo('Inverness')}
              className={`text-[13px] font-bold tracking-wide transition-all whitespace-nowrap ${
                currentView === 'Inverness' ? 'text-royal-blue border-b-2 border-royal-blue pb-1' : 'text-gray-600 hover:text-royal-blue'
              }`}
            >
              QUADS (3D VIEW) 🔥
            </button>

            <button
              onClick={() => navigateTo('About')}
              className={`text-[13px] font-bold tracking-wide transition-all whitespace-nowrap ${
                currentView === 'About' ? 'text-royal-blue border-b-2 border-royal-blue pb-1' : 'text-gray-600 hover:text-royal-blue'
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => navigateTo('Contact')}
              className={`text-[13px] font-bold tracking-wide transition-all whitespace-nowrap ${
                currentView === 'Contact' ? 'text-royal-blue border-b-2 border-royal-blue pb-1' : 'text-gray-600 hover:text-royal-blue'
              }`}
            >
              Contact
            </button>
            
            {/* Portfolio Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setIsPortfolioOpen(true)}
              onMouseLeave={() => setIsPortfolioOpen(false)}
            >
              <button
                className={`text-[13px] font-bold tracking-wide transition-all flex items-center whitespace-nowrap ${
                  (currentView === 'Projects' || currentView === 'Clients') ? 'text-royal-blue' : 'text-gray-600 hover:text-royal-blue'
                }`}
              >
                PORTFOLIO <ChevronRight size={14} className={`ml-1 transition-transform ${isPortfolioOpen ? 'rotate-90' : ''}`} />
              </button>
              
              {isPortfolioOpen && (
                <div className="absolute top-full left-0 w-48 bg-white shadow-xl border border-gray-100 py-2 rounded-sm animate-in fade-in slide-in-from-top-2 duration-200">
                  <button 
                    onClick={() => { navigateTo('Projects'); setIsPortfolioOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors ${currentView === 'Projects' ? 'text-royal-blue' : 'text-gray-600'}`}
                  >
                    Our Projects
                  </button>
                  <button 
                    onClick={() => { navigateTo('Clients'); setIsPortfolioOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors ${currentView === 'Clients' ? 'text-royal-blue' : 'text-gray-600'}`}
                  >
                    Our Clients
                  </button>
                </div>
              )}
            </div>

            <button 
              onClick={onOpenQuote}
              className="bg-royal-blue text-white px-5 py-2.5 rounded-sm text-[13px] font-bold shadow-lg hover:shadow-royal-blue/30 transition-all flex items-center whitespace-nowrap flex-shrink-0"
            >
              Get Free Quote <ChevronRight size={16} className="ml-1" />
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-royal-blue p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 py-6 px-4 space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => { navigateTo('Home'); setIsOpen(false); }} className={`flex flex-col items-center justify-center p-4 rounded-sm border ${currentView === 'Home' ? 'border-royal-blue bg-red-50 text-royal-blue' : 'border-gray-100 text-gray-700'}`}>
              <span className="text-xs font-bold uppercase tracking-widest">Home</span>
            </button>
            <button onClick={() => { navigateTo('Process'); setIsOpen(false); }} className={`flex flex-col items-center justify-center p-4 rounded-sm border ${currentView === 'Process' ? 'border-royal-blue bg-red-50 text-royal-blue' : 'border-gray-100 text-gray-700'}`}>
              <span className="text-xs font-bold uppercase tracking-widest">Process</span>
            </button>
            <button onClick={() => { navigateTo('Products'); setIsOpen(false); }} className={`flex flex-col items-center justify-center p-4 rounded-sm border ${currentView === 'Products' ? 'border-royal-blue bg-red-50 text-royal-blue' : 'border-gray-100 text-gray-700'}`}>
              <span className="text-xs font-bold uppercase tracking-widest">Products</span>
            </button>
            <button onClick={() => { navigateTo('Inverness'); setIsOpen(false); }} className={`flex flex-col items-center justify-center p-4 rounded-sm border ${currentView === 'Inverness' ? 'border-royal-blue bg-red-50 text-royal-blue' : 'border-gray-100 text-gray-700'}`}>
              <span className="text-xs font-bold uppercase tracking-widest">Quads (3D View)</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-50 pb-1">Our Services</p>
              <div className="grid grid-cols-1 gap-2">
                {services.map(service => (
                  <button 
                    key={service.id} 
                    onClick={() => { navigateTo('Service', service.id); setIsOpen(false); }} 
                    className={`block w-full text-left px-4 py-3 text-sm font-bold border-l-2 transition-all ${currentView === 'Service' && selectedServiceId === service.id ? 'border-royal-blue text-royal-blue bg-red-50' : 'border-transparent text-gray-600'}`}
                  >
                    {service.title}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-50 pb-1">Portfolio</p>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => { navigateTo('Projects'); setIsOpen(false); }} className={`text-left px-4 py-3 text-xs font-bold rounded-sm border ${currentView === 'Projects' ? 'border-royal-blue text-royal-blue bg-red-50' : 'border-gray-100 text-gray-600'}`}>
                  Projects
                </button>
                <button onClick={() => { navigateTo('Clients'); setIsOpen(false); }} className={`text-left px-4 py-3 text-xs font-bold rounded-sm border ${currentView === 'Clients' ? 'border-royal-blue text-royal-blue bg-red-50' : 'border-gray-100 text-gray-600'}`}>
                  Clients
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => { navigateTo('About'); setIsOpen(false); }} className={`text-left px-4 py-3 text-xs font-bold rounded-sm border ${currentView === 'About' ? 'border-royal-blue text-royal-blue bg-red-50' : 'border-gray-100 text-gray-600'}`}>
                About Us
              </button>
              <button onClick={() => { navigateTo('Contact'); setIsOpen(false); }} className={`text-left px-4 py-3 text-xs font-bold rounded-sm border ${currentView === 'Contact' ? 'border-royal-blue text-royal-blue bg-red-50' : 'border-gray-100 text-gray-600'}`}>
                Contact
              </button>
            </div>
          </div>
          
          <div className="pt-4">
            <button 
              onClick={() => { onOpenQuote(); setIsOpen(false); }}
              className="w-full bg-royal-blue text-white py-5 rounded-sm text-sm font-bold uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-transform"
            >
              Get Free Quote
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
