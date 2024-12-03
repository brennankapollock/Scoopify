import React, { useState, useEffect } from 'react';
import { Plus, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { collection, query, getDocs, addDoc, doc, updateDoc, where, onSnapshot, writeBatch } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/auth';
import RouteGrid from './RouteGrid';
import RouteDialog from './RouteDialog';
import FilterDialog from './FilterDialog';
import RouteOptimizationDialog from './RouteOptimizationDialog';
import UnassignedCustomers from './UnassignedCustomers';
import { Route, RouteStop } from './types';
import { Employee } from '../employees/types';
import { Customer } from '../customers/types';

const RoutesPage = () => {
  const { user } = useAuth();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [unassignedCustomers, setUnassignedCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [isNewRouteOpen, setIsNewRouteOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isOptimizationOpen, setIsOptimizationOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businessData, setBusinessData] = useState<any>(null);

  const handleAssignEmployee = async (routeId: string, employeeId: string | undefined) => {
    if (!user?.businessId) return;

    try {
      const batch = writeBatch(db);
      
      // Get the route
      const route = routes.find(r => r.id === routeId);
      if (!route) throw new Error('Route not found');

      // If there was a previous employee assigned, update their assignedRoutes
      if (route.assignedTech?.id) {
        const prevEmployee = employees.find(e => e.id === route.assignedTech?.id);
        if (prevEmployee) {
          const employeeRef = doc(db, 'businesses', user.businessId, 'employees', prevEmployee.id);
          batch.update(employeeRef, {
            assignedRoutes: prevEmployee.assignedRoutes?.filter(id => id !== routeId) || [],
            updatedAt: new Date().toISOString()
          });
        }
      }

      // If assigning to a new employee
      if (employeeId) {
        const newEmployee = employees.find(e => e.id === employeeId);
        if (newEmployee) {
          // Update employee's assignedRoutes
          const employeeRef = doc(db, 'businesses', user.businessId, 'employees', employeeId);
          batch.update(employeeRef, {
            assignedRoutes: [...(newEmployee.assignedRoutes || []), routeId],
            updatedAt: new Date().toISOString()
          });

          // Update route with new employee
          const routeRef = doc(db, 'businesses', user.businessId, 'routes', routeId);
          batch.update(routeRef, {
            assignedTech: {
              id: employeeId,
              name: newEmployee.fullName,
              rating: newEmployee.rating || 0
            },
            updatedAt: new Date().toISOString()
          });
        }
      } else {
        // Remove employee assignment from route
        const routeRef = doc(db, 'businesses', user.businessId, 'routes', routeId);
        batch.update(routeRef, {
          assignedTech: null,
          updatedAt: new Date().toISOString()
        });
      }

      await batch.commit();

      // Update local state
      setRoutes(prev => prev.map(r => {
        if (r.id === routeId) {
          return {
            ...r,
            assignedTech: employeeId ? {
              id: employeeId,
              name: employees.find(e => e.id === employeeId)?.fullName || '',
              rating: employees.find(e => e.id === employeeId)?.rating || 0
            } : undefined
          };
        }
        return r;
      }));

    } catch (error) {
      console.error('Error assigning employee to route:', error);
      setError('Failed to assign employee to route');
    }
  };

  useEffect(() => {
    if (!user?.businessId) return;

    // Set up real-time listeners
    const unsubscribeRoutes = onSnapshot(
      collection(db, 'businesses', user.businessId, 'routes'),
      (snapshot) => {
        const loadedRoutes = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Route[];
        setRoutes(loadedRoutes);
      },
      (error) => {
        console.error('Error loading routes:', error);
        setError('Failed to load routes data');
      }
    );

    const unsubscribeCustomers = onSnapshot(
      collection(db, 'businesses', user.businessId, 'customers'),
      async (snapshot) => {
        const loadedCustomers = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Customer[];
        
        // Filter unassigned customers and those needing organization
        const unassigned = loadedCustomers.filter(customer => 
          !customer.routeId || customer.needsRouteOrdering
        );
        
        setUnassignedCustomers(unassigned);

        // Update routes to remove customers that have been unassigned or moved
        const batch = writeBatch(db);
        let needsUpdate = false;

        routes.forEach(route => {
          const updatedStops = route.stops.filter(stop => {
            const customer = loadedCustomers.find(c => c.id === stop.customerId);
            return customer?.routeId === route.id;
          });

          if (updatedStops.length !== route.stops.length) {
            needsUpdate = true;
            const routeRef = doc(db, 'businesses', user.businessId!, 'routes', route.id);
            batch.update(routeRef, { 
              stops: updatedStops,
              totalStops: updatedStops.length,
              updatedAt: new Date().toISOString()
            });
          }
        });

        if (needsUpdate) {
          try {
            await batch.commit();
          } catch (error) {
            console.error('Error updating routes:', error);
          }
        }
      },
      (error) => {
        console.error('Error loading customers:', error);
        setError('Failed to load customer data');
      }
    );

    // Load employees (one-time load is fine for employees)
    const loadEmployees = async () => {
      try {
        const employeesRef = collection(db, 'businesses', user.businessId, 'employees');
        const employeesSnapshot = await getDocs(query(employeesRef));
        const loadedEmployees = employeesSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(emp => emp.status === 'active') as Employee[];
        setEmployees(loadedEmployees);
      } catch (error) {
        console.error('Error loading employees:', error);
        setError('Failed to load employee data');
      }
    };

    loadEmployees();
    setLoading(false);

    // Cleanup listeners
    return () => {
      unsubscribeRoutes();
      unsubscribeCustomers();
    };
  }, [user?.businessId]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSaveRoute = async (route: Route) => {
    if (!user?.businessId) return;

    try {
      setError(null);
      const routesRef = collection(db, 'businesses', user.businessId, 'routes');
      
      if (route.id) {
        // Update existing route
        const routeRef = doc(db, 'businesses', user.businessId, 'routes', route.id);
        await updateDoc(routeRef, {
          ...route,
          updatedAt: new Date().toISOString(),
        });
      } else {
        // Add new route
        await addDoc(routesRef, {
          ...route,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      setSelectedRoute(null);
      setIsNewRouteOpen(false);
    } catch (error) {
      console.error('Error saving route:', error);
      setError('Failed to save route. Please try again.');
    }
  };

  const handleReorderStops = async (routeId: string, stops: RouteStop[]) => {
    if (!user?.businessId) return;

    try {
      const batch = writeBatch(db);
      const routeRef = doc(db, 'businesses', user.businessId, 'routes', routeId);
      
      // Update route stops
      batch.update(routeRef, { 
        stops,
        totalStops: stops.length,
        updatedAt: new Date().toISOString()
      });

      // Update all customers in this route to mark them as organized
      stops.forEach(stop => {
        const customerRef = doc(db, 'businesses', user.businessId!, 'customers', stop.customerId);
        batch.update(customerRef, {
          needsRouteOrdering: false,
          updatedAt: new Date().toISOString()
        });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error updating stops:', error);
      setError('Failed to update route order. Please try again.');
    }
  };

  const handleUnassignCustomer = async (routeId: string, customerId: string) => {
    if (!user?.businessId) return;

    try {
      const batch = writeBatch(db);

      // Update customer document
      const customerRef = doc(db, 'businesses', user.businessId, 'customers', customerId);
      batch.update(customerRef, {
        routeId: null,
        previousRouteId: routeId,
        needsRouteOrdering: false,
        updatedAt: new Date().toISOString()
      });

      // Update route document
      const routeRef = doc(db, 'businesses', user.businessId, 'routes', routeId);
      const route = routes.find(r => r.id === routeId);
      
      if (route) {
        const updatedStops = route.stops.filter(stop => stop.customerId !== customerId);
        batch.update(routeRef, {
          stops: updatedStops,
          totalStops: updatedStops.length,
          updatedAt: new Date().toISOString()
        });
      }

      await batch.commit();
    } catch (error) {
      console.error('Error unassigning customer:', error);
      setError('Failed to unassign customer. Please try again.');
    }
  };

  const handleAssignCustomer = async (customerId: string, routeId: string) => {
    if (!user?.businessId) return;

    try {
      // Check if customer is already in the route
      const selectedRoute = routes.find(r => r.id === routeId);
      if (selectedRoute?.stops.some(stop => stop.customerId === customerId)) {
        setError('Customer is already assigned to this route');
        return;
      }

      // Check if customer is already assigned to another route
      const existingCustomer = unassignedCustomers.find(c => c.id === customerId);
      if (existingCustomer?.routeId && existingCustomer.routeId !== routeId) {
        // Only allow multiple routes for twice-weekly customers
        if (existingCustomer.service?.type !== 'twice-weekly') {
          setError('Customer can only be assigned to one route unless they have twice-weekly service');
          return;
        }
      }

      const batch = writeBatch(db);
      
      // Get the customer and route
      const customerRef = doc(db, 'businesses', user.businessId, 'customers', customerId);
      const routeRef = doc(db, 'businesses', user.businessId, 'routes', routeId);
      const targetRoute = routes.find(r => r.id === routeId);
      
      if (!targetRoute) throw new Error('Route not found');
      if (!existingCustomer) throw new Error('Customer not found');

      // If customer was previously in a different route, update that route's stops
      if (existingCustomer.previousRouteId) {
        const previousRoute = routes.find(r => r.id === existingCustomer.previousRouteId);
        if (previousRoute) {
          const previousRouteRef = doc(db, 'businesses', user.businessId, 'routes', existingCustomer.previousRouteId);
          const updatedStops = previousRoute.stops.filter(stop => stop.customerId !== customerId);
          
          batch.update(previousRouteRef, {
            stops: updatedStops,
            totalStops: updatedStops.length,
            updatedAt: new Date().toISOString()
          });
        }
      }

      // Create new stop
      const newStop: RouteStop = {
        id: `${customerId}-${Date.now()}`,
        customerId,
        customerName: existingCustomer.fullName,
        address: existingCustomer.address,
        position: targetRoute.stops.length + 1,
        timeWindow: '09:00', // Default time window
        serviceType: existingCustomer.service?.type || 'weekly',
      };

      // Update route with new stop
      const updatedStops = [...targetRoute.stops, newStop];
      batch.update(routeRef, {
        stops: updatedStops,
        totalStops: updatedStops.length,
        updatedAt: new Date().toISOString()
      });

      // Update customer with route assignment
      batch.update(customerRef, {
        routeId,
        needsRouteOrdering: false,
        previousRouteId: existingCustomer.routeId || null,
        updatedAt: new Date().toISOString()
      });

      await batch.commit();
    } catch (error) {
      console.error('Error assigning customer to route:', error);
      setError('Failed to assign customer to route. Please try again.');
    }
  };

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
          Routes
        </h1>
        <p className="text-sm sm:text-base text-gray-500">
          Manage and optimize your service routes
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search routes..."
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
            onClick={() => setIsOptimizationOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            <Sparkles size={20} className="mr-2" />
            Optimize Routes✨
          </button>
          <button
            onClick={() => setIsNewRouteOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Create Route
          </button>
        </div>
      </div>

      {/* Unassigned Customers Section */}
      {unassignedCustomers.length > 0 && (
        <div className="mb-8">
          <UnassignedCustomers
            customers={unassignedCustomers}
            routes={routes}
            onAssignToRoute={handleAssignCustomer}
          />
        </div>
      )}

      {/* Routes Grid */}
      <RouteGrid
        routes={routes}
        employees={employees}
        onRouteClick={setSelectedRoute}
        onReorderStops={handleReorderStops}
        onUnassignCustomer={handleUnassignCustomer}
        onAssignEmployee={handleAssignEmployee}
      />

      {/* Route Dialog */}
      <RouteDialog
        isOpen={selectedRoute !== null || isNewRouteOpen}
        onClose={() => {
          setSelectedRoute(null);
          setIsNewRouteOpen(false);
        }}
        route={selectedRoute}
        onSave={handleSaveRoute}
        businessData={businessData}
        employees={employees}
      />

      {/* Filter Dialog */}
      <FilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />

      {/* Route Optimization Dialog */}
      <RouteOptimizationDialog
        isOpen={isOptimizationOpen}
        onClose={() => setIsOptimizationOpen(false)}
        routes={routes}
        onSaveRoute={handleReorderStops}
      />
    </div>
  );
};

export default RoutesPage;