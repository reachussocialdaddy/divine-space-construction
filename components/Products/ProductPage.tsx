
import React, { useState, useEffect, useMemo } from 'react';
import { Product, PageSectionContent, ProductCategory, ProductSubCategory } from '../../types.ts';
import { MessageCircle, X, Search, MapPin, ChevronLeft, ArrowRight, Star, SlidersHorizontal, Home, ShieldCheck, Truck, Headphones, Lock, ChevronRight, ChevronDown, Package, CheckCircle2, CreditCard, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductPageProps {
  products: Product[];
  categories: ProductCategory[];
  subCategories: ProductSubCategory[];
  onProductClick?: (id: string) => void;
  pageContent?: PageSectionContent[];
  initialCategory?: string | null;
  initialSubCategoryId?: string | null;
}

const ProductPage: React.FC<ProductPageProps> = ({ products, categories: dynamicCategories, subCategories, onProductClick, pageContent, initialCategory, initialSubCategoryId }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string | null>(initialSubCategoryId || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');

  const heroContent = pageContent?.find(c => c.section_key === 'products_hero');
  const newsletterContent = pageContent?.find(c => c.section_key === 'products_newsletter');

  const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=60&w=800';

  // Map dynamic categories to the format expected by the UI
  const displayCategories = useMemo(() => {
    return dynamicCategories.map(cat => ({
      id: cat.name, // Using name as ID for filtering since products use category name
      title: cat.name,
      subtitle: `Explore our ${cat.name} collection`,
      image: products.find(p => p.category === cat.name)?.image || FALLBACK_IMAGE,
      span: 'col-span-1'
    }));
  }, [dynamicCategories, products]);

  useEffect(() => {
    if (initialSubCategoryId) {
      const sub = subCategories.find(s => s.id === initialSubCategoryId);
      if (sub) {
        const parentCat = dynamicCategories.find(c => c.id === sub.category_id);
        if (parentCat) {
          setSelectedCategory(parentCat.name);
          setSelectedSubCategoryId(initialSubCategoryId);
          return;
        }
      }
    }
    setSelectedCategory(initialCategory || null);
    setSelectedSubCategoryId(initialSubCategoryId || null);
  }, [initialCategory, initialSubCategoryId, subCategories, dynamicCategories]);

  const handleCategoryClick = (cat: any) => {
    window.history.pushState({}, '', `/Products/${encodeURIComponent(cat.title)}`);
    setSelectedCategory(cat.id);
    window.scrollTo(0, 0);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = FALLBACK_IMAGE; 
  };

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return [];
    
    // Normalize category names for comparison (lowercase, replace hyphens with spaces)
    const normalizeCat = (cat: string) => cat.toLowerCase().replace(/-/g, ' ');
    const normalizedSelectedCat = normalizeCat(selectedCategory);

    let categoryProducts = products.filter(p => 
      normalizeCat(p.category) === normalizedSelectedCat
    );

    if (selectedSubCategoryId) {
      categoryProducts = categoryProducts.filter(p => p.subcategory_id === selectedSubCategoryId);
    }
    
    return categoryProducts.filter(p => 
      (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       p.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [selectedCategory, products, searchQuery]);

  const sendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    const message = encodeURIComponent(`Hi, I'm interested in the "${selectedProduct.name}" from your website.`);
    window.open(`https://wa.me/16475550123?text=${message}`, '_blank');
    setSelectedProduct(null);
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      <AnimatePresence mode="wait">
        {!selectedCategory ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="animate-in fade-in duration-500">
            <div className="max-w-7xl mx-auto px-4 py-20">
              <div className="text-center mb-16">
                <span className="text-royal-blue font-bold text-[10px] uppercase tracking-[0.5em] mb-4 block">
                  {heroContent?.subtitle || 'Product Collections'}
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-brand-black mb-4 uppercase tracking-tighter">
                  {heroContent?.title || 'Shop by Category'}
                </h2>
                <div className="w-16 h-1 bg-royal-blue mx-auto" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-20">
                {displayCategories.map((cat, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }} 
                    onClick={() => handleCategoryClick(cat)} 
                    className={`relative group overflow-hidden bg-gray-100 rounded-sm cursor-pointer ${cat.span} aspect-[4/3] md:aspect-auto border border-gray-100 shadow-sm`}
                  >
                    <img src={cat.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.85] group-hover:brightness-100 min-h-[300px]" alt={cat.title} onError={handleImageError} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 group-hover:opacity-60 transition-opacity" />
                    <div className="absolute bottom-8 left-8 text-white z-10 transition-transform group-hover:-translate-y-2">
                      <h3 className="text-2xl md:text-3xl font-bold mb-2 leading-tight uppercase tracking-tight">{cat.title}</h3>
                      <p className="text-[10px] md:text-xs text-white/80 font-bold tracking-[0.2em] uppercase">{cat.subtitle}</p>
                    </div>
                  </motion.div>
                ))}
                {displayCategories.length === 0 && (
                  <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 bg-gray-50/50 rounded-sm">
                    <Package size={48} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No collections available yet</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <CategoryDetail 
            categoryId={selectedCategory} 
            displayCategories={displayCategories}
            dynamicCategories={dynamicCategories}
            subCategories={subCategories}
            selectedSubCategoryId={selectedSubCategoryId}
            setSelectedSubCategoryId={setSelectedSubCategoryId}
            setSelectedCategory={setSelectedCategory}
            filteredProducts={filteredProducts}
            handleImageError={handleImageError}
            onProductClick={onProductClick}
          />
        )}
      </AnimatePresence>

      <section className="bg-white py-24 text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto px-4 relative z-10">
          <span className="text-royal-blue font-bold text-[10px] uppercase tracking-[0.5em] mb-4 block">
            {newsletterContent?.subtitle || 'Newsletter'}
          </span>
          <h3 className="text-3xl font-bold mb-4 uppercase tracking-tighter text-brand-black">
            {newsletterContent?.title || 'Join our inner circle'}
          </h3>
          <p className="text-gray-500 text-sm mb-10 leading-relaxed">
            {newsletterContent?.description || 'Subscribe to receive first-look access to new product collections, design inspiration, and special events.'}
          </p>
          <form className="flex flex-col sm:flex-row gap-0 shadow-2xl border border-gray-100" onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); setEmail(''); }}>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="flex-grow px-8 py-5 bg-gray-50 text-brand-black outline-none text-sm font-medium focus:bg-white transition-colors" />
            <button className="bg-brand-black px-12 py-5 font-bold text-[10px] text-white uppercase tracking-widest hover:bg-royal-blue transition-all">Subscribe</button>
          </form>
        </div>
      </section>

      {selectedProduct && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-sm overflow-hidden shadow-2xl relative p-10 border border-gray-100">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 text-gray-400 hover:text-royal-blue"><X size={24} /></button>
            <div className="flex flex-col items-center text-center mb-8 pb-8 border-b border-gray-50">
              <div className="w-32 h-32 bg-gray-50 mb-6 shadow-inner overflow-hidden border border-gray-100">
                <img src={selectedProduct.image} className="w-full h-full object-cover" alt="Thumbnail" onError={handleImageError} />
              </div>
              <div>
                <p className="text-[10px] text-royal-blue font-black uppercase tracking-[0.3em] mb-2">{selectedProduct.category}</p>
                <h4 className="font-bold text-brand-black text-2xl uppercase tracking-tight">{selectedProduct.name}</h4>
                <p className="text-gray-400 font-bold text-sm mt-1">{selectedProduct.price}</p>
              </div>
            </div>
            <form onSubmit={sendWhatsApp} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Your Inquiry</label>
                <textarea className="w-full border border-gray-100 p-4 text-sm outline-none bg-gray-50 focus:bg-white focus:border-royal-blue transition-all h-24" placeholder={`Tell us about your project for ${selectedProduct.name}...`} />
              </div>
              <button type="submit" className="w-full py-5 bg-brand-black text-white font-bold tracking-widest text-[10px] uppercase hover:bg-royal-blue transition-all shadow-xl flex items-center justify-center">
                <MessageCircle size={18} className="mr-2" /> Inquire via WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;

interface CategoryDetailProps {
  categoryId: string;
  displayCategories: any[];
  dynamicCategories: ProductCategory[];
  subCategories: ProductSubCategory[];
  selectedSubCategoryId: string | null;
  setSelectedSubCategoryId: (id: string | null) => void;
  setSelectedCategory: (id: string | null) => void;
  filteredProducts: Product[];
  handleImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onProductClick?: (id: string) => void;
}

const CategoryDetail: React.FC<CategoryDetailProps> = ({ 
  categoryId, displayCategories, dynamicCategories, subCategories, 
  selectedSubCategoryId, setSelectedSubCategoryId, setSelectedCategory,
  filteredProducts, handleImageError, onProductClick 
}) => {
  const normalizeCat = (cat: string) => cat.toLowerCase().replace(/-/g, ' ');
  const normalizedCategoryId = normalizeCat(categoryId);
  
  const cat = displayCategories.find(c => normalizeCat(c.id) === normalizedCategoryId);
  
  if (!cat) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-royal-blue"></div>
      </div>
    );
  }
  
  const actualCategory = dynamicCategories.find(c => normalizeCat(c.name) === normalizedCategoryId);
  const currentSubCategories = actualCategory ? subCategories.filter(sc => sc.category_id === actualCategory.id) : [];
  
  const handleSubCategoryClick = (subId: string | null) => {
    setSelectedSubCategoryId(subId);
    if (subId) {
      window.history.pushState({}, '', `/Products/sub:${subId}`);
    } else {
      window.history.pushState({}, '', `/Products/${encodeURIComponent(categoryId)}`);
    }
    window.scrollTo(0, 0);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="animate-in fade-in duration-500 pb-20 bg-white">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          <button onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }} className="hover:text-royal-blue flex items-center"><Home size={12} className="mr-1" /> Home</button>
          <span>/</span>
          <button onClick={() => { window.history.pushState({}, '', '/Products'); setSelectedCategory(null); setSelectedSubCategoryId(null); window.dispatchEvent(new PopStateEvent('popstate')); }} className="hover:text-royal-blue">Products</button>
          <span>/</span>
          <button onClick={() => handleSubCategoryClick(null)} className={`${!selectedSubCategoryId ? 'text-brand-black' : 'hover:text-royal-blue'}`}>{cat.title}</button>
          {selectedSubCategoryId && (
            <>
              <span>/</span>
              <span className="text-brand-black">{subCategories.find(s => s.id === selectedSubCategoryId)?.name}</span>
            </>
          )}
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative h-[450px] overflow-hidden bg-[#1a1a1a]">
        <img src={cat.image} className="w-full h-full object-cover opacity-40 grayscale brightness-75" alt="Banner" onError={handleImageError} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight uppercase">
            {selectedSubCategoryId ? subCategories.find(s => s.id === selectedSubCategoryId)?.name : cat.title}
          </h1>
          <p className="text-white/80 max-w-4xl text-sm md:text-base leading-relaxed mx-auto font-light">
            {selectedSubCategoryId 
              ? subCategories.find(s => s.id === selectedSubCategoryId)?.description || `Explore our premium ${subCategories.find(s => s.id === selectedSubCategoryId)?.name} collection.`
              : `Along with the high end ${cat.title.toLowerCase()} from our premium collections, Divine Space offer our customers the most cost saving solutions for nice designed products.`
            }
          </p>
        </div>
      </div>

      {/* Sub-Categories Navigation */}
      {currentSubCategories.length > 0 && (
        <div className="bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center">
                <Filter size={12} className="mr-2" /> Sub-Products:
              </span>
              <button 
                onClick={() => handleSubCategoryClick(null)}
                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all ${!selectedSubCategoryId ? 'bg-royal-blue border-royal-blue text-white shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:border-royal-blue hover:text-royal-blue'}`}
              >
                All {cat.title}
              </button>
              {currentSubCategories.map(sub => (
                <button 
                  key={sub.id}
                  onClick={() => handleSubCategoryClick(sub.id)}
                  className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all ${selectedSubCategoryId === sub.id ? 'bg-royal-blue border-royal-blue text-white shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:border-royal-blue hover:text-royal-blue'}`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Products Grid Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-end mb-10 border-b border-gray-100 pb-6">
          <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">
            {selectedSubCategoryId ? subCategories.find(s => s.id === selectedSubCategoryId)?.name : cat.title} by Divine Space
          </h2>
          <button className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] hover:text-royal-blue transition-colors">View All</button>
        </div>
        
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${categoryId.toLowerCase() === '3d-view' ? 'md:grid-cols-3 lg:grid-cols-3' : 'md:grid-cols-3 lg:grid-cols-6'} gap-x-6 gap-y-12`}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <motion.div 
                key={product.id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group cursor-pointer" 
                onClick={() => onProductClick?.(product.id)}
              >
                <div className={`relative ${categoryId.toLowerCase() === '3d-view' ? 'aspect-[4/3]' : 'aspect-square'} overflow-hidden bg-gray-50 mb-4 border border-gray-100 group-hover:shadow-xl transition-all duration-500`}>
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onError={handleImageError} />
                  {categoryId.toLowerCase() === '3d-view' && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest shadow-lg">
                      Handles
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/90 backdrop-blur-sm">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-royal-blue">View Details</p>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight mb-1 group-hover:text-royal-blue transition-colors">{product.name}</h3>
                <p className={`font-bold mb-2 ${categoryId.toLowerCase() === '3d-view' ? 'text-red-600 text-lg' : 'text-gray-400 text-[10px]'}`}>
                  {categoryId.toLowerCase() === '3d-view' ? `$${product.price}` : product.price}
                </p>
                {categoryId.toLowerCase() === '3d-view' && (
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                    {product.description}
                  </p>
                )}
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 bg-gray-50/50 rounded-sm">
              <Package size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No products found in this category</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
