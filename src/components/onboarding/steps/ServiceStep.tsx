import React, { useState } from 'react';
import { Calendar, Check } from 'lucide-react';
import { OnboardingData } from '../types';

interface ServiceStepProps {
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  data: OnboardingData;
}

const services = [
  {
    type: 'weekly',
    name: 'Weekly Service',
    description: 'Perfect for maintaining a consistently clean yard',
    basePrice: 29.99,
  },
  {
    type: 'biweekly',
    name: 'Bi-Weekly Service',
    description: 'Ideal for yards with moderate usage',
    basePrice: 39.99,
  },
  {
    type: 'monthly',
    name: 'Monthly Service',
    description: 'Best for light yard usage',
    basePrice: 49.99,
  },
] as const;

const addOns = [
  {
    id: 'deodorizer',
    name: 'Yard Deodorizer',
    description: 'Keep your yard fresh and clean',
    price: 9.99,
  },
  {
    id: 'sanitizer',
    name: 'Sanitizer Treatment',
    description: 'Extra protection for your family',
    price: 14.99,
  },
  {
    id: 'inspection',
    name: 'Yard Inspection Report',
    description: 'Detailed report of yard condition',
    price: 4.99,
  },
];

const ServiceStep: React.FC<ServiceStepProps> = ({ onNext, onBack, data }) => {
  const [selectedService, setSelectedService] = useState<typeof services[number]['type']>(data.service.type);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(data.addOns);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const service = services.find(s => s.type === selectedService)!;
    onNext({
      service: {
        type: selectedService,
        basePrice: service.basePrice,
      },
      addOns: selectedAddOns,
    });
  };

  const toggleAddOn = (id: string) => {
    setSelectedAddOns(prev =>
      prev.includes(id)
        ? prev.filter(a => a !== id)
        : [...prev, id]
    );
  };

  return (
    <div>
      <Calendar size={48} className="mx-auto mb-6 text-primary-600" />
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
        Choose Your Service Plan
      </h2>
      
      <p className="text-lg text-gray-600 mb-8 text-center">
        Select the service frequency that works best for you
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Service Selection */}
        <div className="grid gap-4">
          {services.map((service) => (
            <button
              key={service.type}
              type="button"
              onClick={() => setSelectedService(service.type)}
              className={`p-6 text-left border-2 rounded-lg transition-all ${
                selectedService === service.type
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-200'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {service.name}
                </h3>
                <span className="text-xl font-bold text-primary-600">
                  ${service.basePrice}/mo
                </span>
              </div>
              <p className="text-gray-600">{service.description}</p>
            </button>
          ))}
        </div>

        {/* Add-ons */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Optional Add-ons
          </h3>
          <div className="grid gap-3">
            {addOns.map((addon) => (
              <label
                key={addon.id}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedAddOns.includes(addon.id)
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedAddOns.includes(addon.id)}
                  onChange={() => toggleAddOn(addon.id)}
                  className="sr-only"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-900">{addon.name}</span>
                    <span className="text-primary-600 font-medium">
                      +${addon.price}/mo
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{addon.description}</p>
                </div>
                <div className={`ml-4 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedAddOns.includes(addon.id)
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-gray-300'
                }`}>
                  {selectedAddOns.includes(addon.id) && (
                    <Check size={14} className="text-white" />
                  )}
                </div>
              </label>
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

export default ServiceStep;