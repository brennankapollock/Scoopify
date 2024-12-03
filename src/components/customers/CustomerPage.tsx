import React, { useState, useEffect } from 'react';
import { Plus, Search, SlidersHorizontal } from 'lucide-react';
import CustomerCard from './CustomerCard';
import CustomerDialog from './CustomerDialog';
import FilterDialog from './FilterDialog';
import { Customer } from './types';
import { useAuth } from '../../contexts/auth';
import { collection, query, getDocs, doc, setDoc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Route } from '../routes/types';

const CustomerPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
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

        // Load customers
        const customersRef = collection(db, 'businesses', user.businessId, 'customers');
        const customersSnapshot = await getDocs(query(customersRef));
        const loadedCustomers = customersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Customer[];

        setCustomers(loadedCustomers);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.businessId]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSaveCustomer = async (customer: Customer) => {
    if (!user?.businessId) return;

    try {
      const customersRef = collection(db, 'businesses', user.businessId, 'customers');
      
      if (customer.id) {
        // Update existing customer
        const customerDoc = doc(customersRef, customer.id);
        await updateDoc(customerDoc, customer);
        setCustomers(prev => prev.map(c => c.id === customer.id ? customer : c));
      } else {
        // Add new customer
        const docRef = await addDoc(customersRef, {
          ...customer,
          createdAt: new Date().toISOString(),
          totalSpent: 0,
        });
        const newCustomer = { ...customer, id: docRef.id };
        setCustomers(prev => [...prev, newCustomer]);
      }
      
      setSelectedCustomer(null);
      setIsNewCustomerOpen(false);
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  const getRouteName = (routeId?: string) => {
    if (!routeId) return undefined;
    const route = routes.find(r => r.id === routeId);
    return route?.name;
  };

  const filteredCustomers = customers.filter(customer =>
    customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
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
          Customers
        </h1>
        <p className="text-sm sm:text-base text-gray-500">
          Manage your customer relationships
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search customers..."
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
            onClick={() => setIsNewCustomerOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            New Customer
          </button>
        </div>
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredCustomers.map((customer) => (
          <CustomerCard
            key={customer.id}
            customer={customer}
            onClick={() => setSelectedCustomer(customer)}
            routeName={getRouteName(customer.routeId)}
          />
        ))}
      </div>

      {/* Customer Dialog */}
      <CustomerDialog
        isOpen={selectedCustomer !== null || isNewCustomerOpen}
        onClose={() => {
          setSelectedCustomer(null);
          setIsNewCustomerOpen(false);
        }}
        customer={selectedCustomer}
        onSave={handleSaveCustomer}
      />

      {/* Filter Dialog */}
      <FilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
    </div>
  );
};

export default CustomerPage;