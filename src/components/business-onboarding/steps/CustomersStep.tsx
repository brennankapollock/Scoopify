import React, { useState } from 'react';
import { Users, HelpCircle } from 'lucide-react';
import { BusinessOnboardingData } from '../types';

interface CustomersStepProps {
  onNext: (data: Partial<BusinessOnboardingData>) => void;
  onBack: () => void;
  data: BusinessOnboardingData;
}

const availableFields = [
  { id: 'name', label: 'Customer Name', description: 'Full name of the customer' },
  { id: 'email', label: 'Email Address', description: 'Primary contact email' },
  { id: 'phone', label: 'Phone Number', description: 'Contact phone number' },
  { id: 'address', label: 'Service Address', description: 'Location where service is provided' },
  { id: 'gate_code', label: 'Gate Code', description: 'Access code if required' },
  { id: 'pets', label: 'Pet Details', description: 'Number and type of pets' },
  { id: 'notes', label: 'Special Instructions', description: 'Any additional notes or requirements' },
];

const CustomersStep: React.FC<CustomersStepProps> = ({ onNext, onBack, data }) => {
  const [formData, setFormData] = useState({
    customerFields: data.customerFields,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  const toggleField = (fieldId: string, type: 'required' | 'optional') => {
    setFormData(prev => {
      const otherType = type === 'required' ? 'optional' : 'required';
      
      // Remove from the other array if it exists there
      const updatedOtherArray = prev.customerFields[otherType].filter(id => id !== fieldId);
      
      // Toggle in the current array
      const updatedCurrentArray = prev.customerFields[type].includes(fieldId)
        ? prev.customerFields[type].filter(id => id !== fieldId)
        : [...prev.customerFields[type], fieldId];

      return {
        ...prev,
        customerFields: {
          ...prev.customerFields,
          [type]: updatedCurrentArray,
          [otherType]: updatedOtherArray,
        },
      };
    });
  };

  return (
    <div>
      <Users size={48} className="mx-auto mb-6 text-primary-600" />
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
        Customer Management
      </h2>
      
      <p className="text-lg text-gray-600 mb-8 text-center">
        Set up how you'll manage customer information
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Customer Information Fields
            </h3>
            <button
              type="button"
              className="text-sm text-primary-600 hover:text-primary-700"
              onClick={() => {
                setFormData({
                  customerFields: {
                    required: ['name', 'email', 'phone', 'address'],
                    optional: ['notes', 'gate_code'],
                  },
                });
              }}
            >
              Reset to Default
            </button>
          </div>

          <div className="space-y-4">
            {availableFields.map((field) => (
              <div
                key={field.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{field.label}</span>
                        <button
                          type="button"
                          className="text-gray-400 hover:text-gray-500"
                          onClick={() => {
                            alert(field.description);
                          }}
                        >
                          <HelpCircle size={16} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{field.description}</p>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.customerFields.required.includes(field.id)}
                          onChange={() => toggleField(field.id, 'required')}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Required</span>
                 </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.customerFields.optional.includes(field.id)}
                          onChange={() => toggleField(field.id, 'optional')}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Optional</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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

export default CustomersStep;