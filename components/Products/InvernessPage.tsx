
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, ChevronRight, Camera, RefreshCw, AlertCircle } from 'lucide-react';
import { View, Product } from '../../types';
import { getAIClient } from '../../services/geminiService.ts';
import { Type } from "@google/genai";

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
    { id: 'fu1', name: 'Vida Premium Walnut Veneer', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800', description: 'High-end American walnut wood grain with rich, straight strip patterns.' },
    { id: 'fu2', name: 'Vida Natural Oak Grain', image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&q=80&w=800', description: 'Classic vertical red oak grain sheet with organic wood ring textures.' },
    { id: 'fu3', name: 'Vida Glossy Chantilly White', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800', description: 'High-gloss acrylic white cabinet panels with mirror finish (Smart Hardware).' },
    { id: 'fu4', name: 'Vida Obsidian Matte Black', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800', description: 'Fingerprint-resistant matte black cabinet panels for an ultra-modern kitchen profile.' },
    { id: 'fu5', name: 'Vida Royal Windsor Green', image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=800', description: 'Elegant, deep heritage green shaker cabinet paint coat.' },
    { id: 'fu6', name: 'Vida Midnight Navy Blue', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800', description: 'Rich navy blue satin lacquer coat, perfect with brass hardware.' },
    { id: 'fu7', name: 'Vida Cashmere Beige Lacquer', image: 'https://images.unsplash.com/photo-1618221381711-42ca8ab6e908?auto=format&fit=crop&q=80&w=800', description: 'Soft cashmere beige high gloss panels for bright, warm interior environments.' },
    { id: 'fu8', name: 'Vida Charcoal Ash Stained Wood', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800', description: 'Ash wood panels stained in deep charcoal with prominent visible grain contours.' },
    { id: 'fu9', name: 'Vida Fluted Teak Shutter', image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800', description: 'Teak wood panels with elegant, vertical fluted channels (Smart Hardware).' },
    { id: 'fu10', name: 'Vida Brushed Gold Accent Sheet', image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=800', description: 'Metallic brushed champagne gold panels for ultra-luxury kitchen cabinets.' },
    { id: 'fu11', name: 'Vida Silver Elm Veneer', image: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&q=80&w=800', description: 'Light, contemporary silver elm wood grain with straight, clean linear patterns.' },
    { id: 'fu12', name: 'Vida Crimson Luxury Lacquer', image: 'https://images.unsplash.com/photo-1565182999561-18d7dc63c391?auto=format&fit=crop&q=80&w=800', description: 'Deep red luxury satin coat designed to stand out on feature accent cupboards.' },
    { id: 'fu13', name: 'Vida Alpine Matte White', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800', description: 'Silky smooth matte white finish for minimalist kitchen designs.' },
    { id: 'fu14', name: 'Vida Smokey Quartz Gray', image: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&q=80&w=800', description: 'Mid-tone warm gray with a velvet-like anti-fingerprint surface.' },
    { id: 'fu15', name: 'Vida Desert Sand Oak', image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&q=80&w=800', description: 'Light washed oak texture for Scandinavian and coastal inspired spaces.' },
    { id: 'fu16', name: 'Vida Emerald Green Gloss', image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=800', description: 'High gloss deep emerald green paneling that reflects light beautifully.' },
    { id: 'fu17', name: 'Vida Macassar Ebony Veneer', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800', description: 'Exotic dark wood veneer with striking light brown vertical stripes.' },
    { id: 'fu18', name: 'Vida Rose Gold Brushed Metallic', image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=800', description: 'Soft pink-gold metallic finish for dramatic statement kitchen islands.' },
    { id: 'fu19', name: 'Vida French Vanilla Shaker', image: 'https://images.unsplash.com/photo-1618221381711-42ca8ab6e908?auto=format&fit=crop&q=80&w=800', description: 'Warm off-white painted finish on classic shaker style door profiles.' },
    { id: 'fu20', name: 'Vida Industrial Concrete Texture', image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&q=80&w=800', description: 'Raw, textured concrete-look panels for urban loft aesthetics.' }
  ]
};

interface InvernessPageProps {
  navigateTo: (view: View, id?: string) => void;
  products: Product[];
}

const InvernessPage: React.FC<InvernessPageProps> = ({ navigateTo, products }) => {
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isDesignerActive, setIsDesignerActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'FLOOR' | 'WALL' | 'FURNITURE' | 'COUNTERTOP' | 'HARDWARE'>('FURNITURE');
  const [selections, setSelections] = useState<Record<string, string>>({
    FLOOR: 'Smoked Oak Herringbone',
    WALL: 'Chantilly Lace White',
    FURNITURE: 'Vida Premium Walnut Veneer',
    COUNTERTOP: 'Calacatta Quartz Gold',
    HARDWARE: 'Vida Luxe Gold Handle'
  });
  const [appliedImages, setAppliedImages] = useState<Record<string, string>>({
    FLOOR: '',
    WALL: '',
    FURNITURE: '',
    COUNTERTOP: '',
    HARDWARE: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=200'
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

  const quadProducts = products.filter(p => p.category === 'Quads');
  const featuredProduct = quadProducts[0];
  const designerProducts = quadProducts;

  const [isZoomed, setIsZoomed] = useState(false);
  const [isAIAnalyzing, setIsAIAnalyzing] = useState(false);

  // Effect to handle transition from scanning to designer mode
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
      const ai = getAIClient();
      const model = "gemini-3-flash-preview";
      
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

      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Image.split(',')[1]
                }
              }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              WALL: { type: Type.STRING, description: "CSS polygon() string for the wall area" },
              FLOOR: { type: Type.STRING, description: "CSS polygon() string for the floor area" },
              FURNITURE_SURFACES: {
                type: Type.ARRAY,
                description: "Array of individual furniture surface masks",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING, description: "Unique ID for the surface" },
                    mask: { type: Type.STRING, description: "CSS polygon() string for this specific surface" },
                    label: { type: Type.STRING, description: "Descriptive label for the surface" },
                    transform: { type: Type.STRING, description: "Optional CSS transform for perspective" }
                  },
                  required: ["id", "mask", "label"]
                }
              },
              COUNTERTOPS: {
                type: Type.ARRAY,
                description: "Array of countertop and island surface masks",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    mask: { type: Type.STRING },
                    label: { type: Type.STRING }
                  },
                  required: ["id", "mask", "label"]
                }
              },
              APPLIANCES: {
                type: Type.ARRAY,
                description: "Array of appliance masks (gas stove, sink, etc.)",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    mask: { type: Type.STRING },
                    label: { type: Type.STRING }
                  },
                  required: ["id", "mask", "label"]
                }
              },
              HOTSPOTS: {
                type: Type.ARRAY,
                description: "Coordinates of cabinet handles and knobs",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    x: { type: Type.NUMBER, description: "X coordinate (0-100)" },
                    y: { type: Type.NUMBER, description: "Y coordinate (0-100)" }
                  },
                  required: ["x", "y"]
                }
              }
            },
            required: ["WALL", "FLOOR", "FURNITURE_SURFACES", "COUNTERTOPS", "APPLIANCES"]
          }
        }
      });

      const text = response.text;
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
      // DO NOT set setIsScanning(false) here, so the error UI stays visible
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
    setAppliedImages({ FLOOR: '', WALL: '', FURNITURE: '', COUNTERTOP: '' });
    setHotspots([]);
    setLayerMasks({ WALL: "", FLOOR: "", FURNITURE_SURFACES: [], COUNTERTOPS: [], APPLIANCES: [] });
    setImageAspectRatio(null);
  };

  const handleProductSelect = (product: { id: string; name: string; image: string; description?: string }) => {
    setSelections(prev => ({ ...prev, [activeTab]: product.name }));
    setAppliedImages(prev => ({ ...prev, [activeTab]: product.image }));
  };

  return (
    <div className="bg-white min-h-screen font-sans overflow-hidden">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 md:py-24">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
          {/* Left: Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full md:w-1/2 relative"
          >
            <div className="relative aspect-[4/5] md:aspect-square rounded-sm overflow-hidden shadow-2xl border border-gray-100 bg-gray-50">
              {featuredProduct ? (
                <>
                  <img 
                    src={featuredProduct.image} 
                    alt={featuredProduct.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Camera size={48} className="text-gray-200" />
                </div>
              )}
            </div>
            
            {/* Floating Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-white p-6 shadow-xl border border-gray-50 hidden md:block"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-royal-blue mb-1">All Collections</p>
              <div className="w-12 h-0.5 bg-royal-blue" />
            </motion.div>
          </motion.div>

          {/* Right: Info Section */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full md:w-1/2 space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold text-brand-black leading-tight uppercase tracking-tighter">
                {featuredProduct?.name || 'QUADS COLLECTION'}
              </h1>
              <p className="text-royal-blue font-black text-xs uppercase tracking-[0.5em]">
                DIVINE SERIES
              </p>
            </div>

            <p className="text-gray-500 text-lg leading-relaxed max-w-md italic font-light">
              {featuredProduct?.description || "Explore our premium collection of Quads handles and hardware."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <button 
                onClick={() => setIsVisualizerOpen(true)}
                className="group relative px-8 py-5 bg-brand-black text-white font-bold text-[11px] uppercase tracking-[0.3em] overflow-hidden transition-all hover:bg-royal-blue shadow-xl"
              >
                <span className="relative z-10 flex items-center justify-center">
                  SEE IT IN YOUR ROOM <Camera size={16} className="ml-3 group-hover:rotate-12 transition-transform" />
                </span>
              </button>
              
              <button 
                onClick={() => navigateTo('Contact')}
                className="px-8 py-5 border-2 border-brand-black text-brand-black font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-brand-black hover:text-white transition-all"
              >
                GET A QUOTE
              </button>
            </div>
          </motion.div>
        </div>

        {/* Quads Product Listings Section */}
        <div className="mt-32 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-brand-black uppercase tracking-tighter">QUADS COLLECTION</h2>
              <p className="text-gray-500 max-w-xl">Explore our exclusive range of Quads products from Vida Company, designed for timeless elegance, premium finishes, and superior tactile quality.</p>
            </div>
            <div className="flex items-center space-x-2 text-royal-blue font-bold text-xs uppercase tracking-widest">
              <span>{quadProducts.length} Products Found</span>
              <div className="w-12 h-0.5 bg-royal-blue" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {quadProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
                onClick={() => navigateTo('ProductDetail', product.id)}
              >
                <div className="relative aspect-square overflow-hidden bg-gray-50 mb-4 border border-gray-100 group-hover:shadow-xl transition-all duration-500">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/90 backdrop-blur-sm">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-royal-blue">View Details</p>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight mb-1 group-hover:text-royal-blue transition-colors">{product.name}</h3>
                <p className="text-red-600 font-bold text-lg">${product.price}</p>
              </motion.div>
            ))}
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
                        {(activeTab === 'HARDWARE' ? designerProducts : TAB_MATERIALS[activeTab]).map((product) => (
                          <button
                            key={product.id}
                            onClick={() => handleProductSelect(product)}
                            className={`w-full flex items-center space-x-4 p-3 border rounded-sm transition-all text-left ${
                              selections[activeTab] === product.name
                                ? 'border-royal-blue bg-royal-blue/5 shadow-md'
                                : 'border-gray-100 hover:border-gray-300'
                            }`}
                          >
                            <div className="w-16 h-16 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-grow">
                              <p className="text-[10px] font-black text-brand-black leading-tight uppercase tracking-tighter">
                                {product.name}
                              </p>
                              {selections[activeTab] === product.name && (
                                <p className="text-[8px] font-bold text-royal-blue mt-1 uppercase tracking-widest">Selected</p>
                              )}
                            </div>
                            <ChevronRight size={14} className={selections[activeTab] === product.name ? 'text-royal-blue' : 'text-gray-300'} />
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
                        {/* 
                          MASK-BASED REPLACEMENT SYSTEM
                          FINAL_IMAGE = (original_image × inverse_mask) + (new_texture × mask)
                          We achieve this by rendering mutually exclusive layers that cover 100% of the image.
                        */}
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
                                        strokeDasharray="2,2"
                                        animate={{ strokeDashoffset: [0, -4] }}
                                        transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                                      />
                                      <motion.path
                                        d={layerMasks.FLOOR.replace('polygon(', 'M ').replace(')', ' Z').replace(/%/g, '').split(',').map(p => p.trim()).join(' L ')}
                                        fill="none"
                                        stroke="#00FF00"
                                        strokeWidth="0.5"
                                        strokeDasharray="2,2"
                                        animate={{ strokeDashoffset: [0, -4] }}
                                        transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                                      />
                                      {layerMasks.FURNITURE_SURFACES.map((surface) => (
                                        <motion.path
                                          key={`boundary-${surface.id}`}
                                          d={surface.mask.replace('polygon(', 'M ').replace(')', ' Z').replace(/%/g, '').split(',').map((p: string) => p.trim()).join(' L ')}
                                          fill="none"
                                          stroke="#00FFFF"
                                          strokeWidth="0.5"
                                          strokeDasharray="2,2"
                                          animate={{ strokeDashoffset: [0, -4] }}
                                          transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                                        />
                                      ))}
                                    </svg>
                                  </div>
                                )}

                                {/* Furniture Surface Masks (Blue Highlight) */}
                                {layerMasks.FURNITURE_SURFACES.map((surface, i) => (
                                  <div 
                                    key={`mask-${surface.id}`} 
                                    className={`absolute inset-0 ${showFurnitureSurfaces ? 'bg-blue-500/70' : 'bg-blue-500/40'} border border-white/30`} 
                                    style={{ clipPath: surface.mask }}
                                  >
                                    {showFurnitureSurfaces && (
                                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[7px] font-black text-white bg-black/90 px-2 py-1 rounded-sm whitespace-nowrap border border-white/10 shadow-xl">
                                        {surface.label}
                                      </div>
                                    )}
                                  </div>
                                ))}
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
                            <button 
                              onClick={() => setShowFurnitureSurfaces(!showFurnitureSurfaces)}
                              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${showFurnitureSurfaces ? 'bg-blue-600 text-white' : 'bg-black/60 text-white/70 hover:bg-black/80'} backdrop-blur-sm border border-white/10`}
                            >
                              {showFurnitureSurfaces ? 'HIDE FURNITURE SURFACES' : 'SHOW FURNITURE SURFACES'}
                            </button>
                            <button 
                              onClick={() => setShowLayers(!showLayers)}
                              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${showLayers ? 'bg-indigo-600 text-white' : 'bg-black/60 text-white/70 hover:bg-black/80'} backdrop-blur-sm border border-white/10`}
                            >
                              {showLayers ? 'HIDE ALL MASKS' : 'SHOW ALL MASKS'}
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

                                  <div className="flex flex-col sm:flex-row gap-4 w-full pt-4">
                                    <button 
                                      onClick={() => uploadedImage && analyzeImageWithAI(uploadedImage)}
                                      className="flex-1 py-4 bg-royal-blue text-white font-bold text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center shadow-lg"
                                    >
                                      <RefreshCw size={14} className="mr-2" /> Retry Analysis
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
                        <label className="w-full max-w-lg aspect-square md:aspect-video border-4 border-dashed border-gray-200 rounded-sm flex flex-col items-center justify-center cursor-pointer hover:border-royal-blue hover:bg-white transition-all group">
                          <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
                          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:text-royal-blue group-hover:bg-royal-blue/5 transition-all mb-6">
                            <Upload size={32} />
                          </div>
                          <h3 className="text-xl font-bold text-brand-black uppercase tracking-tight mb-2">UPLOAD YOUR ROOM PHOTO</h3>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">CLICK TO UPLOAD PHOTO</p>
                        </label>
                      )}
                    </div>

                    {/* Right: Info & Actions */}
                    <div className="lg:w-1/3 border-l border-gray-100 flex flex-col bg-white">
                      <div className="p-8 flex-grow space-y-6">
                        <div className="space-y-2">
                          <h4 className="text-[10px] font-black text-royal-blue uppercase tracking-widest">How it works</h4>
                          <p className="text-xs text-gray-500 leading-relaxed">
                            Our AI analyzes your room's lighting, textures, and style to perfectly place the <span className="font-bold text-brand-black">{featuredProduct?.name || 'Quads Satin Ridge™'}</span> handles in your space.
                          </p>
                        </div>
                        
                        <div className="p-5 bg-gray-50 border border-gray-100 rounded-sm">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Selected Product</p>
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-white border border-gray-100 p-2">
                              <img 
                                src={featuredProduct?.image || "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=200"} 
                                className="w-full h-full object-contain" 
                                alt={featuredProduct?.name || "Quads"} 
                              />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-brand-black uppercase tracking-tight">{featuredProduct?.name || 'Quads'}</p>
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

export default InvernessPage;
