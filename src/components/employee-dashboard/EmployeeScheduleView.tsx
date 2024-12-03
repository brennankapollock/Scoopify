import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { Clock, MapPin, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import { Appointment } from '../schedule/types';
import { Route } from '../routes/types';
import { useAuth } from '../../contexts/auth';
import { collection, query, getDocs, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import RouteStopCard from './RouteStopCard';
import { Employee } from '../employees/types';

interface EmployeeScheduleViewProps {
  date: Date;
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
}

const EmployeeScheduleView: React.FC<EmployeeScheduleViewProps> = ({
  date,
  appointments,
  onAppointmentClick,
}) => {
  const { user } = useAuth();
  const [assignedRoutes, setAssignedRoutes] = useState<Route[]>([]);
  const [employeeData, setEmployeeData] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(date);
  const [expandedRoutes, setExpandedRoutes] = useState<string[]>([]);
  const [completedStops, setCompletedStops] = useState<string[]>([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [stats, setStats] = useState({
    completedStops: 0,
    totalStops: 0,
    points: 0,
  });

  const toggleRoute = (routeId: string) => {
    setExpandedRoutes(prev =>
      prev.includes(routeId)
        ? prev.filter(id => id !== routeId)
        : [...prev, routeId]
    );
  };

  useEffect(() => {
    const loadEmployeeData = async () => {
      if (!user?.businessId) return;

      try {
        // Load employee data
        const employeesRef = collection(db, 'businesses', user.businessId, 'employees');
        const employeesQuery = query(employeesRef, where('userId', '==', user.uid));
        const employeesSnapshot = await getDocs(employeesQuery);
        let totalStops = 0;
        
        if (!employeesSnapshot.empty) {
          const employeeDoc = employeesSnapshot.docs[0];
          setEmployeeData(employeeDoc.data() as Employee);
          
          // Load assigned routes
          const routeIds = employeeDoc.data().assignedRoutes || [];
          const routes: Route[] = [];
          
          for (const routeId of routeIds) {
            const routeRef = doc(db, 'businesses', user.businessId, 'routes', routeId);
            const routeDoc = await getDoc(routeRef);
            if (routeDoc.exists()) {
              routes.push({ id: routeDoc.id, ...routeDoc.data() } as Route);
              totalStops += routeDoc.data().stops?.length || 0;
            }
          }
          
          setAssignedRoutes(routes);
          setStats(prev => ({
            ...prev,
            totalStops
          }));
        }
      } catch (err) {
        console.error('Error loading employee data:', err);
        setError('Failed to load your schedule');
      } finally {
        setLoading(false);
      }
    };
    loadEmployeeData();
  }, [user]);
  // Get next 7 days
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(selectedDate), i));

  // Get routes for a specific day
  const getRoutesForDay = (date: Date) => {
    const dayName = format(date, 'EEEE').toLowerCase();
    return assignedRoutes.filter(route => route.serviceDay.toLowerCase() === dayName);
  };
  const handleCompleteStop = async (stopId: string) => {
    setCompletedStops(prev => [...prev, stopId]);
    setStats(prev => ({
      ...prev,
      completedStops: prev.completedStops + 1,
      points: prev.points + 15, // Base points + potential bonus
    }));
    // TODO: Update stop status in database
  };

  const handleAlertCustomer = async (stopId: string) => {
    // Implement customer alert logic
  };

  const handleGetLocation = (stopId: string) => {
    // Implement navigation logic
  };

  const handleReportIssue = (stopId: string) => {
    // Implement issue reporting logic
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">
          Your Schedule
        </h1>
        <div className="flex justify-between items-center">
          <p className="text-gray-500">
            View your upcoming routes and appointments
          </p>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-gray-500">Progress: </span>
              <span className="font-medium text-primary-600">
                {stats.completedStops}/{stats.totalStops} stops
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Points: </span>
              <span className="font-medium text-yellow-600">
                +{stats.points}
              </span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      {/* Appointments List */}
      <div className="space-y-8">
        {weekDays.map(day => {
          const routes = getRoutesForDay(day);
          const isToday = isSameDay(day, new Date());
          
          return (
            <div key={format(day, 'yyyy-MM-dd')} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className={`p-4 ${isToday ? 'bg-primary-50' : 'bg-gray-50'} border-b border-gray-200`}>
                <h2 className="text-lg font-semibold text-gray-900">
                  {format(day, 'EEEE, MMMM d')}
                  {isToday && <span className="ml-2 text-primary-600">(Today)</span>}
                </h2>
              </div>
              
              {routes.length > 0 ? (
                <div className="p-4">
                  {routes.map(route => (
                    <div key={route.id} className="mb-4 last:mb-0">
                      <div>
                        <button
                          onClick={() => toggleRoute(route.id)}
                          className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                              {route.stops.length}
                            </div>
                            <div className="text-left">
                              <h3 className="font-medium text-gray-900">{route.name}</h3>
                              <p className="text-sm text-gray-500">
                                {route.stops.length} {route.stops.length === 1 ? 'stop' : 'stops'}
                              </p>
                            </div>
                          </div>
                          {expandedRoutes.includes(route.id) ? (
                            <ChevronUp className="text-gray-400" size={20} />
                          ) : (
                            <ChevronDown className="text-gray-400" size={20} />
                          )}
                        </button>
                        
                        {expandedRoutes.includes(route.id) && (
                          <div className="mt-4 space-y-4 pl-4">
                            {/* Active Stops */}
                            {route.stops
                              .filter(stop => !completedStops.includes(stop.id))
                              .map(stop => (
                              <RouteStopCard
                                key={stop.id}
                                stop={stop}
                                onComplete={handleCompleteStop}
                                onAlert={handleAlertCustomer}
                                onLocation={handleGetLocation}
                                onIssue={handleReportIssue}
                              />
                            ))}
                            
                            {/* Completed Stops Toggle */}
                            {completedStops.some(id => 
                              route.stops.find(stop => stop.id === id)
                            ) && (
                              <div className="mt-6 pt-4 border-t border-gray-200">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowCompleted(!showCompleted);
                                  }}
                                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                                >
                                  {showCompleted ? (
                                    <ChevronUp size={16} />
                                  ) : (
                                    <ChevronDown size={16} />
                                  )}
                                  {completedStops.filter(id => 
                                    route.stops.find(stop => stop.id === id)
                                  ).length} completed stops
                                </button>
                                
                                {/* Completed Stops List */}
                                {showCompleted && (
                                  <div className="mt-4 space-y-4 opacity-60">
                                    {route.stops
                                      .filter(stop => completedStops.includes(stop.id))
                                      .map(stop => (
                                        <RouteStopCard
                                          key={stop.id}
                                          stop={stop}
                                          onComplete={handleCompleteStop}
                                          onAlert={handleAlertCustomer}
                                          onLocation={handleGetLocation}
                                          onIssue={handleReportIssue}
                                        />
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No routes scheduled for this day
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmployeeScheduleView;