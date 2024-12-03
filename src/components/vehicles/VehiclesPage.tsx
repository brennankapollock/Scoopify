import React, { useState, useEffect } from 'react';
import { Plus, Search, SlidersHorizontal, Car } from 'lucide-react';
import { collection, query, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/auth';
import VehicleGrid from './VehicleGrid';
import VehicleDialog from './VehicleDialog';
import FilterDialog from './FilterDialog';
import { Vehicle } from './types';

// Rest of the file remains exactly the same
const VehiclesPage = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewVehicleOpen, setIsNewVehicleOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVehicles = async () => {
      if (!user?.businessId) return;

      try {
        const vehiclesRef = collection(db, 'businesses', user.businessId, 'vehicles');
        const vehiclesSnapshot = await getDocs(query(vehiclesRef));
        const loadedVehicles = vehiclesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Vehicle[];
        setVehicles(loadedVehicles);
      } catch (error) {
        console.error('Error loading vehicles:', error);
        setError('Failed to load vehicles. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadVehicles();
  }, [user?.businessId]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSaveVehicle = async (vehicle: Vehicle) => {
    if (!user?.businessId) return;

    try {
      setError(null);
      const vehiclesRef = collection(db, 'businesses', user.businessId, 'vehicles');
      
      if (vehicle.id) {
        // Update existing vehicle
        const vehicleRef = doc(db, 'businesses', user.businessId, 'vehicles', vehicle.id);
        await updateDoc(vehicleRef, {
          ...vehicle,
          updatedAt: new Date().toISOString(),
        });
        setVehicles(prev => prev.map(v => v.id === vehicle.id ? vehicle : v));
      } else {
        // Add new vehicle
        const docRef = await addDoc(vehiclesRef, {
          ...vehicle,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        const newVehicle = { ...vehicle, id: docRef.id };
        setVehicles(prev => [...prev, newVehicle]);
      }

      setSelectedVehicle(null);
      setIsNewVehicleOpen(false);
    } catch (error) {
      console.error('Error saving vehicle:', error);
      setError('Failed to save vehicle. Please try again.');
    }
  };

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          Fleet Vehicles
        </h1>
        <p className="text-sm sm:text-base text-gray-500">
          Manage your fleet vehicles and maintenance schedules
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search vehicles..."
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
            onClick={() => setIsNewVehicleOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add Vehicle
          </button>
        </div>
      </div>

      {/* Empty State or Vehicle Grid */}
      {vehicles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col items-center">
            <Car size={48} className="text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Vehicles Yet</h3>
            <p className="text-gray-500 mb-6">
              Start by adding your first vehicle to your fleet
            </p>
            <button
              onClick={() => setIsNewVehicleOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Add First Vehicle
            </button>
          </div>
        </div>
      ) : (
        <VehicleGrid
          vehicles={filteredVehicles}
          onVehicleClick={setSelectedVehicle}
        />
      )}

      {/* Dialogs */}
      <VehicleDialog
        isOpen={isNewVehicleOpen || selectedVehicle !== null}
        onClose={() => {
          setIsNewVehicleOpen(false);
          setSelectedVehicle(null);
        }}
        vehicle={selectedVehicle}
        onSave={handleSaveVehicle}
      />

      <FilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
    </div>
  );
};

export default VehiclesPage;