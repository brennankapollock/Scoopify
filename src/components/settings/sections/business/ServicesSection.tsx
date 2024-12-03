import React from 'react';
import { BusinessOnboardingData } from '../../../../types/business';
import { Plus, X } from 'lucide-react';

interface ServicesSectionProps {
  data: BusinessOnboardingData;
  onChange: (data: BusinessOnboardingData) => void;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ data, onChange }) => {
  const addService = () => {
    onChange({
      ...data,
      services: {
        ...data.services,
        offerings: [
          ...data.services.offerings,
          {
            id: `service_${Date.now()}`,
            price: 0,
            zipCodes: [...data.serviceArea.zipCodes],
          }
        ]
      }
    });
  };

  const removeService = (serviceId: string) => {
    onChange({
      ...data,
      services: {
        ...data.services,
        offerings: data.services.offerings.filter(s => s.id !== serviceId)
      }
    });
  };

  const updateServicePrice = (serviceId: string, price: number) => {
    onChange({
      ...data,
      services: {
        ...data.services,
        offerings: data.services.offerings.map(s =>
          s.id === serviceId ? { ...s, price } : s
        )
      }
    });
  };

  return (
    <div className="space-y-6">
      {data.services.offerings.map((service) => (
        <div
          key={service.id}
          className="p-4 border border-gray-200 rounded-lg space-y-4"
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-gray-900">
                {service.id.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => removeService(service.id)}
              className="text-gray-400 hover:text-red-500"
            >
              <X size={20} />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                value={service.price}
                onChange={(e) => updateServicePrice(service.id, parseFloat(e.target.value) || 0)}
                className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="0.00"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Available ZIP Codes</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {data.serviceArea.zipCodes.map((zipCode) => (
                <label
                  key={zipCode}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                    service.zipCodes.includes(zipCode)
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={service.zipCodes.includes(zipCode)}
                    onChange={() => {
                      onChange({
                        ...data,
                        services: {
                          ...data.services,
                          offerings: data.services.offerings.map(s =>
                            s.id === service.id
                              ? {
                                  ...s,
                                  zipCodes: s.zipCodes.includes(zipCode)
                                    ? s.zipCodes.filter(z => z !== zipCode)
                                    : [...s.zipCodes, zipCode]
                                }
                              : s
                          )
                        }
                      });
                    }}
                    className="sr-only"
                  />
                  {zipCode}
                </label>
              ))}
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addService}
        className="w-full flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-500 hover:text-primary-500"
      >
        <Plus size={20} className="mr-2" />
        Add Service
      </button>
    </div>
  );
};

export default ServicesSection;