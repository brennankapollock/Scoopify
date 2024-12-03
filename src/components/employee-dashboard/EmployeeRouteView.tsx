import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/auth';
import { collection, query, getDocs, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Route } from '../routes/types';
import { format, addDays, isToday, isTomorrow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Play, MapPin, Clock, Users, Calendar } from 'lucide-react';

const EmployeeRouteView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assignedRoutes, setAssignedRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

  useEffect(() => {
    const loadAssignedRoutes = async () => {
      if (!user?.businessId) return;

      try {
        // Get employee document first to get assignedRoutes
        const employeesRef = collection(db, 'businesses', user.businessId, 'employees');
        const employeesQuery = query(employeesRef, where('userId', '==', user.uid));
        const employeesSnapshot = await getDocs(employeesQuery);
        
        if (employeesSnapshot.empty) {
          setError('Employee data not found');
          return;
        }

        const employeeData = employeesSnapshot.docs[0].data();
        const assignedRouteIds = employeeData.assignedRoutes || [];

        // Get all assigned routes
        const routesRef = collection(db, 'businesses', user.businessId, 'routes');
        const loadedRoutes: Route[] = [];

        for (const routeId of assignedRouteIds) {
          const routeDoc = await getDoc(doc(routesRef, routeId));
          if (routeDoc.exists()) {
            loadedRoutes.push({ id: routeDoc.id, ...routeDoc.data() } as Route);
          }
        }
        
        // Sort routes by day
        const sortedRoutes = loadedRoutes.sort((a, b) => 
          days.indexOf(a.serviceDay.toLowerCase()) - days.indexOf(b.serviceDay.toLowerCase())
        ) as Route[];

        setAssignedRoutes(sortedRoutes);
      } catch (err) {
        console.error('Error loading routes:', err);
        setError('Failed to load your assigned routes');
      } finally {
        setLoading(false);
      }
    };

    loadAssignedRoutes();
  }, [user]);

  const handleStartRoute = (routeId: string) => {
    navigate(`/employee/routes/${routeId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const groupedRoutes = assignedRoutes.reduce((acc, route) => {
    const day = route.serviceDay.toLowerCase();
    if (!acc[day]) acc[day] = [];
    acc[day].push(route);
    return acc;
  }, {} as Record<string, Route[]>);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">
          Your Routes
        </h1>
        <p className="text-gray-500">View and manage your assigned routes</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Routes by Day */}
      <div className="space-y-8">
        {days.map(day => {
          const routes = groupedRoutes[day] || [];
          if (routes.length === 0) return null;

          const isToday = format(new Date(), 'EEEE').toLowerCase() === day;

          return (
            <div key={day} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className={`p-4 ${isToday ? 'bg-primary-50' : 'bg-gray-50'} border-b border-gray-200`}>
                <h2 className="text-lg font-semibold text-gray-900 capitalize">
                  {day}s
                  {isToday && <span className="ml-2 text-primary-600">(Today)</span>}
                </h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 gap-4">
                  {routes.map((route) => (
                    <div key={route.id} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{route.name}</h3>
                          <div className="flex items-center gap-4 mt-2 text-gray-600">
                            <div className="flex items-center">
                              <Clock size={16} className="mr-1" />
                              <span className="text-sm">
                                {Math.ceil(route.stops.length * 15 / 60)}h {(route.stops.length * 15) % 60}m
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Users size={16} className="mr-1" />
                              <span className="text-sm">{route.stops.length} stops</span>
                            </div>
                          </div>
                        </div>
                        {isToday && (
                          <button
                            onClick={() => handleStartRoute(route.id)}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
                          >
                            <Play size={16} />
                            Start Route
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmployeeRouteView;