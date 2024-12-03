import React, { useState, useEffect } from 'react';
import { X, MapPin, GripVertical } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon, LatLng } from 'leaflet';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Route, RouteStop, RouteEndpoint } from './types';
import 'leaflet/dist/leaflet.css';

interface RouteOptimizationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  routes: Route[];
  onSaveRoute: (routeId: string, stops: RouteStop[]) => void;
}

const createIcon = (color: string) => new Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
      <circle cx="12" cy="12" r="10" fill="white" stroke="${color}" stroke-width="2"/>
      <circle cx="12" cy="12" r="4" fill="${color}"/>
    </svg>
  `)}`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

interface SortableStopProps {
  stop: RouteStop;
  onUnassign: () => void;
}

const SortableStop = ({ stop, onUnassign }: SortableStopProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: stop.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm"
    >
      <button {...listeners} className="touch-none">
        <GripVertical className="text-gray-400" size={16} />
      </button>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{stop.customerName}</p>
        <p className="text-sm text-gray-500">{stop.address}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">Stop #{stop.position}</span>
        <button
          onClick={onUnassign}
          className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
          title="Remove from route"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

const RouteOptimizationDialog: React.FC<RouteOptimizationDialogProps> = ({
  isOpen,
  onClose,
  routes,
  onSaveRoute,
}) => {
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [markers, setMarkers] = useState<Array<{ position: LatLng; stop: RouteStop }>>([]);
  const [center, setCenter] = useState<[number, number]>([39.8283, -98.5795]);
  const [startPoint, setStartPoint] = useState<string>('');
  const [endPoint, setEndPoint] = useState<string>('');
  const [sameStartEnd, setSameStartEnd] = useState(false);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (selectedRoute) {
      const geocodeAddresses = async () => {
        const geocodedMarkers = await Promise.all(
          selectedRoute.stops.map(async (stop) => {
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

        if (validMarkers.length > 0) {
          setCenter([validMarkers[0].position.lat, validMarkers[0].position.lng]);
        }
      };

      geocodeAddresses();
    }
  }, [selectedRoute]);

  if (!isOpen) return null;

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = selectedRoute?.stops.findIndex(stop => stop.id === active.id);
      const newIndex = selectedRoute?.stops.findIndex(stop => stop.id === over.id);
      
      if (oldIndex !== undefined && newIndex !== undefined && selectedRoute) {
        const newStops = arrayMove(selectedRoute.stops, oldIndex, newIndex).map((stop, index) => ({
          ...stop,
          position: index + 1,
        }));
        
        setSelectedRoute({
          ...selectedRoute,
          stops: newStops,
        });
      }
    }
  };

  const handleSave = () => {
    if (selectedRoute) {
      onSaveRoute(selectedRoute.id, selectedRoute.stops);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-6xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Route Optimization
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={24} />
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Route
            </label>
            <select
              value={selectedRoute?.id || ''}
              onChange={(e) => setSelectedRoute(routes.find(r => r.id === e.target.value) || null)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">Choose a route...</option>
              {routes.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.name}
                </option>
              ))}
            </select>
          </div>

          {selectedRoute && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Map View */}
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
                      icon={createIcon(selectedRoute.color)}
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
                      color={selectedRoute.color}
                      weight={2}
                      opacity={0.8}
                    />
                  )}
                </MapContainer>
              </div>

              {/* Stops List */}
              <div>
                <div className="mb-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Point
                    </label>
                    <input
                      type="text"
                      value={startPoint}
                      onChange={(e) => setStartPoint(e.target.value)}
                      placeholder="Enter start address"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={sameStartEnd}
                      onChange={(e) => {
                        setSameStartEnd(e.target.checked);
                        if (e.target.checked) {
                          setEndPoint(startPoint);
                        }
                      }}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      End point is same as start point
                    </span>
                  </label>

                  {!sameStartEnd && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Point
                      </label>
                      <input
                        type="text"
                        value={endPoint}
                        onChange={(e) => setEndPoint(e.target.value)}
                        placeholder="Enter end address"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">
                    Route Stops ({selectedRoute.stops.length})
                  </h4>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={selectedRoute.stops}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {selectedRoute.stops.map((stop) => (
                          <SortableStop 
                            key={stop.id} 
                            stop={stop} 
                            onUnassign={() => {
                              setSelectedRoute({
                                ...selectedRoute,
                                stops: selectedRoute.stops.filter(s => s.id !== stop.id)
                              });
                            }}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!selectedRoute}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              Save Route Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteOptimizationDialog;