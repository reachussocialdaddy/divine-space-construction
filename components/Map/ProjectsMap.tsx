
import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { MapPin, Info, X, ExternalLink } from 'lucide-react';
import { ProjectPin } from '../../types.ts';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 43.6532,
  lng: -79.3832
};

interface ProjectsMapProps {
  pins: ProjectPin[];
}

const ProjectsMap: React.FC<ProjectsMapProps> = ({ pins }) => {
  const [selected, setSelected] = useState<ProjectPin | null>(null);
  
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.GOOGLE_MAPS_PLATFORM_KEY || 
                     import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 
                     (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY || 
                     ""
  });

  if (loadError) {
    const isBillingError = loadError.message?.includes('BillingNotEnabledMapError') || 
                          loadError.toString().includes('BillingNotEnabledMapError');
    
    return (
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="bg-white p-12 rounded-sm shadow-xl border border-red-100 max-w-2xl mx-auto">
            <MapPin size={48} className="mx-auto text-red-200 mb-6" />
            <h2 className="text-2xl font-bold text-royal-blue mb-4 uppercase tracking-tighter">
              {isBillingError ? "Action Required: Enable Billing" : "Map Loading Error"}
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {isBillingError 
                ? "The Google Maps API requires a billing account to be linked to your project. This is a mandatory step for the map to function."
                : "The Google Maps API failed to load. This is often due to a configuration issue or billing not being enabled on the Google Cloud project."}
            </p>
            <div className="bg-red-50 p-6 rounded-sm text-left mb-6 border border-red-100">
              <p className="text-xs font-bold text-red-800 uppercase tracking-widest mb-3 flex items-center">
                <Info size={14} className="mr-2" /> How to fix this:
              </p>
              <ul className="text-xs text-red-700 space-y-2 list-disc pl-4 mb-4">
                <li>Go to the <strong>Google Cloud Console</strong></li>
                <li>Link a <strong>Billing Account</strong> to this project</li>
                <li>Ensure <strong>Maps JavaScript API</strong> is enabled</li>
                {isBillingError && <li>Wait a few minutes after enabling billing for the changes to propagate.</li>}
              </ul>
              <a 
                href="https://console.cloud.google.com/billing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-royal-blue font-bold text-xs hover:underline"
              >
                Open Billing Console <ExternalLink size={12} className="ml-1" />
              </a>
            </div>
            <p className="text-sm text-gray-500 italic">
              {isBillingError 
                ? "Error: BillingNotEnabledMapError" 
                : "Please ensure your API key is valid and billing is active in the Google Cloud Console."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-royal-blue font-bold tracking-widest text-sm uppercase mb-3 block">Portfolio</span>
            <h2 className="text-4xl md:text-5xl font-bold text-royal-blue">GTA & Toronto Projects</h2>
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
          <div className="lg:col-span-2 relative h-[600px] bg-white rounded-sm shadow-xl overflow-hidden border border-gray-200">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={11}
                options={{
                  styles: [
                    {
                      "featureType": "all",
                      "elementType": "geometry.fill",
                      "stylers": [{ "weight": "2.00" }]
                    },
                    {
                      "featureType": "all",
                      "elementType": "geometry.stroke",
                      "stylers": [{ "color": "#9c9c9c" }]
                    },
                    {
                      "featureType": "all",
                      "elementType": "labels.text",
                      "stylers": [{ "visibility": "on" }]
                    },
                    {
                      "featureType": "landscape",
                      "elementType": "all",
                      "stylers": [{ "color": "#f2f2f2" }]
                    },
                    {
                      "featureType": "landscape",
                      "elementType": "geometry.fill",
                      "stylers": [{ "color": "#ffffff" }]
                    },
                    {
                      "featureType": "landscape.man_made",
                      "elementType": "geometry.fill",
                      "stylers": [{ "color": "#ffffff" }]
                    },
                    {
                      "featureType": "poi",
                      "elementType": "all",
                      "stylers": [{ "visibility": "off" }]
                    },
                    {
                      "featureType": "road",
                      "elementType": "all",
                      "stylers": [{ "saturation": -100 }, { "lightness": 45 }]
                    },
                    {
                      "featureType": "road",
                      "elementType": "geometry.fill",
                      "stylers": [{ "color": "#eeeeee" }]
                    },
                    {
                      "featureType": "road",
                      "elementType": "labels.text.fill",
                      "stylers": [{ "color": "#7b7b7b" }]
                    },
                    {
                      "featureType": "road",
                      "elementType": "labels.text.stroke",
                      "stylers": [{ "color": "#ffffff" }]
                    },
                    {
                      "featureType": "road.highway",
                      "elementType": "all",
                      "stylers": [{ "visibility": "simplified" }]
                    },
                    {
                      "featureType": "road.arterial",
                      "elementType": "labels.icon",
                      "stylers": [{ "visibility": "off" }]
                    },
                    {
                      "featureType": "transit",
                      "elementType": "all",
                      "stylers": [{ "visibility": "off" }]
                    },
                    {
                      "featureType": "water",
                      "elementType": "all",
                      "stylers": [{ "color": "#46bcec" }, { "visibility": "on" }]
                    },
                    {
                      "featureType": "water",
                      "elementType": "geometry.fill",
                      "stylers": [{ "color": "#c8d7d4" }]
                    },
                    {
                      "featureType": "water",
                      "elementType": "labels.text.fill",
                      "stylers": [{ "color": "#070707" }]
                    },
                    {
                      "featureType": "water",
                      "elementType": "labels.text.stroke",
                      "stylers": [{ "color": "#ffffff" }]
                    }
                  ],
                  disableDefaultUI: false,
                  zoomControl: true,
                }}
              >
                {pins.map((pin) => (
                  <MarkerF
                    key={pin.id}
                    position={{ lat: pin.lat, lng: pin.lng }}
                    onClick={() => setSelected(pin)}
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

                {selected && (
                  <InfoWindowF
                    position={{ lat: selected.lat, lng: selected.lng }}
                    onCloseClick={() => setSelected(null)}
                  >
                    <div className="p-2 max-w-[200px]">
                      <h4 className="font-bold text-royal-blue text-sm mb-1">{selected.title}</h4>
                      <p className="text-xs text-gray-600 line-clamp-2">{selected.description}</p>
                    </div>
                  </InfoWindowF>
                )}
              </GoogleMap>
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
