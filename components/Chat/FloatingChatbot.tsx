
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, PhoneCall } from 'lucide-react';
import { getAIResponse } from '../../services/aiService.ts';
import { Lead, ChatMessage } from '../../types.ts';

const TypewriterText: React.FC<{ text: string; onUpdate?: () => void }> = ({ text, onUpdate }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[index]);
        setIndex(prev => prev + 1);
        if (onUpdate) onUpdate();
      }, 10);
      return () => clearTimeout(timeout);
    }
  }, [index, text, onUpdate]);

  return <>{displayedText}</>;
};

interface FloatingChatbotProps {
  onLeadSubmit: (lead: Omit<Lead, 'id' | 'timestamp' | 'status'>) => void;
}

const FloatingChatbot: React.FC<FloatingChatbotProps> = ({ onLeadSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Lead Form States
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formService, setFormService] = useState('Legal Basement');

  useEffect(() => {
    const handleOpenRequest = () => setIsOpen(true);
    window.addEventListener('open-chatbot', handleOpenRequest);
    return () => window.removeEventListener('open-chatbot', handleOpenRequest);
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addBotMessage("Hello! I'm your project consultant from Divine Space. How can I assist you with your home transformation today?");
      }, 1000);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const addBotMessage = (text: string) => {
    setMessages(prev => [...prev, { role: 'assistant', content: text }]);
  };

  const extractAndSubmitLead = (text: string) => {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;

    const emails = text.match(emailRegex);
    const phones = text.match(phoneRegex);

    if (emails || phones) {
      onLeadSubmit({
        name: 'Chatbot Lead (Auto-extracted)',
        email: emails ? emails[0] : 'N/A',
        phone: phones ? phones[0] : 'N/A',
        service: 'Chatbot Consult',
        location: 'AI Chatbot Message',
        budget: 'N/A',
        timeline: 'N/A',
        topic: `Extracted from chat message: "${text}"`
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLeadSubmit({
      name: formName,
      email: formEmail,
      phone: formPhone,
      service: formService,
      location: 'Chatbot Callback Form',
      budget: 'N/A',
      timeline: 'N/A',
      topic: `Requested callback via AI Chatbot for ${formService}.`
    });

    addBotMessage(`Thank you, ${formName}! I have scheduled a callback request for ${formService}. One of our specialists will contact you at ${formPhone} shortly.`);

    setFormName('');
    setFormPhone('');
    setFormEmail('');
    setShowLeadForm(false);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    extractAndSubmitLead(userText);

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setInputValue('');

    setIsTyping(true);
    try {
      console.log("Sending message to AI:", userText);
      const response = await getAIResponse(userText, messages);
      console.log("AI Response received:", response);
      setIsTyping(false);
      addBotMessage(response);
    } catch (error) {
      console.error("Chatbot handleSend Error:", error);
      setIsTyping(false);
      addBotMessage("I'm having a bit of trouble connecting right now. Please try again in a moment.");
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-royal-blue text-white w-16 h-16 rounded-full shadow-[0_20px_50px_rgba(0,35,102,0.3)] flex items-center justify-center hover:scale-110 transition-all duration-300 group"
        >
          <div className="absolute inset-0 rounded-full border border-white/20 scale-100 group-hover:scale-150 opacity-100 group-hover:opacity-0 transition-all duration-500"></div>
          <MessageSquare size={28} />
        </button>
      ) : (
        <div className="bg-white w-[380px] h-[600px] rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-12 duration-500">
          {/* Premium Header */}
          <div className="bg-royal-blue p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
                    <Bot size={26} className="text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-royal-blue"></div>
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide">Divine AI Consultant</h3>
                  <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest">Premium Service</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Area / Lead Form */}
          {showLeadForm ? (
            <div className="flex-grow p-6 flex flex-col justify-between bg-white overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-bold text-gray-900 uppercase tracking-tight mb-2">Connect to a Consultant</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-light">
                    Leave your contact details and one of our construction experts will reach out to you within 24 hours.
                  </p>
                </div>
                
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                    <input
                      required
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 text-xs focus:bg-white focus:border-royal-blue outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
                    <input
                      required
                      type="tel"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="+1 (647) 000-0000"
                      className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 text-xs focus:bg-white focus:border-royal-blue outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                    <input
                      required
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 text-xs focus:bg-white focus:border-royal-blue outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Service Needed</label>
                    <select
                      value={formService}
                      onChange={(e) => setFormService(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 text-xs focus:bg-white focus:border-royal-blue outline-none transition-colors"
                    >
                      <option value="Legal Basement">Legal Basement</option>
                      <option value="Kitchen Renovation">Kitchen Renovation</option>
                      <option value="Home Renovation">Home Renovation</option>
                      <option value="Other">Other Construction Work</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-royal-blue text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-black transition-colors rounded-xl shadow-lg mt-2"
                  >
                    Request Callback
                  </button>
                </form>
              </div>
              
              <button 
                onClick={() => setShowLeadForm(false)}
                className="w-full mt-4 py-2.5 text-gray-400 hover:text-royal-blue text-[10px] font-bold uppercase tracking-widest border border-gray-100 hover:border-royal-blue/20 transition-all rounded-xl"
              >
                Back to AI Assistant
              </button>
            </div>
          ) : (
            <>
              {/* Messages Area */}
              <div 
                ref={scrollRef}
                className="flex-grow overflow-y-auto p-6 space-y-6 bg-white"
              >
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-royal-blue text-white rounded-tr-none shadow-lg' 
                          : 'bg-gray-50 text-gray-800 rounded-tl-none border border-gray-100'
                      }`}>
                        {msg.role === 'assistant' ? (
                          <TypewriterText text={msg.content} onUpdate={scrollToBottom} />
                        ) : (
                          msg.content
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl rounded-tl-none flex space-x-1.5">
                      <div className="w-1.5 h-1.5 bg-royal-blue/30 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-royal-blue/30 rounded-full animate-bounce delay-100"></div>
                      <div className="w-1.5 h-1.5 bg-royal-blue/30 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Luxury Input Bar */}
              <div className="p-6 bg-white border-t border-gray-50">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Discuss your luxury project..."
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 pl-6 pr-14 text-sm focus:bg-white focus:ring-2 focus:ring-royal-blue/20 focus:border-royal-blue outline-none transition-all shadow-inner"
                  />
                  <button 
                    onClick={handleSend}
                    className="absolute right-2 p-3 text-royal-blue hover:scale-110 transition-transform disabled:opacity-30"
                    disabled={!inputValue.trim()}
                  >
                    <Send size={20} fill="currentColor" />
                  </button>
                </div>
                <button 
                  onClick={() => setShowLeadForm(true)}
                  className="w-full flex items-center justify-center mt-4 space-x-2 opacity-50 hover:opacity-100 transition-opacity text-gray-500 hover:text-royal-blue"
                >
                  <PhoneCall size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Connect to Human Expert</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FloatingChatbot;
