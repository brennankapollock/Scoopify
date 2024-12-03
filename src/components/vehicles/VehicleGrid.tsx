import React from 'react';
import { AlertTriangle, Calendar, Car, Tag, User } from 'lucide-react';
import { Vehicle } from './types';
import { format, isBefore, addDays } from 'date-fns';

interface VehicleGridProps {
  vehicles: Vehicle[];
  onVehicleClick: (vehicle: Vehicle) => void;
}

const VehicleGrid: React.FC<VehicleGridProps> = ({ vehicles, onVehicleClick }) => {
  const isExpiringWithin30Days = (date: string) => {
    return isBefore(new Date(date), addDays(new Date(), 30));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {vehicles.map((vehicle) => (
        <div
          key={vehicle.id}
          onClick={() => onVehicleClick(vehicle)}
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 cursor-pointer"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{vehicle.name}</h3>
              <p className="text-sm text-gray-500">
                {vehicle.make} {vehicle.model} {vehicle.year}
              </p>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              vehicle.status === 'active'
                ? 'bg-primary-100 text-primary-800'
                : vehicle.status === 'maintenance'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <Car size={16} className="mr-2" />
              <span className="text-sm">{vehicle.licensePlate}</span>
            </div>

            {vehicle.assignedTo && (
              <div className="flex items-center text-gray-600">
                <User size={16} className="mr-2" />
                <span className="text-sm">{vehicle.assignedTo}</span>
              </div>
            )}

            <div className="flex items-center text-gray-600">
              <Calendar size={16} className="mr-2" />
              <span className="text-sm">
                Registration expires: {format(new Date(vehicle.registrationExpiry), 'MMM d, yyyy')}
                {isExpiringWithin30Days(vehicle.registrationExpiry) && (
                  <AlertTriangle size={14} className="inline ml-1 text-amber-500" />
                )}
              </span>
            </div>

            {vehicle.nextMaintenance && (
              <div className="flex items-center text-gray-600">
                <AlertTriangle size={16} className="mr-2" />
                <span className="text-sm">
                  {vehicle.nextMaintenance.type} due {format(new Date(vehicle.nextMaintenance.dueDate), 'MMM d')}
                </span>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {vehicle.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                >
                  <Tag size={12} className="mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Current Mileage</span>
              <span className="text-lg font-semibold text-gray-900">
                {vehicle.currentMileage.toLocaleString()} mi
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VehicleGrid;