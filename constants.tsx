
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
import { Product, ProjectPin, FAQ, Service } from './types';

export const COLORS = {
  brandRed: '#E31E24',
  brandBlack: '#111111',
  white: '#FFFFFF',
};

export const Logo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M50 5 L11 27.5 L25 51 L50 36 Z" fill="#E31E24" />
    <path d="M50 5 L89 27.5 L89 51 L50 36 Z" fill="#111111" />
    <path d="M50 95 L11 72.5 L11 49 L50 64 Z" fill="#111111" />
    <path d="M50 95 L89 72.5 L75 49 L50 64 Z" fill="#E31E24" />
    <path d="M11 27.5 L11 72.5 L25 51 L25 40 Z" fill="#111111" />
    <path d="M89 27.5 L89 72.5 L75 49 L75 40 Z" fill="#111111" />
  </svg>
);

export const ADDRESS = "10 Bramhurst Ave, Unit 10, Brampton, ON L6T 5H1";

export const SERVICES: Service[] = [
  { 
    id: 'legal-basements', 
    title: 'Legal Basements', 
    icon: <Home size={24} />, 
    description: 'Expertly finished legal basements compliant with city codes.',
    long_description: 'Our legal basement services cover everything from structural changes and fire-rating to separate entrance installations. We work closely with Toronto and GTA municipalities to ensure every project meets the strict Ontario Building Code requirements for secondary suites.',
    benefits: ['City Permit Handling', 'Fire-Rated Materials', 'Separate Entrance Layouts', 'Professional Egress Windows', 'HVAC & Plumbing Integration'],
    image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200'
  },
  { 
    id: 'kitchen-renovation', 
    title: 'Kitchen Renovation', 
    icon: <Hammer size={24} />, 
    description: 'Full kitchen transformations with high-end finishes.',
    long_description: 'Transform your kitchen into a culinary masterpiece. Divine Space specializes in full kitchen renovations that improve both functionality and market value. From custom cabinetry to premium countertops, we handle every detail.',
    benefits: ['Custom Cabinetry', 'Premium Countertops', 'Modern Lighting', 'Efficient Layouts', 'High-End Appliances'],
    image_url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1200'
  },
  { 
    id: 'modular-cabinetry', 
    title: 'Modular Cabinetry', 
    icon: <Layout size={24} />, 
    description: 'Sleek, modern, and highly functional cabinetry designs.',
    long_description: 'Our modular cabinetry solutions offer Italian-inspired designs with Canadian durability. We use only high-end materials like quartz, solid wood, and soft-close German hardware to ensure your cabinets look as good as they function.',
    benefits: ['Soft-Close Cabinetry', 'Custom Finishes', 'Smart Storage', 'Italian Designs', 'German Hardware'],
    image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=1200'
  },
  { 
    id: 'custom-closets', 
    title: 'Custom Closets', 
    icon: <Layers size={24} />, 
    description: 'Bespoke storage solutions for organized living.',
    long_description: 'Maximized organization meets high-end luxury. Our custom closets are designed to your specific wardrobe needs, utilizing every inch of space while maintaining an aesthetic that matches your master suite.',
    benefits: ['Space Optimization', 'Integrated Lighting', 'Adjustable Shelving', 'Velvet Lined Drawers', 'Shoe Display Systems'],
    image_url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=1200'
  },
  { 
    id: 'condo-renovations', 
    title: 'Condo Renovations', 
    icon: <Bath size={24} />, 
    description: 'Luxurious condo transformations tailored to urban living.',
    long_description: 'Renovating a condo requires specialized knowledge of building rules and space constraints. Our team is experienced in delivering high-quality condo renovations that respect your building\'s guidelines while maximizing your space.',
    benefits: ['Space-Saving Designs', 'Condo Rule Compliance', 'Premium Finishes', 'Minimal Disruption', 'Urban Style'],
    image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200'
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
  { id: '5', name: 'Windsor Brass Satin Ridge', category: 'handles', price: '$24.95', image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=1200', description: 'A premium satin brass handle featuring unique ridge texturing for a sophisticated tactile experience.' },
  { id: '1', name: 'Azure Modular Kitchen', category: 'kitchen', price: '$12,000+', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800', description: 'High-gloss cabinetry with smart storage solutions.' },
  { id: '2', name: 'Royal Walk-in Closet', category: 'closet', price: '$4,500+', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800', description: 'Premium wood finish with integrated LED lighting.' },
  { id: '3', name: 'Modern Island Suite', category: 'kitchen', price: '$8,500+', image: 'https://images.unsplash.com/photo-1565182999561-18d7dc63c391?auto=format&fit=crop&q=80&w=800', description: 'Quartz countertops with customized island layout.' },
  { id: '4', name: 'Executive Master Closet', category: 'closet', price: '$6,000+', image: 'https://images.unsplash.com/photo-1558997519-83ec73027bfd?auto=format&fit=crop&q=80&w=1200', description: 'Elegant velvet-lined drawers and shoe display.' },
];

export const MOCK_PROJECT_PINS: ProjectPin[] = [
  { id: 'p1', lat: 43.6532, lng: -79.3832, title: 'Modern Renovation', description: 'Whole house renovation in Downtown Toronto.' },
  { id: 'p2', lat: 43.7315, lng: -79.7624, title: 'Legal Basement', description: 'Legal basement construction in Brampton.' },
  { id: 'p3', lat: 43.5890, lng: -79.6441, title: 'Luxury Kitchen', description: 'Modular kitchen installation in Mississauga.' },
  { id: 'p4', lat: 43.8563, lng: -79.5085, title: 'Custom Wardrobe', description: 'Bespoke closet system in Vaughan.' },
];
