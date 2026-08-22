import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import maduraiSouthGeoJson from '../../data/maduraiSouthBoundary.json';
import { CivicIssue } from '../../types';
import { validateMaduraiSouthLocation } from '../../utils/geoValidation';

// Fix default marker icon issues with Leaflet in React
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const userMarkerIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const issueMarkerIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface ConstituencyMapProps {
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
  selectedLat?: number;
  selectedLng?: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  issues?: CivicIssue[];
  interactive?: boolean;
  heightClass?: string;
  showBoundaryOnly?: boolean;
}

export const ConstituencyMap: React.FC<ConstituencyMapProps> = ({
  centerLat = 9.9150,
  centerLng = 78.1300,
  zoom = 13,
  selectedLat,
  selectedLng,
  onLocationSelect,
  issues = [],
  interactive = false,
  heightClass = "h-[400px]",
  showBoundaryOnly = false
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const selectedMarkerRef = useRef<L.Marker | null>(null);
  const issueMarkersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy previous map instance if exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize Map centered on Madurai South
    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: zoom,
      zoomControl: true
    });

    mapInstanceRef.current = map;

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors | 192-Madurai South Geo-Boundary'
    }).addTo(map);

    // Add Madurai South GeoJSON Boundary Polygon
    const geoJsonLayer = L.geoJSON(maduraiSouthGeoJson as any, {
      style: {
        color: '#1E40AF',
        weight: 3.5,
        opacity: 0.9,
        fillColor: '#3B82F6',
        fillOpacity: 0.15,
        dashArray: '6, 6'
      }
    }).addTo(map);

    // Fit map bounds to constituency
    if (showBoundaryOnly) {
      map.fitBounds(geoJsonLayer.getBounds(), { padding: [20, 20] });
    }

    // Create LayerGroup for issue markers
    const issueLayerGroup = L.layerGroup().addTo(map);
    issueMarkersLayerRef.current = issueLayerGroup;

    // Handle Map Click if interactive selection is enabled
    if (interactive && onLocationSelect) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        onLocationSelect(lat, lng);
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update center & selected location marker when props change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (selectedLat !== undefined && selectedLng !== undefined) {
      // Remove old marker
      if (selectedMarkerRef.current) {
        map.removeLayer(selectedMarkerRef.current);
      }

      // Validate location for popup badge text
      const val = validateMaduraiSouthLocation(selectedLat, selectedLng);

      const marker = L.marker([selectedLat, selectedLng], {
        icon: userMarkerIcon,
        draggable: interactive && !!onLocationSelect
      }).addTo(map);

      selectedMarkerRef.current = marker;

      const popupContent = `
        <div style="font-family: sans-serif; text-align: center; padding: 4px;">
          <strong style="color: ${val.isValid ? '#1E40AF' : '#DC2626'}; font-size: 12px;">
            ${val.isValid ? '✓ Inside Madurai South' : '✕ Outside Constituency'}
          </strong>
          <div style="font-size: 11px; color: #1E293B; font-weight: 600; margin-top: 2px;">
            ${val.detectedWard ? val.detectedWard.name_en : 'Madurai South'}
          </div>
          <div style="font-size: 10px; color: #64748B; margin-top: 2px; font-family: monospace;">
            Lat: ${selectedLat.toFixed(4)}, Lng: ${selectedLng.toFixed(4)}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent).openPopup();

      if (interactive && onLocationSelect) {
        marker.on('dragend', (event) => {
          const newPos = event.target.getLatLng();
          onLocationSelect(newPos.lat, newPos.lng);
        });
      }

      map.panTo([selectedLat, selectedLng], { animate: true, duration: 0.5 });
    }
  }, [selectedLat, selectedLng, interactive, onLocationSelect]);

  // Render existing issues on the map
  useEffect(() => {
    if (!issueMarkersLayerRef.current || !mapInstanceRef.current) return;
    issueMarkersLayerRef.current.clearLayers();

    issues.forEach(issue => {
      const issueMarker = L.marker([issue.latitude, issue.longitude], {
        icon: defaultIcon
      });

      const statusColor = 
        issue.status === 'COMPLETED' ? '#1E40AF' : 
        issue.status === 'WORKING' ? '#2563EB' : 
        issue.status === 'SEEN' ? '#3B82F6' : '#60A5FA';

      const popupHtml = `
        <div style="font-family: sans-serif; max-width: 220px;">
          <span style="background: ${statusColor}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; text-transform: uppercase;">
            ${issue.status}
          </span>
          <h4 style="font-size: 13px; font-weight: bold; margin: 6px 0 2px 0; color: #0F2942;">${issue.title}</h4>
          <p style="font-size: 11px; color: #475569; margin: 0 0 6px 0;">${issue.ward_name}</p>
          <div style="font-size: 10px; color: #1E40AF; font-weight: bold; font-family: monospace;">ID: ${issue.issue_id}</div>
        </div>
      `;

      issueMarker.bindPopup(popupHtml);
      issueMarkersLayerRef.current?.addLayer(issueMarker);
    });
  }, [issues]);

  return (
    <div className={`relative w-full ${heightClass} rounded-2xl overflow-hidden shadow-inner border border-blue-100`}>
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
