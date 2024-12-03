import React, { useState } from 'react';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { Vehicle } from './types';

interface MaintenanceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
}

const MaintenanceDialog: React.FC<MaintenanceDialogProps> = ({
  isOpen,
  onClose,
  vehicles,
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>(vehicles[0]?.id || '');

  if (!isOpen) return null;

  const vehicle = vehicles.find(v => v.id === selectedVehicle);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-4xl p-4 sm:p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Maintenance Log
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                View and manage vehicle maintenance records
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={24} />
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Select Vehicle
            </label>
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.name} - {vehicle.make} {vehicle.model}
                </option>
              ))}
            </select>
          </div>

          {vehicle && (
            <div className="space-y-6">
              {/* Current Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Current Mileage</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {vehicle.currentMileage.toLocaleString()} mi
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Service</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {vehicle.lastMaintenance
                        ? format(new Date(vehicle.lastMaintenance.date), 'MMM d, yyyy')
                        : 'No record'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Next Service Due</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {vehicle.nextMaintenance
                        ? format(new Date(vehicle.nextMaintenance.dueDate), 'MMM d, yyyy')
                        : 'Not scheduled'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Maintenance History */}
              <div className="overflow-x-auto">
                <h4 className="text-base font-medium text-gray-900 mb-4">
                  Maintenance History
                </h4>
                <div className="min-w-full overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                          Date
                        </th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Type
                        </th>
                        <th className="hidden sm:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Description
                        </th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Mileage
                        </th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Cost
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {vehicle.lastMaintenance && (
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
                            {format(new Date(vehicle.lastMaintenance.date), 'MMM d, yyyy')}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {vehicle.lastMaintenance.type}
                          </td>
                          <td className="hidden sm:table-cell px-3 py-4 text-sm text-gray-500">
                            {vehicle.lastMaintenance.description}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {vehicle.lastMaintenance.mileage.toLocaleString()} mi
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            ${vehicle.lastMaintenance.cost.toFixed(2)}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDialog;