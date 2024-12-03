import React from 'react';
import { Mail, Phone, MapPin, Dog, Route } from 'lucide-react';
import { Customer } from './types';

interface CustomerCardProps {
  customer: Customer;
  onClick: () => void;
  routeName?: string;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onClick, routeName }) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {customer.fullName}
        </h3>
        
        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <Mail size={16} className="mr-2" />
            <span className="text-sm truncate">{customer.email}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Phone size={16} className="mr-2" />
            <span className="text-sm">{customer.phone}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <MapPin size={16} className="mr-2" />
            <span className="text-sm truncate">{customer.address}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Dog size={16} className="mr-2" />
            <span className="text-sm">
              {customer.dogs?.count || customer.numberOfDogs || 0} {(customer.dogs?.count || customer.numberOfDogs || 0) === 1 ? 'dog' : 'dogs'}
            </span>
          </div>

          {routeName && (
            <div className="flex items-center text-gray-600">
              <Route size={16} className="mr-2" />
              <span className="text-sm">{routeName}</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Total Spent</span>
            <span className="text-lg font-semibold text-primary-600">
              ${(customer.totalSpent || 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default CustomerCard;