
import React from 'react';
import HeroSlider from './HeroSlider';
import TrustIndicators from './TrustIndicators';
import ServicesOverview from './ServicesOverview';
import WorkProcess from './WorkProcess';
import ProjectsMap from '../Map/ProjectsMap';
import FAQSection from './FAQSection';
import { View, Lead, HeroSlide, PageSectionContent, ProjectPin, FAQ, Service } from '../../types';

interface HomePageProps {
  onLeadSubmit: (lead: Omit<Lead, 'id' | 'timestamp' | 'status'>) => void;
  navigateTo: (view: View) => void;
  heroSlides: HeroSlide[];
  pageContent: PageSectionContent[];
  pins: ProjectPin[];
  faqs: FAQ[];
  services: Service[];
  onOpenQuote: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ navigateTo, onLeadSubmit, heroSlides, pageContent, pins, faqs, services, onOpenQuote }) => {
  const servicesContent = pageContent.find(c => c.section_key === 'services_overview');
  const processContent = pageContent.find(c => c.section_key === 'work_process_home');
  const faqContent = pageContent.find(c => c.section_key === 'faq_section_home');

  return (
    <div className="animate-in fade-in duration-700">
      <HeroSlider navigateTo={navigateTo} slides={heroSlides} onOpenQuote={onOpenQuote} />
      <TrustIndicators />
      <ServicesOverview navigateTo={navigateTo} content={servicesContent} services={services} onOpenQuote={onOpenQuote} />
      <WorkProcess content={processContent} />
      <FAQSection content={faqContent} faqs={faqs} />
      <ProjectsMap pins={pins} />
    </div>
  );
};

export default HomePage;
