import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, MapPin, Calendar, Heart, Award, Clock, DollarSign, FileText, Route as RouteIcon } from 'lucide-react';
import { Employee } from './types';
import { Route } from '../routes/types';
import { format } from 'date-fns';
import { collection, query, getDocs, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/auth';

interface EmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employee?: Employee | null;
  onSave: (employee: Employee) => void;
}

const EmployeeDialog: React.FC<EmployeeDialogProps> = ({
  isOpen,
  onClose,
  employee,
  onSave,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState('info');
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assignedRoutes, setAssignedRoutes] = useState<string[]>([]);

  // Initialize assigned routes when employee data changes
  useEffect(() => {
    if (employee?.assignedRoutes) {
      setAssignedRoutes(employee.assignedRoutes);
    }
  }, [employee]);

  useEffect(() => {
    if (employee) {
      setFormData(employee);
    }
  }, [employee]);

  useEffect(() => {
    const loadRoutes = async () => {
      if (!user?.businessId) return;

      try {
        const routesRef = collection(db, 'businesses', user.businessId, 'routes');
        const routesSnapshot = await getDocs(query(routesRef));
        const loadedRoutes = routesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Route[];
        setRoutes(loadedRoutes);
      } catch (error) {
        console.error('Error loading routes:', error);
      }
    };

    loadRoutes();
  }, [user?.businessId]);

  if (!isOpen || !formData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const batch = writeBatch(db);

    try {
      if (!user?.businessId || !formData.id) throw new Error('Missing required data');

      // Update employee document with new route assignments
      const employeeRef = doc(db, 'businesses', user.businessId, 'employees', formData.id);
      batch.update(employeeRef, {
        ...formData,
        assignedRoutes,
        updatedAt: new Date().toISOString()
      });

      // Update all routes to remove this employee if they were previously assigned
      const routesRef = collection(db, 'businesses', user.businessId, 'routes');
      const routesSnapshot = await getDocs(query(routesRef));
      
      routesSnapshot.docs.forEach(routeDoc => {
        const route = routeDoc.data();
        if (route.assignedTech?.id === formData.id) {
          // Only update if this route is no longer in assignedRoutes
          if (!assignedRoutes.includes(routeDoc.id)) {
            batch.update(doc(routesRef, routeDoc.id), {
              assignedTech: null,
              updatedAt: new Date().toISOString()
            });
          }
        }
      });

      // Update newly assigned routes with this employee
      for (const routeId of assignedRoutes) {
        batch.update(doc(routesRef, routeId), {
          assignedTech: {
            id: formData.id,
            name: formData.fullName,
            rating: formData.rating || 0
          },
          updatedAt: new Date().toISOString()
        });
      }

      await batch.commit();
      onSave({
        ...formData,
        assignedRoutes: assignedRoutes
      });
    } catch (error) {
      console.error('Error saving employee:', error);
      setError('Failed to save changes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'info', label: 'Basic Info', icon: Mail },
    { id: 'work', label: 'Work Details', icon: Award },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'personality', label: 'Personality', icon: Heart },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {employee ? 'Edit Employee' : 'Employee Details'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={24} />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-2 border-b-2 text-sm font-medium ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={16} className="mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            {activeTab === 'info' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <div className="mt-1 text-gray-900">{formData.fullName}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="mt-1 text-gray-900">{formData.email}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <div className="mt-1 text-gray-900">{formData.phone}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <div className="mt-1 text-gray-900">{formData.address}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <div className="mt-1 text-gray-900">
                      {formData.dateOfBirth ? format(new Date(formData.dateOfBirth), 'MMM d, yyyy') : 'Not provided'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <div className="mt-1 text-gray-900">
                      {format(new Date(formData.startDate), 'MMM d, yyyy')}
                    </div>
                  </div>
                </div>

                {formData.emergencyContact && (
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Emergency Contact</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <div className="mt-1 text-gray-900">{formData.emergencyContact.name}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Relationship</label>
                        <div className="mt-1 text-gray-900">{formData.emergencyContact.relationship}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <div className="mt-1 text-gray-900">{formData.emergencyContact.phone}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Work Details */}
            {activeTab === 'work' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Position</label>
                    <select
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    >
                      <option value="Yard Technician">Yard Technician</option>
                      <option value="Senior Technician">Senior Technician</option>
                      <option value="Team Lead">Team Lead</option>
                      <option value="Route Manager">Route Manager</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as Employee['status'] })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    >
                      <option value="active">Active</option>
                      <option value="on-leave">On Leave</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pay Type</label>
                    <select
                      value={formData.payType}
                      onChange={(e) => setFormData({ ...formData, payType: e.target.value as 'hourly' | 'salary' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    >
                      <option value="hourly">Hourly</option>
                      <option value="salary">Salary</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pay Rate</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        value={formData.payRate || ''}
                        onChange={(e) => setFormData({ ...formData, payRate: parseFloat(e.target.value) })}
                        className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                {/* Assigned Routes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Routes</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {routes.map((route) => {
                      const isAssigned = assignedRoutes.includes(route.id);
                      return (
                      <label
                        key={route.id}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                         isAssigned
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isAssigned}
                          onChange={() => {
                           setAssignedRoutes(prev =>
                             prev.includes(route.id)
                               ? prev.filter(id => id !== route.id)
                               : [...prev, route.id]
                           );
                          }}
                          className="sr-only"
                        />
                        <RouteIcon 
                          size={14} 
                          className={
                           isAssigned
                             ? 'text-primary-600'
                             : 'text-gray-400'
                          } 
                        />
                        <span className="ml-1">{route.name}</span>
                        {isAssigned && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setAssignedRoutes(prev => prev.filter(id => id !== route.id));
                            }}
                            className="ml-2 text-primary-600 hover:text-primary-800"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </label>
                    )})}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Performance Metrics</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Yards Completed</label>
                      <input
                        type="number"
                        value={formData.yardsCompleted || 0}
                        onChange={(e) => setFormData({ ...formData, yardsCompleted: parseInt(e.target.value) })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Rating</label>
                      <input
                        type="number"
                        value={formData.rating || 0}
                        onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        min="0"
                        max="5"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Performance Score</label>
                      <input
                        type="number"
                        value={formData.performanceScore || 0}
                        onChange={(e) => setFormData({ ...formData, performanceScore: parseInt(e.target.value) })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Schedule */}
            {activeTab === 'schedule' && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Weekly Availability</h4>
                {Object.entries(formData.availability || {}).map(([day, { available }]) => (
                  <label key={day} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={available}
                      onChange={(e) => setFormData({
                        ...formData,
                        availability: {
                          ...formData.availability,
                          [day]: { available: e.target.checked },
                        },
                      })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{day}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Documents */}
            {activeTab === 'documents' && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Required Documents</h4>
                {Object.entries(formData.documents || {}).map(([doc, completed]) => (
                  <label key={doc} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={completed}
                      onChange={(e) => setFormData({
                        ...formData,
                        documents: {
                          ...formData.documents,
                          [doc]: e.target.checked,
                        },
                      })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {doc === 'w4' ? 'W-4 Form' :
                       doc === 'i9' ? 'I-9 Form' :
                       doc === 'driversLicense' ? "Driver's License" :
                       'Direct Deposit Form'}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {/* Personality */}
            {activeTab === 'personality' && formData.personalityProfile && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Favorite Food</label>
                  <div className="mt-1 text-gray-900">{formData.personalityProfile.favoriteFood}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Appreciation Style</label>
                  <div className="mt-1 text-gray-900">{formData.personalityProfile.appreciationStyle}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Work Style</label>
                  <div className="mt-1 text-gray-900">{formData.personalityProfile.workStyle}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hobbies</label>
                  <div className="mt-1 text-gray-900">{formData.personalityProfile.hobbies}</div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDialog;