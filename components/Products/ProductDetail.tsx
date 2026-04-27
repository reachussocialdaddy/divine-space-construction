import React, { useState, useEffect } from 'react';
import { Product, View } from '../../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  Share2,
  Facebook,
  Twitter,
  Mail,
  Plus,
  Minus,
  Lock,
  CheckCircle2,
  Truck,
  HeadphonesIcon,
  CreditCard,
  Search,
  Instagram,
  Home,
  Headphones,
  Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductDetailProps {
  productId: string;
  products: Product[];
  navigateTo: (view: View, id?: string) => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId, products, navigateTo, onAddToCart }) => {
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1621905252507-b354bcadcabc?auto=format&fit=crop&q=60&w=800';

  useEffect(() => {
    const found = products.find(p => p.id === productId);
    setProduct(found);
    if (found) {
      if (found.colors && found.colors.length > 0) setSelectedColor(found.colors[0]);
      if (found.sizes && found.sizes.length > 0) setSelectedSize(found.sizes[0]);
    }
    window.scrollTo(0, 0);
  }, [productId, products]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-royal-blue"></div>
      </div>
    );
  }

  // Helper to get color hex from name
  const getColorHex = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('brass')) return '#8B7355';
    if (lower.includes('nickel') || lower.includes('chrome') || lower.includes('silver')) return '#C0C0C0';
    if (lower.includes('black')) return '#1A1A1A';
    if (lower.includes('gold')) return '#FFD700';
    return '#E5E7EB'; // Default gray
  };

  const images = [
    product.image,
    ...(product.images || [])
  ];

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 6);
  const recentlyViewed = products.slice(0, 2);

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center space-x-2">
        <button onClick={() => navigateTo('Home')} className="hover:text-royal-blue flex items-center"><Home size={12} className="mr-1" /> Home</button>
        <span>/</span>
        <button onClick={() => navigateTo('Products')} className="hover:text-royal-blue">Products</button>
        <span>/</span>
        <button onClick={() => navigateTo('Products', product.category)} className="hover:text-royal-blue">{product.category}</button>
        <span>/</span>
        <span className="text-brand-black">{product.name}</span>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Image Gallery */}
          <div className="lg:w-1/2 flex gap-4">
            <div className="flex flex-col gap-4 w-20">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square border-2 rounded-sm overflow-hidden transition-all ${
                    selectedImage === idx ? 'border-royal-blue' : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="flex-grow relative aspect-square bg-white rounded-sm overflow-hidden border border-gray-100 group">
              <img 
                src={images[selectedImage]} 
                alt={product.name} 
                className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="text-[10px] text-gray-400 flex items-center justify-center uppercase tracking-widest">
                  <Search size={12} className="mr-2" /> Roll over image to zoom in
                </p>
              </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:w-1/2 space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 uppercase tracking-tight">{product.name}</h1>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-royal-blue">{product.brand || 'WINNEC'}</span>
                  {product.sku && <span className="text-gray-400">SKU: {product.sku}</span>}
                </div>
                <div className="flex items-center space-x-3">
                  <button className="p-2 text-gray-400 hover:text-royal-blue transition-colors"><Facebook size={18} /></button>
                  <button className="p-2 text-gray-400 hover:text-royal-blue transition-colors"><Share2 size={18} /></button>
                  <button className="p-2 text-gray-400 hover:text-royal-blue transition-colors"><Twitter size={18} /></button>
                  <button className="p-2 text-gray-400 hover:text-royal-blue transition-colors"><Mail size={18} /></button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-widest">Color: <span className="text-gray-500 font-normal">{selectedColor}</span></p>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`w-10 h-10 rounded-sm border-2 transition-all ${
                          selectedColor === c ? 'border-royal-blue p-0.5' : 'border-gray-100 p-0.5 hover:border-gray-300'
                        }`}
                      >
                        <div className="w-full h-full rounded-sm shadow-inner" style={{ backgroundColor: getColorHex(c) }} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-widest">Size / CC: <span className="text-gray-500 font-normal">{selectedSize}</span></p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest border-2 rounded-sm transition-all ${
                          selectedSize === s 
                            ? 'border-brand-black bg-brand-black text-white' 
                            : 'border-gray-100 text-gray-400 hover:border-gray-300'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="pt-6 border-t border-gray-100">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-gray-900">{product.price}</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-3">
                  Pay over time for orders over <span className="font-bold">$35.00</span> with <span className="text-royal-blue font-bold">shop Pay</span> <button className="underline">Learn more</button>
                </p>
              </div>

              {/* Quantity & Actions */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-200 rounded-sm bg-gray-50">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 text-gray-400 hover:text-gray-900"
                    >
                      <Minus size={14} />
                    </button>
                    <input 
                      type="number" 
                      value={quantity} 
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-12 text-center text-xs font-bold outline-none bg-transparent" 
                    />
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 text-gray-400 hover:text-gray-900"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={() => product && onAddToCart(product, quantity)}
                    className="w-full bg-brand-black text-white py-5 font-bold uppercase text-[11px] tracking-[0.3em] hover:bg-royal-blue transition-all shadow-xl"
                  >
                    Add to cart
                  </button>
                  <button className="w-full bg-[#5a31f4] text-white py-5 font-bold rounded-sm flex items-center justify-center space-x-2 hover:bg-[#4a21e4] transition-all shadow-lg">
                    <span className="text-[11px] uppercase tracking-widest">Buy with</span>
                    <span className="text-lg font-black italic">shop Pay</span>
                  </button>
                  <button className="w-full text-[10px] font-bold text-gray-400 uppercase tracking-widest underline text-center hover:text-royal-blue transition-colors">More payment options</button>
                </div>
              </div>

              {/* Pickup Info */}
              <div className="p-5 bg-gray-50 border border-gray-100 rounded-sm space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 size={18} className="text-green-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-gray-900 uppercase tracking-widest">Pickup available at Winnec Markham</p>
                    <p className="text-[11px] text-gray-500 mt-1">Usually ready in 2-4 days</p>
                    <button className="text-[10px] font-bold text-royal-blue underline mt-2 uppercase tracking-widest">Check availability at other stores</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-24 border-t border-gray-100 pt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 uppercase tracking-tight">Description</h2>
          <div className="space-y-16">
            <div className="max-w-5xl mx-auto">
              <img 
                src={product.image} 
                alt="Product Detail" 
                className="w-full rounded-sm shadow-2xl border border-gray-50"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <p className="text-gray-600 leading-relaxed text-sm">
                  {product.description}
                </p>
                {product.specs && product.specs.length > 0 && (
                  <div className="bg-gray-50 p-8 rounded-sm border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-widest text-[10px] border-b border-gray-200 pb-3">Technical Specifications</h4>
                    <table className="w-full text-[11px] uppercase tracking-wider">
                      <tbody className="text-gray-600 font-medium">
                        {product.specs.map((spec, idx) => (
                          <tr key={idx} className="border-t border-gray-100">
                            <td className="py-3 font-bold text-gray-400">{spec.label}</td>
                            <td className="py-3 text-right">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="bg-white aspect-square rounded-sm border border-gray-100 flex items-center justify-center p-12 shadow-inner">
                <img src={product.image} alt="Technical Drawing" className="max-w-full max-h-full object-contain opacity-80" />
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Security */}
        <div className="mt-24 p-10 border border-gray-100 rounded-sm bg-white shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-bold text-gray-900 flex items-center uppercase tracking-tight">
              Payment & Security <Lock size={20} className="ml-3 text-royal-blue" />
            </h3>
          </div>
          <div className="flex flex-wrap gap-5 mb-8">
            {['AMEX', 'APPLE', 'GOOGLE', 'DISC', 'MC', 'PAYPAL', 'SHOP', 'VISA'].map(card => (
              <div key={card} className="h-10 w-16 bg-gray-50 rounded-sm border border-gray-100 flex items-center justify-center text-[9px] font-black text-gray-400 uppercase tracking-widest shadow-sm">{card}</div>
            ))}
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed max-w-2xl">
            Your payment information is processed securely. We do not store credit card details nor have access to your credit card information.
          </p>
        </div>

        {/* You may also like */}
        <div className="mt-24">
          <h3 className="text-2xl font-bold text-gray-900 mb-12 uppercase tracking-tight border-b border-gray-100 pb-6">You may also like</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {relatedProducts.map((p) => (
              <div key={p.id} onClick={() => navigateTo('ProductDetail', p.id)} className="group cursor-pointer">
                <div className="aspect-square bg-white border border-gray-100 mb-5 overflow-hidden p-6 flex items-center justify-center shadow-sm group-hover:shadow-lg transition-all duration-300">
                  <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500" />
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">WINNEC</p>
                <h4 className="text-[13px] font-bold text-gray-800 uppercase tracking-tight mb-2 group-hover:text-royal-blue transition-colors line-clamp-1">{p.name}</h4>
                <p className="text-[13px] font-bold text-gray-700">From {p.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recently viewed */}
        <div className="mt-24">
          <h3 className="text-2xl font-bold text-gray-900 mb-12 uppercase tracking-tight border-b border-gray-100 pb-6">Recently viewed</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {recentlyViewed.map((p) => (
              <div key={p.id} onClick={() => navigateTo('ProductDetail', p.id)} className="group cursor-pointer">
                <div className="aspect-square bg-white border border-gray-100 mb-5 overflow-hidden p-6 flex items-center justify-center shadow-sm group-hover:shadow-lg transition-all duration-300">
                  <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500" />
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">WINNEC</p>
                <h4 className="text-[13px] font-bold text-gray-800 uppercase tracking-tight mb-2 group-hover:text-royal-blue transition-colors line-clamp-1">{p.name}</h4>
                <p className="text-[13px] font-bold text-gray-700">From {p.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges Section */}
        <div className="bg-gray-50 py-20 border-t border-gray-100 mt-24 -mx-4 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-white shadow-sm rounded-sm text-royal-blue">
                  <Home size={24} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">Welcome to Divine Space!</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Divine Space Inc. official Canadian online store. The one-stop shop for all Divine Space hardware!
                  </p>
                  <p className="text-[11px] text-gray-500 leading-relaxed mt-2">
                    We stock over 3000 high quality hardware products.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-white shadow-sm rounded-sm text-royal-blue">
                  <Truck size={24} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">Free local delivery for orders over $300</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    $20 shipping fee for all orders below $300
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-white shadow-sm rounded-sm text-royal-blue">
                  <Headphones size={24} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">TOP-NOTCH SUPPORT</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Feel free to contact us on the phone & email.
                  </p>
                  <button className="text-[11px] font-bold text-royal-blue hover:underline mt-2 uppercase tracking-widest">Contact Us</button>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-white shadow-sm rounded-sm text-royal-blue">
                  <Lock size={24} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">SECURE PAYMENTS</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    We accept MasterCard, Visa and AMEX.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
