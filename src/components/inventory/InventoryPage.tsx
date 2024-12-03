import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Plus, ClipboardList } from 'lucide-react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/auth';
import InventoryGrid from './InventoryGrid';
import NewItemDialog from './NewItemDialog';
import FilterDialog from './FilterDialog';
import TakeInventoryDialog from './TakeInventoryDialog';
import { InventoryItem } from './types';

const InventoryPage = () => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewItemOpen, setIsNewItemOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isTakeInventoryOpen, setIsTakeInventoryOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    lowStock: false,
    supplier: '',
  });

  useEffect(() => {
    const loadInventory = async () => {
      if (!user?.businessId) return;

      try {
        const inventoryRef = collection(db, 'businesses', user.businessId, 'inventory');
        const inventorySnapshot = await getDocs(query(inventoryRef));
        
        const items = inventorySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as InventoryItem[];

        setInventory(items);
      } catch (error) {
        console.error('Error loading inventory:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInventory();
  }, [user?.businessId]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSaveItem = async (item: InventoryItem) => {
    // Handle saving item to Firestore
    setIsNewItemOpen(false);
  };

  const applyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setIsFilterOpen(false);
  };

  const filteredInventory = inventory.filter(item => {
    let matches = true;

    // Search query
    if (searchQuery) {
      matches = matches && (
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filters.category) {
      matches = matches && item.category === filters.category;
    }

    // Location filter
    if (filters.location) {
      matches = matches && item.location === filters.location;
    }

    // Low stock filter
    if (filters.lowStock) {
      matches = matches && item.quantity <= item.minThreshold;
    }

    // Supplier filter
    if (filters.supplier) {
      matches = matches && item.supplier === filters.supplier;
    }

    return matches;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
          Inventory
        </h1>
        <p className="text-sm sm:text-base text-gray-500">
          Track and manage your supplies and equipment
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search inventory..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal size={20} className="mr-2" />
            Filters
          </button>
          <button
            onClick={() => setIsTakeInventoryOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            <ClipboardList size={20} className="mr-2" />
            Take Inventory
          </button>
          <button
            onClick={() => setIsNewItemOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add Item
          </button>
        </div>
      </div>

      {/* Empty State or Inventory Grid */}
      {inventory.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col items-center">
            <ClipboardList size={48} className="text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Items Yet</h3>
            <p className="text-gray-500 mb-6">
              Start by adding items to your inventory
            </p>
            <button
              onClick={() => setIsNewItemOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Add First Item
            </button>
          </div>
        </div>
      ) : (
        <InventoryGrid items={filteredInventory} onUpdateItem={handleSaveItem} />
      )}

      {/* Dialogs */}
      <NewItemDialog
        isOpen={isNewItemOpen}
        onClose={() => setIsNewItemOpen(false)}
        onSave={handleSaveItem}
      />
      <FilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        initialFilters={filters}
        onApply={applyFilters}
      />
      <TakeInventoryDialog
        isOpen={isTakeInventoryOpen}
        onClose={() => setIsTakeInventoryOpen(false)}
        inventory={inventory}
      />
    </div>
  );
};

export default InventoryPage;