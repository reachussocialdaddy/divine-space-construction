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
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200'
  },
  { 
    id: 'modular-kitchen', 
    title: 'Modular Kitchen', 
    icon: <Layout size={24} />, 
    description: 'Sleek, Italian-inspired kitchen cabinet designs and islands.',
    long_description: 'We build custom, high-end modular kitchens that pair Italian aesthetic styling with daily functional utility. Incorporating premium wood finishes, high-gloss UV panels, and elegant quartz countertops, our kitchens are masterpieces engineered to last.',
    benefits: ['German Soft-Close Hinges & Tracks', 'Sleek Under-Cabinet Lighting', 'Innovative Corner Pullouts & Spices', 'Premium Heat-Resistant Counters', 'Custom Hidden Appliance Integration'],
    image_url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1200'
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
    image_url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=1200'
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
  // Quartz category items branded under "Vida"
  { id: 'v1', name: 'Vida Luxe Gold Handle', category: 'Quartz', price: '32.00', image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=1200', description: 'A premium satin brass handle from Vida Company featuring unique ridge texturing for a sophisticated tactile experience.', brand: 'Vida Company' },
  { id: 'v2', name: 'Vida Elite Satin Pull', category: 'Quartz', price: '29.50', image: 'https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&q=80&w=1200', description: 'Graceful satin chrome handpull built by Vida Company, ideal for luxury kitchen cabinetry panels.', brand: 'Vida Company' },
  { id: 'v3', name: 'Vida Matte Obsidian Bar', category: 'Quartz', price: '35.00', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=1200', description: 'Stunning black obsidian designer pull bar by Vida Company for high-end minimalist aesthetics.', brand: 'Vida Company' },
  { id: 'v4', name: 'Vida Smart Finger-Pull', category: 'Quartz', price: '42.00', image: 'https://images.unsplash.com/photo-1558997519-83ec73027bfd?auto=format&fit=crop&q=80&w=1200', description: 'Vida Company modern edge-integrated handle providing a completely clean cabinet profile face.', brand: 'Vida Company' },

  // Kitchen organizer accessories under "Kitchen" category
  { id: 'k1', name: 'Corner Unit Magic-Pullout', category: 'kitchen', price: '340.00', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=800', description: 'Maximize blind corner cabinet spaces. Features heavy-duty racks that pull out completely for effortless access.' },
  { id: 'k2', name: 'Cutlery Organizer Tray', category: 'kitchen', price: '85.00', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800', description: 'Fully adjustable solid oak drawer partitions to custom organize knives, forks, spoons, and cooking utensils.' },
  { id: 'k3', name: 'Pull-Down Pantry Tray', category: 'kitchen', price: '195.00', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800', description: 'Reach high shelves easily with a hydraulic-assisted steel wire pull-down shelf tray for cupboards.' },
  { id: 'k4', name: 'Rotating Pantry Unit', category: 'kitchen', price: '210.00', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800', description: 'Rotating tall pantry unit to make the most out of your kitchen storage.' },

  // Cabinet Sheet & Smart Hardware
  { id: 'cbs1', name: 'Smart Hardware Walnut Sheet', category: 'cabinet-sheet', price: '150.00', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800', description: 'Luxury 3/4 inch walnut timber ply cabinet face sheets with smart edge-banding layers.' },
  { id: 'cbs2', name: 'Smart Hardware Glossy White Sheet', category: 'cabinet-sheet', price: '120.00', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800', description: 'Ultra-high-gloss acrylic white cabinet door panels featuring exceptional scratch and UV resistance.' },
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
      "https://lh3.googleusercontent.com/d/1Q4qf-NXTi9ea_nyvPk1Xwr75X7yneiyE",
      "https://lh3.googleusercontent.com/d/11yNeDmtIt4NS7aS8d9NLrSRpVxSIdMhQ",
      "https://lh3.googleusercontent.com/d/1hmK_98J0H9mQuBp4xpNB4HA2N9odRDBE",
      "https://lh3.googleusercontent.com/d/1ys_MJO6vvo4SQP6ZISQhXpdUHIqWtVIN",
      "https://lh3.googleusercontent.com/d/1zSXBGt4tUxV6aLO5gLEs77oVJuJ8hJzz",
      "https://lh3.googleusercontent.com/d/1S_iJatTFmCS5teBp4Qh0ue-k5D7vosJz",
      "https://lh3.googleusercontent.com/d/133iq_Ll6AkX9VCifjfaQOJY3mLAhRyyJ",
      "https://lh3.googleusercontent.com/d/1If7ymjoQphJWVyW3LArH8V4OKGkLYlet",
      "https://lh3.googleusercontent.com/d/1GTycmramg3CHt0bkKNPvgwRk-nqHsShV",
      "https://lh3.googleusercontent.com/d/13DBRppIrQ7WVQOZm5DZc9O2sn068zWnr",
      "https://lh3.googleusercontent.com/d/1SCWkp6jym9vTynSqnxwOByThl53CAPwk",
      "https://lh3.googleusercontent.com/d/1925bGc7fZxUcYiPR50R9_cVwJjrqtN7b",
      "https://lh3.googleusercontent.com/d/1fFsCNBIyDkTBRVvCYDXExGyDnG-pVVbd",
      "https://lh3.googleusercontent.com/d/1W2eUubAds8_I7Vn8eIZJu4_FHR792kIO",
      "https://lh3.googleusercontent.com/d/1IbTNdpeS5ZGJZkHdk1tsoULyt-xJm359",
      "https://lh3.googleusercontent.com/d/1B-GL_nz_Ja69vdpf_HpVizvvRu7L89Pv",
      "https://lh3.googleusercontent.com/d/1oFNZB7zsxDJfNWGpFoHstY8ZaOigdT8K",
      "https://lh3.googleusercontent.com/d/1RbvK2wvgbz-dr7IarOplAzNghB8roCs_",
      "https://lh3.googleusercontent.com/d/1maCH6ihDOHflIfD9fjmyAsAlJ5ZNp6tg",
      "https://lh3.googleusercontent.com/d/1MAPpXqe2iJ_2uvm1IuJRR0r2Bu74av0_",
      "https://lh3.googleusercontent.com/d/1kS70LLuNzlm0wjPjL8V7JOF-F88MTlGx",
      "https://lh3.googleusercontent.com/d/1MMcFTsDKO80kHrMkH7PBw-qt0MOdUvfK",
      "https://lh3.googleusercontent.com/d/14dp-bWtF7G9d2VdYVVp3tnIq8ezIYFxa",
      "https://lh3.googleusercontent.com/d/1kCRrt2tYeSKAL10POGhNKok67Wc_y0AA",
      "https://lh3.googleusercontent.com/d/19RuYq-sg0LdX-9Gg8YbjdMESsPy6ajAr",
      "https://lh3.googleusercontent.com/d/1yvK4I-ObkRNX3HxAjjGdrPI0DuSU-jrB"
    ]
  },
  {
    "id": "c3b8d0f0-f67c-4fc7-a2da-387dfa6c5cd8",
    "name": "BATHROOM RENOVATION",
    "category": "Bathroom",
    "images": [
      "https://lh3.googleusercontent.com/d/1oKOnDlGBgIi8T9uMM8yzGkhqed6Ufr30",
      "https://lh3.googleusercontent.com/d/1d2LzamXOk3_dHQ3zTFkrc4Rs78VQuBkj",
      "https://lh3.googleusercontent.com/d/1wumXRHNWeBqNH94A0UPuZNRJjBNgu1v_",
      "https://lh3.googleusercontent.com/d/1KYfrZJ6B8jLiYh3SltnH_DrFDCbmF8ow",
      "https://lh3.googleusercontent.com/d/1VX3Tcpx1wOczmYpBxIiIVli6Bt3PxL3f"
    ]
  },
  {
    "id": "2eca4954-10bd-4085-bb47-7253d5a501dd",
    "name": "WASHROOMS SPA DESIGN",
    "category": "Washrooms",
    "images": [
      "https://lh3.googleusercontent.com/d/1Pzqm1vYNKepn5kSCHUss2e9kO2mGjaAy",
      "https://lh3.googleusercontent.com/d/1ZY2vvLyvN-xfB3r9h6f3xlhZZ5Pt98qm",
      "https://lh3.googleusercontent.com/d/1XZd4-W5397MJdRlTTtin_USDK6Y3daZy",
      "https://lh3.googleusercontent.com/d/1k6fWZdXzFuv6f2S35afpVsf8g948X0qf",
      "https://lh3.googleusercontent.com/d/1y0U0Hgn6Exu42Nh8S00A3bjII267KJGC",
      "https://lh3.googleusercontent.com/d/1XUwCK9nmv7NSVNk31ohMiGhfM8um8n0K"
    ]
  },
  {
    "id": "c49a448d-aebb-4fd6-8da0-7404b403ac90",
    "name": "LEGAL BASEMENTS PERMIT SUITES",
    "category": "Legal Basements",
    "images": [
      "https://lh3.googleusercontent.com/d/1qs63Z26UDsYxsVjylAwXuEgjhn1WOift",
      "https://lh3.googleusercontent.com/d/1nkj_1H7A2Ukf5qxwFEi8y8S1OBVdVwP0",
      "https://lh3.googleusercontent.com/d/169Y8fWjq0_FaFniUn5BiBS6FRv4hBnZp"
    ]
  },
  {
    "id": "6b514b6c-4168-41e7-b970-19111c5ff7d7",
    "name": "CLOSETS CUSTOM STORAGE",
    "category": "Closets",
    "images": [
      "https://lh3.googleusercontent.com/d/1cugPyUHFt6kSutmejfR7Dcosuzc4Nhtz",
      "https://lh3.googleusercontent.com/d/1c1vIsBHtqCs765doAZvf7vRxWzJOfexD",
      "https://lh3.googleusercontent.com/d/177V-jOUuRFBO3wBNwtPr2gPk-N3jMMD8",
      "https://lh3.googleusercontent.com/d/1D2jH17vTiCZ2eEFeZC8Jyw1HAqHzoM3v",
      "https://lh3.googleusercontent.com/d/1rljcXoyusXgitFinxvTdzzTgQx-JjABV",
      "https://lh3.googleusercontent.com/d/1tUXXfTZAs7vM7aQejL4YpVIcfrBTBVUR"
    ]
  },
  {
    "id": "a3a5dbfa-c6b8-4895-9198-05ade6320534",
    "name": "BEDROOMS LUXURY SUITES",
    "category": "Bedrooms",
    "images": [
      "https://lh3.googleusercontent.com/d/1tncdJ_xHjSDUEMKAh6rKR1xIONfXpg2X",
      "https://lh3.googleusercontent.com/d/18kJtmg4yNzJiGMvZPyBF2gjB_UQvSBzw",
      "https://lh3.googleusercontent.com/d/1QGS2EmZyHq306m1sOOIaHf5e6QAnBTw6",
      "https://lh3.googleusercontent.com/d/1h2lZJlJSIa9tnbfTIGbpBv-fM-rRM5hy",
      "https://lh3.googleusercontent.com/d/1_uJucq7WtL678VkxgmfjcZ2E7HoTCSdx"
    ]
  },
  {
    "id": "e11fdf81-bd39-45ed-99a3-52018c40e303",
    "name": "LOUNGE LIVING SPACES",
    "category": "Lounge",
    "images": [
      "https://lh3.googleusercontent.com/d/11qHCW6X_AFHZBxAeLIDSX7Hl8ux1bdAT",
      "https://lh3.googleusercontent.com/d/1c1knvadED__RZ62gWHDsPMUhmg8MsQ-x"
    ]
  },
  {
    "id": "be8c1838-c379-47d4-b3f4-1521d9e6633c",
    "name": "BOOKSHELF CUSTOM MILLWORK",
    "category": "BookShelf",
    "images": [
      "https://lh3.googleusercontent.com/d/1IqZAddKZFq9702zOydepcrea_NNRJbyB",
      "https://lh3.googleusercontent.com/d/1nQMBOEIzorARb_1jWlWg_0ePdnOdfKJP"
    ]
  },
  {
    "id": "b0b4b296-18eb-4a7c-8ecd-9167574534c5",
    "name": "MIRROR WORK CREATIVE GLASS",
    "category": "Mirror Work",
    "images": [
      "https://lh3.googleusercontent.com/d/1USu3QoRYpwJ2cBnxFJVk3UddTV72Bxoj",
      "https://lh3.googleusercontent.com/d/1MDkTApeLJ1C9MSxoCuMQa6mRhRTO6PuC",
      "https://lh3.googleusercontent.com/d/1c25G0ZcKgISdNpKKpkGo8l-ITDb7a3bp"
    ]
  },
  {
    "id": "379b50f7-f3ef-4fbc-bff2-740967d10d88",
    "name": "STAIRS CUSTOM CARPENTRY",
    "category": "Stairs",
    "images": [
      "https://lh3.googleusercontent.com/d/1gMSC1bvSjA1v6XtRybxYFI71Zfpdubmf",
      "https://lh3.googleusercontent.com/d/1G3cHQszD9FS1sHrQ18TfguJF6L_TpX5E",
      "https://lh3.googleusercontent.com/d/1G91IwtBO-fTWZ5ZPSzV-HUjQ9yS7Lnum"
    ]
  }
];
