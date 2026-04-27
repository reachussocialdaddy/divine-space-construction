
import React from 'react';
import { motion } from 'framer-motion';
import { PageSectionContent } from '../../types';

interface LegalPageProps {
  title: string;
  pageContent: PageSectionContent[];
}

const LegalPage: React.FC<LegalPageProps> = ({ title, pageContent }) => {
  return (
    <div className="pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-royal-blue mb-4 uppercase tracking-wider">{title}</h1>
          <div className="w-24 h-1 bg-royal-blue mx-auto"></div>
        </motion.div>

        <div className="space-y-12">
          {pageContent.length > 0 ? (
            pageContent.map((section, index) => (
              <motion.section 
                key={section.section_key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="prose prose-lg max-w-none"
              >
                {section.title && <h2 className="text-2xl font-bold text-brand-black mb-4">{section.title}</h2>}
                {section.subtitle && <h3 className="text-lg font-semibold text-royal-blue mb-2">{section.subtitle}</h3>}
                <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {section.description}
                </div>
              </motion.section>
            ))
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-sm border border-dashed border-gray-200">
              <p className="text-gray-400 italic">Content for this page is currently being updated. Please check back soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
