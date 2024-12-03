import React, { useState } from 'react';
import { X } from 'lucide-react';

interface FilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialFilters: {
    category: string;
    location: string;
    lowStock: boolean;
    supplier: string;
  };
  onApply: (filters: {
    category: string;
    location: string;
    lowStock: boolean;
    supplier: string;
  }) => void;
}

const FilterDialog: React.FC<FilterDialogProps> = ({ 
  isOpen, 
  onClose,
  initialFilters,
  onApply
}) => {
  const [filters, setFilters] = useState(initialFilters);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(filters);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Filter Inventory
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
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">All Categories</option>
                <option value="consumable">Consumable</option>
                <option value="equipment">Equipment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <select
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">All Locations</option>
                <option value="Main Storage">Main Storage</option>
                <option value="Equipment Room">Equipment Room</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Supplier
              </label>
              <select
                value={filters.supplier}
                onChange={(e) => setFilters({ ...filters, supplier: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">All Suppliers</option>
                <option value="CleanPro Supplies">CleanPro Supplies</option>
                <option value="SafetyFirst">SafetyFirst</option>
                <option value="YardTools Pro">YardTools Pro</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="lowStock"
                checked={filters.lowStock}
                onChange={(e) => setFilters({ ...filters, lowStock: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="lowStock" className="ml-2 block text-sm text-gray-700">
                Show only low stock items
              </label>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setFilters({
                    category: '',
                    location: '',
                    lowStock: false,
                    supplier: '',
                  });
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Reset
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