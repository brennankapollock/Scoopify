import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Customer } from './types';
import { Route } from '../routes/types';
import { collection, query, getDocs, doc, writeBatch } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/auth';

interface CustomerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer | null;
  onSave: (customer: Customer) => void;
}

const initialCustomer: Customer = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  serviceSelected: 'Weekly Cleanup',
  numberOfDogs: 1,
  totalSpent: 0,
  service: {
    type: 'weekly',
    basePrice: 29.99,
  },
  addOns: [],
  dogs: {
    count: 1,
    details: [{
      name: '',
      breed: '',
      treats: false,
    }],
  },
};

const CustomerDialog: React.FC<CustomerDialogProps> = ({
  isOpen,
  onClose,
  customer,
  onSave,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Customer>(initialCustomer);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

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

        if (customer?.routeId) {
          setSelectedRoute(customer.routeId);
        }
      } catch (error) {
        console.error('Error loading routes:', error);
        setError('Failed to load routes');
      }
    };

    loadRoutes();
  }, [isOpen, user?.businessId, customer]);

  useEffect(() => {
    setFormData(customer ? {
      ...initialCustomer,
      ...customer,
      service: {
        ...initialCustomer.service,
        ...(customer.service || {}),
      },
      dogs: {
        ...initialCustomer.dogs,
        ...(customer.dogs || {}),
      },
      addOns: customer.addOns || [],
    } : initialCustomer);
  }, [customer]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.businessId) return;

    try {
      setError(null);
      setLoading(true);

      // Check if customer is already assigned to a different route
      if (selectedRoute && customer?.routeId && selectedRoute !== customer.routeId) {
        // Only allow multiple routes for twice-weekly customers
        if (formData.service?.type !== 'twice-weekly') {
          setError('Customer can only be assigned to one route unless they have twice-weekly service');
          return;
        }
      }

      const batch = writeBatch(db);

      // Handle customer document
      const customerRef = doc(db, 'businesses', user.businessId, 'customers', formData.id || 'new');
      const customerData = {
        ...formData,
        routeId: selectedRoute || null,
        // Set needsRouteOrdering to true only when customer has no route
        needsRouteOrdering: !selectedRoute,
        previousRouteId: customer?.routeId || null,
        updatedAt: new Date().toISOString(),
      };

      if (!formData.id) {
        customerData.createdAt = new Date().toISOString();
      }

      batch.set(customerRef, customerData, { merge: true });

      // Handle previous route if customer was assigned to one
      if (customer?.routeId) {
        const previousRouteRef = doc(db, 'businesses', user.businessId, 'routes', customer.routeId);
        const previousRoute = routes.find(r => r.id === customer.routeId);
        
        if (previousRoute) {
          const updatedStops = previousRoute.stops.filter(stop => stop.customerId !== customer.id);
          
          batch.update(previousRouteRef, {
            stops: updatedStops,
            totalStops: updatedStops.length,
            updatedAt: new Date().toISOString(),
          });
        }
      }

      // Handle new route assignment if selected
      if (selectedRoute) {
        const newRouteRef = doc(db, 'businesses', user.businessId, 'routes', selectedRoute);
        const selectedRouteData = routes.find(r => r.id === selectedRoute);
        
        if (selectedRouteData) {
          // Only add the customer if they're not already in the stops
          if (!selectedRouteData.stops.some(stop => stop.customerId === customer?.id)) {
            const newStop = {
              id: `${customer?.id || 'new'}-${Date.now()}`,
              customerId: customer?.id || 'new',
              customerName: formData.fullName,
              address: formData.address,
              position: selectedRouteData.stops.length + 1,
              timeWindow: '09:00',
              serviceType: formData.service?.type || 'weekly',
            };

            batch.update(newRouteRef, {
              stops: [...selectedRouteData.stops, newStop],
              totalStops: selectedRouteData.stops.length + 1,
              updatedAt: new Date().toISOString(),
            });
          }
        }
      }

      await batch.commit();
      onSave(customerData);
      onClose();
    } catch (err) {
      console.error('Error saving customer:', err);
      setError('Failed to save customer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {customer ? 'Edit Customer' : 'New Customer'}
            </h3>
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>

            {/* Route Assignment */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Assign to Route
              </label>
              <select
                value={selectedRoute}
                onChange={(e) => setSelectedRoute(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">No Route</option>
                {routes.map((route) => (
                  <option key={route.id} value={route.id}>
                    {route.name} ({route.serviceDay})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Service Plan
              </label>
              <select
                value={formData.serviceSelected}
                onChange={(e) => {
                  const newService = e.target.value;
                  setFormData({ 
                    ...formData, 
                    serviceSelected: newService,
                    service: {
                      ...formData.service,
                      type: newService.toLowerCase().replace(' cleanup', '') as any
                    }
                  });
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="Weekly Cleanup">Weekly Cleanup</option>
                <option value="Twice-Weekly Cleanup">Twice-Weekly Cleanup</option>
                <option value="Bi-Weekly Cleanup">Bi-Weekly Cleanup</option>
                <option value="Monthly Cleanup">Monthly Cleanup</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Number of Dogs
              </label>
              <input
                type="number"
                value={formData.numberOfDogs}
                onChange={(e) => setFormData({ ...formData, numberOfDogs: parseInt(e.target.value) || 0 })}
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
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
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerDialog;