import React, { useState } from 'react';
import { X, MapPin, User, Map as MapIcon } from 'lucide-react';
import { Route, RouteEndpoint } from './types';
import { Employee } from '../employees/types';
import { collection, query, getDocs, doc, writeBatch, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/auth';
import MapView from './MapView';

interface RouteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  route?: Route | null;
  onSave: (route: Route) => void;
  businessData: BusinessOnboardingData;
  employees: Employee[];
}

const initialRoute: Omit<Route, 'id'> = {
  name: '',
  color: '#4F46E5',
  neighborhoods: [],
  zipCodes: [],
  assignedTech: undefined,
  stops: [],
  status: 'active',
  efficiency: 100,
  totalStops: 0,
  estimatedDuration: '0 hours',
  serviceDay: 'monday',
  startPoint: undefined,
  endPoint: undefined,
};

const days = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

const RouteDialog: React.FC<RouteDialogProps> = ({
  isOpen,
  onClose,
  route,
  onSave,
  businessData,
  employees,
}) => {
  const [formData, setFormData] = useState<Omit<Route, 'id'>>(route || initialRoute);
  const [selectedDay, setSelectedDay] = useState<string>(route?.serviceDay || 'monday');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'form' | 'map'>('form');
  const [selectedEmployee, setSelectedEmployee] = useState<string | undefined>(route?.assignedTech?.id);

  if (!isOpen) return null;

  const sanitizeRouteData = (data: Omit<Route, 'id'>) => {
    return {
      name: data.name.trim(),
      color: data.color,
      neighborhoods: data.neighborhoods || [],
      zipCodes: data.zipCodes || [],
      assignedTech: data.assignedTech,
      stops: data.stops || [],
      status: data.status || 'active',
      efficiency: Number(data.efficiency) || 100,
      totalStops: Number(data.totalStops) || 0,
      estimatedDuration: data.estimatedDuration || '0 hours',
      serviceDay: data.serviceDay,
      startPoint: data.startPoint,
      endPoint: data.endPoint,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const batch = writeBatch(db);

    try {
      if (!user?.businessId) throw new Error('Missing business ID');

      // If changing assigned tech, update the previous employee's assignedRoutes
      if (route?.assignedTech?.id && route.assignedTech.id !== selectedEmployee) {
        const prevEmployeeRef = doc(db, 'businesses', user.businessId, 'employees', route.assignedTech.id);
        const prevEmployeeDoc = await getDoc(prevEmployeeRef);
        
        if (prevEmployeeDoc.exists()) {
          const prevEmployee = prevEmployeeDoc.data();
          batch.update(prevEmployeeRef, {
            assignedRoutes: (prevEmployee.assignedRoutes || []).filter((id: string) => id !== route.id),
            updatedAt: new Date().toISOString()
          });
        }
      }

      // If assigning to new employee, update their assignedRoutes
      if (selectedEmployee && selectedEmployee !== route?.assignedTech?.id) {
        const newEmployeeRef = doc(db, 'businesses', user.businessId, 'employees', selectedEmployee);
        const newEmployeeDoc = await getDoc(newEmployeeRef);
        
        if (newEmployeeDoc.exists()) {
          const newEmployee = newEmployeeDoc.data();
          batch.update(newEmployeeRef, {
            assignedRoutes: [...(newEmployee.assignedRoutes || []), route?.id || 'new'],
            updatedAt: new Date().toISOString()
          });
        }
      }

      const sanitizedData = sanitizeRouteData(formData);
      
      // Add route update to batch
      const routeData = route ? { ...sanitizedData, id: route.id } : sanitizedData as Route;
      const routeRef = route?.id 
        ? doc(db, 'businesses', user.businessId, 'routes', route.id)
        : doc(collection(db, 'businesses', user.businessId, 'routes'));
        
      batch.set(routeRef, {
        ...routeData,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      await batch.commit();
      onSave(routeData);
      onClose();
    } catch (err) {
      console.error('Error saving route:', err);
      setError('Failed to save route. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOrder = (newStops: RouteStop[]) => {
    setFormData(prev => ({
      ...prev,
      stops: newStops
    }));
  };

  const handleUpdateEndpoints = (startPoint: RouteEndpoint | null, endPoint: RouteEndpoint | null) => {
    setFormData(prev => ({
      ...prev,
      startPoint: startPoint || prev.startPoint,
      endPoint: endPoint || prev.endPoint
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-6xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-medium text-gray-900">
                {route ? 'Edit Route' : 'Create New Route'}
              </h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setView('form')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    view === 'form'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Details
                </button>
                <button
                  type="button"
                  onClick={() => setView('map')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    view === 'map'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <MapIcon size={16} className="inline mr-1" />
                  Map View
                </button>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={24} />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {view === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Route Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Service Day
                </label>
                <select
                  value={selectedDay}
                  onChange={(e) => {
                    setSelectedDay(e.target.value);
                    setFormData(prev => ({
                      ...prev,
                      serviceDay: e.target.value,
                      zipCodes: [],
                    }));
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                >
                  {days.map((day) => (
                    <option 
                      key={day} 
                      value={day}
                      disabled={!businessData?.schedulingPreferences?.availableDays?.includes(day)}
                    >
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Assigned Technician
                </label>
                <div className="mt-1 space-y-3">
                  {employees.map((employee) => (
                    <label
                      key={employee.id}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedEmployee === employee.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="assignedTech"
                        checked={selectedEmployee === employee.id}
                        onChange={() => {
                          setSelectedEmployee(employee.id);
                          setFormData(prev => {
                            const updatedData = {
                              ...prev,
                              assignedTech: employee.id ? {
                                id: employee.id,
                                name: employee.fullName,
                                rating: employee.rating || 0
                              } : undefined
                            };
                            return updatedData;
                          });
                        }}
                        className="sr-only"
                      />
                      <User 
                        size={20} 
                        className={selectedEmployee === employee.id ? 'text-primary-600' : 'text-gray-400'} 
                      />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{employee.fullName}</p>
                        <p className="text-xs text-gray-500">{employee.position}</p>
                      </div>
                      {selectedEmployee === employee.id && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedEmployee(undefined);
                            setFormData(prev => {
                              const updatedData = { ...prev, assignedTech: undefined };
                              return updatedData;
                            });
                          }}
                          className="ml-auto text-gray-400 hover:text-red-500"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Service Areas
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {businessData?.schedulingPreferences?.dayZones?.[selectedDay]?.zipCodes?.map((zipCode) => (
                    <label
                      key={zipCode}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                        formData.zipCodes.includes(zipCode)
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.zipCodes.includes(zipCode)}
                        onChange={() => {
                          setFormData(prev => ({
                            ...prev,
                            zipCodes: prev.zipCodes.includes(zipCode)
                              ? prev.zipCodes.filter(z => z !== zipCode)
                              : [...prev.zipCodes, zipCode]
                          }));
                        }}
                        className="sr-only"
                      />
                      <MapPin size={14} className="mr-1" />
                      {zipCode}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Route Color
                </label>
                <div className="mt-1 flex gap-3">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="h-10 w-20 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Route'}
                </button>
              </div>
            </form>
          ) : (
            <MapView
              route={route || { ...formData, id: 'new' }}
              onSaveOrder={handleSaveOrder}
              onUpdateEndpoints={handleUpdateEndpoints}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteDialog;