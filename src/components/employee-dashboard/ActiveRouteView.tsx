import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Route } from '../routes/types';
import { ArrowLeft } from 'lucide-react';
import RouteStopCard from './RouteStopCard';

const ActiveRouteView = () => {
  const { routeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [route, setRoute] = useState<Route | null>(null);
  const [completedStops, setCompletedStops] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    const loadRoute = async () => {
      if (!user?.businessId || !routeId) return;

      try {
        const routeRef = doc(db, 'businesses', user.businessId, 'routes', routeId);
        const routeDoc = await getDoc(routeRef);
        
        if (routeDoc.exists()) {
          setRoute({ id: routeDoc.id, ...routeDoc.data() } as Route);
        } else {
          setError('Route not found');
        }
      } catch (err) {
        console.error('Error loading route:', err);
        setError('Failed to load route details');
      } finally {
        setLoading(false);
      }
    };

    loadRoute();
  }, [user, routeId]);

  const handleCompleteStop = async (stopId: string) => {
    setCompletedStops(prev => [...prev, stopId]);
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

  if (error || !route) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {error || 'Route not found'}
        </div>
      </div>
    );
  }

  const activeStops = route.stops.filter(stop => !completedStops.includes(stop.id));
  const completedStopsList = route.stops.filter(stop => completedStops.includes(stop.id));

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/employee/routes')}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">
            {route.name}
          </h1>
          <p className="text-gray-500">
            {activeStops.length} stops remaining
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-500">Progress</span>
          <span className="text-gray-900 font-medium">
            {completedStops.length}/{route.stops.length} stops
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 rounded-full transition-all duration-500"
            style={{ width: `${(completedStops.length / route.stops.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Active Stops */}
      <div className="space-y-4 mb-8">
        <h2 className="text-lg font-semibold text-gray-900">
          Active Stops ({activeStops.length})
        </h2>
        {activeStops.map(stop => (
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

      {/* Completed Stops */}
      {completedStopsList.length > 0 && (
        <div className="border-t border-gray-200 pt-8">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          >
            {showCompleted ? 'Hide' : 'Show'} {completedStopsList.length} completed stops
          </button>
          
          {showCompleted && (
            <div className="mt-4 space-y-4 opacity-60">
              {completedStopsList.map(stop => (
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
  );
};

export default ActiveRouteView;