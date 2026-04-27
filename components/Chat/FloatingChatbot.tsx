
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, PhoneCall } from 'lucide-react';
import { getGeminiResponse } from '../../services/geminiService.ts';
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
    setMessages(prev => [...prev, { role: 'model', parts: [{ text }] }]);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    const newMessages: ChatMessage[] = [...messages, { role: 'user', parts: [{ text: userText }] }];
    setMessages(newMessages);
    setInputValue('');

    setIsTyping(true);
    try {
      console.log("Sending message to AI:", userText);
      const response = await getGeminiResponse(userText, messages);
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
                    {msg.role === 'model' ? (
                      <TypewriterText text={msg.parts[0].text} onUpdate={scrollToBottom} />
                    ) : (
                      msg.parts[0].text
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
            <div className="flex items-center justify-center mt-4 space-x-2 opacity-30">
              <PhoneCall size={10} />
              <span className="text-[9px] font-bold uppercase tracking-widest">Connect to Human Expert</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingChatbot;
