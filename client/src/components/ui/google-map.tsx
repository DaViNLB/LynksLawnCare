import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface ServiceLocation {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
}

interface GoogleMapProps {
  locations: ServiceLocation[];
  selectedLocation: string | null;
  onLocationSelect: (locationId: string) => void;
}

export default function GoogleMap({ locations, selectedLocation, onLocationSelect }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const initMap = async () => {
      if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
        setLoadError('Google Maps API key not configured');
        return;
      }

      try {
        const loader = new Loader({
          apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
          version: 'weekly',
          libraries: ['marker']
        });

        await loader.load();
        
        if (!mapRef.current) return;

        // Center the map on Delaware
        const mapInstance = new (window as any).google.maps.Map(mapRef.current, {
          center: { lat: 38.9108, lng: -75.5277 }, // Delaware center
          zoom: 10,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            },
            {
              featureType: 'transit',
              elementType: 'all',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        setMap(mapInstance);
        setIsLoaded(true);

        // Add markers for each service location
        const newMarkers: any[] = [];
        
        locations.forEach((location) => {
          const marker = new (window as any).google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: mapInstance,
            title: location.name,
            icon: {
              path: (window as any).google.maps.SymbolPath.CIRCLE,
              scale: 12,
              fillColor: selectedLocation === location.id ? '#16a34a' : '#22c55e',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 3
            }
          });

          marker.addListener('click', () => {
            onLocationSelect(location.id);
          });

          newMarkers.push(marker);
        });

        setMarkers(newMarkers);

      } catch (error) {
        console.error('Error loading Google Maps:', error);
        setLoadError('Failed to load Google Maps');
      }
    };

    initMap();

    // Cleanup
    return () => {
      markers.forEach(marker => marker.setMap(null));
    };
  }, []);

  // Update marker colors when selected location changes
  useEffect(() => {
    markers.forEach((marker, index) => {
      const location = locations[index];
      if (marker && location) {
        marker.setIcon({
          path: (window as any).google.maps.SymbolPath.CIRCLE,
          scale: selectedLocation === location.id ? 15 : 12,
          fillColor: selectedLocation === location.id ? '#16a34a' : '#22c55e',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3
        });
      }
    });
  }, [selectedLocation, markers, locations]);

  if (loadError) {
    return (
      <div className="w-full h-96 md:h-full bg-neutral-200 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="text-neutral-600 mb-2">Google Maps Integration</div>
          <div className="text-sm text-neutral-500">
            {loadError === 'Google Maps API key not configured' 
              ? 'Maps will be available once Google Maps is configured'
              : 'Unable to load map at this time'
            }
          </div>
          <div className="mt-4 text-xs text-neutral-400">
            Service areas: Felton, Harrington, Farmington, Houston, Brownsville
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 md:h-full">
      <div ref={mapRef} className="w-full h-full" />
      {!isLoaded && (
        <div className="absolute inset-0 bg-neutral-200 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2" />
            <div className="text-neutral-600">Loading map...</div>
          </div>
        </div>
      )}
    </div>
  );
}