import React from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Tag, 
  Home, 
  Hammer, 
  Layout, 
  Bath, 
  Layers 
} from 'lucide-react';
import { Product, ProjectPin, FAQ, Service, Client, GalleryProject } from './types';

export const COLORS = {
  brandRed: '#E31E24',
  brandBlack: '#111111',
  white: '#FFFFFF',
};

export const Logo = ({ className = "w-12 h-12", colorMode = 'default' }: { className?: string; colorMode?: 'default' | 'white' }) => {
  const fillDark = colorMode === 'white' ? '#FFFFFF' : '#111111';
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M50 5 L11 27.5 L25 51 L50 36 Z" fill="#E31E24" />
      <path d="M50 5 L89 27.5 L89 51 L50 36 Z" fill={fillDark} />
      <path d="M50 95 L11 72.5 L11 49 L50 64 Z" fill={fillDark} />
      <path d="M50 95 L89 72.5 L75 49 L50 64 Z" fill="#E31E24" />
      <path d="M11 27.5 L11 72.5 L25 51 L25 40 Z" fill={fillDark} />
      <path d="M89 27.5 L89 72.5 L75 49 L75 40 Z" fill={fillDark} />
    </svg>
  );
};

export const FullLogo = ({ className = "", colorMode = 'default' }: { className?: string; colorMode?: 'default' | 'white' }) => {
  const isWhite = colorMode === 'white';
  return (
    <div className={`flex items-center space-x-2 sm:space-x-4 ${className}`}>
      <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
        <Logo className="w-full h-full" colorMode={colorMode} />
      </div>
      <div className="flex flex-col justify-center text-left leading-none">
        <span className={`text-[9px] sm:text-[11px] font-bold ${isWhite ? 'text-white' : 'text-brand-black'} uppercase tracking-widest leading-none`}>
          Divine Space Construction Inc.
        </span>
        <span className={`text-2xl sm:text-3xl font-bold ${isWhite ? 'text-white' : 'text-brand-red'} uppercase tracking-tight leading-none mt-1`} style={{ fontFamily: 'Georgia, serif' }}>
          DIVINE SPACE
        </span>
        <span className={`text-[11px] sm:text-[13px] font-bold ${isWhite ? 'text-white' : 'text-brand-black'} uppercase tracking-widest leading-none mt-1.5`} style={{ fontFamily: 'Georgia, serif' }}>
          KITCHENS & RENOVATIONS
        </span>
        <div className="flex items-center mt-1.5 justify-center sm:justify-start">
          <div className={`w-3 sm:w-6 h-[1px] ${isWhite ? 'bg-white' : 'bg-brand-red'}`}></div>
          <span className={`text-[8px] sm:text-[9px] font-bold ${isWhite ? 'text-white' : 'text-brand-red'} uppercase tracking-[0.2em] mx-2 leading-none`}>
            WE BUILD DREAMS
          </span>
          <div className={`w-3 sm:w-6 h-[1px] ${isWhite ? 'bg-white' : 'bg-brand-red'}`}></div>
        </div>
      </div>
    </div>
  );
};

export const ADDRESS = "10 Bramhurst Ave, Unit 10, Brampton, ON L6T 5H1";

// 5 exact services lined up in the correct sequence as requested
export const SERVICES: Service[] = [
  { 
    id: 'home-renovation', 
    title: 'Home Renovation', 
    icon: <Hammer size={24} />, 
    description: 'Luxurious whole house updates and high-end architectural renovations.',
    long_description: 'Transform your existing property into a premium living experience. From master bedroom updates and open-concept structural walls to electrical, custom plaster moldings, and flooring installations, we manage the entire home renovation journey with flawless craft.',
    benefits: ['Full Permit & Architectural Designs', 'High-End Custom Carpentry', 'Sleek Flooring & Wall Coverings', 'Modern Smart Home Integrations', 'Strict Compliance to Ontario Building Codes'],
    image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200'
  },
  { 
    id: 'modular-kitchen', 
    title: 'Modular Kitchen', 
    icon: <Layout size={24} />, 
    description: 'Sleek, Italian-inspired kitchen cabinet designs and islands.',
    long_description: 'We build custom, high-end modular kitchens that pair Italian aesthetic styling with daily functional utility. Incorporating premium wood finishes, high-gloss UV panels, and elegant quartz countertops, our kitchens are masterpieces engineered to last.',
    benefits: ['German Soft-Close Hinges & Tracks', 'Sleek Under-Cabinet Lighting', 'Innovative Corner Pullouts & Spices', 'Premium Heat-Resistant Counters', 'Custom Hidden Appliance Integration'],
    image_url: 'https://images.unsplash.com/photo-1556910103-1c02745a872f?auto=format&fit=crop&q=80&w=1200'
  },
  { 
    id: 'legal-basements', 
    title: 'Legal Basement', 
    icon: <Home size={24} />, 
    description: 'Compliant legal secondary suites finished with city-registered permits.',
    long_description: 'Turn your basement space into a beautifully finished, legal, income-generating unit. Our permit-compliant basements cover complete municipal zoning approvals, egress window systems, fire-rated insulation separations, separate kitchen lines, and HVAC balancing.',
    benefits: ['100% City Permit Guarantee', 'Complete Fire-Rated Drywalls', 'Dedicated Separate Entrances', 'HVAC Integration & Heating Comfort', 'Plumbing & Laundry Solutions'],
    image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200'
  },
  { 
    id: 'luxury-washrooms', 
    title: 'Luxury Washrooms', 
    icon: <Bath size={24} />, 
    description: 'Spa-inspired luxury bathrooms and premium walk-in showers.',
    long_description: 'Indulge in a boutique hotel bathroom experience inside your home. We custom build walk-in rain showers with linear floor drains, freestanding tubs, smart toilets, floating quartz vanities, custom tiling patterns, and heated floor systems.',
    benefits: ['Custom Frameless Glass Showers', 'Premium Heated Tile Floors', 'Elegant Floating Quartz Vanities', 'High-End Schluter Waterproofing', 'Atmospheric Dimming Controls'],
    image_url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200'
  },
  { 
    id: 'custom-closets', 
    title: 'Custom Closets', 
    icon: <Layers size={24} />, 
    description: 'Bespoke walk-in wardrobe storage organizers and vanity tables.',
    long_description: 'Create an organized sanctuary for your personal wardrobe. Our bespoke closets feature built-in LED track lightning, luxurious velvet drawer liners, premium shoe racks, tie and accessory pullouts, and full-length vanity mirror cabinets.',
    benefits: ['Full Closet Space Optimization', 'Built-In Warm LED Backlights', 'Soft-Close Accessory Drawers', 'Elegant Glass-Front Wardrobes', 'Premium Solid Hardwood Finishes'],
    image_url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=1200'
  },
];

export const TRUST_INDICATORS = [
  { label: 'Licensed & Insured', icon: <ShieldCheck className="text-royal-blue" /> },
  { label: 'GTA & Toronto Projects', icon: <MapPin className="text-royal-blue" /> },
  { label: 'On-Time Delivery', icon: <Clock className="text-royal-blue" /> },
  { label: 'Transparent Pricing', icon: <Tag className="text-royal-blue" /> },
];

export const MOCK_FAQS: FAQ[] = [
  { id: '1', question: 'What is the estimated cost of a legal basement?', answer: 'Costs vary based on size, finishes, and existing conditions. We offer free consultations to provide a tailored estimate.' },
  { id: '2', question: 'Are permits required for my project?', answer: 'Yes, legal basement conversions and major renovations typically require city permits, which we handle on your behalf.' },
  { id: '3', question: 'How long does a typical renovation take?', answer: 'Most projects range from 6-12 weeks, depending on complexity and material lead times.' },
  { id: '4', question: 'What kind of warranty and support do you offer?', answer: 'We provide a comprehensive warranty on all craftsmanship and materials, ensuring peace of mind post-completion.' }
];

export const MOCK_PRODUCTS: Product[] = [
  // Quartz slab products branded under "Vida"
  { id: 'q1', name: 'Vida Calacatta Gold Quartz', category: 'Quartz', price: '120.00', image: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&q=80&w=1200', description: 'Exquisite white quartz slab featuring deep, dramatic gold and grey veining for luxury countertops.', brand: 'Vida Company' },
  { id: 'q2', name: 'Vida Statuary White Quartz', category: 'Quartz', price: '110.00', image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200', description: 'Premium bright white quartz surface with elegant, misty grey patterns.', brand: 'Vida Company' },
  { id: 'q3', name: 'Vida Nero Marquina Quartz', category: 'Quartz', price: '130.00', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200', description: 'Sleek obsidian black quartz slab accented by striking, sharp white calcite veins.', brand: 'Vida Company' },
  { id: 'q4', name: 'Vida Concrete Grey Quartz', category: 'Quartz', price: '95.00', image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&q=80&w=1200', description: 'Modern concrete-textured grey quartz offering a refined industrial look.', brand: 'Vida Company' },

  // Handles & Pulls rebranded under "Smart Hardware"
  { id: 'v1', name: 'Vida Luxe Gold Handle', category: 'Smart Hardware', price: '32.00', image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800', description: 'A premium satin brass handle from Vida Company featuring unique ridge texturing for a sophisticated tactile experience.', brand: 'Vida Company' },
  { id: 'v2', name: 'Vida Elite Satin Pull', category: 'Smart Hardware', price: '29.50', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800', description: 'Graceful satin chrome handpull built by Vida Company, ideal for luxury kitchen cabinetry panels.', brand: 'Vida Company' },
  { id: 'v3', name: 'Vida Matte Obsidian Bar', category: 'Smart Hardware', price: '35.00', image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&q=80&w=800', description: 'Stunning black obsidian designer pull bar by Vida Company for high-end minimalist aesthetics.', brand: 'Vida Company' },
  { id: 'v4', name: 'Vida Smart Finger-Pull', category: 'Smart Hardware', price: '42.00', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800', description: 'Vida Company modern edge-integrated handle providing a completely clean cabinet profile face.', brand: 'Vida Company' },

  // Kitchen organizer accessories under "Kitchen" category
  { id: 'k1', name: 'Corner Unit Magic-Pullout', category: 'kitchen', price: '340.00', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=800', description: 'Maximize blind corner cabinet spaces. Features heavy-duty racks that pull out completely for effortless access.' },
  { id: 'k2', name: 'Cutlery Organizer Tray', category: 'kitchen', price: '85.00', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800', description: 'Fully adjustable solid oak drawer partitions to custom organize knives, forks, spoons, and cooking utensils.' },
  { id: 'k3', name: 'Pull-Down Pantry Tray', category: 'kitchen', price: '195.00', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800', description: 'Reach high shelves easily with a hydraulic-assisted steel wire pull-down shelf tray for cupboards.' },
  { id: 'k4', name: 'Rotating Pantry Unit', category: 'kitchen', price: '210.00', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800', description: 'Rotating tall pantry unit to make the most out of your kitchen storage.' },

  // Front Elevation & Smart Hardware
  { id: 'ss101', name: 'SS101-CONCRETE GRAIN', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/05/SS101-CONCRETE-GRAIN.jpg', description: 'Premium synchronize sheet in Concrete Grain finish.' },
  { id: 'ss102', name: 'SS102-EUROPEAN GRAIN', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/05/SS102-EUROPEAN-GRAIN.jpg', description: 'Premium synchronize sheet in European Grain finish.' },
  { id: 'ss103', name: 'SS103-MACKENZIE GRAIN', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/05/SS103-MACKENZIE-GRAIN.jpg', description: 'Premium synchronize sheet in Mackenzie Grain finish.' },
  { id: 'ss104', name: 'SS104-HARBOUR GRAIN', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/05/SS104-HARBOUR-GRAIN.jpg', description: 'Premium synchronize sheet in Harbour Grain finish.' },
  { id: 'ss105', name: 'SS105-SAVONA GRAIN', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/05/SS105-SAVONA-GRAIN.jpg', description: 'Premium synchronize sheet in Savona Grain finish.' },
  { id: 'ss106', name: 'SS106-LAFARGE GRAIN', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/05/SS106-LAFARGE-GRAIN.jpg', description: 'Premium synchronize sheet in Lafarge Grain finish.' },
  { id: 'ss107', name: 'SS107-ASHCRAFT GRAIN', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/05/SS107-ASHCRAFT-GRAIN.jpg', description: 'Premium synchronize sheet in Ashcraft Grain finish.' },
  { id: 'ss108', name: 'SS108-LOGAN GRAIN', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/05/SS108-LOGAN-GRAIN.jpg', description: 'Premium synchronize sheet in Logan Grain finish.' },
  { id: 'sp001-white', name: 'SP001-WHITE', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/04/SP001-White-PET-Sheet-300x300.jpg', description: 'SP001-WHITE - High-quality PET sheet for a premium finish.' },
  { id: 'sp002-super-matt-white', name: 'SP002-SUPER-MATT WHITE', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/04/SP002-Super-Matt-White-300x300.jpg', description: 'SP002-SUPER-MATT WHITE - High-quality PET sheet for a premium finish.' },
  { id: 'sp003-dark-grey', name: 'SP003-DARK GREY', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/04/SP003-Dark-Grey-Image-300x300.jpg', description: 'SP003-DARK GREY - High-quality PET sheet for a premium finish.' },
  { id: 'sp004-matt-dark-grey', name: 'SP004-MATT DARK GREY', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/04/SP004-Matt-Dark-Grey-300x300.jpg', description: 'SP004-MATT DARK GREY - High-quality PET sheet for a premium finish.' },
  { id: 'sp005-light-grey', name: 'SP005-LIGHT GREY', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/04/SP005-Light-Grey-300x300.jpg', description: 'SP005-LIGHT GREY - High-quality PET sheet for a premium finish.' },
  { id: 'sp006-matt-light-grey', name: 'SP006-MATT LIGHT GREY', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/04/SP006-Matt-Light-Grey-300x300.jpg', description: 'SP006-MATT LIGHT GREY - High-quality PET sheet for a premium finish.' },
  { id: 'sp007-off-white', name: 'SP007-OFF WHITE', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/04/SP007-OFF-WHITE-300x300.jpg', description: 'SP007-OFF WHITE - High-quality PET sheet for a premium finish.' },
  { id: 'sp008-matt-off-white', name: 'SP008-MATT OFF WHITE', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/05/SP008-MATT-OFF-WHITE-300x300.jpg', description: 'SP008-MATT OFF WHITE - High-quality PET sheet for a premium finish.' },
  { id: 'sp009-black', name: 'SP009-BLACK', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/05/SP009-BLACK-300x300.jpg', description: 'SP009-BLACK - High-quality PET sheet for a premium finish.' },
  { id: 'sp010-matt-black', name: 'SP010-MATT BLACK', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/05/SP010-MATT-BLACK-300x300.jpg', description: 'SP010-MATT BLACK - High-quality PET sheet for a premium finish.' },
  { id: 'sp011-blue', name: 'SP011-BLUE', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/05/SP011-BLUE-300x300.jpg', description: 'SP011-BLUE - High-quality PET sheet for a premium finish.' },
  { id: 'sp012-matt-blue', name: 'SP012-MATT BLUE', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/05/SP012-MATT-BLUE-300x300.jpg', description: 'SP012-MATT BLUE - High-quality PET sheet for a premium finish.' },
  { id: 'sp013-matt-sky', name: 'SP013-MATT SKY', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/05/SP013-MATT-SKY-300x300.jpg', description: 'SP013-MATT SKY - High-quality PET sheet for a premium finish.' },
  { id: 'sp014-matt-beige', name: 'SP014-MATT BEIGE', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/05/SP014-MATT-BEIGE-300x300.jpg', description: 'SP014-MATT BEIGE - High-quality PET sheet for a premium finish.' },
  { id: 'sp015-cashmere', name: 'SP015-CASHMERE', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/08/SP015-1-300x300.jpg', description: 'SP015-CASHMERE - High-quality PET sheet for a premium finish.' },
  { id: 'sp016-matt-cashmere', name: 'SP016-MATT CASHMERE', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/08/SP016-4-300x300.jpg', description: 'SP016-MATT CASHMERE - High-quality PET sheet for a premium finish.' },
  { id: 'sp017-ivory-grey', name: 'SP017-IVORY GREY', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/08/SP017-1-300x300.jpg', description: 'SP017-IVORY GREY - High-quality PET sheet for a premium finish.' },
  { id: 'sp018-matt-ivory-grey', name: 'SP018-MATT IVORY GREY', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/08/SP018-5-300x300.jpg', description: 'SP018-MATT IVORY GREY - High-quality PET sheet for a premium finish.' },
  { id: 'sp019-metallic-brown', name: 'SP019-METALLIC BROWN', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/05/SP019-METTALIC-BROWN-300x300.jpg', description: 'SP019-METALLIC BROWN - High-quality PET sheet for a premium finish.' },
  { id: 'sp020-metallic-grey', name: 'SP020-METALLIC GREY', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/05/SP020-METTALIC-GREY-300x300.jpg', description: 'SP020-METALLIC GREY - High-quality PET sheet for a premium finish.' },
  { id: 'sp021-charcoal', name: 'SP021-CHARCOAL', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/05/SP021-CHARCOAL-300x300.jpg', description: 'SP021-CHARCOAL - High-quality PET sheet for a premium finish.' },
  { id: 'sp022-matt-charcoal', name: 'SP022-MATT CHARCOAL', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/05/SP022-MATT-CHARCOAL-300x300.jpg', description: 'SP022-MATT CHARCOAL - High-quality PET sheet for a premium finish.' },
  { id: 'sp023-ash-grey', name: 'SP023-ASH GREY', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/05/SP023-ASH-GREY-300x300.jpg', description: 'SP023-ASH GREY - High-quality PET sheet for a premium finish.' },
  { id: 'sp024-matt-ash-grey', name: 'SP024-MATT ASH GREY', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/05/SP024-MATT-ASH-GREY-300x300.jpg', description: 'SP024-MATT ASH GREY - High-quality PET sheet for a premium finish.' },
  { id: 'sp025-dusty-rose', name: 'SP025-DUSTY ROSE', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/05/SP025-DUSTY-ROSE-300x300.jpg', description: 'SP025-DUSTY ROSE - High-quality PET sheet for a premium finish.' },
  { id: 'sp026-matt-brown', name: 'SP026-MATT BROWN', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/08/SP026-5-300x300.jpg', description: 'SP026-MATT BROWN - High-quality PET sheet for a premium finish.' },
  { id: 'sp027-matt-red', name: 'SP027-MATT RED', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/08/SP027-6-300x300.jpg', description: 'SP027-MATT RED - High-quality PET sheet for a premium finish.' },
  { id: 'sp028-matt-green', name: 'SP028-MATT GREEN', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/08/SP028-4-300x300.jpg', description: 'SP028-MATT GREEN - High-quality PET sheet for a premium finish.' },
  { id: 'sp029-matt-pink', name: 'SP029-MATT PINK', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/08/SP029-4-300x300.jpg', description: 'SP029-MATT PINK - High-quality PET sheet for a premium finish.' },
  { id: 'sp030-matt-super-sea', name: 'SP030-MATT SUPER SEA', category: 'front-elevation', price: 'Contact Us', image: 'https://smarthardware.ca/wp-content/uploads/2025/08/SP030-4-300x300.jpg', description: 'SP030-MATT SUPER SEA - High-quality PET sheet for a premium finish.' },
  { id: 'cbs3', name: 'Smart Soft-Close Cabinet Hinge', category: 'Smart Hardware', price: '14.99', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800', description: 'Adjustable heavy duty soft close cabinetry hinge.' }
];

// Mapped worked cities: Barrie, Newmarket, Guelph, Mississauga, Oakville, Oshawa, Vaughan, Caledon, Cambridge, Kitchener, Milton, Hamilton, Nobleton, King City, Bradford, Whitby, East Gwillimbury, Pickering, Ajax, Brantford
export const MOCK_PROJECT_PINS: ProjectPin[] = [
  { id: 'p1', lat: 44.3894, lng: -79.6903, title: 'Luxury House Renovation', description: 'Completed a premium whole home remodeling project in Barrie, ON.' },
  { id: 'p2', lat: 44.0592, lng: -79.4613, title: 'Legal Basement Unit', description: 'Beautifully finished 2-bedroom secondary legal basement suite in Newmarket, ON.' },
  { id: 'p3', lat: 43.5448, lng: -80.2482, title: 'Modular Kitchen Upgrade', description: 'Custom quartz countertop and high-gloss cabinet installation in Guelph, ON.' },
  { id: 'p4', lat: 43.5890, lng: -79.6441, title: 'Modern Condo Renovation', description: 'High-rise luxury condo remodeling in Mississauga, ON.' },
  { id: 'p5', lat: 43.4675, lng: -79.6877, title: 'Executive Walk-in Closet', description: 'Bespoke custom master wardrobe shelving system in Oakville, ON.' },
  { id: 'p6', lat: 43.8971, lng: -78.8658, title: 'Modern Legal Basement', description: 'City-permit certified legal secondary suite in Oshawa, ON.' },
  { id: 'p7', lat: 43.8563, lng: -79.5085, title: 'Smart Kitchen Remodel', description: 'Contemporary high-end kitchen makeover completed in Vaughan, ON.' },
  { id: 'p8', lat: 43.8667, lng: -79.9997, title: 'Custom Cabinetry & Closets', description: 'Detailed modular millwork and wardrobe setup in Caledon, ON.' },
  { id: 'p9', lat: 43.3616, lng: -80.3144, title: 'Luxury Washroom Spa', description: 'Master washroom remodel with heated tiles in Cambridge, ON.' },
  { id: 'p10', lat: 43.4516, lng: -80.4925, title: 'Kitchen & Bath Remodel', description: 'Sleek luxury cabinetry and tiled washroom updates in Kitchener, ON.' },
  { id: 'p11', lat: 43.5183, lng: -79.8841, title: 'Permit-Compliant Basement', description: 'Separate side entrance and structural legal basement in Milton, ON.' },
  { id: 'p12', lat: 43.2557, lng: -79.8711, title: 'Creative Office Closets', description: 'Bespoke corporate modular storage installation in Hamilton, ON.' },
  { id: 'p13', lat: 43.9016, lng: -79.6853, title: 'Stunning Estate Renovation', description: 'Luxury home millwork and modern open-concept floor plan in Nobleton, ON.' },
  { id: 'p14', lat: 43.9213, lng: -79.5286, title: 'Modular Kitchen Island', description: 'Custom quartz waterfall island and LED ambient display in King City, ON.' },
  { id: 'p15', lat: 44.1139, lng: -79.5658, title: 'Bespoke Closet Organizers', description: 'Premium wood veneer bedroom walk-in closet systems in Bradford, ON.' },
  { id: 'p16', lat: 43.8975, lng: -78.9429, title: 'Legal Entrance & Basement', description: 'Egress windows and structural legal basement conversion in Whitby, ON.' },
  { id: 'p17', lat: 44.1338, lng: -79.4162, title: 'Luxury Double Vanity Bath', description: 'Frameless glass walk-in shower and floating quartz vanity in East Gwillimbury, ON.' },
  { id: 'p18', lat: 43.8384, lng: -79.0868, title: 'Modern Kitchen Remodeling', description: 'Contemporary wood kitchen panels and smart storage in Pickering, ON.' },
  { id: 'p19', lat: 43.8509, lng: -79.0204, title: 'Luxury Master Closet Suite', description: 'Double row shoe storage and integrated wardrobe track lighting in Ajax, ON.' },
  { id: 'p20', lat: 43.1394, lng: -80.2632, title: 'Home Renovation', description: 'Complete luxury home renovation in Brantford, ON.' }
];

export const MOCK_CLIENTS: Client[] = [
  { id: 'c1', name: 'Therapy Villa', category: 'Healthcare & Wellness', logo_url: '' },
  { id: 'c2', name: 'Praise a Bible Church', category: 'Creative & Corporate', logo_url: '' },
  { id: 'c3', name: 'Exotic Jeweller', category: 'Retail & Luxury', logo_url: '' },
  { id: 'c4', name: 'P10H Studio (Tone and Pro)', category: 'Creative & Corporate', logo_url: '' },
  { id: 'c5', name: 'Social Daddy', category: 'Creative & Corporate', logo_url: '' },
  { id: 'c6', name: 'Dental (Ace Academy)', category: 'Healthcare & Wellness', logo_url: '' },
  { id: 'c7', name: 'Aurbit Express', category: 'Logistics & Infrastructure', logo_url: '' },
  { id: 'c8', name: 'Astor Asteritel', category: 'Retail & Luxury', logo_url: '' },
  { id: 'c9', name: 'MKG Freight Lines Inc', category: 'Logistics & Infrastructure', logo_url: '' }
];

export const MOCK_PROJECTS: GalleryProject[] = [
  {
    "id": "acf2b91a-f3d3-4aec-8919-cb05c1cf83c5",
    "name": "KITCHEN RENOVATION",
    "category": "Kitchen",
    "images": [
      "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1200"
    ]
  },
  {
    "id": "c3b8d0f0-f67c-4fc7-a2da-387dfa6c5cd8",
    "name": "BATHROOM RENOVATIONS",
    "category": "Bathroom",
    "images": [
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1620626011761-9ea0184404ec?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1604709177227-3977c61c62cb?auto=format&fit=crop&q=80&w=1200"
    ]
  },
  {
    "id": "c49a448d-aebb-4fd6-8da0-7404b403ac90",
    "name": "LEGAL BASEMENTS PERMIT SUITES",
    "category": "Legal Basements",
    "images": [
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200"
    ]
  },
  {
    "id": "6b514b6c-4168-41e7-b970-19111c5ff7d7",
    "name": "CLOSETS CUSTOM STORAGE",
    "category": "Closets",
    "images": [
      "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1595514535311-6677f24e9309?auto=format&fit=crop&q=80&w=1200"
    ]
  },
  {
    "id": "a3a5dbfa-c6b8-4895-9198-05ade6320534",
    "name": "BEDROOMS LUXURY SUITES",
    "category": "Bedrooms",
    "images": [
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1536353982823-1d02341b5cfc?auto=format&fit=crop&q=80&w=1200"
    ]
  },
  {
    "id": "e11fdf81-bd39-45ed-99a3-52018c40e303",
    "name": "LOUNGE LIVING SPACES",
    "category": "Lounge",
    "images": [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200"
    ]
  },
  {
    "id": "be8c1838-c379-47d4-b3f4-1521d9e6633c",
    "name": "BOOKSHELF CUSTOM MILLWORK",
    "category": "BookShelf",
    "images": [
      "https://images.unsplash.com/photo-1594901511217-109ecf00b77b?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&q=80&w=1200"
    ]
  },
  {
    "id": "b0b4b296-18eb-4a7c-8ecd-9167574534c5",
    "name": "MIRROR WORK CREATIVE GLASS",
    "category": "Mirror Work",
    "images": [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1620626011761-9ea0184404ec?auto=format&fit=crop&q=80&w=1200"
    ]
  },
  {
    "id": "379b50f7-f3ef-4fbc-bff2-740967d10d88",
    "name": "STAIRS CUSTOM CARPENTRY",
    "category": "Stairs",
    "images": [
      "https://images.unsplash.com/photo-1507726420169-08dc80118357?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200"
    ]
  }
];
