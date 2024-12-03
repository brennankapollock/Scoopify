import React, { useState } from 'react';
import { format, isSameDay } from 'date-fns';
import { ChevronDown, ChevronUp, MapPin, Clock } from 'lucide-react';
import { Appointment, Route } from '../types';

interface MonthViewProps {
  date: Date;
  appointments: Appointment[];
  routes: Route[];
  onAppointmentClick: (appointment: Appointment) => void;
  onRouteClick: (route: Route) => void;
  selectedAppointment: Appointment | null;
  onClose: () => void;
}

const MonthView: React.FC<MonthViewProps> = ({ 
  date, 
  appointments, 
  routes,
  onAppointmentClick,
  selectedAppointment,
  onClose
}) => {
  const [expandedDay, setExpandedDay] = useState<Date | null>(null);
  const [expandedRoutes, setExpandedRoutes] = useState<string[]>([]);

  const toggleDay = (day: Date) => {
    setExpandedDay(expandedDay && isSameDay(expandedDay, day) ? null : day);
  };

  const toggleRoute = (routeId: string) => {
    setExpandedRoutes(prev =>
      prev.includes(routeId)
        ? prev.filter(id => id !== routeId)
        : [...prev, routeId]
    );
  };

  const getRoutesForDay = (day: string) => {
    return routes.filter(route => route.serviceDay === day.toLowerCase());
  };

  return (
    <div className="divide-y divide-gray-200">
      {Array.from({ length: 31 }, (_, i) => {
        const currentDay = new Date(date.getFullYear(), date.getMonth(), i + 1);
        const dayName = format(currentDay, 'EEEE').toLowerCase();
        const dayRoutes = getRoutesForDay(dayName);
        const isExpanded = expandedDay && isSameDay(expandedDay, currentDay);

        if (currentDay.getMonth() !== date.getMonth()) return null;

        return (
          <div 
            key={i}
            className="transition-colors hover:bg-gray-50 cursor-pointer"
            onClick={() => toggleDay(currentDay)}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-medium text-gray-900">
                    {format(currentDay, 'EEE')}
                    <span className="hidden sm:inline">{format(currentDay, 'eeee').slice(3)}</span>
                  </span>
                  <span className="text-sm text-gray-500">
                    {format(currentDay, 'MMM d')}
                  </span>
                </div>
                {dayRoutes.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {dayRoutes.length} {dayRoutes.length === 1 ? 'route' : 'routes'}
                    </span>
                    {isExpanded ? (
                      <ChevronUp size={20} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-400" />
                    )}
                  </div>
                )}
              </div>

              {isExpanded && dayRoutes.length > 0 && (
                <div className="space-y-4 mt-4">
                  {dayRoutes.map((route) => (
                    <div key={route.id} className="bg-white rounded-lg border border-gray-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRoute(route.id);
                        }}
                        className="w-full px-4 py-3 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: route.color }}
                          />
                          <span className="font-medium text-gray-900">{route.name}</span>
                          <span className="text-sm text-gray-500">
                            ({route.stops.length} stops)
                          </span>
                        </div>
                        {expandedRoutes.includes(route.id) ? (
                          <ChevronUp size={16} className="text-gray-400" />
                        ) : (
                          <ChevronDown size={16} className="text-gray-400" />
                        )}
                      </button>

                      {expandedRoutes.includes(route.id) && (
                        <div className="border-t border-gray-100">
                          {route.stops.map((stop, index) => (
                            <div
                              key={stop.id}
                              className="px-4 py-3 flex items-start justify-between border-b last:border-b-0 border-gray-100"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-900">
                                    Stop #{index + 1}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {stop.customerName}
                                  </span>
                                </div>
                                <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                                  <MapPin size={14} />
                                  <span>{stop.address}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock size={14} className="text-gray-400" />
                                <span className="text-sm text-gray-500">
                                  {stop.timeWindow}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MonthView;