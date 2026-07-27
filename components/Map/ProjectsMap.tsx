import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Info, X } from 'lucide-react';
import { ProjectPin } from '../../types.ts';

const center = {
  lat: 43.6532,
  lng: -79.3832
};

interface ProjectsMapProps {
  pins: ProjectPin[];
}

const ProjectsMap: React.FC<ProjectsMapProps> = ({ pins }) => {
  const [selected, setSelected] = useState<ProjectPin | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    // 1. Load Leaflet CSS dynamically if not already loaded
    const cssId = 'leaflet-css';
    if (!document.getElementById(cssId)) {
      const link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // 2. Load Leaflet JS dynamically if L is not defined
    const scriptId = 'leaflet-js';
    const initMap = () => {
      setIsMapLoaded(true);
    };

    if ((window as any).L) {
      initMap();
    } else {
      let script = document.getElementById(scriptId) as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        document.body.appendChild(script);
      }
      script.addEventListener('load', initMap);
      return () => {
        script.removeEventListener('load', initMap);
      };
    }
  }, []);

  useEffect(() => {
    if (!isMapLoaded || !mapContainerRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        center: [center.lat, center.lng],
        zoom: 11,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      }).addTo(mapInstanceRef.current);

      // Listen to popupclose to reset selection
      mapInstanceRef.current.on('popupclose', () => {
        setSelected(null);
      });
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Custom blue pin icon to match the previous marker styling
    const customIcon = L.divIcon({
      className: 'bg-transparent border-none',
      html: `
        <div class="flex items-center justify-center w-8 h-8 rounded-full bg-royal-blue text-white shadow-lg border-2 border-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    // Add pins to map
    pins.forEach(pin => {
      const marker = L.marker([pin.lat, pin.lng], { icon: customIcon }).addTo(map);
      
      marker.bindPopup(`
        <div class="p-2 min-w-[150px]">
          <h4 class="font-bold text-royal-blue text-sm mb-1">${pin.title}</h4>
          <p class="text-xs text-gray-600 line-clamp-2">${pin.description}</p>
        </div>
      `);
      
      marker.on('click', () => {
        setSelected(pin);
        map.panTo([pin.lat, pin.lng]);
      });
      
      markersRef.current.push(marker);
    });

    // Adjust map bounds if there are pins
    if (pins.length > 0) {
      const group = L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds().pad(0.1));
    }
  }, [isMapLoaded, pins]);

  // Map instance cleanup on component unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <section className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-royal-blue font-bold tracking-widest text-sm uppercase mb-3 block">Portfolio</span>
            <h2 className="text-3xl md:text-5xl font-bold text-royal-blue">GTA & Toronto Projects</h2>
          </div>
          <div className="flex items-center space-x-4 bg-white p-3 rounded-sm shadow-sm border border-gray-200">
            <div className="flex items-center text-sm font-medium text-gray-500">
              <div className="w-3 h-3 bg-royal-blue rounded-full mr-2"></div> Active Site
            </div>
            <div className="flex items-center text-sm font-medium text-gray-500">
              <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div> Completed
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 relative h-[400px] md:h-[600px] bg-white rounded-sm shadow-xl overflow-hidden border border-gray-200 z-0">
            {isMapLoaded ? (
              <div ref={mapContainerRef} className="w-full h-full min-h-[400px] md:min-h-[600px] z-0" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-blue mx-auto mb-4"></div>
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Map...</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-royal-blue flex items-center">
              <Info size={20} className="mr-2" /> Project Details
            </h3>
            
            {selected ? (
              <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-sm animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-bold text-royal-blue">{selected.title}</h4>
                  <button onClick={() => setSelected(null)} className="p-1 text-gray-400 hover:text-royal-blue">
                    <X size={20} />
                  </button>
                </div>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                  {selected.description}
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                    <span className="text-gray-400">Location</span>
                    <span className="font-semibold text-royal-blue">{(selected.lat || 0).toFixed(4)}, {(selected.lng || 0).toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                    <span className="text-gray-400">Status</span>
                    <span className="text-green-600 font-semibold uppercase tracking-widest text-[10px]">Active Site</span>
                  </div>
                </div>
                <button className="w-full mt-8 py-4 bg-royal-blue text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-opacity-90 transition-all shadow-lg">
                  View Project Details
                </button>
              </div>
            ) : (
              <div className="h-full border-2 border-dashed border-gray-200 rounded-sm flex flex-col items-center justify-center p-8 text-center bg-gray-50/50">
                <MapPin size={48} className="text-gray-200 mb-4" />
                <p className="text-gray-400 text-sm italic">
                  Select a project pin on the map to view site details and progress photos.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsMap;
