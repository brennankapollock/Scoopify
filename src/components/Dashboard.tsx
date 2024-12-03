import React, { useState, useEffect } from 'react';
import {
  Users,
  DollarSign,
  UserMinus,
  Mail,
  Gift,
  FileText,
  TrendingUp,
  Link as LinkIcon,
  Copy,
  CheckCircle,
} from 'lucide-react';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/auth';
import StatsCard from './StatsCard';
import RevenueChart from './RevenueChart';
import TopPerformers from './TopPerformers';
import QuickActions from './QuickActions';
import { Customer } from './customers/types';
import { Employee } from './employees/types';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCustomers: '0',
    monthlyRevenue: '$0',
    churnRate: '0%'
  });
  const [topCustomers, setTopCustomers] = useState<Customer[]>([]);
  const [topEmployees, setTopEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user?.businessId) return;

      try {
        // Get all customers
        const customersRef = collection(db, 'businesses', user.businessId, 'customers');
        const customersSnapshot = await getDocs(query(customersRef));
        
        const customers = customersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Customer[];

        // Total number of customers (including all statuses)
        const totalCustomers = customers.length;

        // Calculate monthly revenue from active customers
        const activeCustomers = customers.filter(customer => 
          customer.status === 'active' || !customer.status // Include customers without status
        );
        
        let monthlyRevenue = activeCustomers.reduce((total, customer) => 
          total + (customer.service?.basePrice || 0), 0
        );

        // Calculate churn rate
        const cancelledCustomers = customers.filter(customer => 
          customer.status === 'cancelled'
        ).length;

        const churnRate = totalCustomers > 0 
          ? ((cancelledCustomers / totalCustomers) * 100).toFixed(1)
          : '0';

        setStats({
          totalCustomers: totalCustomers.toString(),
          monthlyRevenue: `$${monthlyRevenue.toFixed(2)}`,
          churnRate: `${churnRate}%`
        });

        // Get top customers by total spent
        const sortedCustomers = [...activeCustomers].sort((a, b) => 
          (b.totalSpent || 0) - (a.totalSpent || 0)
        ).slice(0, 3);
        setTopCustomers(sortedCustomers);

        // Get top employees
        const employeesRef = collection(db, 'businesses', user.businessId, 'employees');
        const employeesSnapshot = await getDocs(query(employeesRef, orderBy('yardsCompleted', 'desc'), limit(3)));
        const topEmployees = employeesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Employee[];
        setTopEmployees(topEmployees);

      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.businessId]);

  const businessLinks = [
    {
      title: 'Business Landing Page',
      description: 'Share your business landing page',
      path: `/businesses/${user?.businessId}`,
    },
    {
      title: 'Customer Onboarding',
      description: 'Direct link for new customers',
      path: `/businesses/${user?.businessId}/onboard`,
    },
    {
      title: 'Employee Onboarding',
      description: 'Direct link for new employees',
      path: `/businesses/${user?.businessId}/employees/onboard`,
    },
    {
      title: 'Customer Login',
      description: 'Login page for existing customers',
      path: `/businesses/${user?.businessId}/login`,
    },
  ];

  const copyLink = (path: string) => {
    const url = `https://scoopify.netlify.app${path}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(path);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  const statsConfig = [
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      change: '+12%',
      trend: 'up' as const,
      icon: Users,
    },
    {
      title: 'Revenue (Month)',
      value: stats.monthlyRevenue,
      change: '+8.2%',
      trend: 'up' as const,
      icon: DollarSign,
    },
    {
      title: 'Churn Rate',
      value: stats.churnRate,
      change: '-0.8%',
      trend: 'down' as const,
      icon: UserMinus,
    },
  ];

  const quickActions = [
    {
      title: 'Adjust Prices',
      description: 'Update service pricing',
      icon: DollarSign,
      color: 'bg-blue-500',
    },
    {
      title: 'Email Blast',
      description: 'Send updates to customers',
      icon: Mail,
      color: 'bg-purple-500',
    },
    {
      title: 'Employee Appreciation',
      description: 'Recognize top performers',
      icon: Gift,
      color: 'bg-pink-500',
    },
    {
      title: 'Generate Reports',
      description: 'View business analytics',
      icon: FileText,
      color: 'bg-primary-500',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
          Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-500">
          Welcome back! Here's what's happening with your business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {statsConfig.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Business Links */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 sm:mb-8">
        <div className="flex items-center gap-2 mb-4">
          <LinkIcon className="text-primary-600" size={24} />
          <h2 className="text-lg font-medium text-gray-900">Business Links</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {businessLinks.map((link) => (
            <div
              key={link.path}
              className="p-4 bg-gray-50 rounded-lg flex items-start justify-between group hover:bg-gray-100 transition-colors"
            >
              <div>
                <h3 className="font-medium text-gray-900">{link.title}</h3>
                <p className="text-sm text-gray-500">{link.description}</p>
                <p className="text-xs text-gray-400 mt-1 break-all">
                  https://scoopify.netlify.app{link.path}
                </p>
              </div>
              <button
                onClick={() => copyLink(link.path)}
                className="shrink-0 p-2 text-gray-400 hover:text-primary-600 transition-colors"
              >
                {copiedLink === link.path ? (
                  <CheckCircle size={20} className="text-green-500" />
                ) : (
                  <Copy size={20} />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-medium text-gray-900">Revenue Growth</h2>
          <TrendingUp className="text-primary-600" />
        </div>
        <div className="h-[300px] sm:h-[400px]">
          <RevenueChart />
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        {/* Top Customers */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Top Customers</h2>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 sm:py-3 px-4 text-xs sm:text-sm font-medium text-gray-500">
                      Name
                    </th>
                    <th className="text-left py-2 sm:py-3 px-4 text-xs sm:text-sm font-medium text-gray-500">
                      Revenue
                    </th>
                    <th className="text-left py-2 sm:py-3 px-4 text-xs sm:text-sm font-medium text-gray-500">
                      Service
                    </th>
                    <th className="text-left py-2 sm:py-3 px-4 text-xs sm:text-sm font-medium text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topCustomers.length > 0 ? (
                    topCustomers.map((customer) => (
                      <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm text-gray-900">
                          {customer.fullName}
                        </td>
                        <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm text-gray-500">
                          ${(customer.totalSpent || 0).toFixed(2)}
                        </td>
                        <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm text-gray-500">
                          {customer.service?.type || 'N/A'}
                        </td>
                        <td className="py-2 sm:py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${
                            customer.status === 'active'
                              ? 'bg-primary-100 text-primary-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {customer.status || 'Active'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">
                        No customer data available yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top Employees */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Top Employees</h2>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 sm:py-3 px-4 text-xs sm:text-sm font-medium text-gray-500">
                      Name
                    </th>
                    <th className="text-left py-2 sm:py-3 px-4 text-xs sm:text-sm font-medium text-gray-500">
                      Score
                    </th>
                    <th className="text-left py-2 sm:py-3 px-4 text-xs sm:text-sm font-medium text-gray-500">
                      Routes
                    </th>
                    <th className="text-left py-2 sm:py-3 px-4 text-xs sm:text-sm font-medium text-gray-500">
                      Rating
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topEmployees.length > 0 ? (
                    topEmployees.map((employee) => (
                      <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm text-gray-900">
                          {employee.fullName}
                        </td>
                        <td className="py-2 sm:py-3 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-primary-100 text-primary-800">
                            {employee.performanceScore || 'N/A'}
                          </span>
                        </td>
                        <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm text-gray-500">
                          {(employee.assignedRoutes?.length || 0)} routes
                        </td>
                        <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm text-gray-500">
                          {employee.rating ? `${employee.rating.toFixed(1)}★` : 'N/A'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">
                        No employee data available yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6 sm:mt-8">
        {quickActions.map((action) => (
          <QuickActions key={action.title} {...action} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;