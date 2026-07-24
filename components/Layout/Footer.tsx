
import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { View, SiteSettings, Service } from '../../types.ts';
import { ADDRESS, Logo, FullLogo, SERVICES } from '../../constants.tsx';

// Updated FooterProps to include settings and fixed navigateTo signature to match App.tsx
interface FooterProps {
  navigateTo: (view: View, id?: string) => void;
  settings: SiteSettings;
  services: Service[];
}

const Footer: React.FC<FooterProps> = ({ navigateTo, settings, services }) => {
  return (
    <footer className="bg-royal-blue text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 pb-16 border-b border-white/10">
          <div className="space-y-6 md:col-span-6 lg:col-span-4">
            <div className="flex items-center space-x-3 mb-2">
              <FullLogo colorMode="footer" />
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              {settings.footer_description || 'Luxury construction firm specialized in transforming living spaces across Ontario. Professional, reliable, and high-end results.'}
            </p>
            <div className="flex space-x-4">
              {settings.facebook_url && <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors"><Facebook size={20} /></a>}
              {settings.instagram_url && <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors"><Instagram size={20} /></a>}
              {settings.linkedin_url && <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors"><Linkedin size={20} /></a>}
              {settings.twitter_url && <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-200 transition-colors"><Twitter size={20} /></a>}
              {settings.tiktok_url && (
                <a href={settings.tiktok_url} target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          <div className="md:col-span-6 lg:col-span-2">
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-white/60 text-sm">
              <li><button onClick={() => navigateTo('Home')} className="hover:text-white transition-colors text-left font-bold uppercase tracking-widest text-[10px]">Home</button></li>
              <li><button onClick={() => navigateTo('About')} className="hover:text-white transition-colors text-left font-bold uppercase tracking-widest text-[10px]">About Us</button></li>
              <li><button onClick={() => navigateTo('Process')} className="hover:text-white transition-colors text-left font-bold uppercase tracking-widest text-[10px]">Our Process</button></li>
              <li><button onClick={() => navigateTo('Projects')} className="hover:text-white transition-colors text-left font-bold uppercase tracking-widest text-[10px]">Our Projects</button></li>
              <li><button onClick={() => navigateTo('Clients')} className="hover:text-white transition-colors text-left font-bold uppercase tracking-widest text-[10px]">Our Clients</button></li>
              <li><button onClick={() => navigateTo('Contact')} className="hover:text-white transition-colors text-left font-bold uppercase tracking-widest text-[10px]">Contact Us</button></li>
              <li><button onClick={() => navigateTo('Products')} className="hover:text-white transition-colors text-left font-bold uppercase tracking-widest text-[10px]">Product Store</button></li>
            </ul>
          </div>

          <div className="md:col-span-6 lg:col-span-3">
            <h4 className="text-lg font-bold mb-6">Services</h4>
            <ul className="space-y-4 text-white/60 text-sm">
              {SERVICES.map((service) => (
                <li key={service.id}>
                  <button 
                    onClick={() => navigateTo('Service', service.id)} 
                    className="hover:text-white transition-colors text-left"
                  >
                    {service.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-6 lg:col-span-3">
            <h4 className="text-lg font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-white/60 text-sm">
              <li className="flex items-center space-x-3">
                <Phone size={16} className="text-white/40" />
                <span>{settings.phone || '+1 (647) 509-8304 / +1 (289) 946-2003'}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={16} className="text-white/40" />
                <span>{settings.email || 'info@divinespaceconstruction.com'}</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={16} className="text-white/40 mt-1" />
                <span>{settings.address || ADDRESS}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center text-white/40 text-[10px] font-bold uppercase tracking-widest">
          <p>
            © {new Date().getFullYear()} {settings.brand_name || 'Divine Space Construction Inc.'} All Rights Reserved. | Designed by{' '}
            <a href="https://socialdaddy.io" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline underline-offset-2">
              Social Daddy
            </a>
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <button onClick={() => navigateTo('Privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
            <button onClick={() => navigateTo('Terms')} className="hover:text-white transition-colors">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
