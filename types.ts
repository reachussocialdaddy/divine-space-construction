
export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory_id?: string;
  price: string;
  image: string;
  images?: string[];
  description: string;
  sku?: string;
  colors?: string[];
  sizes?: string[];
  specs?: { label: string; value: string }[];
  brand?: string;
}

export interface ProductSubCategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  created_at?: string;
}

export interface ProjectPin {
  id: string;
  lat: number;
  lng: number;
  title?: string;
  description?: string;
}

export interface ImagePair {
  before: string;
  after: string;
}

export interface GalleryProject {
  id: string;
  name: string;
  category: string;
  images: string[];
}

export interface HeroSlide {
  id: string;
  image_url: string;
  title: string;
  subtitle: string;
  button_text: string;
}

export interface PageSectionContent {
  section_key: string;
  page_name: string;
  title: string;
  subtitle: string;
  description: string;
  button_text?: string;
}

export interface SiteSettings {
  id?: string;
  logo_url: string;
  footer_logo_url?: string;
  brand_name: string;
  brand_subtext: string;
  phone: string;
  email: string;
  address: string;
  footer_description?: string;
  working_hours_weekday?: string;
  working_hours_weekend?: string;
  facebook_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  tiktok_url?: string;
}

export interface Lead {
  id: string;
  service: string;
  location: string;
  budget: string;
  timeline: string;
  timestamp: string;
  status: 'New' | 'Contacted' | 'Closed';
  topic?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Service {
  id: string;
  title: string;
  icon_name?: string;
  icon?: any;
  description: string;
  long_description: string;
  benefits: string[];
  image_url: string;
  created_at?: string;
}

export interface Client {
  id: string;
  name: string;
  category: string;
  logo_url: string;
  created_at?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
}

export type View = 'Home' | 'About' | 'Products' | 'Admin' | 'Service' | 'Process' | 'Projects' | 'Clients' | 'ProductDetail' | 'Contact' | 'Inverness' | 'Privacy' | 'Terms' | 'Checkout';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Order {
  id: string;
  user_id?: string;
  user_email: string;
  user_name: string;
  user_phone: string;
  user_address: string;
  user_city: string;
  user_postal_code: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Completed' | 'Cancelled';
  created_at: string;
}

export interface AbandonedCart {
  id: string;
  user_email: string;
  user_name: string;
  items: CartItem[];
  total: number;
  last_updated: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  password?: string; // For prototype simplicity
  created_at: string;
}
