
import React from 'react';
import { TRUST_INDICATORS } from '../../constants.tsx';
import { motion } from 'framer-motion';

const TrustIndicators: React.FC = () => {
  return (
    <div className="bg-gray-50 py-10 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {TRUST_INDICATORS.map((item, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex flex-col items-center text-center space-y-3"
            >
              <div className="p-3 bg-white rounded-full shadow-sm">
                {item.icon}
              </div>
              <span className="text-xs sm:text-sm font-bold tracking-wider text-royal-blue uppercase">
                {item.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default TrustIndicators;
