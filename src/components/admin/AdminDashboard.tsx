import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Users, Building2, DollarSign, MessageSquare } from 'lucide-react';
import MessageDialog from './MessageDialog';

interface BusinessMetrics {
  id: string;
  businessName: string;
  email: string;
  customerCount: number;
  employeeCount: number;
  monthlyRevenue: number;
  status: string;
  createdAt: string;
  lastActivity?: string;
}

const AdminDashboard = () => {
  const [businesses, setBusinesses] = useState<BusinessMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessMetrics | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated) return;

      try {
        const businessesRef = collection(db, 'businesses');
        const businessesSnapshot = await getDocs(query(businessesRef));
        
        const businessMetrics: BusinessMetrics[] = [];
        
        for (const businessDoc of businessesSnapshot.docs) {
          const businessData = businessDoc.data();
          
          // Get customer count
          const customersRef = collection(db, 'businesses', businessDoc.id, 'customers');
          const customersSnapshot = await getDocs(query(customersRef));
          const customerCount = customersSnapshot.docs.length;
          
          // Get employee count
          const employeesRef = collection(db, 'businesses', businessDoc.id, 'employees');
          const employeesSnapshot = await getDocs(query(employeesRef));
          const employeeCount = employeesSnapshot.docs.length;
          
          // Calculate monthly revenue
          const monthlyRevenue = customersSnapshot.docs.reduce((total, customer) => {
            const customerData = customer.data();
            return total + (customerData.service?.basePrice || 0);
          }, 0);
          
          businessMetrics.push({
            id: businessDoc.id,
            businessName: businessData.businessName,
            email: businessData.email,
            customerCount,
            employeeCount,
            monthlyRevenue,
            status: 'active',
            createdAt: businessData.createdAt,
            lastActivity: businessData.updatedAt,
          });
        }
        
        setBusinesses(businessMetrics);
      } catch (err) {
        console.error('Error loading business data:', err);
        setError('Failed to load business data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'password') {
      setIsAuthenticated(true);
    } else {
      setError('Invalid password');
    }
  };

  const calculatePaidCustomers = (customerCount: number) => {
    // Assume businesses with >20 customers are paid
    return customerCount > 20 ? customerCount : 0;
  };

  const calculateFreeCustomers = (customerCount: number) => {
    // First 20 customers are free
    return Math.min(customerCount, 20);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Admin Dashboard
          </h1>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalCustomers = businesses.reduce((sum, b) => sum + b.customerCount, 0);
  const totalFreeCustomers = businesses.reduce((sum, b) => sum + calculateFreeCustomers(b.customerCount), 0);
  const totalPaidCustomers = businesses.reduce((sum, b) => sum + calculatePaidCustomers(b.customerCount), 0);
  const monthlyRevenue = totalPaidCustomers * 249; // $249 per paid business

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Scoopify Admin Dashboard
        </h1>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4">
              <Building2 className="w-12 h-12 text-primary-600" />
              <div>
                <p className="text-sm text-gray-500">Total Businesses</p>
                <p className="text-2xl font-bold text-gray-900">{businesses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4">
              <Users className="w-12 h-12 text-emerald-600" />
              <div>
                <p className="text-sm text-gray-500">Free Customers</p>
                <p className="text-2xl font-bold text-gray-900">{totalFreeCustomers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4">
              <Users className="w-12 h-12 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Paid Customers</p>
                <p className="text-2xl font-bold text-gray-900">{totalPaidCustomers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4">
              <DollarSign className="w-12 h-12 text-emerald-600" />
              <div>
                <p className="text-sm text-gray-500">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${monthlyRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Businesses Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Business Overview
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customers
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employees
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monthly Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time Using Scoopify
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Activity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {businesses.map((business) => (
                  <tr key={business.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {business.businessName}
                        <button
                          onClick={() => setSelectedBusiness(business)}
                          className="ml-2 text-primary-600 hover:text-primary-700"
                        >
                          <MessageSquare size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {business.customerCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {business.employeeCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${business.monthlyRevenue.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        {business.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(() => {
                        const created = new Date(business.createdAt);
                        const now = new Date();
                        const diffTime = Math.abs(now.getTime() - created.getTime());
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        const diffMonths = Math.floor(diffDays / 30);
                        const diffYears = Math.floor(diffDays / 365);
                        
                        if (diffYears > 0) {
                          return `${diffYears} ${diffYears === 1 ? 'year' : 'years'}`;
                        } else if (diffMonths > 0) {
                          return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'}`;
                        } else {
                          return `${diffDays} ${diffDays === 1 ? 'day' : 'days'}`;
                        }
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {business.lastActivity 
                        ? new Date(business.lastActivity).toLocaleString()
                        : 'No activity'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Message Dialog */}
        <MessageDialog
          isOpen={selectedBusiness !== null}
          onClose={() => setSelectedBusiness(null)}
          businessName={selectedBusiness?.businessName || ''}
          businessEmail={selectedBusiness?.email || ''}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;