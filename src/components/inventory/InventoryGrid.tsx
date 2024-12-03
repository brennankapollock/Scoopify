import React from 'react';
import { Package, AlertTriangle } from 'lucide-react';
import { InventoryItem } from './types';

interface InventoryGridProps {
  items: InventoryItem[];
  onUpdateItem: (item: InventoryItem) => void;
}

const InventoryGrid: React.FC<InventoryGridProps> = ({ items, onUpdateItem }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <Package
                size={24}
                className={item.category === 'equipment' ? 'text-blue-500' : 'text-primary-500'}
              />
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{item.category}</p>
              </div>
            </div>
            {item.quantity <= item.minThreshold && (
              <div className="flex items-center text-amber-500">
                <AlertTriangle size={20} />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Current Stock</span>
              <span className="text-lg font-semibold text-gray-900">
                {item.quantity} {item.unit}
                {item.quantity !== 1 && 's'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Min. Threshold</span>
              <span className="text-sm text-gray-900">{item.minThreshold} {item.unit}s</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Last Restocked</span>
              <span className="text-sm text-gray-900">{item.lastRestocked}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Cost per Unit</span>
              <span className="text-sm text-gray-900">${item.costPerUnit.toFixed(2)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InventoryGrid;