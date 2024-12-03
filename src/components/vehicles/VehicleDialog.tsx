import React, { useState, useEffect } from 'react';
import { X, Plus, Tag as TagIcon } from 'lucide-react';
import { Vehicle } from './types';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/auth';
import { Employee } from '../employees/types';

interface VehicleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: Vehicle | null;
  onSave: (vehicle: Vehicle) => void;
}

const initialVehicle: Omit<Vehicle, 'id'> = {
  name: '',
  make: '',
  model: '',
  year: new Date().getFullYear(),
  licensePlate: '',
  vin: '',
  status: 'active' as const,
  assignedTo: '',
  fuelType: 'gas' as const,
  fuelEfficiency: 0,
  currentMileage: 0,
  insuranceExpiry: '',
  registrationExpiry: '',
  notes: '',
  tags: [],
};

const VehicleDialog: React.FC<VehicleDialogProps> = ({
  isOpen,
  onClose,
  vehicle,
  onSave,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Vehicle>(vehicle || initialVehicle);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const loadEmployees = async () => {
      if (!user?.businessId) return;

      try {
        const employeesRef = collection(db, 'businesses', user.businessId, 'employees');
        const employeesSnapshot = await getDocs(query(employeesRef, where('status', '==', 'active')));
        const loadedEmployees = employeesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Employee[];
        setEmployees(loadedEmployees);
      } catch (error) {
        console.error('Error loading employees:', error);
      }
    };

    loadEmployees();
  }, [user?.businessId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error('Error saving vehicle:', err);
      setError('Failed to save vehicle. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (!newTag.trim()) return;
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, newTag.trim()],
    }));
    setNewTag('');
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
            </h3>
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Vehicle Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Make
                </label>
                <input
                  type="text"
                  name="make"
                  value={formData.make}
                  onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Model
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Year
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  License Plate
                </label>
                <input
                  type="text"
                  name="licensePlate"
                  value={formData.licensePlate}
                  onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  VIN
                </label>
                <input
                  type="text"
                  name="vin"
                  value={formData.vin}
                  onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Vehicle['status'] })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Assigned To
                </label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="">Not Assigned</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.fullName} - {employee.position}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fuel Type
                </label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={(e) => setFormData({ ...formData, fuelType: e.target.value as Vehicle['fuelType'] })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="gas">Gas</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Current Mileage
                </label>
                <input
                  type="number"
                  name="currentMileage"
                  value={formData.currentMileage}
                  onChange={(e) => setFormData({ ...formData, currentMileage: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Insurance Expiry
                </label>
                <input
                  type="date"
                  name="insuranceExpiry"
                  value={formData.insuranceExpiry}
                  onChange={(e) => setFormData({ ...formData, insuranceExpiry: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Registration Expiry
                </label>
                <input
                  type="date"
                  name="registrationExpiry"
                  value={formData.registrationExpiry}
                  onChange={(e) => setFormData({ ...formData, registrationExpiry: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700"
                  >
                    <TagIcon size={14} className="mr-1" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Add a tag"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Plus size={16} className="mr-1" />
                  Add
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Vehicle'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VehicleDialog;