import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Appointment, ServiceType } from './types';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/auth';

interface AppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Appointment) => void;
  appointment?: Appointment;
  routes?: { id: string; name: string }[];
}

const initialAppointment: Omit<Appointment, 'id'> = {
  customerId: '',
  customerName: '',
  serviceType: 'weekly',
  status: 'scheduled',
  date: new Date().toISOString().split('T')[0],
  timeSlot: '09:00',
  duration: 30,
  address: '',
  notes: '',
};

const AppointmentDialog: React.FC<AppointmentDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  appointment,
  routes,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Omit<Appointment, 'id'>>(
    appointment || initialAppointment
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.businessId) return;

    try {
      setError(null);
      setLoading(true);

      const appointmentsRef = collection(db, 'businesses', user.businessId, 'appointments');
      const docRef = await addDoc(appointmentsRef, {
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      onSave({ ...formData, id: docRef.id });
      onClose();
    } catch (err) {
      console.error('Error creating appointment:', err);
      setError('Failed to create appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {appointment ? 'Edit Appointment' : 'Create Appointment'}
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
                Customer Name
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Service Type
              </label>
              <select
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value as ServiceType })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="one-time">One-Time</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Time
                </label>
                <input
                  type="time"
                  value={formData.timeSlot}
                  onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                min="15"
                step="15"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>

            {routes && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Route (Optional)
                </label>
                <select
                  value={formData.routeId || ''}
                  onChange={(e) => setFormData({ ...formData, routeId: e.target.value || undefined })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="">No Route</option>
                  {routes.map((route) => (
                    <option key={route.id} value={route.id}>
                      {route.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
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
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDialog;