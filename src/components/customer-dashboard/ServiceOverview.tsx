import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/auth';

const ServiceOverview = () => {
  const { user } = useAuth();
  const isNewCustomer = true; // You can update this based on service history

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-start">
          <Calendar className="text-primary-600 mt-1 mr-3" size={20} />
          <div>
            <p className="text-sm font-medium text-gray-900">Next Service</p>
            {isNewCustomer ? (
              <p className="text-sm text-primary-600">First visit coming soon!</p>
            ) : (
              <p className="text-sm text-gray-500">Thursday, March 28</p>
            )}
          </div>
        </div>

        <div className="flex items-start">
          <Clock className="text-primary-600 mt-1 mr-3" size={20} />
          <div>
            <p className="text-sm font-medium text-gray-900">Service Frequency</p>
            {isNewCustomer ? (
              <p className="text-sm text-gray-500">To be confirmed</p>
            ) : (
              <p className="text-sm text-gray-500">Weekly Service</p>
            )}
          </div>
        </div>

        <div className="flex items-start">
          <MapPin className="text-primary-600 mt-1 mr-3" size={20} />
          <div>
            <p className="text-sm font-medium text-gray-900">Service Address</p>
            <p className="text-sm text-gray-500">{user?.address || 'Address pending'}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-900">Service Status</p>
            {isNewCustomer ? (
              <p className="text-sm text-primary-600">Pending First Visit</p>
            ) : (
              <p className="text-sm text-green-600">Active</p>
            )}
          </div>
          <span className="px-3 py-1 text-sm font-medium text-primary-700 bg-primary-50 rounded-full">
            {isNewCustomer ? 'New Customer' : 'Premium Plan'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ServiceOverview;