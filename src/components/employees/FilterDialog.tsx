import React, { useState } from 'react';
import { X } from 'lucide-react';

interface FilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const FilterDialog: React.FC<FilterDialogProps> = ({ isOpen, onClose }) => {
  const [filters, setFilters] = useState({
    position: '',
    status: '',
    minRating: '',
    minPerformance: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement filter logic here
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Filter Employees
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Position
              </label>
              <select
                value={filters.position}
                onChange={(e) => setFilters({ ...filters, position: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">All Positions</option>
                <option value="Yard Technician">Yard Technician</option>
                <option value="Senior Technician">Senior Technician</option>
                <option value="Team Lead">Team Lead</option>
                <option value="Route Manager">Route Manager</option>
                <option value="Operations Manager">Operations Manager</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="on-leave">On Leave</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Min Rating
                </label>
                <input
                  type="number"
                  value={filters.minRating}
                  onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="0.0"
                  min="0"
                  max="5"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Min Performance
                </label>
                <input
                  type="number"
                  value={filters.minPerformance}
                  onChange={(e) => setFilters({ ...filters, minPerformance: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="0"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
              >
                Apply Filters
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FilterDialog;