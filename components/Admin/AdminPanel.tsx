import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Map as MapIcon, 
  HelpCircle, 
  LogOut,
  TrendingUp,
  Plus,
  Trash2,
  X,
  Image as ImageIcon,
  Monitor,
  Globe,
  Save,
  Loader2,
  Edit,
  ExternalLink,
  ChevronRight,
  Upload,
  Settings,
  Facebook,
  CheckCircle,
  AlertCircle,
  ShoppingCart,
  UserCheck,
  History,
  Menu
} from 'lucide-react';
import { Lead, Product, ProjectPin, FAQ, View, GalleryProject, HeroSlide, PageSectionContent, SiteSettings, Client, ProductCategory, ProductSubCategory, Service, Order, AbandonedCart, UserProfile } from '../../types.ts';
import { Logo } from '../../constants.tsx';
import { supabase } from '../../supabaseClient.ts';

interface AdminPanelProps {
  leads: Lead[];
  projects: GalleryProject[];
  setProjects: React.Dispatch<React.SetStateAction<GalleryProject[]>>;
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: ProductCategory[];
  setCategories: React.Dispatch<React.SetStateAction<ProductCategory[]>>;
  subCategories: ProductSubCategory[];
  setSubCategories: React.Dispatch<React.SetStateAction<ProductSubCategory[]>>;
  pins: ProjectPin[];
  setPins: React.Dispatch<React.SetStateAction<ProjectPin[]>>;
  faqs: FAQ[];
  setFaqs: React.Dispatch<React.SetStateAction<FAQ[]>>;
  heroSlides: HeroSlide[];
  setHeroSlides: React.Dispatch<React.SetStateAction<HeroSlide[]>>;
  pageContent: PageSectionContent[];
  setPageContent: React.Dispatch<React.SetStateAction<PageSectionContent[]>>;
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  settings: SiteSettings;
  setSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  abandonedCarts: AbandonedCart[];
  setAbandonedCarts: React.Dispatch<React.SetStateAction<AbandonedCart[]>>;
  users: UserProfile[];
  setUsers: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  navigateTo?: (view: View) => void;
}

const API_KEY = 
  process.env.GOOGLE_MAPS_PLATFORM_KEY || 
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY || 
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  leads, projects, setProjects, clients, setClients, products, setProducts,
  categories, setCategories, subCategories, setSubCategories,
  pins, setPins, faqs, setFaqs, heroSlides, setHeroSlides,
  pageContent, setPageContent, services, setServices, settings, setSettings, 
  orders, setOrders, abandonedCarts, setAbandonedCarts, users, setUsers,
  navigateTo 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingPin, setIsAddingPin] = useState(false);
  const [tempPin, setTempPin] = useState<{ lat: number, lng: number } | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [uploading, setUploading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: API_KEY
  });

  if (loadError && activeTab === 'Map Pins') {
    return (
      <div className="flex-grow p-10 bg-white border border-gray-100 rounded-sm shadow-sm">
        <div className="max-w-xl mx-auto text-center py-20">
          <MapIcon size={48} className="mx-auto text-red-200 mb-6" />
          <h2 className="text-2xl font-bold text-brand-black mb-4 uppercase tracking-tighter">Google Maps API Error</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            The map failed to load. Error: <span className="font-mono text-red-500">{loadError.message}</span>
          </p>
          
          <div className="bg-red-50 p-6 rounded-sm text-left space-y-4 mb-8 border border-red-100">
            <p className="text-xs font-bold uppercase tracking-widest text-red-800 flex items-center">
              <AlertCircle size={14} className="mr-2" /> Troubleshooting: BillingNotEnabledMapError
            </p>
            <p className="text-sm text-red-700 leading-relaxed">
              Google requires a <strong>Billing Account</strong> to be linked to your project, even for the free tier. Without it, the map will not display.
            </p>
            <div className="space-y-3 pt-2">
              <a 
                href="https://console.cloud.google.com/billing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full p-3 bg-white border border-red-200 rounded-sm text-royal-blue font-bold text-sm hover:bg-red-50 transition-all"
              >
                1. Link Billing Account to Project <ExternalLink size={14} />
              </a>
              <a 
                href="https://console.cloud.google.com/google/maps-apis/library/maps-backend.googleapis.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full p-3 bg-white border border-red-200 rounded-sm text-royal-blue font-bold text-sm hover:bg-red-50 transition-all"
              >
                2. Ensure Maps JavaScript API is Enabled <ExternalLink size={14} />
              </a>
            </div>
          </div>
          
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">After enabling billing, it may take a few minutes for the changes to propagate.</p>
        </div>
      </div>
    );
  }

  if (!hasValidKey && activeTab === 'Map Pins') {
    return (
      <div className="flex-grow p-10 bg-white border border-gray-100 rounded-sm shadow-sm">
        <div className="max-w-xl mx-auto text-center py-20">
          <MapIcon size={48} className="mx-auto text-gray-200 mb-6" />
          <h2 className="text-2xl font-bold text-brand-black mb-4 uppercase tracking-tighter">Google Maps API Key Required</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">To use the Map Pins feature, you need to provide a Google Maps Platform API key.</p>
          
          <div className="bg-gray-50 p-6 rounded-sm text-left space-y-4 mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Step 1: Get an API Key & Enable Billing</p>
            <div className="space-y-2">
              <a 
                href="https://console.cloud.google.com/google/maps-apis/credentials" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-royal-blue font-bold text-sm hover:underline"
              >
                1. Create API Key <ExternalLink size={14} className="ml-1" />
              </a>
              <br />
              <a 
                href="https://console.cloud.google.com/billing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-royal-blue font-bold text-sm hover:underline"
              >
                2. Enable Billing for your Project <ExternalLink size={14} className="ml-1" />
              </a>
              <p className="text-[10px] text-gray-500 italic">Note: Google Maps requires a billing account even for the free tier. You will get $200 free credit monthly.</p>
            </div>
            
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 pt-4">Step 2: Add to AI Studio Secrets</p>
            <ul className="text-xs text-gray-600 space-y-2 list-disc pl-4">
              <li>Open <strong>Settings</strong> (⚙️ gear icon, top-right)</li>
              <li>Select <strong>Secrets</strong></li>
              <li>Add <code>GOOGLE_MAPS_PLATFORM_KEY</code> as the name</li>
              <li>Paste your API key as the value</li>
            </ul>
          </div>
          
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">The app will rebuild automatically after you add the secret.</p>
        </div>
      </div>
    );
  }

  const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    // We'll use the button to start adding, then a draggable marker appears
  };

  const handleNewPinDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = Number(e.latLng.lat());
      const lng = Number(e.latLng.lng());
      setTempPin({ lat, lng });
      setFormData({ type: 'pin', lat, lng, title: '', description: '' });
      setIsModalOpen(true);
      // Don't set isAddingPin to false yet, so the red marker stays visible while filling details
    }
  };

  const handleMarkerDragEnd = async (e: google.maps.MapMouseEvent, pinId: string) => {
    if (e.latLng) {
      const lat = Number(e.latLng.lat());
      const lng = Number(e.latLng.lng());
      
      // Update local state
      setPins(prev => prev.map(p => p.id === pinId ? { ...p, lat, lng } : p));
      
      // Update database
      const { error } = await supabase.from('project_pins').update({ lat, lng }).eq('id', pinId);
      if (error) console.error("Failed to update pin position:", error.message);
    }
  };

  const internalCategories = [
    { id: 'handles', label: 'Handles and Knobs' },
    { id: 'kitchen', label: 'Kitchen' },
    { id: 'salice', label: 'Salice Hardware' },
    { id: 'closet', label: 'Closet Accessories' },
    { id: 'hinge', label: 'Hinge Systems' },
    { id: 'fasteners', label: 'Screws and Fasteners' },
    { id: 'liftup', label: 'Lift Up System' },
    { id: 'accessories', label: 'Cabinet Accessories' },
    { id: 'led', label: 'LED Light System' },
    { id: 'quartz', label: 'Quartz' },
  ];

  const menuItems = [
    { id: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'Orders & Carts', icon: <ShoppingCart size={20} />, count: orders.length + abandonedCarts.length },
    { id: 'AI Chat Leads', icon: <Users size={20} />, count: leads.length },
    { id: 'Website Editor', icon: <Monitor size={20} /> },
    { id: 'Product Categories', icon: <Plus size={20} /> },
    { id: 'Product Sub-Categories', icon: <Plus size={20} /> },
    { id: 'Product Manager', icon: <Package size={20} /> },
    { id: 'Services', icon: <Settings size={20} /> },
    { id: 'Project Manager', icon: <ImageIcon size={20} /> },
    { id: 'Client Manager', icon: <Users size={20} /> },
    { id: 'Map Pins', icon: <MapIcon size={20} /> },
    { id: 'FAQ Manager', icon: <HelpCircle size={20} /> },
    { id: 'Settings', icon: <Settings size={20} /> },
  ];

  const uploadToImgBB = async (file: File): Promise<string> => {
    const IMGBB_API_KEY = '80bf5ee4dbc4cb5828b36d31cb4c1999';
    const formData = new FormData();
    formData.append('image', file);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { 
        method: 'POST', 
        body: formData,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) return data.data.url;
      throw new Error(data.error?.message || 'Upload failed');
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Upload timed out. Please try a smaller image or check your connection.');
      }
      throw error;
    }
  };

  const [selectedPin, setSelectedPin] = useState<ProjectPin | null>(null);

  const handleUpdateSetting = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleUpdatePageContent = (section_key: string, field: string, value: string) => {
    const updatedContent = pageContent.map(c => 
      c.section_key === section_key ? { ...c, [field]: value } : c
    );
    setPageContent(updatedContent);
    setHasUnsavedChanges(true);
  };

  const handleGlobalSave = async () => {
    setIsSaving(true);
    try {
      // Prepare settings for bulk upsert
      const settingsToSave = Object.entries(settings)
        .filter(([key]) => key !== 'id' && key !== 'created_at')
        .map(([key, value]) => ({ 
          key, 
          value: value === null || value === undefined ? '' : String(value) 
        }));

      // Save settings in one go
      const { error: settingsError } = await supabase
        .from('site_settings')
        .upsert(settingsToSave, { onConflict: 'key' });

      if (settingsError) throw settingsError;

      // Save page content
      const { error: contentError } = await supabase
        .from('page_content')
        .upsert(pageContent, { onConflict: 'section_key' });

      if (contentError) throw contentError;

      setHasUnsavedChanges(false);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    } catch (err: any) {
      console.error("Error saving changes:", err);
      alert(`Failed to save changes: ${err.message || 'Unknown error'}. Please check your connection and try again.`);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      // First update state for immediate UI feedback
      setProducts(prev => prev.filter(p => p.id !== id));
      
      // Perform deletion in database
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        console.error("Database deletion failed:", error.message);
        // If it's a critical error (not just a missing row), you might want to refresh data
        // For this app, we assume the local state filter is sufficient for the mock/DB transition
      }
    } catch (err) {
      console.error("Error during deletion:", err);
    }
  };

  const deleteProject = async (id: string) => {
    if (!window.confirm("Delete this gallery project?")) return;
    
    try {
      setProjects(prev => prev.filter(p => p.id !== id));
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) console.error("Project delete failed:", error.message);
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  const deleteSlide = async (id: string) => {
    const { error } = await supabase.from('hero_slides').delete().eq('id', id);
    if (!error || error) setHeroSlides(heroSlides.filter(s => s.id !== id));
  };

  const deleteClient = async (id: string) => {
    if (!window.confirm("Delete this client?")) return;
    try {
      setClients(prev => prev.filter(c => c.id !== id));
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) console.error("Client delete failed:", error.message);
    } catch (err) {
      console.error("Error deleting client:", err);
    }
  };

  const deletePin = async (id: string) => {
    if (!window.confirm("Delete this map pin?")) return;
    try {
      setPins(prev => prev.filter(p => p.id !== id));
      const { error } = await supabase.from('project_pins').delete().eq('id', id);
      if (error) console.error("Pin delete failed:", error.message);
    } catch (err) {
      console.error("Error deleting pin:", err);
    }
  };

  const deletePageContent = async (section_key: string) => {
    if (!window.confirm("Are you sure you want to delete this section?")) return;
    try {
      setPageContent(prev => prev.filter(c => c.section_key !== section_key));
      const { error } = await supabase.from('page_content').delete().eq('section_key', section_key);
      if (error) console.error("Page content deletion failed:", error.message);
    } catch (err) {
      console.error("Error deleting page content:", err);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category? Products in this category will remain but their category link will be broken.")) return;
    try {
      setCategories(prev => prev.filter(c => c.id !== id));
      const { error } = await supabase.from('product_categories').delete().eq('id', id);
      if (error) console.error("Category delete failed:", error.message);
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  const deleteSubCategory = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this sub-category?")) return;
    try {
      setSubCategories(prev => prev.filter(c => c.id !== id));
      const { error } = await supabase.from('product_subcategories').delete().eq('id', id);
      if (error) console.error("Sub-category delete failed:", error.message);
    } catch (err) {
      console.error("Error deleting sub-category:", err);
    }
  };

  const deleteService = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      setServices(prev => prev.filter(s => s.id !== id));
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) console.error("Service delete failed:", error.message);
    } catch (err) {
      console.error("Error deleting service:", err);
    }
  };

  const handleAddNewProduct = () => {
    setFormData({ 
      type: 'product', 
      name: '',
      category: categories[0]?.name || '',
      subcategory_id: '',
      price: '',
      image_url: '',
      images: [],
      description: '',
      sku: '',
      brand: 'WINNEC',
      colors: [],
      sizes: [],
      specs: []
    });
    setIsModalOpen(true);
  };

  const handleAddNewCategory = () => {
    setFormData({ type: 'category', name: '' });
    setIsModalOpen(true);
  };

  const handleAddNewSubCategory = () => {
    setFormData({ type: 'subcategory', name: '', category_id: categories[0]?.id || '' });
    setIsModalOpen(true);
  };

  const handleAddNewProject = () => {
    setFormData({ 
      type: 'project', 
      name: '',
      category: 'RETAIL', 
      images: [] 
    });
    setIsModalOpen(true);
  };

  const handleAddNewClient = () => {
    setFormData({ 
      type: 'client', 
      name: '',
      category: 'Bonded-Secured Sites & Distribution', 
      logo_url: '' 
    });
    setIsModalOpen(true);
  };

  const handleAddNewService = () => {
    setFormData({ 
      type: 'service', 
      title: '',
      description: '',
      long_description: '',
      image_url: '',
      icon_name: 'Home',
      benefits: [] 
    });
    setIsModalOpen(true);
  };

  const handleAddNewPin = () => {
    setIsAddingPin(true);
    setTempPin(null);
  };

  const handleEditProduct = (product: Product) => {
    setFormData({ ...product, type: 'product', image_url: product.image });
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: ProductCategory) => {
    setFormData({ ...category, type: 'category' });
    setIsModalOpen(true);
  };

  const handleEditSubCategory = (sub: ProductSubCategory) => {
    setFormData({ ...sub, type: 'subcategory' });
    setIsModalOpen(true);
  };

  const handleEditProject = (project: GalleryProject) => {
    setFormData({ ...project, type: 'project' });
    setIsModalOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setFormData({ ...client, type: 'client' });
    setIsModalOpen(true);
  };

  const handleEditService = (service: Service) => {
    setFormData({ ...service, type: 'service' });
    setIsModalOpen(true);
  };

  const handleEditPin = (pin: ProjectPin) => {
    setFormData({ ...pin, type: 'pin' });
    setIsModalOpen(true);
  };

  const handleEditSlide = (slide: HeroSlide) => {
    setFormData({ ...slide, type: 'slide' });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.type === 'product') {
      const payload = {
        name: formData.name,
        category: formData.category,
        subcategory_id: formData.subcategory_id || null,
        price: formData.price,
        image: formData.image_url,
        images: formData.images || [],
        description: formData.description,
        sku: formData.sku,
        colors: formData.colors || [],
        sizes: formData.sizes || [],
        specs: formData.specs || [],
        brand: formData.brand || 'WINNEC'
      };
      
      if (formData.id) {
        const { error } = await supabase.from('products').update(payload).eq('id', formData.id);
        if (!error) setProducts(prev => prev.map(p => p.id === formData.id ? { ...p, ...payload } : p));
      } else {
        const { data, error } = await supabase.from('products').insert([payload]).select();
        if (!error && data) setProducts(prev => [data[0], ...prev]);
      }
    } else if (formData.type === 'slide') {
      const payload = {
        image_url: formData.image_url,
        title: formData.title,
        subtitle: formData.subtitle
      };
      
      if (formData.id) {
        const { error } = await supabase.from('hero_slides').update(payload).eq('id', formData.id);
        if (!error) setHeroSlides(prev => prev.map(s => s.id === formData.id ? { ...s, ...payload } : s));
      } else {
        const { data, error } = await supabase.from('hero_slides').insert([payload]).select();
        if (!error && data) setHeroSlides([...heroSlides, data[0]]);
      }
    } else if (formData.type === 'project') {
      const payload = {
        name: formData.name,
        category: formData.category,
        images: formData.images || []
      };
      
      if (formData.id) {
        const { error } = await supabase.from('projects').update(payload).eq('id', formData.id);
        if (!error) setProjects(prev => prev.map(p => p.id === formData.id ? { ...p, ...payload } : p));
      } else {
        const { data, error } = await supabase.from('projects').insert([payload]).select();
        if (!error && data) setProjects(prev => [data[0], ...prev]);
      }
    } else if (formData.type === 'client') {
      const payload = {
        name: formData.name,
        category: formData.category,
        logo_url: formData.logo_url
      };
      
      if (formData.id) {
        const { error } = await supabase.from('clients').update(payload).eq('id', formData.id);
        if (!error) setClients(prev => prev.map(c => c.id === formData.id ? { ...c, ...payload } : c));
      } else {
        const { data, error } = await supabase.from('clients').insert([payload]).select();
        if (!error && data) setClients(prev => [data[0], ...prev]);
      }
    } else if (formData.type === 'pin') {
      const latVal = typeof formData.lat === 'string' ? parseFloat(formData.lat) : formData.lat;
      const lngVal = typeof formData.lng === 'string' ? parseFloat(formData.lng) : formData.lng;
      
      const payload: any = {
        lat: latVal,
        lng: lngVal,
        title: formData.title,
        name: formData.title,
        location: formData.title,
        work_type: formData.title,
        coords: `${latVal},${lngVal}`, // Fallback for databases that have a 'coords' column
        description: formData.description
      };
      
      if (formData.id) {
        const { error } = await supabase.from('project_pins').update(payload).eq('id', formData.id);
        if (!error) {
          const updatedPin = {
            ...payload,
            id: formData.id,
            lat: typeof payload.lat === 'string' ? parseFloat(payload.lat) : payload.lat,
            lng: typeof payload.lng === 'string' ? parseFloat(payload.lng) : payload.lng
          };
          setPins(prev => prev.map(p => p.id === formData.id ? updatedPin : p));
          setIsModalOpen(false);
          alert("Success: Project pin updated successfully!");
        } else {
          console.error("Pin update failed:", error.message);
          if (error.message.includes("description") || error.message.includes("title") || error.message.includes("lat") || error.message.includes("lng") || error.message.includes("location") || error.message.includes("work_type") || error.message.includes("coords")) {
            alert(`RAW ERROR: ${error.message}\n\nDatabase Error: Your 'project_pins' table is missing required columns. Please run the SQL fix below in your Supabase SQL Editor:\n\nALTER TABLE project_pins ADD COLUMN IF NOT EXISTS lat FLOAT8;\nALTER TABLE project_pins ADD COLUMN IF NOT EXISTS lng FLOAT8;\nALTER TABLE project_pins ADD COLUMN IF NOT EXISTS title TEXT;\nALTER TABLE project_pins ADD COLUMN IF NOT EXISTS name TEXT;\nALTER TABLE project_pins ADD COLUMN IF NOT EXISTS location TEXT;\nALTER TABLE project_pins ADD COLUMN IF NOT EXISTS work_type TEXT;\nALTER TABLE project_pins ADD COLUMN IF NOT EXISTS coords TEXT;\nALTER TABLE project_pins ADD COLUMN IF NOT EXISTS description TEXT;`);
          } else {
            alert("Error saving pin: " + error.message);
          }
        }
      } else {
        const { data, error } = await supabase.from('project_pins').insert([payload]).select();
        if (!error && data) {
          const newPin = {
            ...data[0],
            lat: typeof data[0].lat === 'string' ? parseFloat(data[0].lat) : data[0].lat,
            lng: typeof data[0].lng === 'string' ? parseFloat(data[0].lng) : data[0].lng
          };
          setPins(prev => [newPin, ...prev]);
          setIsAddingPin(false); // Success! Stop adding mode
          setTempPin(null);
          setIsModalOpen(false);
          alert("Success: Project pin saved to database and map!");
        } else {
          console.error("Pin creation failed:", error?.message);
          if (error?.message?.includes("description") || error?.message?.includes("title") || error?.message?.includes("lat") || error?.message?.includes("lng") || error?.message?.includes("location") || error?.message?.includes("work_type") || error?.message?.includes("coords")) {
            alert(`RAW ERROR: ${error?.message}\n\nDatabase Error: Your 'project_pins' table is missing required columns. Please run the SQL fix below in your Supabase SQL Editor:\n\nALTER TABLE project_pins ADD COLUMN IF NOT EXISTS lat FLOAT8;\nALTER TABLE project_pins ADD COLUMN IF NOT EXISTS lng FLOAT8;\nALTER TABLE project_pins ADD COLUMN IF NOT EXISTS title TEXT;\nALTER TABLE project_pins ADD COLUMN IF NOT EXISTS name TEXT;\nALTER TABLE project_pins ADD COLUMN IF NOT EXISTS location TEXT;\nALTER TABLE project_pins ADD COLUMN IF NOT EXISTS work_type TEXT;\nALTER TABLE project_pins ADD COLUMN IF NOT EXISTS coords TEXT;\nALTER TABLE project_pins ADD COLUMN IF NOT EXISTS description TEXT;`);
          } else {
            alert("Error creating pin: " + (error?.message || "Unknown error"));
          }
        }
      }
    } else if (formData.type === 'service') {
      const payload = {
        title: formData.title,
        description: formData.description,
        long_description: formData.long_description,
        image_url: formData.image_url,
        icon_name: formData.icon_name,
        benefits: formData.benefits || []
      };
      
      if (formData.id) {
        const { error } = await supabase.from('services').update(payload).eq('id', formData.id);
        if (!error) setServices(prev => prev.map(s => s.id === formData.id ? { ...s, ...payload } : s));
      } else {
        const { data, error } = await supabase.from('services').insert([payload]).select();
        if (!error && data) setServices(prev => [...prev, data[0]]);
      }
    } else if (formData.type === 'category') {
      const payload = {
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-')
      };
      
      if (formData.id) {
        const { error } = await supabase.from('product_categories').update(payload).eq('id', formData.id);
        if (!error) setCategories(prev => prev.map(c => c.id === formData.id ? { ...c, ...payload } : c));
      } else {
        const { data, error } = await supabase.from('product_categories').insert([payload]).select();
        if (!error && data) setCategories(prev => [...prev, data[0]]);
      }
    } else if (formData.type === 'subcategory') {
      const payload = {
        name: formData.name,
        category_id: formData.category_id,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-')
      };
      
      if (formData.id) {
        const { error } = await supabase.from('product_subcategories').update(payload).eq('id', formData.id);
        if (!error) setSubCategories(prev => prev.map(c => c.id === formData.id ? { ...c, ...payload } : c));
      } else {
        const { data, error } = await supabase.from('product_subcategories').insert([payload]).select();
        if (!error && data) setSubCategories(prev => [...prev, data[0]]);
      }
    } else if (formData.type === 'content') {
      const payload = {
        section_key: formData.section_key,
        page_name: formData.page_name,
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description
      };
      
      const { data, error } = await supabase.from('page_content').upsert(payload).select();
      if (!error && data) {
        setPageContent(prev => {
          const exists = prev.find(c => c.section_key === payload.section_key);
          if (exists) return prev.map(c => c.section_key === payload.section_key ? data[0] : c);
          return [...prev, data[0]];
        });
      }
    }
    setIsModalOpen(false);
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50/50">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden bg-[#111111] text-white p-4 flex justify-between items-center sticky top-0 z-[60]">
        <div className="flex items-center space-x-3">
          {settings.logo_url ? (
            <img src={settings.logo_url} alt="Logo" className="w-8 h-8 object-contain" />
          ) : (
            <Logo className="w-8 h-8" colorMode="white" />
          )}
          <span className="brand-font text-lg uppercase tracking-wider">Admin</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-sm">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <aside className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 fixed md:sticky top-0 md:top-20 z-50 md:z-auto
        w-64 bg-[#111111] text-white flex flex-col h-screen md:h-[calc(100vh-80px)]
        transition-transform duration-300 ease-in-out
      `}>
        <div className="hidden md:flex p-8 border-b border-white/5 items-center space-x-3">
          {settings.logo_url ? (
            <img src={settings.logo_url} alt="Logo" className="w-8 h-8 object-contain" />
          ) : (
            <Logo className="w-8 h-8" colorMode="white" />
          )}
          <div className="brand-font text-xl uppercase tracking-wider">Admin</div>
        </div>
        <nav className="flex-grow py-6 overflow-y-auto">
          {menuItems.map((item) => (
            <button 
              key={item.id} 
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }} 
              className={`w-full flex items-center justify-between px-8 py-4 text-sm font-bold transition-all ${activeTab === item.id ? 'bg-royal-blue text-white shadow-lg' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
            >
              <div className="flex items-center space-x-3">{item.icon}<span>{item.id}</span></div>
              {item.count && <span className="bg-white text-royal-blue text-[10px] px-2 py-0.5 rounded-full">{item.count}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="flex-grow p-4 md:p-10 overflow-y-auto">
        <header className="mb-6 md:mb-10 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-brand-black">{activeTab}</h1>
          {activeTab === 'Product Categories' && (
            <button onClick={handleAddNewCategory} className="bg-royal-blue text-white px-6 py-3 text-xs font-bold uppercase flex items-center shadow-lg hover:bg-red-700 transition-colors">
              <Plus size={16} className="mr-2" /> Add New Category
            </button>
          )}
          {activeTab === 'Product Sub-Categories' && (
            <button onClick={handleAddNewSubCategory} className="bg-royal-blue text-white px-6 py-3 text-xs font-bold uppercase flex items-center shadow-lg hover:bg-red-700 transition-colors">
              <Plus size={16} className="mr-2" /> Add New Sub-Category
            </button>
          )}
          {activeTab === 'Product Manager' && (
            <button onClick={handleAddNewProduct} className="bg-royal-blue text-white px-6 py-3 text-xs font-bold uppercase flex items-center shadow-lg hover:bg-red-700 transition-colors">
              <Plus size={16} className="mr-2" /> Add New Product
            </button>
          )}
          {activeTab === 'Services' && (
            <button onClick={handleAddNewService} className="bg-royal-blue text-white px-6 py-3 text-xs font-bold uppercase flex items-center shadow-lg hover:bg-red-700 transition-colors">
              <Plus size={16} className="mr-2" /> Add New Service
            </button>
          )}
          {activeTab === 'Project Manager' && (
            <button onClick={handleAddNewProject} className="bg-royal-blue text-white px-6 py-3 text-xs font-bold uppercase flex items-center shadow-lg hover:bg-red-700 transition-colors">
              <Plus size={16} className="mr-2" /> Add Gallery Project
            </button>
          )}
          {activeTab === 'Client Manager' && (
            <button onClick={handleAddNewClient} className="bg-royal-blue text-white px-6 py-3 text-xs font-bold uppercase flex items-center shadow-lg hover:bg-red-700 transition-colors">
              <Plus size={16} className="mr-2" /> Add New Client
            </button>
          )}
          {activeTab === 'Map Pins' && (
            <button onClick={handleAddNewPin} className="bg-royal-blue text-white px-6 py-3 text-xs font-bold uppercase flex items-center shadow-lg hover:bg-red-700 transition-colors">
              <Plus size={16} className="mr-2" /> Add Map Pin
            </button>
          )}
        </header>

        {activeTab === 'Product Categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white p-6 border border-gray-100 rounded-sm shadow-sm flex justify-between items-center group hover:border-royal-blue transition-colors">
                <div>
                  <h3 className="font-bold text-brand-black">{cat.name}</h3>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Slug: {cat.slug}</p>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleEditCategory(cat)} className="p-2 text-gray-300 hover:text-royal-blue transition-colors">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => deleteCategory(cat.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 bg-white rounded-sm">
                <Package size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No categories in database</p>
                <button onClick={handleAddNewCategory} className="text-royal-blue text-xs font-bold mt-2 uppercase hover:underline">Add your first category</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Product Manager' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm group">
                <div className="aspect-[4/3] relative">
                  <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                    <button onClick={() => handleEditProduct(product)} className="p-3 bg-white text-royal-blue rounded-full hover:bg-royal-blue hover:text-white transition-all shadow-xl">
                      <Edit size={20} />
                    </button>
                    <button onClick={() => deleteProduct(product.id)} className="p-3 bg-white text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all shadow-xl">
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <div className="absolute top-4 left-4 bg-royal-blue text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                    {product.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-brand-black text-lg mb-1">{product.name}</h3>
                  <p className="text-royal-blue font-black mb-4">{product.price}</p>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{product.description}</p>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 bg-white rounded-sm">
                <Package size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No products in database</p>
                <button onClick={handleAddNewProduct} className="text-royal-blue text-xs font-bold mt-2 uppercase hover:underline">Start adding your products</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Services' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm group">
                <div className="aspect-video relative">
                  <img src={service.image_url} className="w-full h-full object-cover" alt={service.title} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                    <button onClick={() => handleEditService(service)} className="p-3 bg-white text-royal-blue rounded-full hover:bg-royal-blue hover:text-white transition-all shadow-xl">
                      <Edit size={20} />
                    </button>
                    <button onClick={() => deleteService(service.id)} className="p-3 bg-white text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all shadow-xl">
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <div className="absolute top-4 left-4 bg-royal-blue text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                    {service.icon_name}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-brand-black text-lg mb-1">{service.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{service.description}</p>
                </div>
              </div>
            ))}
            {services.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 bg-white rounded-sm">
                <Settings size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No services in database</p>
                <button onClick={handleAddNewService} className="text-royal-blue text-xs font-bold mt-2 uppercase hover:underline">Start adding your services</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Project Manager' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((proj) => (
              <div key={proj.id} className="bg-white border border-gray-100 p-6 rounded-sm shadow-sm flex flex-col group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-brand-black uppercase tracking-tight">{proj.name}</h3>
                    <p className="text-xs text-royal-blue font-bold tracking-widest uppercase mt-1">{proj.category}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => handleEditProject(proj)} className="p-2 text-gray-300 hover:text-royal-blue transition-colors">
                      <Edit size={20} />
                    </button>
                    <button onClick={() => deleteProject(proj.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {proj.images && proj.images.slice(0, 3).map((img, idx) => (
                    <div key={idx} className="relative aspect-video rounded-sm overflow-hidden border border-gray-100 bg-gray-50">
                      <img src={img} className="w-full h-full object-cover" alt="Project Thumbnail" />
                    </div>
                  ))}
                  {(!proj.images || proj.images.length === 0) && (
                    <div className="col-span-3 py-8 text-center bg-gray-50 border border-dashed border-gray-200 rounded-sm">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">No images in gallery</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  <span>{proj.images?.length || 0} GALLERY IMAGES</span>
                  <button className="flex items-center text-royal-blue hover:underline">Manage Gallery <ChevronRight size={12} className="ml-1" /></button>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 bg-white rounded-sm">
                <ImageIcon size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No gallery projects found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Client Manager' && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {clients.map((client) => (
              <div key={client.id} className="bg-white border border-gray-100 rounded-sm p-6 shadow-sm group relative flex flex-col items-center justify-center text-center">
                <div className="absolute top-2 right-2 flex space-x-1 opacity-100 transition-opacity bg-white/80 rounded-sm p-1">
                  <button 
                    onClick={() => handleEditClient(client)}
                    className="p-1.5 text-gray-300 hover:text-royal-blue transition-colors"
                  >
                    <Edit size={14} />
                  </button>
                  <button 
                    onClick={() => deleteClient(client.id)}
                    className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="h-20 w-full flex items-center justify-center mb-4">
                  <img src={client.logo_url} className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all" alt={client.name} />
                </div>
                <h4 className="text-xs font-bold text-brand-black truncate w-full">{client.name}</h4>
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1 truncate w-full">{client.category}</p>
              </div>
            ))}
            {clients.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 bg-white rounded-sm">
                <Users size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No clients in database</p>
                <button onClick={handleAddNewClient} className="text-royal-blue text-xs font-bold mt-2 uppercase hover:underline">Add your first client</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Map Pins' && (
          <div className="space-y-6">
            <div className="bg-white p-4 border border-gray-100 rounded-sm shadow-sm flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <div className="w-3 h-3 bg-royal-blue rounded-full mr-2"></div> Active Projects
                </div>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest">
                  {isAddingPin ? 'Click on map to place pin' : 'Drag pins to move them'}
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setIsAddingPin(!isAddingPin)} 
                  className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all ${isAddingPin ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-gray-200 text-gray-600 hover:border-royal-blue hover:text-royal-blue'}`}
                >
                  {isAddingPin ? 'Cancel Adding' : 'Add New Pin'}
                </button>
              </div>
            </div>

            <div className="h-[600px] bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden relative">
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={{ lat: 43.6532, lng: -79.3832 }}
                  zoom={11}
                  onLoad={onMapLoad}
                  onClick={handleMapClick}
                  options={{
                    disableDefaultUI: false,
                    zoomControl: true,
                    styles: [
                      { "featureType": "poi", "stylers": [{ "visibility": "off" }] }
                    ]
                  }}
                >
                  {(pins || []).map((pin) => (
                    <MarkerF
                      key={pin.id}
                      position={{ lat: pin.lat || 0, lng: pin.lng || 0 }}
                      draggable={true}
                      onDragEnd={(e) => handleMarkerDragEnd(e, pin.id)}
                      onClick={() => setSelectedPin(pin)}
                      icon={{
                        path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                        fillColor: "#003399",
                        fillOpacity: 1,
                        strokeWeight: 1,
                        strokeColor: "#ffffff",
                        scale: 1.5,
                        anchor: { x: 12, y: 24 } as any
                      }}
                    />
                  ))}
                  {selectedPin && (
                    <InfoWindowF
                      position={{ lat: selectedPin.lat || 0, lng: selectedPin.lng || 0 }}
                      onCloseClick={() => setSelectedPin(null)}
                    >
                      <div className="p-3 min-w-[180px]">
                        <h4 className="font-bold text-royal-blue text-sm mb-1 uppercase tracking-tight">{selectedPin.title || 'Untitled'}</h4>
                        <p className="text-[10px] text-gray-500 mb-3 line-clamp-2">{selectedPin.description}</p>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => { handleEditPin(selectedPin); setSelectedPin(null); }}
                            className="flex-grow py-1.5 bg-royal-blue text-white text-[9px] font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => { deletePin(selectedPin.id); setSelectedPin(null); }}
                            className="px-2 py-1.5 bg-red-50 text-red-600 border border-red-100 text-[9px] font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </InfoWindowF>
                  )}
                  {isAddingPin && (
                    <MarkerF
                      position={tempPin || map?.getCenter()?.toJSON() || { lat: 43.6532, lng: -79.3832 }}
                      draggable={true}
                      onDragEnd={handleNewPinDragEnd}
                      icon={{
                        path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                        fillColor: "#FF0000", // Red for new pin
                        fillOpacity: 1,
                        strokeWeight: 2,
                        strokeColor: "#ffffff",
                        scale: 2,
                        anchor: { x: 12, y: 24 } as any
                      }}
                    />
                  )}
                  {isAddingPin && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-red-600 text-white px-6 py-3 rounded-full shadow-2xl font-bold text-xs uppercase tracking-widest animate-pulse">
                      Drag the RED pin to the project location
                    </div>
                  )}
                </GoogleMap>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <Loader2 className="animate-spin text-royal-blue" size={32} />
                </div>
              )}
            </div>

            <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black">Project Details List</h3>
                <span className="text-[10px] text-gray-400 font-bold uppercase">{pins.length} Projects Saved</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b border-gray-100">
                      <th className="p-4 text-[10px] font-bold uppercase text-gray-400 tracking-widest">Project Title</th>
                      <th className="p-4 text-[10px] font-bold uppercase text-gray-400 tracking-widest">Coordinates</th>
                      <th className="p-4 text-[10px] font-bold uppercase text-gray-400 tracking-widest">Description</th>
                      <th className="p-4 text-[10px] font-bold uppercase text-gray-400 tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {(!pins || pins.length === 0) ? (
                      <tr>
                        <td colSpan={4} className="p-10 text-center text-gray-400 text-xs italic">No projects saved yet. Add a pin on the map to get started.</td>
                      </tr>
                    ) : (
                      pins.map((pin) => (
                        <tr key={pin.id} className="hover:bg-gray-50 transition-colors group">
                          <td className="p-4">
                            <div className="font-bold text-brand-black text-sm">{pin.title || 'Untitled Project'}</div>
                          </td>
                          <td className="p-4">
                            <div className="text-[10px] text-royal-blue font-mono font-bold">
                              {(pin.lat || 0).toFixed(6)}, {(pin.lng || 0).toFixed(6)}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-xs text-gray-500 max-w-xs truncate" title={pin.description}>
                              {pin.description || 'No description provided'}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end space-x-2">
                              <button 
                                onClick={() => {
                                  if (map) {
                                    map.panTo({ lat: pin.lat, lng: pin.lng });
                                    map.setZoom(15);
                                    setSelectedPin(pin);
                                  }
                                }}
                                className="p-2 text-gray-400 hover:text-royal-blue hover:bg-royal-blue/5 rounded-sm transition-all"
                                title="View on Map"
                              >
                                <MapIcon size={16} />
                              </button>
                              <button 
                                onClick={() => handleEditPin(pin)} 
                                className="p-2 text-gray-400 hover:text-royal-blue hover:bg-royal-blue/5 rounded-sm transition-all"
                                title="Edit Details"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => deletePin(pin.id)} 
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-sm transition-all"
                                title="Delete Project"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'AI Chat Leads' && (
          <div className="space-y-4">
            {leads.map((lead) => (
              <div key={lead.id} className="bg-white p-6 border border-gray-100 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-royal-blue font-bold uppercase text-xs tracking-widest">{lead.service}</span>
                    <span className="text-[10px] bg-gray-100 text-gray-400 px-2 py-1 rounded-full font-bold">{lead.status}</span>
                  </div>
                  <h3 className="text-lg font-bold text-brand-black">{lead.location}</h3>
                  <p className="text-sm text-gray-500">{lead.budget} • {lead.timeline}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-300 font-bold uppercase mb-2">{lead.timestamp}</p>
                  <button className="text-royal-blue text-xs font-bold uppercase hover:underline">View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Website Editor' && (
          <div className="space-y-10">
            <section className="bg-white p-8 border border-gray-100 rounded-sm shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-royal-blue flex items-center"><ImageIcon className="mr-2" /> Hero Slider</h3>
                <button onClick={() => { setFormData({ type: 'slide' }); setIsModalOpen(true); }} className="bg-royal-blue text-white px-4 py-2 text-xs font-bold uppercase flex items-center shadow-lg hover:bg-red-700 transition-colors"><Plus size={16} className="mr-1" /> Add Slide</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {heroSlides.map((slide) => (
                  <div key={slide.id} className="group relative aspect-video rounded-sm overflow-hidden border border-gray-100 shadow-sm">
                    <img src={slide.image_url} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                      <p className="text-white font-bold text-sm mb-1">{slide.title}</p>
                      <p className="text-white/70 text-[10px] uppercase tracking-widest mb-4">{slide.subtitle}</p>
                      <div className="flex space-x-3">
                        <button onClick={() => handleEditSlide(slide)} className="p-2 bg-white text-royal-blue rounded-full hover:bg-royal-blue hover:text-white transition-colors shadow-xl">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => deleteSlide(slide.id)} className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-xl">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white p-8 border border-gray-100 rounded-sm shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-royal-blue flex items-center"><Globe className="mr-2" /> Page Content Sections</h3>
                <button onClick={() => { setFormData({ type: 'content', page_name: 'Home' }); setIsModalOpen(true); }} className="bg-royal-blue text-white px-4 py-2 text-xs font-bold uppercase flex items-center shadow-lg hover:bg-red-700 transition-colors"><Plus size={16} className="mr-1" /> Add Section</button>
              </div>
              <div className="space-y-8">
                {['Home', 'About', 'Process', 'Contact', 'Products', 'Projects', 'Privacy', 'Terms'].map(page => (
                  <div key={page} className="space-y-4">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] border-b pb-2">{page} Page Sections</h4>
                    <div className="grid grid-cols-1 gap-6">
                      {pageContent.filter(c => c.page_name === page).map(content => (
                        <div key={content.section_key} className="p-6 bg-gray-50 border border-gray-100 rounded-sm space-y-4 relative group/section">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-royal-blue uppercase tracking-widest">{content.section_key}</span>
                            <button 
                              onClick={() => deletePageContent(content.section_key)}
                              className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover/section:opacity-100"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase text-gray-400">Section Title</label>
                              <input 
                                className="w-full border p-3 text-sm focus:border-royal-blue outline-none bg-white" 
                                value={content.title || ''} 
                                onChange={(e) => handleUpdatePageContent(content.section_key, 'title', e.target.value)} 
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase text-gray-400">Section Subtitle</label>
                              <input 
                                className="w-full border p-3 text-sm focus:border-royal-blue outline-none bg-white" 
                                value={content.subtitle || ''} 
                                onChange={(e) => handleUpdatePageContent(content.section_key, 'subtitle', e.target.value)} 
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-gray-400">Description / Body Text</label>
                            <textarea 
                              className="w-full border p-3 text-sm h-24 focus:border-royal-blue outline-none bg-white resize-none" 
                              value={content.description || ''} 
                              onChange={(e) => handleUpdatePageContent(content.section_key, 'description', e.target.value)} 
                            />
                          </div>
                        </div>
                      ))}
                      {pageContent.filter(c => c.page_name === page).length === 0 && (
                        <p className="text-xs text-gray-400 italic">No editable sections found for this page.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            <div className="flex justify-center pt-6">
              <button 
                onClick={handleGlobalSave}
                disabled={isSaving}
                className="bg-royal-blue text-white px-12 py-4 text-sm font-bold uppercase flex items-center shadow-2xl hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isSaving ? <Loader2 size={20} className="animate-spin mr-2" /> : <Save size={20} className="mr-2" />}
                {isSaving ? 'Saving Changes...' : 'Update Website Content'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'Settings' && (
          <div className="space-y-10">
            <section className="bg-white p-8 border border-gray-100 rounded-sm shadow-sm">
              <h3 className="text-xl font-bold text-royal-blue mb-6 flex items-center"><Globe className="mr-2" /> Global Branding</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400">Brand Name</label>
                    <div className="flex space-x-2 mt-1">
                      <input className="flex-grow border p-3 text-sm focus:border-royal-blue outline-none" value={settings.brand_name || ''} onChange={(e) => handleUpdateSetting('brand_name', e.target.value)} />
                      {settings.brand_name && (
                        <button 
                          onClick={() => handleUpdateSetting('brand_name', '')}
                          className="bg-red-50 p-3 rounded-sm cursor-pointer hover:bg-red-100 transition-colors text-red-500"
                          title="Clear Brand Name"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400">Brand Subtext</label>
                    <div className="flex space-x-2 mt-1">
                      <input className="flex-grow border p-3 text-sm focus:border-royal-blue outline-none" value={settings.brand_subtext || ''} onChange={(e) => handleUpdateSetting('brand_subtext', e.target.value)} />
                      {settings.brand_subtext && (
                        <button 
                          onClick={() => handleUpdateSetting('brand_subtext', '')}
                          className="bg-red-50 p-3 rounded-sm cursor-pointer hover:bg-red-100 transition-colors text-red-500"
                          title="Clear Brand Subtext"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400">Logo URL</label>
                    <div className="flex space-x-2 mt-1">
                      <input className="flex-grow border p-3 text-sm focus:border-royal-blue outline-none" value={settings.logo_url || ''} onChange={(e) => handleUpdateSetting('logo_url', e.target.value)} />
                      <label className="bg-gray-100 p-3 rounded-sm cursor-pointer hover:bg-gray-200 transition-colors flex items-center justify-center min-w-[44px]">
                        <input type="file" className="hidden" onChange={async (e) => {
                          if (e.target.files?.[0]) {
                            try {
                              setUploading(true);
                              const url = await uploadToImgBB(e.target.files[0]);
                              handleUpdateSetting('logo_url', url);
                            } catch (err) {
                              console.error("Logo upload failed:", err);
                              alert("Failed to upload logo. Please try again.");
                            } finally {
                              setUploading(false);
                            }
                          }
                        }} />
                        {uploading ? (
                          <Loader2 size={18} className="animate-spin text-royal-blue" />
                        ) : (
                          <Upload size={18} className="text-gray-500" />
                        )}
                      </label>
                      {settings.logo_url && (
                        <button 
                          onClick={() => handleUpdateSetting('logo_url', '')}
                          className="bg-red-50 p-3 rounded-sm cursor-pointer hover:bg-red-100 transition-colors text-red-500"
                          title="Delete Logo"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                    {settings.logo_url && (
                      <div className="mt-4 p-4 bg-gray-50 border border-dashed border-gray-200 rounded-sm flex flex-col items-center">
                        <span className="text-[9px] font-bold uppercase text-gray-400 mb-2">Logo Preview</span>
                        <img src={settings.logo_url} alt="Logo Preview" className="h-12 w-auto object-contain" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400">Footer Logo URL</label>
                    <div className="flex space-x-2 mt-1">
                      <input className="flex-grow border p-3 text-sm focus:border-royal-blue outline-none" value={settings.footer_logo_url || ''} onChange={(e) => handleUpdateSetting('footer_logo_url', e.target.value)} />
                      <label className="bg-gray-100 p-3 rounded-sm cursor-pointer hover:bg-gray-200 transition-colors flex items-center justify-center min-w-[44px]">
                        <input type="file" className="hidden" onChange={async (e) => {
                          if (e.target.files?.[0]) {
                            try {
                              setUploading(true);
                              const url = await uploadToImgBB(e.target.files[0]);
                              handleUpdateSetting('footer_logo_url', url);
                            } catch (err) {
                              console.error("Footer logo upload failed:", err);
                              alert("Failed to upload footer logo. Please try again.");
                            } finally {
                              setUploading(false);
                            }
                          }
                        }} />
                        {uploading ? (
                          <Loader2 size={18} className="animate-spin text-royal-blue" />
                        ) : (
                          <Upload size={18} className="text-gray-500" />
                        )}
                      </label>
                      {settings.footer_logo_url && (
                        <button 
                          onClick={() => handleUpdateSetting('footer_logo_url', '')}
                          className="bg-red-50 p-3 rounded-sm cursor-pointer hover:bg-red-100 transition-colors text-red-500"
                          title="Delete Footer Logo"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                    {settings.footer_logo_url && (
                      <div className="mt-4 p-4 bg-gray-50 border border-dashed border-gray-200 rounded-sm flex flex-col items-center">
                        <span className="text-[9px] font-bold uppercase text-gray-400 mb-2">Footer Logo Preview</span>
                        <img src={settings.footer_logo_url} alt="Footer Logo Preview" className="h-12 w-auto object-contain" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400">Contact Phone</label>
                    <input className="w-full border p-3 text-sm mt-1 focus:border-royal-blue outline-none" value={settings.phone || ''} onChange={(e) => handleUpdateSetting('phone', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400">Contact Email</label>
                    <input className="w-full border p-3 text-sm mt-1 focus:border-royal-blue outline-none" value={settings.email || ''} onChange={(e) => handleUpdateSetting('email', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400">Office Address</label>
                    <textarea className="w-full border p-3 text-sm mt-1 focus:border-royal-blue outline-none h-24 resize-none" value={settings.address || ''} onChange={(e) => handleUpdateSetting('address', e.target.value)} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-gray-400">Working Hours (Weekday)</label>
                      <input className="w-full border p-3 text-sm mt-1 focus:border-royal-blue outline-none" value={settings.working_hours_weekday || ''} onChange={(e) => handleUpdateSetting('working_hours_weekday', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-gray-400">Working Hours (Weekend)</label>
                      <input className="w-full border p-3 text-sm mt-1 focus:border-royal-blue outline-none" value={settings.working_hours_weekend || ''} onChange={(e) => handleUpdateSetting('working_hours_weekend', e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400">Footer Description</label>
                    <textarea className="w-full border p-3 text-sm mt-1 focus:border-royal-blue outline-none h-24 resize-none" value={settings.footer_description || ''} onChange={(e) => handleUpdateSetting('footer_description', e.target.value)} />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 border border-gray-100 rounded-sm shadow-sm">
              <h3 className="text-xl font-bold text-royal-blue mb-6 flex items-center"><Facebook className="mr-2" /> Social Media Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400">Facebook URL</label>
                    <input className="w-full border p-3 text-sm mt-1 focus:border-royal-blue outline-none" value={settings.facebook_url || ''} onChange={(e) => handleUpdateSetting('facebook_url', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400">Instagram URL</label>
                    <input className="w-full border p-3 text-sm mt-1 focus:border-royal-blue outline-none" value={settings.instagram_url || ''} onChange={(e) => handleUpdateSetting('instagram_url', e.target.value)} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400">LinkedIn URL</label>
                    <input className="w-full border p-3 text-sm mt-1 focus:border-royal-blue outline-none" value={settings.linkedin_url || ''} onChange={(e) => handleUpdateSetting('linkedin_url', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400">Twitter URL</label>
                    <input className="w-full border p-3 text-sm mt-1 focus:border-royal-blue outline-none" value={settings.twitter_url || ''} onChange={(e) => handleUpdateSetting('twitter_url', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400">TikTok URL</label>
                    <input className="w-full border p-3 text-sm mt-1 focus:border-royal-blue outline-none" value={settings.tiktok_url || ''} onChange={(e) => handleUpdateSetting('tiktok_url', e.target.value)} />
                  </div>
                </div>
              </div>
            </section>
            
            <div className="flex justify-center pt-6">
              <button 
                onClick={handleGlobalSave}
                disabled={isSaving}
                className="bg-royal-blue text-white px-12 py-4 text-sm font-bold uppercase flex items-center shadow-2xl hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isSaving ? <Loader2 size={20} className="animate-spin mr-2" /> : <Save size={20} className="mr-2" />}
                {isSaving ? 'Saving Changes...' : 'Save Site Settings'}
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'Orders & Carts' && (
          <div className="space-y-10">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 border border-gray-100 rounded-sm shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-50 text-green-600 rounded-sm">
                    <ShoppingCart size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Total Orders</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{orders.length}</h3>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Completed & Pending</p>
              </div>
              <div className="bg-white p-6 border border-gray-100 rounded-sm shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-orange-50 text-orange-600 rounded-sm">
                    <History size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Abandoned Carts</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{abandonedCarts.length}</h3>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Potential Customers</p>
              </div>
              <div className="bg-white p-6 border border-gray-100 rounded-sm shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-sm">
                    <UserCheck size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Registered Users</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{users.length}</h3>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Customer Base</p>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center">
                  <ShoppingCart size={18} className="mr-2 text-royal-blue" /> Recent Orders
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Address</th>
                      <th className="px-6 py-4">Items</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-xs font-bold text-royal-blue">#{order.id.slice(0, 8)}</td>
                        <td className="px-6 py-4">
                          <div className="text-xs font-bold text-gray-900">{order.user_name}</div>
                          <div className="text-[10px] text-gray-400">{order.user_email}</div>
                          <div className="text-[10px] text-gray-400">{order.user_phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-[10px] text-gray-900 font-bold">{order.user_address}</div>
                          <div className="text-[9px] text-gray-400 uppercase tracking-widest">{order.user_city}, {order.user_postal_code}</div>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-gray-900">${order.total.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                            order.status === 'Completed' ? 'bg-green-100 text-green-600' : 
                            order.status === 'Pending' ? 'bg-orange-100 text-orange-600' : 
                            'bg-red-100 text-red-600'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[10px] text-gray-400">{new Date(order.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-gray-400 text-xs uppercase tracking-widest">No orders found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Abandoned Carts */}
            <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center">
                  <History size={18} className="mr-2 text-orange-500" /> Abandoned Carts
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Items</th>
                      <th className="px-6 py-4">Total Value</th>
                      <th className="px-6 py-4">Last Updated</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {abandonedCarts.map((cart) => (
                      <tr key={cart.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-xs font-bold text-gray-900">{cart.user_name}</div>
                          <div className="text-[10px] text-gray-400">{cart.user_email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex -space-x-2">
                            {cart.items.slice(0, 3).map((item, i) => (
                              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm">
                                <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                              </div>
                            ))}
                            {cart.items.length > 3 && (
                              <div className="w-8 h-8 rounded-full border-2 border-white bg-royal-blue text-white flex items-center justify-center text-[9px] font-bold shadow-sm">
                                +{cart.items.length - 3}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-gray-900">${cart.total.toFixed(2)}</td>
                        <td className="px-6 py-4 text-[10px] text-gray-400">{new Date(cart.last_updated).toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <button className="text-[10px] font-bold text-royal-blue uppercase tracking-widest hover:underline">Send Reminder</button>
                        </td>
                      </tr>
                    ))}
                    {abandonedCarts.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-xs uppercase tracking-widest">No abandoned carts found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Registered Users */}
            <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center">
                  <UserCheck size={18} className="mr-2 text-blue-500" /> Registered Users
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Joined Date</th>
                      <th className="px-6 py-4">Orders</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-xs font-bold text-gray-900">{user.full_name}</td>
                        <td className="px-6 py-4 text-xs text-gray-500">{user.email}</td>
                        <td className="px-6 py-4 text-[10px] text-gray-400">{new Date(user.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-xs font-bold text-royal-blue">
                          {orders.filter(o => o.user_email === user.email).length}
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-400 text-xs uppercase tracking-widest">No users found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-gray-100 rounded-sm shadow-sm text-center">
              <Package size={32} className="mx-auto text-royal-blue mb-4" />
              <h4 className="text-3xl font-black text-brand-black mb-1">{products.length}</h4>
              <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Active Products</p>
            </div>
            <div className="bg-white p-8 border border-gray-100 rounded-sm shadow-sm text-center">
              <Users size={32} className="mx-auto text-royal-blue mb-4" />
              <h4 className="text-3xl font-black text-brand-black mb-1">{leads.length}</h4>
              <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Captured Leads</p>
            </div>
            <div className="bg-white p-8 border border-gray-100 rounded-sm shadow-sm text-center">
              <ImageIcon size={32} className="mx-auto text-royal-blue mb-4" />
              <h4 className="text-3xl font-black text-brand-black mb-1">{projects.length}</h4>
              <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Gallery Projects</p>
            </div>
          </div>
        )}
      </main>

      {/* Global Save Button */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-8 right-8 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <button 
            onClick={handleGlobalSave}
            disabled={isSaving}
            className="bg-royal-blue text-white px-8 py-4 rounded-full shadow-2xl flex items-center space-x-3 hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Save size={20} />
            )}
            <span className="font-bold uppercase tracking-widest text-xs">
              {isSaving ? 'Saving Changes...' : 'Save All Changes'}
            </span>
          </button>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[120] animate-in fade-in zoom-in duration-300">
          <div className="bg-green-600 text-white px-8 py-4 rounded-full shadow-2xl flex items-center space-x-3">
            <div className="bg-white/20 p-1 rounded-full">
              <CheckCircle size={20} />
            </div>
            <span className="font-bold uppercase tracking-widest text-xs">Details Saved Successfully!</span>
          </div>
        </div>
      )}

      {/* Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg p-10 rounded-sm shadow-2xl relative">
            <button onClick={() => { setIsModalOpen(false); setIsAddingPin(false); setTempPin(null); }} className="absolute top-6 right-6 text-gray-400 hover:text-royal-blue"><X size={24} /></button>
            <h3 className="text-2xl font-bold mb-8 uppercase tracking-tighter">
              {formData.id ? 'Edit ' : 'Add New '}
              {formData.type === 'product' ? 'Product' : formData.type === 'category' ? 'Product Category' : formData.type === 'subcategory' ? 'Product Sub-Category' : formData.type === 'project' ? 'Gallery Project' : formData.type === 'client' ? 'Client' : formData.type === 'content' ? 'Page Section' : formData.type === 'pin' ? 'Map Pin' : 'Slide'}
            </h3>
            
            <form onSubmit={handleSave} className="space-y-6">
              {formData.type === 'product' ? (
                <div className="max-h-[60vh] overflow-y-auto pr-4 -mr-4 space-y-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Product Name</label>
                    <input required className="w-full border border-gray-200 p-3 text-sm focus:border-royal-blue outline-none" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-gray-400">Category</label>
                      <select className="w-full border border-gray-200 p-3 text-sm focus:border-royal-blue outline-none" value={formData.category || ''} onChange={e => {
                        const cat = categories.find(c => c.name === e.target.value);
                        setFormData({...formData, category: e.target.value, subcategory_id: ''});
                      }}>
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-gray-400">Sub-Category (Optional)</label>
                      <select className="w-full border border-gray-200 p-3 text-sm focus:border-royal-blue outline-none" value={formData.subcategory_id || ''} onChange={e => setFormData({...formData, subcategory_id: e.target.value})}>
                        <option value="">None</option>
                        {subCategories
                          .filter(sc => {
                            const parentCat = categories.find(c => c.id === sc.category_id);
                            return parentCat?.name === formData.category;
                          })
                          .map(sc => <option key={sc.id} value={sc.id}>{sc.name}</option>)
                        }
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-gray-400">Display Price</label>
                      <input required className="w-full border border-gray-200 p-3 text-sm focus:border-royal-blue outline-none" placeholder="e.g. $1.70 CAD" value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-gray-400">SKU</label>
                      <input className="w-full border border-gray-200 p-3 text-sm focus:border-royal-blue outline-none" placeholder="e.g. 518028ABN" value={formData.sku || ''} onChange={e => setFormData({...formData, sku: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-gray-400">Brand</label>
                      <input className="w-full border border-gray-200 p-3 text-sm focus:border-royal-blue outline-none" placeholder="e.g. WINNEC" value={formData.brand || ''} onChange={e => setFormData({...formData, brand: e.target.value})} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Colors (Comma separated)</label>
                    <input 
                      className="w-full border border-gray-200 p-3 text-sm focus:border-royal-blue outline-none" 
                      placeholder="e.g. AB - Antique Brass, MB - Matte Black" 
                      value={formData.colors?.join(', ') || ''} 
                      onChange={e => setFormData({...formData, colors: e.target.value.split(',').map(s => s.trim())})} 
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Sizes (Comma separated)</label>
                    <input 
                      className="w-full border border-gray-200 p-3 text-sm focus:border-royal-blue outline-none" 
                      placeholder="e.g. Knob, 128 mm, 160 mm" 
                      value={formData.sizes?.join(', ') || ''} 
                      onChange={e => setFormData({...formData, sizes: e.target.value.split(',').map(s => s.trim())})} 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Main Product Image</label>
                    <div className="flex items-center space-x-4">
                      {formData.image_url && (
                        <div className="w-16 h-16 border rounded-sm overflow-hidden bg-gray-50 flex items-center justify-center p-2">
                          <img src={formData.image_url} className="max-w-full max-h-full object-contain" />
                        </div>
                      )}
                      <label className="flex-1 border-2 border-dashed border-gray-200 p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all">
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={async (e) => {
                            if (e.target.files?.[0]) {
                              try {
                                setUploading(true);
                                const url = await uploadToImgBB(e.target.files[0]);
                                setFormData((prev: any) => ({...prev, image_url: url}));
                              } catch (err: any) {
                                console.error("Upload failed:", err);
                                alert(`Upload failed: ${err.message || 'Unknown error'}`);
                              } finally {
                                setUploading(false);
                              }
                            }
                          }} 
                        />
                        {uploading ? (
                          <Loader2 size={24} className="animate-spin text-royal-blue" />
                        ) : (
                          <>
                            <Upload size={24} className="text-gray-400 mb-2" />
                            <span className="text-[10px] font-bold uppercase text-gray-400">Upload Main Image</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Extra Gallery Images</label>
                    <div className="grid grid-cols-4 gap-2">
                      {formData.images?.map((img: string, idx: number) => (
                        <div key={idx} className="relative aspect-square border rounded-sm overflow-hidden group">
                          <img src={img} className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => setFormData({...formData, images: formData.images.filter((_: any, i: number) => i !== idx)})}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      ))}
                      <label className="aspect-square border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all">
                        <input 
                          type="file" 
                          multiple
                          className="hidden" 
                          onChange={async (e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              try {
                                setUploading(true);
                                const files = Array.from(e.target.files);
                                const uploadPromises = files.map(file => uploadToImgBB(file));
                                const urls = await Promise.all(uploadPromises);
                                setFormData((prev: any) => ({
                                  ...prev, 
                                  images: [...(prev.images || []), ...urls]
                                }));
                              } catch (err: any) {
                                console.error("Gallery upload failed:", err);
                                alert(`Gallery upload failed: ${err.message || 'Unknown error'}`);
                              } finally {
                                setUploading(false);
                              }
                            }
                          }} 
                        />
                        {uploading ? (
                          <Loader2 size={20} className="animate-spin text-royal-blue" />
                        ) : (
                          <Plus size={20} className="text-gray-400" />
                        )}
                      </label>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Short Description</label>
                    <textarea className="w-full border border-gray-200 p-3 text-sm h-24 focus:border-royal-blue outline-none" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold uppercase text-gray-400">Technical Specs</label>
                      <button 
                        type="button" 
                        onClick={() => setFormData({...formData, specs: [...(formData.specs || []), { label: '', value: '' }]})}
                        className="text-royal-blue text-[10px] font-bold uppercase hover:underline"
                      >
                        + Add Spec
                      </button>
                    </div>
                    <div className="space-y-2">
                      {formData.specs?.map((spec: any, idx: number) => (
                        <div key={idx} className="flex gap-2">
                          <input 
                            className="flex-1 border border-gray-200 p-2 text-xs outline-none focus:border-royal-blue" 
                            placeholder="Label (e.g. Length)"
                            value={spec.label}
                            onChange={e => {
                              const newSpecs = [...formData.specs];
                              newSpecs[idx].label = e.target.value;
                              setFormData({...formData, specs: newSpecs});
                            }}
                          />
                          <input 
                            className="flex-1 border border-gray-200 p-2 text-xs outline-none focus:border-royal-blue" 
                            placeholder="Value (e.g. 146)"
                            value={spec.value}
                            onChange={e => {
                              const newSpecs = [...formData.specs];
                              newSpecs[idx].value = e.target.value;
                              setFormData({...formData, specs: newSpecs});
                            }}
                          />
                          <button 
                            type="button"
                            onClick={() => setFormData({...formData, specs: formData.specs.filter((_: any, i: number) => i !== idx)})}
                            className="text-red-500 p-2"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : formData.type === 'service' ? (
                <div className="max-h-[60vh] overflow-y-auto pr-4 -mr-4 space-y-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Service Title</label>
                    <input required className="w-full border border-gray-200 p-3 text-sm focus:border-royal-blue outline-none" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Icon Name (Lucide Icon)</label>
                    <select className="w-full border border-gray-200 p-3 text-sm focus:border-royal-blue outline-none" value={formData.icon_name || 'Home'} onChange={e => setFormData({...formData, icon_name: e.target.value})}>
                      <option value="Home">Home (Legal Basements)</option>
                      <option value="ChefHat">ChefHat (Kitchen Renovation)</option>
                      <option value="Layout">Layout (Modular Cabinetry)</option>
                      <option value="DoorOpen">DoorOpen (Custom Closets)</option>
                      <option value="Building2">Building2 (Condo Renovations)</option>
                      <option value="Hammer">Hammer</option>
                      <option value="Wrench">Wrench</option>
                      <option value="Paintbrush">Paintbrush</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Short Description</label>
                    <textarea required className="w-full border border-gray-200 p-3 text-sm h-20 focus:border-royal-blue outline-none" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Long Description (Detailed)</label>
                    <textarea required className="w-full border border-gray-200 p-3 text-sm h-40 focus:border-royal-blue outline-none" value={formData.long_description || ''} onChange={e => setFormData({...formData, long_description: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Service Banner Image</label>
                    <div className="flex items-center space-x-4">
                      {formData.image_url && (
                        <div className="w-16 h-16 border rounded-sm overflow-hidden bg-gray-50 flex items-center justify-center p-2">
                          <img src={formData.image_url} className="max-w-full max-h-full object-contain" />
                        </div>
                      )}
                      <label className="flex-1 border-2 border-dashed border-gray-200 p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all">
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={async (e) => {
                            if (e.target.files?.[0]) {
                              try {
                                setUploading(true);
                                const url = await uploadToImgBB(e.target.files[0]);
                                setFormData((prev: any) => ({...prev, image_url: url}));
                              } catch (err: any) {
                                console.error("Upload failed:", err);
                                alert(`Upload failed: ${err.message || 'Unknown error'}`);
                              } finally {
                                setUploading(false);
                              }
                            }
                          }} 
                        />
                        {uploading ? (
                          <Loader2 size={24} className="animate-spin text-royal-blue" />
                        ) : (
                          <>
                            <Upload size={24} className="text-gray-400 mb-2" />
                            <span className="text-[10px] font-bold uppercase text-gray-400">Upload Banner Image</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold uppercase text-gray-400">Benefits (One per line)</label>
                    </div>
                    <textarea 
                      className="w-full border border-gray-200 p-3 text-sm h-24 focus:border-royal-blue outline-none" 
                      placeholder="e.g. High Quality Materials&#10;Expert Installation&#10;Lifetime Warranty"
                      value={formData.benefits?.join('\n') || ''}
                      onChange={e => setFormData({...formData, benefits: e.target.value.split('\n').filter(s => s.trim() !== '')})}
                    />
                  </div>
                </div>
              ) : formData.type === 'category' ? (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Category Name</label>
                    <input required className="w-full border border-gray-200 p-3 text-sm focus:border-royal-blue outline-none" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Handles & Knobs" />
                  </div>
                </>
              ) : formData.type === 'subcategory' ? (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Parent Category</label>
                    <select className="w-full border border-gray-200 p-3 text-sm focus:border-royal-blue outline-none" value={formData.category_id || ''} onChange={e => setFormData({...formData, category_id: e.target.value})}>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Sub-Category Name</label>
                    <input required className="w-full border border-gray-200 p-3 text-sm focus:border-royal-blue outline-none" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Pull Handles" />
                  </div>
                </>
              ) : formData.type === 'project' ? (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Project Name (e.g. Modern Kitchen)</label>
                    <input required className="w-full border border-gray-200 p-3 text-sm focus:border-royal-blue outline-none" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Gallery Category</label>
                    <select className="w-full border border-gray-200 p-3 text-sm focus:border-royal-blue outline-none" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})}>
                      <option value="">Select Category</option>
                      {['RETAIL SHOWROOM', 'EXTERIOR RETROFIT', 'FOOD SERVICE', 'RESTAURANT (FULL SERVICE)', 'RETAIL GROCERY', 'FULL DESIGN BUILD', 'EPOXY FLOORING'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Project Images ({formData.images?.length || 0})</label>
                    <div className="grid grid-cols-4 gap-2">
                      {formData.images?.map((img: string, idx: number) => (
                        <div key={idx} className="relative aspect-square border rounded-sm overflow-hidden">
                          <img src={img} className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => setFormData({...formData, images: formData.images.filter((_: any, i: number) => i !== idx)})}
                            className="absolute top-0 right-0 bg-red-500 text-white p-1"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                      <label className="aspect-square border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50">
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={async (e) => {
                            if (e.target.files?.[0]) {
                              try {
                                setUploading(true);
                                const url = await uploadToImgBB(e.target.files[0]);
                                setFormData((prev: any) => ({...prev, images: [...(prev.images || []), url]}));
                              } catch (err: any) {
                                console.error("Upload failed:", err);
                                alert(`Upload failed: ${err.message || 'Unknown error'}`);
                              } finally {
                                setUploading(false);
                              }
                            }
                          }} 
                        />
                        {uploading ? <Loader2 size={16} className="animate-spin text-royal-blue" /> : <Plus size={16} className="text-gray-400" />}
                      </label>
                    </div>
                  </div>
                </>
              ) : formData.type === 'client' ? (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Client Name</label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-200 p-3 text-sm focus:border-royal-blue outline-none" 
                      placeholder="e.g. Scotiabank"
                      value={formData.name || ''}
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Client Category</label>
                    <select 
                      className="w-full border border-gray-200 p-3 text-sm focus:border-royal-blue outline-none" 
                      value={formData.category || ''}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                      {[
                        'Bonded-Secured Sites & Distribution',
                        'Education & Financial',
                        'Health Care & High Rise Residential',
                        'Hospitality & Food Service',
                        'Infrastructure & Office Towers',
                        'Power Distributors & Production Plants',
                        'Third-Party Management'
                      ].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Client Logo</label>
                    <div className="flex items-center space-x-4">
                      {formData.logo_url && (
                        <div className="w-16 h-16 border rounded-sm overflow-hidden bg-gray-50 flex items-center justify-center p-2">
                          <img src={formData.logo_url} className="max-w-full max-h-full object-contain" />
                        </div>
                      )}
                      <label 
                        className="flex-1 border-2 border-dashed border-gray-200 p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all"
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const file = e.dataTransfer.files?.[0];
                          if (file) {
                            if (file.type !== 'image/png' && file.type !== 'image/jpeg' && !file.name.toLowerCase().match(/\.(png|jpe?g)$/)) {
                              alert('Only .png, .jpg, and .jpeg formats are allowed for Client Logos.');
                              return;
                            }
                            try {
                              setUploading(true);
                              const url = await uploadToImgBB(file);
                              setFormData((prev: any) => ({...prev, logo_url: url}));
                            } catch (err: any) {
                              console.error("Upload failed:", err);
                              alert(`Upload failed: ${err.message || 'Unknown error'}`);
                            } finally {
                              setUploading(false);
                            }
                          }
                        }}
                      >
                        <input 
                          type="file" 
                          accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                          className="hidden" 
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.type !== 'image/png' && file.type !== 'image/jpeg' && !file.name.toLowerCase().match(/\.(png|jpe?g)$/)) {
                                alert('Only .png, .jpg, and .jpeg formats are allowed for Client Logos.');
                                return;
                              }
                              try {
                                setUploading(true);
                                const url = await uploadToImgBB(file);
                                setFormData((prev: any) => ({...prev, logo_url: url}));
                              } catch (err: any) {
                                console.error("Upload failed:", err);
                                alert(`Upload failed: ${err.message || 'Unknown error'}`);
                              } finally {
                                setUploading(false);
                              }
                            }
                          }} 
                        />
                        {uploading ? (
                          <Loader2 size={24} className="animate-spin text-royal-blue" />
                        ) : (
                          <>
                            <Upload size={24} className="text-gray-400 mb-2" />
                            <span className="text-[10px] font-bold uppercase text-gray-400 text-center">Drag & Drop or Click to Upload<br/>(.PNG, .JPG, .JPEG)</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </>
              ) : formData.type === 'pin' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-gray-400">Latitude</label>
                      <input 
                        required 
                        type="number" 
                        step="any"
                        className="w-full border border-gray-200 p-3 text-sm focus:border-royal-blue outline-none" 
                        value={formData.lat || ''}
                        onChange={e => setFormData({...formData, lat: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-gray-400">Longitude</label>
                      <input 
                        required 
                        type="number" 
                        step="any"
                        className="w-full border border-gray-200 p-3 text-sm focus:border-royal-blue outline-none" 
                        value={formData.lng || ''}
                        onChange={e => setFormData({...formData, lng: e.target.value})} 
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Project Title</label>
                    <input 
                      required 
                      className="w-full border border-gray-200 p-3 text-sm focus:border-royal-blue outline-none" 
                      value={formData.title || ''}
                      onChange={e => setFormData({...formData, title: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Project Description</label>
                    <textarea 
                      className="w-full border border-gray-200 p-3 text-sm h-24 focus:border-royal-blue outline-none resize-none" 
                      value={formData.description || ''}
                      onChange={e => setFormData({...formData, description: e.target.value})} 
                    />
                  </div>
                </>
              ) : formData.type === 'content' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-gray-400">Page Name</label>
                      <select className="w-full border border-gray-200 p-3 text-sm focus:border-royal-blue outline-none" value={formData.page_name || 'Home'} onChange={e => setFormData({...formData, page_name: e.target.value})}>
                        {['Home', 'About', 'Process', 'Contact', 'Products', 'Projects', 'Privacy', 'Terms'].map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-gray-400">Section Key (Unique ID)</label>
                      <input required className="w-full border border-gray-200 p-3 text-sm focus:border-royal-blue outline-none" placeholder="e.g. hero_section" value={formData.section_key || ''} onChange={e => setFormData({...formData, section_key: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Section Title</label>
                    <input required className="w-full border border-gray-200 p-3 text-sm focus:border-royal-blue outline-none" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Section Subtitle</label>
                    <input className="w-full border border-gray-200 p-3 text-sm focus:border-royal-blue outline-none" value={formData.subtitle || ''} onChange={e => setFormData({...formData, subtitle: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Button Text (Optional)</label>
                    <input className="w-full border border-gray-200 p-3 text-sm focus:border-royal-blue outline-none" value={formData.button_text || ''} onChange={e => setFormData({...formData, button_text: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Description / Body Text</label>
                    <textarea className="w-full border border-gray-200 p-3 text-sm h-32 focus:border-royal-blue outline-none resize-none" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Slide Title</label>
                    <input required className="w-full border border-gray-200 p-3 text-sm focus:border-royal-blue outline-none" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Slide Subtitle</label>
                    <input className="w-full border border-gray-200 p-3 text-sm focus:border-royal-blue outline-none" value={formData.subtitle || ''} onChange={e => setFormData({...formData, subtitle: e.target.value})} />
                  </div>
                </>
              )}
              
              {(formData.type === 'product' || formData.type === 'slide') && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400">Visual Asset (Image)</label>
                  <div className="border-2 border-dashed border-gray-200 p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="file" className="hidden" id="admin-file-upload" onChange={async (e) => {
                      if (e.target.files?.[0]) {
                        try {
                          setUploading(true);
                          const url = await uploadToImgBB(e.target.files[0]);
                          setFormData((prev: any) => ({...prev, image_url: url}));
                        } catch (err: any) {
                          console.error("Upload failed:", err);
                          alert(`Upload failed: ${err.message || 'Unknown error'}`);
                        } finally {
                          setUploading(false);
                        }
                      }
                    }} />
                    <label htmlFor="admin-file-upload" className="cursor-pointer block">
                      {uploading ? <Loader2 className="animate-spin mx-auto text-royal-blue" /> : (
                        <>
                          {formData.image_url ? (
                            <div className="flex flex-col items-center">
                              <img src={formData.image_url} className="h-20 object-contain mb-2" />
                              <span className="text-[10px] font-bold text-green-600">Image Ready</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <ImageIcon className="mx-auto text-gray-300 mb-2" />
                              <span className="text-[10px] font-bold text-gray-400">CLICK TO UPLOAD</span>
                            </div>
                          )}
                        </>
                      )}
                    </label>
                  </div>
                </div>
              )}

              <button type="submit" disabled={uploading || ((formData.type === 'product' || formData.type === 'slide') && !formData.image_url)} className="w-full bg-royal-blue text-white py-5 font-bold uppercase text-xs tracking-widest disabled:opacity-50 shadow-xl hover:bg-red-700 transition-colors">
                {uploading ? 'Processing...' : 'Save Changes to Database'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;