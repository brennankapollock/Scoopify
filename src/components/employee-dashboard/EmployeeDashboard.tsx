import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/auth';
import { collection, query, getDocs, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Route } from '../routes/types';
import { format, isToday, isTomorrow } from 'date-fns';
import { MapPin, Clock, Trophy, Star } from 'lucide-react';
import RouteStopCard from './RouteStopCard';

const EmployeeDashboard = () => {
  const { user, getBusiness } = useAuth();
  const [assignedRoutes, setAssignedRoutes] = useState<Route[]>([]);
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [completedStops, setCompletedStops] = useState<string[]>([]);
  const [stats, setStats] = useState({
    totalStops: 0,
    completedToday: 0,
    weeklyStreak: 0,
    monthlyRating: 4.8,
    points: 750,
    rank: 'Gold',
    nextRankPoints: 1000,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAssignedRoutes = async () => {
      if (!user?.businessId) return;
      try {
        // Load employee data first
        const employeesRef = collection(db, 'businesses', user.businessId, 'employees');
        const employeesQuery = query(employeesRef, where('userId', '==', user.uid));
        const employeesSnapshot = await getDocs(employeesQuery);
        
        if (!employeesSnapshot.empty) {
          const employeeDoc = employeesSnapshot.docs[0];
          setEmployeeData(employeeDoc.data());
        }

        const routesRef = collection(db, 'businesses', user.businessId, 'routes');
        const routesQuery = query(routesRef, where('assignedTech.id', '==', user.uid));
        const routesSnapshot = await getDocs(routesQuery);
        
        const loadedRoutes = routesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Route[];

        setAssignedRoutes(loadedRoutes);
      } catch (err) {
        console.error('Error loading routes:', err);
        setError('Failed to load your assigned routes');
      } finally {
        setLoading(false);
      }
    };

    loadAssignedRoutes();
  }, [user]);

  const handleCompleteStop = async (stopId: string) => {
    setCompletedStops(prev => [...prev, stopId]);
    // Update stop status in database
  };

  const handleAlertCustomer = async (stopId: string, message: string) => {
    // Implement customer alert logic
  };

  const handleGetLocation = (stopId: string) => {
    // Implement navigation/directions logic
  };

  const handleReportIssue = (stopId: string) => {
    // Implement issue reporting logic
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEEE, MMMM d');
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
          Welcome back, {employeeData?.fullName?.split(' ')[0] || 'there'}!
        </h1>
        <p className="text-gray-500">
          Here's your schedule for the next few days
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Today's Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Gamification Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="text-yellow-500" />
            <div>
              <h2 className="text-lg font-semibold">Rank Progress</h2>
              <p className="text-sm text-gray-500">{stats.rank} Tier</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span>{stats.points} points</span>
              <span>{stats.nextRankPoints} points</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                style={{ width: `${(stats.points / stats.nextRankPoints) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="text-primary-600" />
            <div>
              <h2 className="text-lg font-semibold">Today's Progress</h2>
              <p className="text-sm text-gray-500">{stats.completedToday} of {stats.totalStops} stops</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-600 rounded-full transition-all duration-500"
                style={{ width: `${(stats.completedToday / stats.totalStops) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Star className="text-primary-600" />
            <div>
              <h2 className="text-lg font-semibold">Performance</h2>
              <p className="text-sm text-gray-500">{stats.weeklyStreak} day streak</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {/* This would need to be calculated from actual customer data */}
            {stats.monthlyRating}★
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="text-primary-600" />
            <h2 className="text-lg font-semibold">Service Area</h2>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {new Set(assignedRoutes.flatMap(route => route.zipCodes)).size} ZIP codes
          </div>
        </div>
      </div>

      {/* Routes List */}
      <div className="space-y-6">
        {assignedRoutes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">No routes assigned yet</p>
          </div>
        ) : (
          assignedRoutes.map((route) => (
            <div key={route.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{route.name}</h3>
                    <p className="text-sm text-gray-500">{format(new Date(), 'EEEE')}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    route.status === 'active' ? 'bg-primary-100 text-primary-800' :
                    route.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-4">
                  {route.stops.map((stop, index) => (
                    <div key={stop.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{stop.customerName}</h4>
                        <p className="text-sm text-gray-500">{stop.address}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {stop.timeWindow}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;