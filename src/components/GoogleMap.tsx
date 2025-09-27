import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, AlertCircle } from "lucide-react";

interface GoogleMapProps {
  location: string;
  farmerName: string;
}

declare global {
  interface Window {
    google: typeof google;
  }
}

const GoogleMap = ({ location, farmerName }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  // Parse GPS coordinates from location string
  const parseCoordinates = (locationStr: string) => {
    // Try to extract coordinates from various formats
    const coordPattern = /(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/;
    const match = locationStr.match(coordPattern);
    
    if (match) {
      return {
        lat: parseFloat(match[1]),
        lng: parseFloat(match[2])
      };
    }
    
    // If no coordinates found, try to geocode the location name
    return null;
  };

  useEffect(() => {
    const coords = parseCoordinates(location);
    setCoordinates(coords);

    if (!coords || !mapRef.current) {
      if (!coords) {
        setMapError("GPS coordinates not found in location data");
      }
      return;
    }

    const loader = new Loader({
      apiKey: "YOUR_GOOGLE_MAPS_API_KEY", // Note: Replace with your actual API key
      version: "weekly",
      libraries: ["places"]
    });

    loader.load().then(() => {
      if (!mapRef.current || !window.google) return;

      const map = new window.google.maps.Map(mapRef.current, {
        center: coords,
        zoom: 15,
        styles: [
          {
            featureType: "all",
            stylers: [{ saturation: -20 }]
          }
        ]
      });

      // Add marker for farmer location
      new window.google.maps.Marker({
        position: coords,
        map: map,
        title: `${farmerName}'s Farm`,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#22c55e",
          fillOpacity: 1,
          strokeColor: "#166534",
          strokeWeight: 2
        }
      });

      // Add info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h3 style="margin: 0 0 4px 0; color: #166534; font-weight: bold;">
              ${farmerName}'s Farm
            </h3>
            <p style="margin: 0; color: #666; font-size: 14px;">
              ${location}
            </p>
          </div>
        `
      });

      const marker = new window.google.maps.Marker({
        position: coords,
        map: map,
        title: `${farmerName}'s Farm`
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });

    }).catch((error) => {
      console.error("Error loading Google Maps:", error);
      setMapError("Failed to load map. Please check if Google Maps API key is configured.");
    });

  }, [location, farmerName]);

  if (mapError || !coordinates) {
    return (
      <Card className="shadow-card-soft">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold text-foreground mb-2">Map Unavailable</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {mapError || "Location coordinates not available"}
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card-soft">
      <CardContent className="p-0">
        <div 
          ref={mapRef} 
          className="w-full h-64 rounded-lg"
          style={{ minHeight: "250px" }}
        />
        <div className="p-4 bg-background/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-forest" />
            <span>{location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleMap;