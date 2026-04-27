
import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { PageSectionContent, FAQ } from '../../types';

interface FAQSectionProps {
  content?: PageSectionContent;
  faqs: FAQ[];
}

const FAQSection: React.FC<FAQSectionProps> = ({ content, faqs }) => {
  const [openId, setOpenId] = useState<string | null>(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-16">
          <HelpCircle size={48} className="text-royal-blue/20 mb-4" />
          <h2 className="text-4xl font-bold text-royal-blue mb-4">{content?.title || 'Answering Key Questions'}</h2>
          <p className="text-gray-500 max-w-xl">{content?.subtitle || 'We address the most common client concerns directly, saving time and building confidence in your project.'}</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div 
              key={faq.id} 
              className={`border rounded-sm transition-all duration-300 ${openId === faq.id ? 'border-royal-blue ring-1 ring-royal-blue/10 bg-gray-50/30' : 'border-gray-100'}`}
            >
              <button 
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className={`text-lg font-bold transition-colors ${openId === faq.id ? 'text-royal-blue' : 'text-gray-700'}`}>
                  {faq.question}
                </span>
                <ChevronDown 
                  size={20} 
                  className={`text-royal-blue transition-transform duration-300 ${openId === faq.id ? 'rotate-180' : ''}`} 
                />
              </button>
              {openId === faq.id && (
                <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <p className="text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-gray-50 border border-dashed border-gray-200 rounded-sm flex items-center justify-between">
          <p className="text-sm text-gray-500 font-medium italic">Have more specific questions about your Toronto renovation?</p>
          <button className="text-royal-blue font-bold text-sm tracking-widest uppercase hover:underline">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
