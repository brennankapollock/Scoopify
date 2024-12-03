import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon, LatLng } from 'leaflet';
import { Route, RouteStop, RouteEndpoint } from './types';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  route: Route;
  onSaveOrder: (stops: RouteStop[]) => void;
  onUpdateEndpoints: (startPoint: RouteEndpoint | null, endPoint: RouteEndpoint | null) => void;
}

const createIcon = (color: string) => new Icon({
  iconUrl: `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
      <circle cx="12" cy="12" r="10" fill="white" stroke="${color}" stroke-width="2"/>
      <circle cx="12" cy="12" r="4" fill="${color}"/>
    </svg>
  `)))}`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

const MapView: React.FC<MapViewProps> = ({ route, onSaveOrder, onUpdateEndpoints }) => {
  const [markers, setMarkers] = useState<Array<{ position: LatLng; stop: RouteStop }>>([]);
  const [startPoint, setStartPoint] = useState<RouteEndpoint | null>(route.startPoint || null);
  const [endPoint, setEndPoint] = useState<RouteEndpoint | null>(route.endPoint || null);
  const [center, setCenter] = useState<[number, number]>([39.8283, -98.5795]); // Center of US

  useEffect(() => {
    // Geocode all addresses to get coordinates
    const geocodeAddresses = async () => {
      const geocodedMarkers = await Promise.all(
        route.stops.map(async (stop) => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(stop.address)}`
            );
            const data = await response.json();
            if (data[0]) {
              return {
                position: new LatLng(parseFloat(data[0].lat), parseFloat(data[0].lon)),
                stop,
              };
            }
            return null;
          } catch (error) {
            console.error('Error geocoding address:', error);
            return null;
          }
        })
      );

      const validMarkers = geocodedMarkers.filter(Boolean);
      setMarkers(validMarkers);

      // Center map on first marker if available
      if (validMarkers.length > 0) {
        setCenter([validMarkers[0].position.lat, validMarkers[0].position.lng]);
      }
    };

    geocodeAddresses();
  }, [route.stops]);

  const handleSaveOrder = () => {
    const newStops = markers.map((marker, index) => ({
      ...marker.stop,
      position: index + 1,
    }));
    onSaveOrder(newStops);
  };

  return (
    <div className="space-y-4">
      {/* Start/End Points */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Point Address
          </label>
          <input
            type="text"
            value={startPoint?.address || ''}
            onChange={(e) => {
              const newStartPoint = {
                type: 'start' as const,
                address: e.target.value,
                zipCode: startPoint?.zipCode || '',
              };
              setStartPoint(newStartPoint);
              onUpdateEndpoints(newStartPoint, endPoint);
            }}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="Enter start address"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Point Address
          </label>
          <input
            type="text"
            value={endPoint?.address || ''}
            onChange={(e) => {
              const newEndPoint = {
                type: 'end' as const,
                address: e.target.value,
                zipCode: endPoint?.zipCode || '',
              };
              setEndPoint(newEndPoint);
              onUpdateEndpoints(startPoint, newEndPoint);
            }}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="Enter end address"
          />
        </div>
      </div>

      {/* Map */}
      <div className="h-[600px] rounded-lg overflow-hidden border border-gray-200">
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {markers.map((marker, index) => (
            <Marker
              key={marker.stop.id}
              position={marker.position}
              icon={createIcon(route.color)}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-medium">{marker.stop.customerName}</p>
                  <p className="text-gray-500">{marker.stop.address}</p>
                  <p className="text-gray-500">Stop #{index + 1}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {markers.length > 1 && (
            <Polyline
              positions={markers.map(m => m.position)}
              color={route.color}
              weight={2}
              opacity={0.8}
            />
          )}
        </MapContainer>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveOrder}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
        >
          Save Route Order
        </button>
      </div>
    </div>
  );
};

export default MapView;