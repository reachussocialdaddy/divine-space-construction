import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { SiteSettings, Lead } from '../../types';

interface ContactPageProps {
  settings: SiteSettings;
  onLeadSubmit?: (lead: Omit<Lead, 'id' | 'timestamp' | 'status'>) => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ settings, onLeadSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    setIsSubmitting(true);
    try {
      if (onLeadSubmit) {
        onLeadSubmit({
          name,
          email,
          phone: 'N/A',
          service: subject || 'Contact Us Tab Inquiry',
          location: 'Contact Page',
          budget: 'N/A',
          timeline: 'N/A',
          topic: message
        });
      }
      setIsSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err) {
      console.error('Error submitting contact lead:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-24 bg-royal-blue overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tighter uppercase"
          >
            Contact <span className="text-white/50 italic">Us</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/70 max-w-2xl mx-auto font-light"
          >
            Have a project in mind? We'd love to hear from you. Reach out to our team for a professional consultation.
          </motion.p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <div>
                <h2 className="text-3xl font-bold text-brand-black mb-8 uppercase tracking-tight">Get In Touch</h2>
                <div className="space-y-8">
                  <div className="flex items-start space-x-6">
                    <div className="w-12 h-12 bg-gray-50 flex items-center justify-center rounded-sm text-royal-blue shadow-sm">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Call Us</h4>
                      <p className="text-lg font-bold text-brand-black">{settings.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-6">
                    <div className="w-12 h-12 bg-gray-50 flex items-center justify-center rounded-sm text-royal-blue shadow-sm">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email Us</h4>
                      <p className="text-lg font-bold text-brand-black">{settings.email || 'info@divinespace.ca'}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-6">
                    <div className="w-12 h-12 bg-gray-50 flex items-center justify-center rounded-sm text-royal-blue shadow-sm">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Visit Us</h4>
                      <p className="text-lg font-bold text-brand-black leading-relaxed">{settings.address || '10 Bramhurst Ave, Unit 10, Brampton, ON L6T 5H1'}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-6">
                    <div className="w-12 h-12 bg-gray-50 flex items-center justify-center rounded-sm text-royal-blue shadow-sm">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Working Hours</h4>
                      <p className="text-lg font-bold text-brand-black">{settings.working_hours_weekday || 'Mon - Fri: 9:00 AM - 6:00 PM'}</p>
                      <p className="text-lg font-bold text-brand-black">{settings.working_hours_weekend || 'Sat: 10:00 AM - 4:00 PM'}</p>
                      <p className="text-lg font-bold text-brand-black">Sun: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="h-80 bg-gray-100 rounded-sm overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-700">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2884.281874278148!2d-79.6841235!3d43.7047069!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b396790555555%3A0x5a5a5a5a5a5a5a5a!2s10%20Bramhurst%20Ave%2C%20Brampton%2C%20ON%20L6T%205H1!5e0!3m2!1sen!2sca!4v1620000000000!5m2!1sen!2sca" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy"
                ></iframe>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50 p-10 md:p-16 rounded-sm shadow-sm relative overflow-hidden"
            >
              <h2 className="text-3xl font-bold text-brand-black mb-8 uppercase tracking-tight">Send a Message</h2>
              
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center z-10"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 100 }}
                      className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm"
                    >
                      <CheckCircle size={36} />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-brand-black mb-3 uppercase tracking-tight">Message Received!</h3>
                    <p className="text-gray-500 max-w-sm text-sm leading-relaxed mb-8">
                      Thank you for contacting Divine Space. Our representative will review your message and reach back to you shortly.
                    </p>
                    <button 
                      onClick={() => setIsSubmitted(false)}
                      className="px-8 py-3 bg-royal-blue text-white text-[10px] font-bold uppercase tracking-widest hover:bg-brand-black transition-colors rounded-sm"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white border border-gray-200 px-4 py-4 focus:outline-none focus:border-royal-blue transition-colors rounded-sm text-sm font-medium" 
                      placeholder="John Doe" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-gray-200 px-4 py-4 focus:outline-none focus:border-royal-blue transition-colors rounded-sm text-sm font-medium" 
                      placeholder="john@example.com" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subject</label>
                  <input 
                    type="text" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-white border border-gray-200 px-4 py-4 focus:outline-none focus:border-royal-blue transition-colors rounded-sm text-sm font-medium" 
                    placeholder="Project Inquiry" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Message</label>
                  <textarea 
                    rows={6} 
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-white border border-gray-200 px-4 py-4 focus:outline-none focus:border-royal-blue transition-colors rounded-sm resize-none text-sm font-medium" 
                    placeholder="Tell us about your project..."
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-royal-blue text-white py-5 font-bold uppercase tracking-widest text-xs flex items-center justify-center space-x-3 hover:bg-brand-black transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                  <Send size={16} />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
