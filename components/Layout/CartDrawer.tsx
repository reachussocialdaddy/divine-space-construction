import React from 'react';
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartItem } from '../../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
              <div className="flex items-center space-x-3">
                <ShoppingBag className="text-royal-blue" size={24} />
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Your Cart</h2>
                <span className="bg-royal-blue/10 text-royal-blue text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">
                  {items.length} {items.length === 1 ? 'Item' : 'Items'}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                    <ShoppingBag size={40} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Your cart is empty</h3>
                    <p className="text-sm text-gray-500 mt-2">Looks like you haven't added anything yet.</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-8 py-3 bg-royal-blue text-white font-bold uppercase text-[11px] tracking-widest hover:bg-brand-black transition-all"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-24 h-24 bg-gray-50 rounded-sm overflow-hidden border border-gray-100 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                    </div>
                    <div className="flex-grow space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-tight line-clamp-2 leading-tight pr-4">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product_id)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-sm font-bold text-royal-blue">${item.price.toFixed(2)}</p>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-gray-200 rounded-sm bg-gray-50">
                          <button
                            onClick={() => onUpdateQuantity(item.product_id, Math.max(1, item.quantity - 1))}
                            className="p-1.5 text-gray-400 hover:text-gray-900"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-[10px] font-bold">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
                            className="p-1.5 text-gray-400 hover:text-gray-900"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <p className="text-xs font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 uppercase tracking-widest font-bold text-[10px]">Subtotal</span>
                    <span className="text-gray-900 font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 uppercase tracking-widest font-bold text-[10px]">Shipping</span>
                    <span className="text-green-600 font-bold uppercase text-[10px]">Calculated at checkout</span>
                  </div>
                  <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900 uppercase tracking-tight">Total</span>
                    <span className="text-2xl font-bold text-royal-blue">${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={onCheckout}
                  className="w-full bg-brand-black text-white py-5 font-bold uppercase text-[11px] tracking-[0.3em] hover:bg-royal-blue transition-all shadow-xl flex items-center justify-center group"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <p className="text-[9px] text-gray-400 text-center uppercase tracking-widest leading-relaxed">
                  Shipping, taxes, and discounts will be calculated during checkout.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
