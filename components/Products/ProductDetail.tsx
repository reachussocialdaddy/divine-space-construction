import React, { useState, useEffect } from 'react';
import { Product, View } from '../../types';
import { formatPrice } from './ProductPage';
import { getAIClient } from '../../services/aiService.ts';
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
  Package,
  Camera,
  Upload,
  RefreshCw,
  AlertCircle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TAB_MATERIALS: Record<string, { id: string; name: string; image: string; description: string }[]> = {
  WALL: [
    { id: 'w1', name: 'Chantilly Lace White', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800', description: 'Clean, premium architectural matte white paint coat.' },
    { id: 'w2', name: 'Obsidian Slate Plaster', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800', description: 'Dark, modern micro-cement textured plaster.' },
    { id: 'w3', name: 'Classic Taupe Grey', image: 'https://images.unsplash.com/photo-1618221381711-42ca8ab6e908?auto=format&fit=crop&q=80&w=800', description: 'Warm grey beige paint providing a serene room backdrop.' },
    { id: 'w4', name: 'Sage Green Earth', image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=800', description: 'Muted organic sage color for luxury accent walls.' }
  ],
  FLOOR: [
    { id: 'f1', name: 'Smoked Oak Herringbone', image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80&w=800', description: 'Premium European smoked oak laid in classic herringbone pattern.' },
    { id: 'f2', name: 'Calacatta White Tiling', image: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&q=80&w=800', description: 'Polished large-format calacatta marble tiles with grey veining.' },
    { id: 'f3', name: 'Natural Honey Maple', image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=800', description: 'Warm honey maple wood planks with smooth satin protective coat.' },
    { id: 'f4', name: 'Industrial Slate Grey', image: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&q=80&w=800', description: 'Honed dark charcoal basalt tiles for contemporary industrial look.' }
  ],
  COUNTERTOP: [
    { id: 'c1', name: 'Calacatta Quartz Gold', image: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&q=80&w=800', description: 'Stunning white quartz with thick golden and grey veining.' },
    { id: 'c2', name: 'Nero Marquina Black Marble', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800', description: 'Deep obsidian black marble with sharp white calcite veins.' },
    { id: 'c3', name: 'Statuary White Marble', image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800', description: 'Bright white stone surface with subtle misty grey patterns.' },
    { id: 'c4', name: 'Polished Concrete Grey', image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&q=80&w=800', description: 'Honed concrete gray surface with subtle industrial speckles.' }
  ],
  FURNITURE: [
    { id: 'fu1', name: 'Premium Walnut Veneer', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800', description: 'High-end American walnut wood grain with rich, straight strip patterns.' },
    { id: 'fu2', name: 'Natural Oak Grain', image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&q=80&w=800', description: 'Classic vertical red oak grain sheet with organic wood ring textures.' },
    { id: 'fu3', name: 'Glossy Chantilly White', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800', description: 'High-gloss acrylic white cabinet panels with mirror finish (Smart Hardware).' },
    { id: 'fu4', name: 'Obsidian Matte Black', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800', description: 'Fingerprint-resistant matte black cabinet panels for an ultra-modern kitchen profile.' },
    { id: 'fu5', name: 'Royal Windsor Green', image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=800', description: 'Elegant, deep heritage green shaker cabinet paint coat.' },
    { id: 'fu6', name: 'Midnight Navy Blue', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800', description: 'Rich navy blue satin lacquer coat, perfect with brass hardware.' },
    { id: 'fu7', name: 'Cashmere Beige Lacquer', image: 'https://images.unsplash.com/photo-1618221381711-42ca8ab6e908?auto=format&fit=crop&q=80&w=800', description: 'Soft cashmere beige high gloss panels for bright, warm interior environments.' },
    { id: 'fu8', name: 'Charcoal Ash Stained Wood', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800', description: 'Ash wood panels stained in deep charcoal with prominent visible grain contours.' },
    { id: 'fu9', name: 'Fluted Teak Shutter', image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800', description: 'Teak wood panels with elegant, vertical fluted channels (Smart Hardware).' },
    { id: 'fu10', name: 'Brushed Gold Accent Sheet', image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=800', description: 'Metallic brushed champagne gold panels for ultra-luxury kitchen cabinets.' },
    { id: 'fu11', name: 'Silver Elm Veneer', image: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&q=80&w=800', description: 'Light, contemporary silver elm wood grain with straight, clean linear patterns.' },
    { id: 'fu12', name: 'Crimson Luxury Lacquer', image: 'https://images.unsplash.com/photo-1565182999561-18d7dc63c391?auto=format&fit=crop&q=80&w=800', description: 'Deep red luxury satin coat designed to stand out on feature accent cupboards.' },
    { id: 'fu13', name: 'Alpine Matte White', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800', description: 'Silky smooth matte white finish for minimalist kitchen designs.' },
    { id: 'fu14', name: 'Smokey Quartz Gray', image: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&q=80&w=800', description: 'Mid-tone warm gray with a velvet-like anti-fingerprint surface.' },
    { id: 'fu15', name: 'Desert Sand Oak', image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&q=80&w=800', description: 'Light washed oak texture for Scandinavian and coastal inspired spaces.' },
    { id: 'fu16', name: 'Emerald Green Gloss', image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=800', description: 'High gloss deep emerald green paneling that reflects light beautifully.' },
    { id: 'fu17', name: 'Macassar Ebony Veneer', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800', description: 'Exotic dark wood veneer with striking light brown vertical stripes.' },
    { id: 'fu18', name: 'Rose Gold Brushed Metallic', image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=800', description: 'Soft pink-gold metallic finish for dramatic statement kitchen islands.' },
    { id: 'fu19', name: 'French Vanilla Shaker', image: 'https://images.unsplash.com/photo-1618221381711-42ca8ab6e908?auto=format&fit=crop&q=80&w=800', description: 'Warm off-white painted finish on classic shaker style door profiles.' },
    { id: 'fu20', name: 'Industrial Concrete Texture', image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&q=80&w=800', description: 'Raw, textured concrete-look panels for urban loft aesthetics.' }
  ],
  HARDWARE: [
    { id: 'h1', name: 'Bespoke Champagne Gold Pull', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=200', description: 'Luxury solid brass champagne gold cabinet pull handle.' },
    { id: 'h2', name: 'Classic Matte Black Bar', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=200', description: 'Sleek, minimalist matte black hardware bar.' },
    { id: 'h3', name: 'Brushed Nickel T-Bar', image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=200', description: 'Premium brushed nickel modern T-bar kitchen pull.' }
  ]
};

const DEMO_ROOM = {
  image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
  layerMasks: {
    WALL: 'polygon(0% 0%, 100% 0%, 100% 45%, 0% 45%)',
    FLOOR: 'polygon(0% 80%, 100% 80%, 100% 100%, 0% 100%)',
    COUNTERTOPS: [
      { id: 'demo-countertop-1', mask: 'polygon(0% 70%, 100% 70%, 100% 80%, 0% 80%)', label: 'Main Quartz Countertop' }
    ],
    FURNITURE_SURFACES: [
      { id: 'demo-cabinet-left', mask: 'polygon(10% 45%, 45% 45%, 45% 70%, 10% 70%)', label: 'Left Cabinetry', transform: 'none' },
      { id: 'demo-cabinet-right', mask: 'polygon(55% 45%, 90% 45%, 90% 70%, 55% 70%)', label: 'Right Cabinetry', transform: 'none' }
    ],
    APPLIANCES: [
      { id: 'demo-stove', mask: 'polygon(45% 55%, 55% 55%, 55% 70%, 45% 70%)', label: 'Stove Occlusion' }
    ]
  },
  hotspots: [
    { x: 42, y: 58 },
    { x: 58, y: 58 }
  ]
};

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

  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isDesignerActive, setIsDesignerActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'FLOOR' | 'WALL' | 'FURNITURE' | 'COUNTERTOP' | 'HARDWARE'>('COUNTERTOP');
  const [selections, setSelections] = useState<Record<string, string>>({
    FLOOR: 'Smoked Oak Herringbone',
    WALL: 'Chantilly Lace White',
    FURNITURE: 'Premium Walnut Veneer',
    COUNTERTOP: '',
    HARDWARE: 'Bespoke Champagne Gold Pull'
  });
  const [appliedImages, setAppliedImages] = useState<Record<string, string>>({
    FLOOR: '',
    WALL: '',
    FURNITURE: '',
    COUNTERTOP: '',
    HARDWARE: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=200'
  });
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);
  const [hotspots, setHotspots] = useState<{ x: number, y: number }[]>([]);
  const [isRescanning, setIsRescanning] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [showFurnitureSurfaces, setShowFurnitureSurfaces] = useState(false);
  const [showBoundaries, setShowBoundaries] = useState(false);
  const [overlapWarning, setOverlapWarning] = useState(false);
  const [isPenTracing, setIsPenTracing] = useState(false);

  const [layerMasks, setLayerMasks] = useState<{ 
    WALL: string; 
    FLOOR: string; 
    FURNITURE_SURFACES: any[];
    COUNTERTOPS: any[];
    APPLIANCES: any[];
  }>({
    WALL: "",
    FLOOR: "",
    FURNITURE_SURFACES: [],
    COUNTERTOPS: [],
    APPLIANCES: []
  });

  const [aiError, setAiError] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isAIAnalyzing, setIsAIAnalyzing] = useState(false);

  const loadDemoRoom = () => {
    setUploadedImage(DEMO_ROOM.image);
    setLayerMasks(DEMO_ROOM.layerMasks);
    setHotspots(DEMO_ROOM.hotspots);
    setAiError(null);
    setIsScanning(false);
    setIsDesignerActive(true);
    setIsRescanning(false);
    setIsPenTracing(false);
  };

  const designerProducts = products.filter(p => p.category === 'Quartz');
  const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1621905252507-b354bcadcabc?auto=format&fit=crop&q=60&w=800';

  useEffect(() => {
    if (product) {
      setSelections(prev => ({ ...prev, COUNTERTOP: product.name }));
      setAppliedImages(prev => ({ ...prev, COUNTERTOP: product.image }));
    }
  }, [product]);

  const getMaterialList = () => {
    if (activeTab === 'COUNTERTOP') {
      const filtered = designerProducts.filter(p => p.id !== product?.id);
      return product ? [product, ...filtered] : designerProducts;
    }
    if (activeTab === 'HARDWARE') {
      return TAB_MATERIALS.HARDWARE || [];
    }
    return TAB_MATERIALS[activeTab] || [];
  };

  useEffect(() => {
    if (isScanning && !isAIAnalyzing && layerMasks.WALL && !aiError) {
      const timer = setTimeout(() => {
        setIsScanning(false);
        setIsDesignerActive(true);
        setIsRescanning(false);
        setIsPenTracing(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isScanning, isAIAnalyzing, layerMasks.WALL, aiError]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        setUploadedImage(base64);
        setAiError(null);
        startScanning();
        await analyzeImageWithAI(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImageWithAI = async (base64Image: string) => {
    setIsAIAnalyzing(true);
    setAiError(null);
    try {
      const { client: ai, model } = getAIClient();
      
      const prompt = `Act as a WORLD-CLASS ARCHITECTURAL SCANNER and PHOTOSHOP EXPERT with 25 years of experience. 
      Analyze this interior room image and perform ULTIMATE DEEP SEGMENTATION with pixel-perfect precision. 
      
      CRITICAL SEGMENTATION DIRECTIVES:
      1. WALL: Trace the exact boundaries of all visible wall surfaces. Be careful around corners and ceiling lines.
      2. FLOOR: Trace the floor area from wall-to-wall, including under furniture if visible.
      3. FURNITURE & CABINETRY (ULTRA-PRECISION): 
         - Identify EVERY individual cabinet door, drawer, and side panel.
         - Use "BORDER-TO-BORDER" tracing. There must be ZERO GAPS between adjacent furniture components.
         - Ensure polygons are tight and follow the exact edges of the wood/material.
      4. COUNTERTOPS & MARBLE: Identify all horizontal surfaces like kitchen countertops, islands, and table tops (especially marble surfaces).
      5. APPLIANCES (OCCLUSION LAYERS): Identify the gas stove (shegadi/hob), sink, oven, fridge, etc.
         - These are CRITICAL. They must be segmented perfectly so they can occlude (sit on top of) new furniture textures.
         - For a gas stove on a table, trace the stove itself separately from the marble table top.
      6. HOTSPOTS: Mark the exact center (x, y) of every handle, knob, or pull.
      
      Return the coordinates as CSS polygon() strings (e.g., "polygon(0% 0%, 100% 0%, ...)") in a JSON format.
      The coordinates must be 100% accurate relative to the image dimensions (0-100%).
      Ensure NO OVERLAP between Wall, Floor, and Furniture.
      
      JSON structure:
      {
        "WALL": "string (CSS polygon)",
        "FLOOR": "string (CSS polygon)",
        "FURNITURE_SURFACES": [
          { "id": "string", "mask": "string (CSS polygon)", "label": "string", "transform": "string" }
        ],
        "COUNTERTOPS": [
          { "id": "string", "mask": "string (CSS polygon)", "label": "string" }
        ],
        "APPLIANCES": [
          { "id": "string", "mask": "string (CSS polygon)", "label": "string" }
        ],
        "HOTSPOTS": [
          { "x": number, "y": number }
        ]
      }
      
      Think like a Photoshop professional creating paths. Every pixel counts.
      Be extremely precise. Use percentages (0-100%) for coordinates. 
      Identify ALL visible components, not just the main ones.`;

      const isNvidia = model.includes('llama');

      const options: any = {
        model: model,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: base64Image
                }
              }
            ]
          }
        ]
      };

      if (!isNvidia) {
        options.response_format = {
          type: "json_schema",
          json_schema: {
            name: "room_segmentation",
            strict: true,
            schema: {
              type: "object",
              properties: {
                WALL: { type: "string" },
                FLOOR: { type: "string" },
                FURNITURE_SURFACES: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      mask: { type: "string" },
                      label: { type: "string" },
                      transform: { type: "string" }
                    },
                    required: ["id", "mask", "label", "transform"],
                    additionalProperties: false
                  }
                },
                COUNTERTOPS: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      mask: { type: "string" },
                      label: { type: "string" }
                    },
                    required: ["id", "mask", "label"],
                    additionalProperties: false
                  }
                },
                APPLIANCES: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      mask: { type: "string" },
                      label: { type: "string" }
                    },
                    required: ["id", "mask", "label"],
                    additionalProperties: false
                  }
                },
                HOTSPOTS: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      x: { type: "number" },
                      y: { type: "number" }
                    },
                    required: ["x", "y"],
                    additionalProperties: false
                  }
                }
              },
              required: ["WALL", "FLOOR", "FURNITURE_SURFACES", "COUNTERTOPS", "APPLIANCES", "HOTSPOTS"],
              additionalProperties: false
            }
          }
        };
      } else {
        options.response_format = { type: "json_object" };
      }

      const response = await ai.chat.completions.create(options);

      const text = response.choices[0]?.message?.content;
      if (!text) throw new Error("Empty response from AI");
      const result = JSON.parse(text);
      if (result) {
        setLayerMasks({
          WALL: result.WALL,
          FLOOR: result.FLOOR,
          FURNITURE_SURFACES: result.FURNITURE_SURFACES || [],
          COUNTERTOPS: result.COUNTERTOPS || [],
          APPLIANCES: result.APPLIANCES || []
        });
        if (result.HOTSPOTS) {
          setHotspots(result.HOTSPOTS);
        }
      }
    } catch (error: any) {
      console.error("AI Analysis failed:", error);
      setAiError(error.message || "AI Analysis failed. Please try again.");
    } finally {
      setIsAIAnalyzing(false);
    }
  };

  const startScanning = (isRescan = false) => {
    setIsScanning(true);
    setIsRescanning(isRescan);
    setIsDesignerActive(false);
    setHotspots([]);
    setIsPenTracing(true);
  };

  const handleReset = () => {
    setUploadedImage(null);
    setIsScanning(false);
    setIsDesignerActive(false);
    setAiError(null);
    setAppliedImages({ FLOOR: '', WALL: '', FURNITURE: '', COUNTERTOP: '', HARDWARE: product?.image || '' });
    setHotspots([]);
    setLayerMasks({ WALL: "", FLOOR: "", FURNITURE_SURFACES: [], COUNTERTOPS: [], APPLIANCES: [] });
    setImageAspectRatio(null);
  };

  const handleProductSelect = (selectedProd: { id: string; name: string; image: string; description?: string }) => {
    setSelections(prev => ({ ...prev, [activeTab]: selectedProd.name }));
    setAppliedImages(prev => ({ ...prev, [activeTab]: selectedProd.image }));
  };

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
            <div 
              className="flex-grow relative aspect-square bg-white rounded-sm overflow-hidden border border-gray-100 group cursor-zoom-in"
              onClick={() => {
                const lightbox = document.createElement('div');
                lightbox.className = 'fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 cursor-zoom-out animate-in fade-in duration-200';
                
                const closeBtn = document.createElement('button');
                closeBtn.className = 'absolute top-6 right-6 text-white/50 hover:text-white bg-black/50 hover:bg-royal-blue rounded-full p-2 transition-all z-50';
                closeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
                
                const img = document.createElement('img');
                img.src = images[selectedImage];
                img.className = 'max-w-full max-h-[90vh] object-contain shadow-2xl rounded-sm';
                
                lightbox.appendChild(closeBtn);
                lightbox.appendChild(img);
                
                lightbox.onclick = () => document.body.removeChild(lightbox);
                document.body.appendChild(lightbox);
              }}
            >
              <img 
                src={images[selectedImage]} 
                alt={product.name} 
                className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="text-[10px] text-gray-400 flex items-center justify-center uppercase tracking-widest">
                  <Search size={12} className="mr-2" /> Click image to zoom in
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
                  <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
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
                  
                  {product.category === 'Quartz' && (
                    <button 
                      onClick={() => setIsVisualizerOpen(true)}
                      className="w-full bg-royal-blue text-white py-5 font-bold uppercase text-[11px] tracking-[0.3em] hover:bg-brand-black transition-all shadow-xl flex items-center justify-center space-x-2"
                    >
                      <span>See it in your room</span>
                      <Camera size={16} />
                    </button>
                  )}
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
                <p className="text-[13px] font-bold text-gray-700">From {formatPrice(p.price)}</p>
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
                <p className="text-[13px] font-bold text-gray-700">From {formatPrice(p.price)}</p>
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

      {/* Room Visualizer Modal */}
      <AnimatePresence>
        {isVisualizerOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-8"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-6xl h-full max-h-[850px] rounded-sm overflow-hidden flex flex-col relative shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-6 md:p-10 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-brand-black flex items-center justify-center text-white rounded-sm shadow-lg">
                    <Camera size={24} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-brand-black uppercase tracking-tighter">THE LUXURY DESIGNER</h2>
                    <p className="text-[10px] font-bold text-royal-blue uppercase tracking-[0.3em] mt-1">BESPOKE ROOM VISUALIZER</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={handleReset}
                    className="hidden md:flex items-center text-[10px] font-bold text-gray-400 hover:text-royal-blue uppercase tracking-widest transition-colors"
                  >
                    <RefreshCw size={14} className="mr-2" /> Start Over
                  </button>
                  <button 
                    onClick={() => setIsVisualizerOpen(false)}
                    className="p-2 text-gray-400 hover:text-royal-blue transition-colors"
                  >
                    <X size={28} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
                {isDesignerActive ? (
                  <>
                    {/* Left Sidebar: Designer Controls */}
                    <div className="lg:w-1/3 border-r border-gray-100 flex flex-col bg-white overflow-hidden">
                      {/* Tabs */}
                      <div className="flex border-b border-gray-100 relative">
                        {(['FLOOR', 'WALL', 'FURNITURE', 'COUNTERTOP', 'HARDWARE'] as const).map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-5 text-[10px] font-black tracking-[0.2em] transition-all border-b-2 ${
                              activeTab === tab 
                                ? 'border-brand-black text-brand-black bg-white' 
                                : 'border-transparent text-gray-400 hover:bg-gray-50'
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                        <div className="absolute -top-3 right-4 bg-green-500 text-white text-[6px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest animate-pulse">
                          Pixel-Level Active
                        </div>
                      </div>

                      {/* Product List */}
                      <div className="flex-grow overflow-y-auto p-6 space-y-4">
                        {getMaterialList().map((material) => (
                          <button
                            key={material.id}
                            onClick={() => handleProductSelect(material)}
                            className={`w-full flex items-center space-x-4 p-3 border rounded-sm transition-all text-left ${
                              selections[activeTab] === material.name
                                ? 'border-royal-blue bg-royal-blue/5 shadow-md'
                                : 'border-gray-100 hover:border-gray-300'
                            }`}
                          >
                            <div className="w-16 h-16 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                              <img src={material.image} alt={material.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-grow">
                              <p className="text-[10px] font-black text-brand-black leading-tight uppercase tracking-tighter">
                                {material.name}
                              </p>
                              {selections[activeTab] === material.name && (
                                <p className="text-[8px] font-bold text-royal-blue mt-1 uppercase tracking-widest">Selected</p>
                              )}
                            </div>
                            <ChevronRight size={14} className={selections[activeTab] === material.name ? 'text-royal-blue' : 'text-gray-300'} />
                          </button>
                        ))}
                      </div>

                      {/* Footer Action */}
                      <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col gap-3">
                        <button 
                          onClick={() => {
                            startScanning(true);
                            if (uploadedImage) analyzeImageWithAI(uploadedImage);
                          }}
                          disabled={isAIAnalyzing}
                          className="w-full py-4 border-2 border-brand-black text-brand-black font-bold text-[10px] uppercase tracking-widest hover:bg-brand-black hover:text-white transition-all flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <RefreshCw size={14} className={`mr-2 ${isAIAnalyzing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} /> 
                          {isAIAnalyzing ? 'RE-ANALYZING...' : 'HIGH PRECISION RE-SCAN'}
                        </button>
                        <button 
                          onClick={() => navigateTo('Contact')}
                          className="w-full py-4 bg-brand-black text-white font-bold text-[10px] uppercase tracking-widest hover:bg-royal-blue transition-all shadow-lg"
                        >
                          ORDER SAMPLES
                        </button>
                      </div>
                    </div>

                    {/* Right: Preview Area */}
                    <div className="lg:w-2/3 bg-[#0a0a0a] flex flex-col items-center justify-center p-8 relative overflow-hidden">
                      <div className="relative w-full h-full flex items-center justify-center">
                        <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
                          <div 
                            className={`relative transition-transform duration-500 cursor-zoom-in pointer-events-auto ${isZoomed ? 'scale-150' : 'scale-100'}`}
                            style={{ 
                              aspectRatio: imageAspectRatio ? `${imageAspectRatio}` : 'auto',
                              width: imageAspectRatio && imageAspectRatio > 1 ? '100%' : 'auto',
                              height: imageAspectRatio && imageAspectRatio <= 1 ? '100%' : 'auto',
                              maxWidth: '100%',
                              maxHeight: '100%'
                            }}
                            onClick={() => setIsZoomed(!isZoomed)}
                          >
                            {/* Base Image for Aspect Ratio and Fallback */}
                            <img 
                              src={uploadedImage || undefined} 
                              alt="Base" 
                              className="w-full h-full object-contain opacity-0"
                              onLoad={(e) => {
                                const img = e.currentTarget;
                                setImageAspectRatio(img.naturalWidth / img.naturalHeight);
                              }}
                            />

                             {/* 0. Original Image Background */}
                             <div 
                               className="absolute inset-0 bg-no-repeat bg-center z-0"
                               style={{ 
                                 backgroundImage: `url(${uploadedImage})`,
                                 backgroundSize: '100% 100%'
                               }}
                             />
 
                             {/* 1. Wall Layer */}
                             <div 
                               className="absolute inset-0 bg-center opacity-100 transition-all duration-700 z-10"
                               style={{ 
                                 backgroundImage: `url(${appliedImages.WALL || uploadedImage})`, 
                                 clipPath: layerMasks.WALL,
                                 backgroundSize: appliedImages.WALL ? '33%' : '100% 100%',
                                 backgroundRepeat: appliedImages.WALL ? 'repeat' : 'no-repeat'
                               }}
                             />
                             
                             {/* 2. Floor Layer */}
                             <div 
                               className="absolute inset-0 bg-center opacity-100 transition-all duration-700 z-20"
                               style={{ 
                                 backgroundImage: `url(${appliedImages.FLOOR || uploadedImage})`, 
                                 clipPath: layerMasks.FLOOR,
                                 backgroundSize: appliedImages.FLOOR ? '25%' : '100% 100%',
                                 backgroundRepeat: appliedImages.FLOOR ? 'repeat' : 'no-repeat'
                               }}
                             />
 
                             {/* 3. Countertop Layer */}
                             {layerMasks.COUNTERTOPS.map((countertop) => (
                               <div 
                                 key={countertop.id}
                                 className="absolute inset-0 opacity-100 transition-all duration-700 z-25"
                                 style={{ 
                                   backgroundImage: `url(${appliedImages.COUNTERTOP || uploadedImage})`, 
                                   clipPath: countertop.mask,
                                   backgroundSize: appliedImages.COUNTERTOP ? '33%' : '100% 100%',
                                   backgroundRepeat: appliedImages.COUNTERTOP ? 'repeat' : 'no-repeat'
                                 }}
                               />
                             ))}
                             
                             {/* 4. Furniture Layer */}
                             {layerMasks.FURNITURE_SURFACES.map((surface) => (
                               <div 
                                 key={surface.id}
                                 className="absolute inset-0 opacity-100 transition-all duration-700 z-30"
                                 style={{ 
                                   backgroundImage: `url(${appliedImages.FURNITURE || uploadedImage})`, 
                                   clipPath: surface.mask,
                                   backgroundSize: appliedImages.FURNITURE ? '300px' : '100% 100%',
                                   backgroundRepeat: appliedImages.FURNITURE ? 'repeat' : 'no-repeat',
                                   transform: appliedImages.FURNITURE ? surface.transform : 'none',
                                   filter: appliedImages.FURNITURE ? 'contrast(1.1) brightness(0.9) saturate(1.05)' : 'none'
                                 }}
                               />
                             ))}
 
                             {/* 5. Appliances Occlusion Layer */}
                             {layerMasks.APPLIANCES.map((appliance) => (
                               <div 
                                 key={appliance.id}
                                 className="absolute inset-0 z-40 bg-no-repeat bg-center"
                                 style={{ 
                                   backgroundImage: `url(${uploadedImage})`, 
                                   clipPath: appliance.mask,
                                   backgroundSize: '100% 100%'
                                 }}
                               />
                             ))}

                             {/* 6. Realistic Rendering: Shadow Preservation */}
                             <div 
                               className="absolute inset-0 bg-no-repeat bg-center pointer-events-none transition-opacity duration-500"
                               style={{ 
                                 backgroundImage: `url(${uploadedImage})`, 
                                 backgroundSize: '100% 100%',
                                 mixBlendMode: 'multiply',
                                 opacity: (appliedImages.WALL || appliedImages.FLOOR || appliedImages.FURNITURE || appliedImages.COUNTERTOP) ? 0.75 : 0,
                                 zIndex: 45,
                                 filter: 'contrast(1.15) brightness(0.85)'
                               }}
                             />
                             
                             {/* 7. Realistic Rendering: Highlight Preservation */}
                             <div 
                               className="absolute inset-0 bg-no-repeat bg-center pointer-events-none transition-opacity duration-500"
                               style={{ 
                                 backgroundImage: `url(${uploadedImage})`, 
                                 backgroundSize: '100% 100%',
                                 mixBlendMode: 'screen',
                                 opacity: (appliedImages.WALL || appliedImages.FLOOR || appliedImages.FURNITURE || appliedImages.COUNTERTOP) ? 0.35 : 0,
                                 zIndex: 46,
                                 filter: 'brightness(1.25)'
                               }}
                             />

                             {/* Layer Segmentation Visualization (Designer Debug Mode) */}
                             {(showLayers || showFurnitureSurfaces || showBoundaries) && (
                               <div className="absolute inset-0 z-50 pointer-events-none">
                                 {showLayers && (
                                   <>
                                     {/* Wall Mask (Red) */}
                                     <div className="absolute inset-0 bg-red-500/60" style={{ clipPath: layerMasks.WALL }} />
                                     {/* Floor Mask (Green) */}
                                     <div className="absolute inset-0 bg-green-500/60" style={{ clipPath: layerMasks.FLOOR }} />
                                   </>
                                 )}
                                 
                                 {/* Boundary Lines (Marching Ants Style) */}
                                 {showBoundaries && (
                                   <div className="absolute inset-0">
                                     <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                       <motion.path
                                         d={layerMasks.WALL.replace('polygon(', 'M ').replace(')', ' Z').replace(/%/g, '').split(',').map(p => p.trim()).join(' L ')}
                                         fill="none"
                                         stroke="#FF0000"
                                         strokeWidth="0.5"
                                       />
                                     </svg>
                                   </div>
                                 )}
                               </div>
                             )}

                             {/* Overlap Detection Warning */}
                             {overlapWarning && (
                               <div className="absolute top-4 right-4 z-[60] bg-red-600 text-white px-3 py-1 text-[8px] font-bold uppercase tracking-widest flex items-center shadow-xl animate-bounce">
                                 <AlertCircle size={12} className="mr-2" /> Overlap Detected: Correcting Pixels...
                               </div>
                             )}

                             {/* Furniture Hardware (Hotspot Placement) */}
                             {hotspots.length > 0 && (
                               <div className="absolute inset-0 z-20">
                                 {hotspots.map((spot, idx) => (
                                   <motion.div
                                     key={idx}
                                     initial={{ opacity: 0, scale: 0 }}
                                     animate={{ opacity: 1, scale: 1 }}
                                     transition={{ delay: idx * 0.05 }}
                                     className="absolute w-8 h-8 -ml-4 -mt-4 flex items-center justify-center"
                                     style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                                   >
                                     <img 
                                       src={appliedImages.HARDWARE || "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=200"} 
                                       alt="Hardware" 
                                       className="w-full h-full object-contain drop-shadow-2xl brightness-110 contrast-110"
                                       style={{ transform: 'rotate(-45deg)' }}
                                     />
                                   </motion.div>
                                 ))}
                               </div>
                             )}
                          </div>
                        </div>
                        
                        {/* Overlay Info */}
                        <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                          <div className="bg-black/60 backdrop-blur-sm p-4 border-l-2 border-royal-blue text-white">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-[8px] font-bold text-royal-blue uppercase tracking-widest">Active Layer</p>
                              <div className="flex items-center space-x-1">
                                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                                <p className="text-[6px] text-green-500 font-bold uppercase tracking-widest">Pixel-Level Scan Active</p>
                              </div>
                            </div>
                            <p className="text-xs font-black uppercase tracking-tighter">{activeTab}: {selections[activeTab]}</p>
                          </div>
                          <button 
                            onClick={() => {
                              startScanning(true);
                              if (uploadedImage) analyzeImageWithAI(uploadedImage);
                            }}
                            disabled={isAIAnalyzing}
                            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all backdrop-blur-sm border border-white/10 ${
                              isAIAnalyzing ? 'bg-royal-blue/40 text-white/50 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20 text-white'
                            }`}
                          >
                            {isAIAnalyzing ? (
                              <span className="flex items-center">
                                <RefreshCw size={10} className="mr-2 animate-spin" />
                                RE-ANALYZING...
                              </span>
                            ) : 'FORCE RE-SCAN'}
                          </button>
                          <button 
                            onClick={() => setShowBoundaries(!showBoundaries)}
                            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${showBoundaries ? 'bg-yellow-500 text-black' : 'bg-black/60 text-white/70 hover:bg-black/80'} backdrop-blur-sm border border-white/10`}
                          >
                            {showBoundaries ? 'HIDE BOUNDARIES' : 'SHOW BOUNDARIES'}
                          </button>
                          <button 
                            onClick={() => setOverlapWarning(!overlapWarning)}
                            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${overlapWarning ? 'bg-red-600 text-white' : 'bg-black/60 text-white/70 hover:bg-black/80'} backdrop-blur-sm border border-white/10`}
                          >
                            {overlapWarning ? 'DISABLE WARNING' : 'ENABLE WARNING'}
                          </button>
                        </div>

                        {/* Visualizer Controls Overlay */}
                        <div className="absolute bottom-6 right-6 flex space-x-2 z-10">
                          <button 
                            onClick={handleReset}
                            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full transition-all"
                          >
                            <RefreshCw size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Left: Upload/Preview Area */}
                    <div className="lg:w-2/3 bg-gray-50 flex flex-col items-center justify-center p-8 relative overflow-hidden">
                      {uploadedImage ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                          <img src={uploadedImage || undefined} alt="Uploaded Room" className="max-w-full max-h-full object-contain shadow-2xl" />
                          
                          {/* Layer Segmentation Visualization (Simulated) */}
                          {(showLayers || showFurnitureSurfaces) && isDesignerActive && (
                            <div className="absolute inset-0 pointer-events-none">
                              {showLayers && (
                                <>
                                  {/* Wall Mask (Red) */}
                                  <div className="absolute inset-0 bg-red-500/60" style={{ clipPath: layerMasks.WALL }} />
                                  {/* Floor Mask (Green) */}
                                  <div className="absolute inset-0 bg-green-500/60" style={{ clipPath: layerMasks.FLOOR }} />
                                </>
                              )}
                              {/* Furniture Surface Masks (Blue Highlight) */}
                              {layerMasks.FURNITURE_SURFACES.map((surface, i) => (
                                <div 
                                  key={`preview-mask-${surface.id}`} 
                                  className={`absolute inset-0 ${showFurnitureSurfaces ? 'bg-blue-500/70' : 'bg-blue-500/40'} border border-white/30`} 
                                  style={{ clipPath: surface.mask }} 
                                />
                              ))}
                            </div>
                          )}

                          {isScanning && (
                            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white animate-in fade-in duration-300 z-50">
                              {aiError ? (
                                <div className="relative z-10 flex flex-col items-center space-y-8 max-w-md text-center px-6">
                                  <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 mb-4 border-2 border-red-500/30">
                                    <AlertCircle size={48} className="animate-pulse" />
                                  </div>
                                  
                                  <div className="space-y-4">
                                    <h3 className="text-2xl font-black uppercase tracking-tighter text-red-500">AI Analysis Failed</h3>
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] leading-relaxed">
                                      {aiError}
                                    </p>
                                  </div>

                                  <div className="flex flex-col gap-3 w-full pt-4">
                                    <button 
                                      onClick={loadDemoRoom}
                                      className="w-full py-4 bg-royal-blue text-white font-bold text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center shadow-lg"
                                    >
                                      Use Demo Kitchen Room
                                    </button>
                                    <div className="flex gap-3">
                                      <button 
                                        onClick={() => uploadedImage && analyzeImageWithAI(uploadedImage)}
                                        className="flex-1 py-4 border border-white/20 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center"
                                      >
                                        <RefreshCw size={12} className="mr-2" /> Retry
                                      </button>
                                      <button 
                                        onClick={() => {
                                          setIsScanning(false);
                                          setAiError(null);
                                        }}
                                        className="flex-1 py-4 border border-white/20 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="relative z-10 flex flex-col items-center space-y-8 max-w-md text-center px-6">
                                  <div className="relative">
                                    <div className="w-24 h-24 border-2 border-royal-blue/20 border-t-royal-blue rounded-full animate-spin" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <Camera size={32} className="text-royal-blue animate-pulse" />
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-4">
                                    <h3 className="text-2xl font-black uppercase tracking-tighter">AI Analysis in Progress</h3>
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em] leading-relaxed">
                                      Our neural engine is performing pixel-level segmentation of your room...
                                    </p>
                                  </div>

                                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                    <motion.div 
                                      className="h-full bg-royal-blue shadow-[0_0_15px_rgba(0,102,255,0.5)]"
                                      animate={{ 
                                        width: ["0%", "100%"],
                                        opacity: [1, 0.8, 1]
                                      }}
                                      transition={{ 
                                        width: { duration: 15, repeat: Infinity, ease: "linear" },
                                        opacity: { duration: 2, repeat: Infinity }
                                      }}
                                    />
                                  </div>
                                  
                                  <div className="flex items-center space-x-2 text-[8px] font-bold text-royal-blue uppercase tracking-[0.4em] animate-pulse">
                                    <span className="w-1 h-1 bg-royal-blue rounded-full" />
                                    <span>Processing Surfaces</span>
                                    <span className="w-1 h-1 bg-royal-blue rounded-full" />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-full max-w-lg flex flex-col items-center space-y-4">
                          <label className="w-full aspect-square md:aspect-[1.5] border-4 border-dashed border-gray-200 rounded-sm flex flex-col items-center justify-center cursor-pointer hover:border-royal-blue hover:bg-white transition-all group">
                            <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:text-royal-blue group-hover:bg-royal-blue/5 transition-all mb-4">
                              <Upload size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-brand-black uppercase tracking-tight mb-1">UPLOAD YOUR ROOM PHOTO</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">CLICK TO UPLOAD PHOTO</p>
                          </label>
                          <div className="w-full flex items-center justify-between">
                            <div className="h-[1px] bg-gray-200 flex-grow mr-4" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">OR</span>
                            <div className="h-[1px] bg-gray-200 flex-grow ml-4" />
                          </div>
                          <button 
                            onClick={loadDemoRoom}
                            className="w-full py-4 border-2 border-brand-black text-brand-black font-bold text-[10px] uppercase tracking-widest hover:bg-brand-black hover:text-white transition-all shadow-md"
                          >
                            Try with Demo Kitchen
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Right: Info & Actions */}
                    <div className="lg:w-1/3 border-l border-gray-100 flex flex-col bg-white">
                      <div className="p-8 flex-grow space-y-6">
                        <div className="space-y-2">
                          <h4 className="text-[10px] font-black text-royal-blue uppercase tracking-widest">How it works</h4>
                          <p className="text-xs text-gray-500 leading-relaxed">
                            Our AI analyzes your room's lighting, textures, and style to perfectly place the <span className="font-bold text-brand-black">{product?.name || 'Quartz Satin Ridge™'}</span> handles in your space.
                          </p>
                        </div>
                        
                        <div className="p-5 bg-gray-50 border border-gray-100 rounded-sm">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Selected Product</p>
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-white border border-gray-100 p-2">
                              <img 
                                src={product?.image || "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=200"} 
                                className="w-full h-full object-contain" 
                                alt={product?.name || "Quartz"} 
                              />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-brand-black uppercase tracking-tight">{product?.name || 'Quartz'}</p>
                              <p className="text-[10px] text-royal-blue font-bold uppercase tracking-widest">Satin Ridge™</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-8 bg-gray-50 border-t border-gray-100">
                        <button 
                          onClick={() => setIsVisualizerOpen(false)}
                          className="w-full py-4 bg-brand-black text-white font-bold text-[10px] uppercase tracking-widest hover:bg-royal-blue transition-all shadow-lg"
                        >
                          Close Visualizer
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;
