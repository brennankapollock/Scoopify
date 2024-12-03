import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/auth';
import { InventoryItem, InventoryCount } from './types';

interface TakeInventoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: InventoryItem[];
}

const TakeInventoryDialog: React.FC<TakeInventoryDialogProps> = ({
  isOpen,
  onClose,
  inventory
}) => {
  const { user } = useAuth();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.businessId) return;
    
    try {
      setError(null);
      setLoading(true);

      // Create inventory count record
      const countRecord: InventoryCount = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        countedBy: user.uid,
        items: Object.entries(counts).map(([itemId, counted]) => {
          const item = inventory.find(i => i.id === itemId);
          return {
            itemId,
            counted,
            expected: item?.quantity || 0,
            difference: counted - (item?.quantity || 0)
          };
        }),
        notes,
        status: 'completed'
      };

      // Save to Firestore
      const countRef = collection(db, 'businesses', user.businessId, 'inventory-counts');
      await addDoc(countRef, {
        ...countRecord,
        createdAt: new Date().toISOString(),
      });

      onClose();
    } catch (err) {
      console.error('Error saving inventory count:', err);
      setError('Failed to save inventory count. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCountChange = (itemId: string, value: number) => {
    setCounts(prev => ({
      ...prev,
      [itemId]: value
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Take Inventory
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Count your current inventory levels
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={24} />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expected
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Counted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Difference
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventory.map((item) => {
                    const counted = counts[item.id] || 0;
                    const difference = counted - item.quantity;
                    
                    return (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.unit}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            value={counted || ''}
                            onChange={(e) => handleCountChange(item.id, parseInt(e.target.value) || 0)}
                            className="w-24 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            min="0"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${
                            difference === 0 ? 'text-gray-900' :
                            difference > 0 ? 'text-primary-600' :
                            'text-red-600'
                          }`}>
                            {difference > 0 ? '+' : ''}{difference}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Add any notes about the inventory count..."
              />
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
                disabled={loading}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                <Save size={16} className="mr-2" />
                {loading ? 'Saving...' : 'Save Count'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TakeInventoryDialog;