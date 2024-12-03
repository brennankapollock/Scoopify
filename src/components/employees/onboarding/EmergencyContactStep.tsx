import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Employee } from '../types';

interface EmergencyContactStepProps {
  onNext: (data: Partial<Employee>) => void;
  onBack: () => void;
  data: Employee;
}

const EmergencyContactStep: React.FC<EmergencyContactStepProps> = ({ onNext, onBack, data }) => {
  const [formData, setFormData] = useState({
    emergencyContact: {
      name: data.emergencyContact?.name || '',
      relationship: data.emergencyContact?.relationship || '',
      phone: data.emergencyContact?.phone || '',
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <div>
      <Heart size={48} className="mx-auto mb-6 text-primary-600" />
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
        Emergency Contact
      </h2>
      
      <p className="text-lg text-gray-600 mb-8 text-center">
        Who should we contact in case of an emergency?
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Name
          </label>
          <input
            type="text"
            value={formData.emergencyContact.name}
            onChange={(e) => setFormData({
              ...formData,
              emergencyContact: {
                ...formData.emergencyContact,
                name: e.target.value,
              },
            })}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Relationship
          </label>
          <input
            type="text"
            value={formData.emergencyContact.relationship}
            onChange={(e) => setFormData({
              ...formData,
              emergencyContact: {
                ...formData.emergencyContact,
                relationship: e.target.value,
              },
            })}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.emergencyContact.phone}
            onChange={(e) => setFormData({
              ...formData,
              emergencyContact: {
                ...formData.emergencyContact,
                phone: e.target.value,
              },
            })}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
            required
          />
        </div>

        <div className="flex gap-3 pt-6">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-6 py-3 text-lg font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all"
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmergencyContactStep;