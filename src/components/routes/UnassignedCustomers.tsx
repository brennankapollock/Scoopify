import React from 'react';
import { MapPin, Route as RouteIcon } from 'lucide-react';
import { Customer } from '../customers/types';
import { Route } from './types';

interface UnassignedCustomersProps {
  customers: Customer[];
  routes: Route[];
  onAssignToRoute: (customerId: string, routeId: string) => void;
}

const UnassignedCustomers: React.FC<UnassignedCustomersProps> = ({
  customers,
  routes,
  onAssignToRoute,
}) => {
  const getSuggestedRoutes = (customer: Customer) => {
    if (!customer.zipCode) return [];
    return routes.filter(route => route.zipCodes.includes(customer.zipCode));
  };

  if (customers.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 text-center">
        <p className="text-gray-500">All customers are assigned to routes</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Unassigned Customers ({customers.length})
        </h3>
      </div>
      <div className="divide-y divide-gray-200">
        {customers.map((customer) => {
          const suggestedRoutes = getSuggestedRoutes(customer);
          
          return (
            <div key={customer.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {customer.fullName}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin size={14} className="mr-1 flex-shrink-0" />
                      {customer.address}
                    </div>
                    {customer.zipCode && (
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                          ZIP: {customer.zipCode}
                        </span>
                        {routes.length > 0 && (
                          <span className="text-xs text-gray-500">
                            {suggestedRoutes.length === 0 
                              ? '(No matching routes)' 
                              : `(Matches ${suggestedRoutes.length} ${suggestedRoutes.length === 1 ? 'route' : 'routes'})`
                            }
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="ml-4">
                  {suggestedRoutes.length > 0 ? (
                    <div className="space-y-2">
                      {suggestedRoutes.map((route) => (
                        <button
                          key={route.id}
                          onClick={() => onAssignToRoute(customer.id!, route.id)}
                          className="flex items-center px-3 py-1 text-sm text-primary-600 bg-primary-50 rounded-full hover:bg-primary-100 transition-colors"
                        >
                          <RouteIcon size={14} className="mr-1" />
                          Add to {route.name}
                        </button>
                      ))}
                    </div>
                  ) : routes.length > 0 && (
                    <span className="text-xs text-amber-600">
                      ZIP code not covered by any route
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UnassignedCustomers;