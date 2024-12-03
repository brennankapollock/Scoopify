import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/auth';
import { Appointment, Route, ViewMode } from './types';
import MonthView from './views/MonthView';
import WeekView from './views/WeekView';
import RouteView from './views/RouteView';
import AppointmentDetails from './AppointmentDetails';
import AppointmentDialog from './AppointmentDialog';
import FilterDialog from './FilterDialog';

const SchedulePage = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadScheduleData = async () => {
      if (!user?.businessId) return;

      try {
        // Load routes
        const routesRef = collection(db, 'businesses', user.businessId, 'routes');
        const routesSnapshot = await getDocs(query(routesRef));
        const loadedRoutes = routesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Route[];
        setRoutes(loadedRoutes);

        // Load appointments
        const appointmentsRef = collection(db, 'businesses', user.businessId, 'appointments');
        const appointmentsSnapshot = await getDocs(query(appointmentsRef));
        const loadedAppointments = appointmentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Appointment[];
        setAppointments(loadedAppointments);
      } catch (error) {
        console.error('Error loading schedule data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadScheduleData();
  }, [user?.businessId]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handlePreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleRouteClick = (routeId: string) => {
    setSelectedRouteId(routeId);
    setViewMode('route');
  };

  const handleBackToMonth = () => {
    setSelectedRouteId(null);
    setViewMode('month');
  };

  const handleSaveAppointment = (appointment: Appointment) => {
    setAppointments(prev => [...prev, appointment]);
  };

  const filteredAppointments = appointments.filter(appointment =>
    appointment.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appointment.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
          Schedule
        </h1>
        <p className="text-sm sm:text-base text-gray-500">
          Manage your appointments and service schedule
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search appointments..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal size={20} className="mr-2" />
            Filters
          </button>
          <button
            onClick={() => setIsNewAppointmentOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Create Appointment
          </button>
        </div>
      </div>

      {/* View Controls */}
      <div className="flex justify-between items-center mb-6">
        {viewMode === 'route' ? (
          <button
            onClick={handleBackToMonth}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft size={20} className="mr-1" />
            Back to Calendar
          </button>
        ) : (
          <>
            <button
              onClick={handlePreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-xl font-semibold">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Calendar View */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {viewMode === 'route' && selectedRouteId ? (
          <RouteView
            date={currentDate}
            route={routes.find(r => r.id === selectedRouteId)!}
            appointments={filteredAppointments.filter(a => a.routeId === selectedRouteId)}
            onAppointmentClick={handleAppointmentClick}
          />
        ) : viewMode === 'week' ? (
          <WeekView
            date={currentDate}
            appointments={filteredAppointments}
            onAppointmentClick={handleAppointmentClick}
          />
        ) : (
          <MonthView
            date={currentDate}
            appointments={filteredAppointments}
            routes={routes}
            onAppointmentClick={handleAppointmentClick}
            onRouteClick={handleRouteClick}
            selectedAppointment={selectedAppointment}
            onClose={() => setSelectedAppointment(null)}
          />
        )}
      </div>

      {/* Dialogs */}
      <FilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />

      <AppointmentDialog
        isOpen={isNewAppointmentOpen}
        onClose={() => setIsNewAppointmentOpen(false)}
        onSave={handleSaveAppointment}
        routes={routes}
      />
    </div>
  );
};

export default SchedulePage;