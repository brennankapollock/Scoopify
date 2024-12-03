import React, { useState } from 'react';
import { AlertTriangle, Clock, MapPin, User, ChevronDown, ChevronUp, GripVertical, X, TrendingUp, MoreVertical } from 'lucide-react';
import { Route, RouteStop } from './types';
import { Employee } from '../employees/types';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface RouteGridProps {
  routes: Route[];
  employees: Employee[];
  onRouteClick: (route: Route) => void;
  onReorderStops: (routeId: string, stops: RouteStop[]) => void;
  onUnassignCustomer: (routeId: string, customerId: string) => void;
  onAssignEmployee: (routeId: string, employeeId: string | undefined) => void;
}

const SortableStop = ({ stop, onUnassign, route }: { stop: RouteStop; onUnassign: () => void; route: Route }) => {
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
        <div 
          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-medium"
          style={{ backgroundColor: route?.color || 'var(--color-primary-600)' }}
        >
          {stop.position}
        </div>
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

const RouteGrid: React.FC<RouteGridProps> = ({ 
  routes, 
  employees, 
  onRouteClick, 
  onReorderStops,
  onUnassignCustomer,
  onAssignEmployee
}) => {
  const [expandedRoutes, setExpandedRoutes] = useState<string[]>([]);
  const [showAssignMenu, setShowAssignMenu] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getEmployeeDetails = (employeeId?: string) => {
    if (!employeeId) return null;
    return employees.find(emp => emp.id === employeeId);
  };

  const toggleRouteExpanded = (routeId: string) => {
    setExpandedRoutes(prev =>
      prev.includes(routeId)
        ? prev.filter(id => id !== routeId)
        : [...prev, routeId]
    );
  };

  const calculateRouteDuration = (stops: RouteStop[]) => {
    const totalMinutes = stops.length * 15; // 15 minutes per stop
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const handleDragEnd = (routeId: string, event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const route = routes.find(r => r.id === routeId);
      if (!route) return;

      const oldIndex = route.stops.findIndex(stop => stop.id === active.id);
      const newIndex = route.stops.findIndex(stop => stop.id === over.id);
      
      const newStops = arrayMove(route.stops, oldIndex, newIndex).map((stop, index) => ({
        ...stop,
        position: index + 1,
      }));

      onReorderStops(routeId, newStops);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {routes.map((route) => {
          const assignedEmployee = route.assignedTech?.id ? getEmployeeDetails(route.assignedTech.id) : null;
          const isExpanded = expandedRoutes.includes(route.id);
          const estimatedDuration = calculateRouteDuration(route.stops);
          
          return (
            <div
              key={route.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
              onMouseLeave={() => setShowAssignMenu(null)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4 relative">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {route.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      route.status === 'active' ? 'bg-primary-100 text-primary-800' :
                      route.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAssignMenu(showAssignMenu === route.id ? null : route.id);
                      }}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <MoreVertical size={20} className="text-gray-500" />
                    </button>
                    
                    {/* Assignment Menu */}
                    {showAssignMenu === route.id && (
                      <div className="absolute right-0 top-8 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        <div className="p-2">
                          <div className="text-xs font-medium text-gray-500 px-3 py-2">
                            Assign Employee
                          </div>
                          {employees.map((employee) => (
                            <button
                              key={employee.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onAssignEmployee(route.id, employee.id === route.assignedTech?.id ? undefined : employee.id);
                                setShowAssignMenu(null);
                              }}
                              className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                                employee.id === route.assignedTech?.id
                                  ? 'bg-primary-50 text-primary-700'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              <User size={16} className="mr-2" />
                              {employee.fullName}
                              {employee.id === route.assignedTech?.id && (
                                <X size={16} className="ml-auto" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => toggleRouteExpanded(route.id)}
                  className="w-full text-left"
                >
                  <div className="space-y-3">
                    {route.neighborhoods.length > 0 && (
                      <div className="flex items-center text-gray-600">
                        <MapPin size={16} className="mr-2" />
                        <span className="text-sm">
                          {route.neighborhoods.join(', ')}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center text-gray-600">
                      <Clock size={16} className="mr-2" />
                      <span className="text-sm">
                        {estimatedDuration} • {route.stops.length} stops
                      </span>
                    </div>

                    {assignedEmployee && (
                      <div className="flex items-center text-gray-600">
                        <User size={16} className="mr-2" />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {assignedEmployee.fullName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {assignedEmployee.position}
                            {assignedEmployee.rating && ` • ${assignedEmployee.rating}★`}
                          </span>
                        </div>
                      </div>
                    )}

                    {route.zipCodes.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {route.zipCodes.map((zipCode) => (
                          <span
                            key={zipCode}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                          >
                            {zipCode}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Route Efficiency</span>
                      <div className="flex items-center gap-2">
                        <TrendingUp size={16} className="text-primary-500" />
                        <span className="text-lg font-semibold text-primary-600">
                          {route.efficiency}%
                        </span>
                        {isExpanded ? (
                          <ChevronUp size={20} className="text-gray-400" />
                        ) : (
                          <ChevronDown size={20} className="text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Expandable Stops List */}
                {isExpanded && (
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">
                      Stops ({route.stops.length})
                    </h4>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={(event) => handleDragEnd(route.id, event)}
                    >
                      <SortableContext
                        items={route.stops}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-2">
                          {route.stops.map((stop) => (
                            <SortableStop 
                              key={stop.id} 
                              stop={stop} 
                              route={route}
                              onUnassign={() => onUnassignCustomer(route.id, stop.customerId)}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RouteGrid;