
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Phone, Mail, User, CheckCircle } from 'lucide-react';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; phone: string }) => void;
}

const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
      setFormData({ name: '', email: '', phone: '' });
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-sm shadow-2xl overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-royal-blue transition-colors z-10"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col md:flex-row">
              <div className="hidden md:flex md:w-1/3 bg-royal-blue p-8 flex-col justify-between text-white">
                <div>
                  <h3 className="text-2xl font-bold uppercase tracking-tighter mb-4">Get A Free Quote</h3>
                  <p className="text-xs text-white/70 leading-relaxed font-medium">
                    Fill out the form and our team will get back to you within 24 hours.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-widest">
                    <Phone size={14} />
                    <span>Expert Advice</span>
                  </div>
                  <div className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-widest">
                    <CheckCircle size={14} />
                    <span>Free Estimation</span>
                  </div>
                </div>
              </div>

              <div className="flex-grow p-8">
                {isSubmitted ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-brand-black uppercase tracking-tight mb-2">Request Received!</h3>
                    <p className="text-sm text-gray-500">Thank you for reaching out. We'll contact you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          required
                          type="text"
                          placeholder="John Doe"
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-sm text-sm focus:border-royal-blue outline-none transition-all"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          required
                          type="email"
                          placeholder="john@example.com"
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-sm text-sm focus:border-royal-blue outline-none transition-all"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Mobile Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          required
                          type="tel"
                          placeholder="+1 (647) 000-0000"
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-sm text-sm focus:border-royal-blue outline-none transition-all"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-royal-blue text-white font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-brand-black transition-all shadow-lg flex items-center justify-center space-x-2"
                    >
                      <span>Send Request</span>
                      <Send size={14} />
                    </button>
                    
                    <p className="text-[9px] text-gray-400 text-center uppercase tracking-widest font-medium">
                      By submitting, you agree to our privacy policy.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuoteModal;
