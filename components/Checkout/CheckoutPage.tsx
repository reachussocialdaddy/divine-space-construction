import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, MapPin, Phone, User, Mail, ShoppingBag, ArrowRight, Lock, LogIn } from 'lucide-react';
import { CartItem, UserProfile } from '../../types';

interface CheckoutPageProps {
  cart: CartItem[];
  onBack: () => void;
  onCheckout: (userData: { name: string, email: string, phone: string, address: string, city: string, postalCode: string }) => Promise<void>;
  currentUser: UserProfile | null;
  onLogin: (email: string, password?: string) => Promise<UserProfile>;
  onRegister: (userData: Partial<UserProfile>) => Promise<UserProfile>;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, onBack, onCheckout, currentUser, onLogin, onRegister }) => {
  const [step, setStep] = useState<'shipping' | 'payment' | 'success'>('shipping');
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.full_name || prev.name,
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone,
        address: currentUser.address || prev.address,
        city: currentUser.city || prev.city,
        postalCode: currentUser.postal_code || prev.postalCode
      }));
    }
  }, [currentUser]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (isLoginMode) {
      setIsSubmitting(true);
      try {
        await onLogin(formData.email, formData.password);
        // After login, we stay on shipping step but with pre-filled data
        setIsLoginMode(false);
      } catch (error: any) {
        setAuthError(error.message || 'Login failed');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (createAccount && !currentUser) {
      setIsSubmitting(true);
      try {
        await onRegister({
          email: formData.email,
          full_name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postalCode,
          password: formData.password
        });
      } catch (error: any) {
        setAuthError(error.message || 'Registration failed');
        setIsSubmitting(false);
        return;
      } finally {
        setIsSubmitting(false);
      }
    }

    setStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onCheckout(formData);
      setStep('success');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 border border-gray-100 rounded-sm shadow-sm text-center max-w-md mx-auto"
        >
          <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-widest mb-4">Order Placed!</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest leading-relaxed mb-8">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
          <button
            onClick={onBack}
            className="w-full bg-royal-blue text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-opacity-90 transition-all"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={onBack}
          className="flex items-center text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-royal-blue transition-colors mb-8"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Shopping
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 border border-gray-100 rounded-sm shadow-sm"
          >
            {step === 'shipping' ? (
              <>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-gray-900 uppercase tracking-widest flex items-center">
                    <User size={20} className="mr-3 text-royal-blue" /> {isLoginMode ? 'User Login' : 'Shipping Information'}
                  </h2>
                  {!currentUser && (
                    <button 
                      onClick={() => {
                        setIsLoginMode(!isLoginMode);
                        setAuthError(null);
                      }}
                      className="text-[10px] font-bold text-royal-blue uppercase tracking-widest hover:underline flex items-center"
                    >
                      {isLoginMode ? (
                        <>New User? Register</>
                      ) : (
                        <><LogIn size={12} className="mr-1" /> Already have an account? Login</>
                      )}
                    </button>
                  )}
                </div>

                {authError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase tracking-widest">
                    {authError}
                  </div>
                )}

                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  {!isLoginMode && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input
                            required
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 text-xs focus:outline-none focus:border-royal-blue transition-colors"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input
                            required
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 text-xs focus:outline-none focus:border-royal-blue transition-colors"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {isLoginMode && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input
                            required
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 text-xs focus:outline-none focus:border-royal-blue transition-colors"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input
                            required
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 text-xs focus:outline-none focus:border-royal-blue transition-colors"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {!isLoginMode && (
                    <>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input
                            required
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 text-xs focus:outline-none focus:border-royal-blue transition-colors"
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Shipping Address</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-4 text-gray-400" size={16} />
                          <textarea
                            required
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows={3}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 text-xs focus:outline-none focus:border-royal-blue transition-colors resize-none"
                            placeholder="Street address, Apartment, Suite, etc."
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">City</label>
                          <input
                            required
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 text-xs focus:outline-none focus:border-royal-blue transition-colors"
                            placeholder="Toronto"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Postal Code</label>
                          <input
                            required
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 text-xs focus:outline-none focus:border-royal-blue transition-colors"
                            placeholder="M5V 2H1"
                          />
                        </div>
                      </div>

                      {!currentUser && (
                        <div className="space-y-4 pt-4">
                          <label className="flex items-center space-x-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={createAccount}
                              onChange={(e) => setCreateAccount(e.target.checked)}
                              className="w-4 h-4 border-gray-100 rounded-sm text-royal-blue focus:ring-royal-blue"
                            />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-royal-blue transition-colors">
                              Create an account for later?
                            </span>
                          </label>

                          {createAccount && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="space-y-2"
                            >
                              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Create Password</label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                  required={createAccount}
                                  type="password"
                                  name="password"
                                  value={formData.password}
                                  onChange={handleChange}
                                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 text-xs focus:outline-none focus:border-royal-blue transition-colors"
                                  placeholder="••••••••"
                                />
                              </div>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-royal-blue text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-opacity-90 transition-all flex items-center justify-center disabled:opacity-50"
                    >
                      {isLoginMode ? (
                        isSubmitting ? 'Logging in...' : 'Login to Account'
                      ) : (
                        <>Continue to Payment <ArrowRight size={16} className="ml-2" /></>
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-widest mb-8 flex items-center">
                  <CreditCard size={20} className="mr-3 text-royal-blue" /> Payment Method
                </h2>

                <div className="space-y-6">
                  <div className="p-4 border border-royal-blue bg-royal-blue bg-opacity-5 rounded-sm flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-6 bg-gray-800 rounded-sm mr-4"></div>
                      <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">Credit / Debit Card</span>
                    </div>
                    <div className="w-4 h-4 rounded-full border-4 border-royal-blue"></div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Card Number</label>
                      <input
                        disabled
                        type="text"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 text-xs focus:outline-none"
                        placeholder="**** **** **** 4242"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Expiry Date</label>
                        <input
                          disabled
                          type="text"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 text-xs focus:outline-none"
                          placeholder="MM / YY"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">CVV</label>
                        <input
                          disabled
                          type="text"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 text-xs focus:outline-none"
                          placeholder="***"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 space-y-4">
                    <button
                      onClick={handlePaymentSubmit}
                      disabled={isSubmitting}
                      className="w-full bg-royal-blue text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isSubmitting ? 'Processing Payment...' : 'Complete Purchase'}
                    </button>
                    <button
                      onClick={() => setStep('shipping')}
                      className="w-full text-gray-400 py-2 text-[10px] font-bold uppercase tracking-widest hover:text-royal-blue transition-colors"
                    >
                      Back to Shipping
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="bg-white p-8 border border-gray-100 rounded-sm shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-widest mb-8 flex items-center">
                <ShoppingBag size={20} className="mr-3 text-royal-blue" /> Order Summary
              </h2>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-sm overflow-hidden border border-gray-100 flex items-center justify-center p-2">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest">{item.name}</h4>
                        <p className="text-[10px] text-gray-400 mt-1">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
                <div className="flex justify-between text-xs text-gray-400 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400 uppercase tracking-widest">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-900 uppercase tracking-widest pt-4">
                  <span>Total</span>
                  <span className="text-royal-blue">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-royal-blue bg-opacity-5 p-6 border border-royal-blue border-opacity-10 rounded-sm">
              <p className="text-[10px] text-royal-blue font-bold uppercase tracking-widest leading-relaxed">
                Secure SSL Encryption. Your information is protected and will only be used for shipping purposes.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
