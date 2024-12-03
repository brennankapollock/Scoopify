import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { InventoryItem } from './types';

interface TrendsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: InventoryItem[];
}

// Mock trend data
const mockTrends = {
  usage: [65, 72, 68, 74, 80, 75, 82],
  restock: [100, 0, 0, 100, 0, 0, 100],
  dates: ['Mar 14', 'Mar 15', 'Mar 16', 'Mar 17', 'Mar 18', 'Mar 19', 'Mar 20'],
};

const TrendsDialog: React.FC<TrendsDialogProps> = ({
  isOpen,
  onClose,
  inventory,
}) => {
  const [selectedItem, setSelectedItem] = useState<string>(inventory[0]?.id || '');

  if (!isOpen) return null;

  const selectedItemData = inventory.find(item => item.id === selectedItem);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Inventory Trends
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                View usage patterns and restocking history
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Item
              </label>
              <select
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                {inventory.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedItemData && (
              <>
                {/* Current Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Current Stock</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {selectedItemData.quantity} {selectedItemData.unit}s
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Average Usage</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      73 {selectedItemData.unit}s/week
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Restock Frequency</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      Weekly
                    </p>
                  </div>
                </div>

                {/* Usage Trends */}
                <div className="bg-white rounded-lg p-4">
                  <h4 className="text-base font-medium text-gray-900 mb-4">7-Day Usage Trend</h4>
                  <div className="h-64 flex items-end space-x-2">
                    {mockTrends.usage.map((value, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div className="relative w-full">
                          {/* Restock bar */}
                          {mockTrends.restock[index] > 0 && (
                            <div
                              className="absolute bottom-0 w-full bg-primary-200 rounded-t"
                              style={{ height: `${mockTrends.restock[index]}%` }}
                            />
                          )}
                          {/* Usage bar */}
                          <div
                            className="relative w-full bg-primary-500 rounded-t"
                            style={{ height: `${value}%` }}
                          />
                        </div>
                        <span className="mt-2 text-xs text-gray-500">
                          {mockTrends.dates[index]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Insights */}
                <div className="space-y-3">
                  <div className="flex items-center text-primary-600">
                    <TrendingUp size={20} className="mr-2" />
                    <span className="text-sm">
                      Usage increased by 12% compared to last week
                    </span>
                  </div>
                  <div className="flex items-center text-amber-600">
                    <TrendingDown size={20} className="mr-2" />
                    <span className="text-sm">
                      Current stock will last approximately 5 days at current usage rate
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendsDialog;