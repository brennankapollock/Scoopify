import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface CustomerData {
  id: string;
  businessId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  serviceType: string;
  dogs: {
    count: number;
    details: {
      name: string;
      breed: string;
      treats: boolean;
      image?: string;
    }[];
  };
  addOns: string[];
  status: 'active' | 'paused' | 'cancelled';
  rewards: {
    points: number;
    referrals: number;
    referralCode: string;
  };
}

interface CustomerContextType {
  customerData: CustomerData | null;
  loading: boolean;
  error: string | null;
  updateCustomerData: (data: Partial<CustomerData>) => Promise<void>;
  pauseService: () => Promise<void>;
  resumeService: () => Promise<void>;
  cancelService: () => Promise<void>;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCustomerData = async () => {
      // Skip loading customer data if no user or on business landing page
      if (!user || window.location.pathname.startsWith('/businesses/')) {
        setLoading(false);
        return;
      }

      try {
        const customerDoc = await getDoc(doc(db, 'customers', user.uid));
        if (customerDoc.exists()) {
          setCustomerData(customerDoc.data() as CustomerData);
        }
      } catch (err) {
        // Only set error if not on business landing page
        if (!window.location.pathname.startsWith('/businesses/')) {
          console.error('Error loading customer data:', err);
          setError('Failed to load customer data');
        }
      } finally {
        setLoading(false);
      }
    };

    loadCustomerData();
  }, [user, window.location.pathname]);

  const updateCustomerData = async (data: Partial<CustomerData>) => {
    if (!user || !customerData) return;

    try {
      const customerRef = doc(db, 'customers', user.uid);
      await updateDoc(customerRef, data);
      setCustomerData({ ...customerData, ...data });
    } catch (err) {
      console.error('Error updating customer data:', err);
      throw new Error('Failed to update customer data');
    }
  };

  const pauseService = async () => {
    await updateCustomerData({ status: 'paused' });
  };

  const resumeService = async () => {
    await updateCustomerData({ status: 'active' });
  };

  const cancelService = async () => {
    await updateCustomerData({ status: 'cancelled' });
  };

  const value = {
    customerData,
    loading,
    error,
    updateCustomerData,
    pauseService,
    resumeService,
    cancelService,
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
};

export default CustomerContext;