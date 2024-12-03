import React, { useState } from 'react';
import { Calendar, Check } from 'lucide-react';
import { OnboardingData } from '../../onboarding/types';
import { BusinessOnboardingData } from '../../business-onboarding/types';

interface ServiceStepProps {
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  data: OnboardingData;
  businessData: BusinessOnboardingData;
}

const ServiceStep: React.FC<ServiceStepProps> = ({ onNext, onBack, data, businessData }) => {
  const [selectedService, setSelectedService] = useState(data.service.type);
  const [selectedAddOns, setSelectedAddOns] = useState(data.addOns);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find the selected service offering
    const serviceOffering = businessData.services.offerings.find(
      offering => offering.id === selectedService
    );

    if (!serviceOffering) return;

    onNext({
      service: {
        type: selectedService,
        basePrice: serviceOffering.price,
      },
      addOns: selectedAddOns,
    });
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
          {businessData.services.offerings.map((service) => {
            // Only show services available in customer's ZIP code
            if (!service.zipCodes.includes(data.zipCode)) return null;

            return (
              <button
                key={service.id}
                type="button"
                onClick={() => setSelectedService(service.id)}
                className={`p-6 text-left border-2 rounded-lg transition-all ${
                  selectedService === service.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-200'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {service.id.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </h3>
                  <span className="text-xl font-bold text-primary-600">
                    ${service.price.toFixed(2)}/mo
                  </span>
                </div>
                <p className="text-gray-600">
                  {service.id === 'weekly' && 'Weekly service for consistent cleanliness'}
                  {service.id === 'biweekly' && 'Service every two weeks'}
                  {service.id === 'monthly' && 'Monthly maintenance service'}
                  {service.id === 'one_time' && 'One-time cleanup service'}
                </p>
              </button>
            );
          })}
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