import React, { useState, useEffect } from 'react';
import { View, Lead, GalleryProject, Product, ProjectPin, FAQ, HeroSlide, PageSectionContent, SiteSettings, Client, ProductCategory, ProductSubCategory, Service, CartItem, Order, AbandonedCart, UserProfile } from './types';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import HomePage from './components/Home/HomePage';
import AboutPage from './components/About/AboutPage';
import ProductPage from './components/Products/ProductPage';
import ProductDetail from './components/Products/ProductDetail';
import InvernessPage from './components/Products/InvernessPage';
import AdminPanel from './components/Admin/AdminPanel';
import ServiceDetail from './components/Services/ServiceDetail';
import ProcessPage from './components/Process/ProcessPage';
import ProjectsPage from './components/Projects/ProjectsPage';
import ClientsPage from './components/Clients/ClientsPage';
import ContactPage from './components/Contact/ContactPage';
import LegalPage from './components/Legal/LegalPage';
import FloatingChatbot from './components/Chat/FloatingChatbot';
import QuoteModal from './components/Layout/QuoteModal';
import CartDrawer from './components/Layout/CartDrawer';
import CheckoutPage from './components/Checkout/CheckoutPage';
import { supabase } from './supabaseClient';
import { MOCK_CLIENTS, MOCK_PRODUCTS, MOCK_PROJECT_PINS, SERVICES, MOCK_PROJECTS } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('Home');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubCategoryId, setActiveSubCategoryId] = useState<string | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  
  // States for DB Content - Initialized as empty to ensure only DB data is shown in Admin
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<GalleryProject[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [subCategories, setSubCategories] = useState<ProductSubCategory[]>([]);
  const [pins, setPins] = useState<ProjectPin[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  
  // E-commerce States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [abandonedCarts, setAbandonedCarts] = useState<AbandonedCart[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [pageContent, setPageContent] = useState<PageSectionContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<SiteSettings>({
    logo_url: '',
    footer_logo_url: '',
    brand_name: '',
    brand_subtext: '',
    phone: '+1 (647) 509-8304 / +1 (289) 946-2003',
    email: '',
    address: '',
    tiktok_url: ''
  });

  useEffect(() => {
    fetchInitialData();

    const handleRouteChange = () => {
      const path = window.location.pathname;
      const normalizedPath = path.toLowerCase().replace(/^\/|\/$/g, ''); // Remove leading/trailing slashes
      
      if (normalizedPath === 'admin') {
        setCurrentView('Admin');
        return;
      }
      
      if (normalizedPath.startsWith('service/')) {
        const id = normalizedPath.split('/')[1];
        setSelectedServiceId(id);
        setCurrentView('Service');
      } else if (normalizedPath.startsWith('products/detail/')) {
        const id = normalizedPath.split('/')[2];
        setSelectedProductId(id);
        setCurrentView('ProductDetail');
      } else if (normalizedPath.startsWith('products/')) {
        const parts = normalizedPath.split('/');
        if (parts.length === 2) {
          const catParam = decodeURIComponent(parts[1]);
          if (catParam.startsWith('sub:')) {
            setActiveSubCategoryId(catParam.replace('sub:', ''));
            setActiveCategory(null); // Will be resolved by ProductPage or we can resolve it here if we have subCategories
          } else {
            setActiveCategory(catParam);
            setActiveSubCategoryId(null);
          }
        } else {
          setActiveCategory(null);
          setActiveSubCategoryId(null);
        }
        setCurrentView('Products');
      } else if (normalizedPath === 'inverness') {
        setCurrentView('Inverness');
        setActiveCategory('Quartz');
        setActiveSubCategoryId(null);
      } else if (['home', 'about', 'products', 'admin', 'process', 'projects', 'clients', 'contact', 'inverness', 'privacy', 'terms'].includes(normalizedPath)) {
        const viewMap: Record<string, View> = {
          home: 'Home',
          about: 'About',
          products: 'Products',
          admin: 'Admin',
          process: 'Process',
          projects: 'Projects',
          clients: 'Clients',
          contact: 'Contact',
          inverness: 'Inverness',
          privacy: 'Privacy',
          terms: 'Terms'
        };
        setCurrentView(viewMap[normalizedPath]);
      } else if (normalizedPath === '') {
        setCurrentView('Home');
      }
    };
    window.addEventListener('popstate', handleRouteChange);
    handleRouteChange();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        navigateTo('Admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const fetchInitialData = async () => {
    try {
      const [
        { data: leadsData },
        { data: projectsData },
        { data: clientsData },
        { data: productsData },
        { data: categoriesData },
        { data: subCategoriesData },
        { data: pinsData },
        { data: faqsData },
        { data: slidesData },
        { data: contentData },
        { data: settingsData },
        { data: servicesData },
        { data: ordersData },
        { data: abandonedCartsData },
        { data: usersData }
      ] = await Promise.all([
        supabase.from('leads').select('*').order('timestamp', { ascending: false }),
        supabase.from('projects').select('*'),
        supabase.from('clients').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('product_categories').select('*').order('name', { ascending: true }),
        supabase.from('product_subcategories').select('*').order('name', { ascending: true }),
        supabase.from('project_pins').select('*'),
        supabase.from('faqs').select('*'),
        supabase.from('hero_slides').select('*').order('id', { ascending: true }),
        supabase.from('page_content').select('*'),
        supabase.from('site_settings').select('*'),
        supabase.from('services').select('*').order('created_at', { ascending: true }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('abandoned_carts').select('*').order('last_updated', { ascending: false }),
        supabase.from('user_profiles').select('*').order('created_at', { ascending: false })
      ]);

      if (leadsData) setLeads(leadsData);
      if (projectsData && projectsData.length > 0) {
        setProjects(projectsData);
      } else {
        setProjects(MOCK_PROJECTS);
      }
      
      // Fallback for actual Clients
      if (clientsData && clientsData.length > 0) {
        setClients(clientsData);
      } else {
        setClients(MOCK_CLIENTS);
      }

      // Fallback for Products (Kitchen Corner Units, Cutlery Drawers, Quartz line)
      if (productsData && productsData.length > 0) {
        setProducts(productsData);
      } else {
        setProducts(MOCK_PRODUCTS);
      }

      // Fallback for Product Categories (renamed/seeded)
      if (categoriesData && categoriesData.length > 0) {
        setCategories(categoriesData.filter((c: any) => c.name.toLowerCase() !== 'kitchen'));
      } else {
        setCategories([
          { id: 'cabinet-sheet', name: 'Cabinet Sheet', slug: 'cabinet-sheet' },
          { id: 'Smart Hardware', name: 'Smart Hardware', slug: 'smart-hardware' },
          { id: 'Quartz', name: 'Quartz', slug: 'quartz' }
        ]);
      }

      if (subCategoriesData) setSubCategories(subCategoriesData);

      // Merge database project pins with local MOCK_PROJECT_PINS so both are displayed on map
      const dbPins = pinsData ? pinsData.map((p: any) => ({
        ...p,
        lat: typeof p.lat === 'string' ? (parseFloat(p.lat) || 0) : (p.lat || 0),
        lng: typeof p.lng === 'string' ? (parseFloat(p.lng) || 0) : (p.lng || 0)
      })) : [];

      const mergedPins = [...MOCK_PROJECT_PINS];
      dbPins.forEach((dp: any) => {
        if (!mergedPins.some(mp => mp.id === dp.id || (dp.title && mp.title === dp.title))) {
          mergedPins.push(dp);
        }
      });
      setPins(mergedPins);

      if (faqsData && faqsData.length > 0) setFaqs(faqsData);

      // Correct tagline on home page slides dynamically and on fallback
      if (slidesData && slidesData.length > 0) {
        const correctedSlides = slidesData.map(s => {
          if (s.title.includes('We Built')) {
            return { ...s, title: s.title.replace('We Built', 'We Build') };
          }
          return s;
        });
        setHeroSlides(correctedSlides);
      } else {
        setHeroSlides([
          {
            id: 'default-1',
            image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1920',
            title: 'We Build Beautifully with the Best Possible Materials',
            subtitle: 'Legal Basements | Renovations | Modular Kitchens | Custom Closets',
            button_text: 'Get Free Quote'
          }
        ]);
      }

      if (contentData) setPageContent(contentData);

      // Enforcing the exact Services from constants.tsx for correct layout order
      setServices(SERVICES);

      if (ordersData) setOrders(ordersData);
      if (abandonedCartsData) setAbandonedCarts(abandonedCartsData);
      if (usersData) setUsers(usersData);
      
      if (settingsData) {
        const settingsObj: any = {};
        settingsData.forEach(s => settingsObj[s.key] = s.value);
        setSettings(prev => ({ ...prev, ...settingsObj }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cart Functions
  const addToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.product_id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product_id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      const priceValue = parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0;
      return [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        product_id: product.id,
        name: product.name,
        price: priceValue,
        image: product.image,
        quantity
      }];
    });
    setIsCartOpen(true);
    
    // Track as potential abandoned cart if user is identified
    if (currentUser) {
      updateAbandonedCart(currentUser, [...cart, {
        id: Math.random().toString(36).substr(2, 9),
        product_id: product.id,
        name: product.name,
        price: parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0,
        image: product.image,
        quantity
      }]);
    }
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart(prev => prev.map(item => 
      item.product_id === productId ? { ...item, quantity } : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product_id !== productId));
  };

  const updateAbandonedCart = async (user: UserProfile, items: CartItem[]) => {
    if (items.length === 0) return;
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const abandoned: Omit<AbandonedCart, 'id'> = {
      user_email: user.email,
      user_name: user.full_name,
      items,
      total,
      last_updated: new Date().toISOString()
    };
    
    try {
      await supabase.from('abandoned_carts').upsert([
        abandoned
      ], { onConflict: 'user_email' });
    } catch (error) {
      console.error('Error tracking abandoned cart:', error);
    }
  };

  const handleLogin = async (email: string, password?: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (error || !data) {
        throw new Error('Invalid email or password');
      }

      setCurrentUser(data);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleRegister = async (userData: Partial<UserProfile>) => {
    try {
      const newUser = {
        ...userData,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .insert([newUser])
        .select()
        .single();

      if (error) throw error;

      setCurrentUser(data);
      setUsers(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const handleCheckout = async (userData: { name: string, email: string, phone: string, address: string, city: string, postalCode: string }) => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order: Omit<Order, 'id'> = {
      user_id: currentUser?.id,
      user_name: userData.name,
      user_email: userData.email,
      user_phone: userData.phone,
      user_address: userData.address,
      user_city: userData.city,
      user_postal_code: userData.postalCode,
      items: cart,
      total,
      status: 'Pending',
      created_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase.from('orders').insert([order]).select();
      if (!error && data) {
        setOrders(prev => [data[0], ...prev]);
        setCart([]);
        setIsCartOpen(false);
        
        // Remove from abandoned carts if it existed
        await supabase.from('abandoned_carts').delete().eq('user_email', userData.email);
        
        // Update user profile with latest address if logged in
        if (currentUser) {
          await supabase.from('user_profiles').update({
            full_name: userData.name,
            phone: userData.phone,
            address: userData.address,
            city: userData.city,
            postal_code: userData.postalCode
          }).eq('id', currentUser.id);
        }
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const navigateTo = (view: View, id?: string) => {
    let path = '';
    if (view === 'Service' && id) {
      path = `/Service/${id}`;
      setSelectedServiceId(id);
    } else if (view === 'ProductDetail' && id) {
      path = `/Products/Detail/${id}`;
      setSelectedProductId(id);
    } else if (view === 'Products' && id) {
      path = `/Products/${encodeURIComponent(id)}`;
      if (id.startsWith('sub:')) {
        setActiveSubCategoryId(id.replace('sub:', ''));
        setActiveCategory(null);
      } else {
        setActiveCategory(id);
        setActiveSubCategoryId(null);
      }
    } else if (view === 'Products') {
      path = '/Products';
      setActiveCategory(null);
      setActiveSubCategoryId(null);
    } else if (view === 'Inverness') {
      path = '/Inverness';
      setActiveCategory('Quartz');
      setActiveSubCategoryId(null);
    } else if (view === 'Home') {
      path = '/';
    } else {
      path = `/${view}`;
    }
    
    window.history.pushState({}, '', path);
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const addLead = async (lead: Omit<Lead, 'id' | 'timestamp' | 'status'>) => {
    const newLead: Lead = {
      ...lead,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      status: 'New',
    };
    try {
      const { data, error } = await supabase.from('leads').insert([newLead]).select();
      if (!error && data) setLeads(prev => [data[0], ...prev]);
    } catch (error) {
      console.error('Error adding lead:', error);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-royal-blue/20 border-t-royal-blue rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-royal-blue rounded-full animate-pulse opacity-50"></div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold text-royal-blue tracking-widest uppercase mb-2">Divine Space</h2>
          <p className="text-gray-400 text-sm font-medium tracking-widest uppercase animate-pulse">Loading Excellence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans">
      <Navbar 
        currentView={currentView} 
        selectedServiceId={selectedServiceId}
        navigateTo={navigateTo} 
        settings={settings} 
        categories={categories} 
        subCategories={subCategories} 
        services={services}
        onOpenQuote={() => setIsQuoteModalOpen(true)}
      />
      
      <main className="flex-grow">
        {currentView === 'Home' && (
          <HomePage 
            onLeadSubmit={addLead} 
            navigateTo={navigateTo} 
            heroSlides={heroSlides} 
            pageContent={pageContent} 
            pins={pins}
            faqs={faqs}
            services={services}
            onOpenQuote={() => setIsQuoteModalOpen(true)}
          />
        )}
        {currentView === 'About' && <AboutPage pageContent={pageContent} />}
        {currentView === 'Products' && (
          <ProductPage 
            products={products} 
            categories={categories} 
            subCategories={subCategories} 
            onProductClick={(id) => navigateTo('ProductDetail', id)} 
            pageContent={pageContent} 
            initialCategory={activeCategory}
            initialSubCategoryId={activeSubCategoryId}
          />
        )}
        {currentView === 'Inverness' && (
          <InvernessPage navigateTo={navigateTo} products={products} />
        )}
        {currentView === 'ProductDetail' && selectedProductId && (
          <ProductDetail 
            productId={selectedProductId} 
            products={products} 
            navigateTo={navigateTo} 
            onAddToCart={addToCart}
          />
        )}
        {currentView === 'Process' && <ProcessPage pageContent={pageContent} />}
        {currentView === 'Contact' && <ContactPage settings={settings} onLeadSubmit={addLead} />}
        {currentView === 'Projects' && <ProjectsPage projects={projects} pageContent={pageContent} />}
        {currentView === 'Clients' && <ClientsPage clients={clients} />}
        {currentView === 'Privacy' && (
          <LegalPage 
            title="Privacy Policy" 
            pageContent={pageContent.filter(c => c.page_name === 'Privacy')} 
          />
        )}
        {currentView === 'Terms' && (
          <LegalPage 
            title="Terms of Service" 
            pageContent={pageContent.filter(c => c.page_name === 'Terms')} 
          />
        )}
        {currentView === 'Admin' && (
          <AdminPanel 
            leads={leads} 
            projects={projects} 
            setProjects={setProjects} 
            clients={clients}
            setClients={setClients}
            products={products}
            setProducts={setProducts}
            categories={categories}
            setCategories={setCategories}
            subCategories={subCategories}
            setSubCategories={setSubCategories}
            pins={pins}
            setPins={setPins}
            faqs={faqs}
            setFaqs={setFaqs}
            heroSlides={heroSlides}
            setHeroSlides={setHeroSlides}
            pageContent={pageContent}
            setPageContent={setPageContent}
            settings={settings}
            setSettings={setSettings}
            services={services}
            setServices={setServices}
            orders={orders}
            setOrders={setOrders}
            abandonedCarts={abandonedCarts}
            setAbandonedCarts={setAbandonedCarts}
            users={users}
            setUsers={setUsers}
            navigateTo={navigateTo} 
          />
        )}
        {currentView === 'Service' && selectedServiceId && (
          <ServiceDetail 
            serviceId={selectedServiceId} 
            navigateTo={navigateTo} 
            services={services} 
            onOpenQuote={() => setIsQuoteModalOpen(true)}
          />
        )}
        {currentView === 'Checkout' && (
          <CheckoutPage 
            cart={cart}
            onBack={() => navigateTo('Products')}
            onCheckout={handleCheckout}
            currentUser={currentUser}
            onLogin={handleLogin}
            onRegister={handleRegister}
          />
        )}
      </main>

      <Footer navigateTo={navigateTo} settings={settings} services={services} />
      <FloatingChatbot onLeadSubmit={addLead} />
      
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        onUpdateQuantity={updateCartQuantity} 
        onRemoveItem={removeFromCart} 
        onCheckout={() => {
          setIsCartOpen(false);
          navigateTo('Checkout');
        }}
      />
      
      <QuoteModal 
        isOpen={isQuoteModalOpen} 
        onClose={() => setIsQuoteModalOpen(false)} 
        onSubmit={(data) => {
          addLead({
            service: 'Quote Request',
            location: 'Website Popup',
            budget: 'N/A',
            timeline: 'N/A',
            topic: `Name: ${data.name}, Email: ${data.email}, Phone: ${data.phone}`
          });
        }}
      />
    </div>
  );
};

export default App;