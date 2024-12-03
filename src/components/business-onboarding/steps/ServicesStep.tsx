import React, { useState } from 'react';
import { Package, Check } from 'lucide-react';
import { BusinessOnboardingData } from '../types';

interface ServicesStepProps {
  onNext: (data: Partial<BusinessOnboardingData>) => void;
  onBack: () => void;
  data: BusinessOnboardingData;
}

const defaultServices = [
  {
    id: 'weekly',
    name: 'Weekly Service',
    description: 'Regular weekly cleaning service',
    defaultPrice: 29.99,
  },
  {
    id: 'biweekly',
    name: 'Bi-Weekly Service',
    description: 'Every other week cleaning service',
    defaultPrice: 39.99,
  },
  {
    id: 'monthly',
    name: 'Monthly Service',
    description: 'Monthly maintenance service',
    defaultPrice: 49.99,
  },
  {
    id: 'one_time',
    name: 'One-Time Service',
    description: 'Single cleaning service',
    defaultPrice: 59.99,
  },
];

const ServicesStep: React.FC<ServicesStepProps> = ({ onNext, onBack, data }) => {
  const [selectedServices, setSelectedServices] = useState<string[]>(
    data.services.offerings.map(o => o.id)
  );
  const [prices, setPrices] = useState<Record<string, number>>(
    Object.fromEntries(
      data.services.offerings.map(o => [o.id, o.price])
    )
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const offerings = selectedServices.map(serviceId => ({
      id: serviceId,
      price: prices[serviceId] || defaultServices.find(s => s.id === serviceId)?.defaultPrice || 0,
      zipCodes: data.serviceArea.zipCodes,
    }));

    onNext({
      services: {
        offerings,
        types: selectedServices,
        additionalFees: [],
      },
    });
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const updatePrice = (serviceId: string, price: string) => {
    const numericPrice = parseFloat(price) || 0;
    setPrices(prev => ({
      ...prev,
      [serviceId]: numericPrice,
    }));
  };

  return (
    <div>
      <Package size={48} className="mx-auto mb-6 text-primary-600" />
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
        Services & Pricing
      </h2>
      
      <p className="text-lg text-gray-600 mb-8 text-center">
        Select the services you want to offer and set your prices
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          {defaultServices.map((service) => (
            <div
              key={service.id}
              className={`p-6 border-2 rounded-lg transition-all ${
                selectedServices.includes(service.id)
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service.id)}
                    onChange={() => toggleService(service.id)}
                    className="sr-only"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                        selectedServices.includes(service.id)
                          ? 'bg-primary-500 border-primary-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedServices.includes(service.id) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {service.name}
                      </h3>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 ml-7">
                      {service.description}
                    </p>
                  </div>
                </label>

                {selectedServices.includes(service.id) && (
                  <div className="flex-shrink-0 w-32">
                    <label className="block text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        value={prices[service.id] || service.defaultPrice}
                        onChange={(e) => updatePrice(service.id, e.target.value)}
                        className="block w-full pl-7 pr-3 py-2 rounded-md border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
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
            disabled={selectedServices.length === 0}
            className="flex-1 px-6 py-3 text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServicesStep;