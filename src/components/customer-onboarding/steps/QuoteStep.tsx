import React from 'react';
import { DollarSign, Check, X } from 'lucide-react';
import { OnboardingData } from '../../onboarding/types';
import { BusinessOnboardingData } from '../../business-onboarding/types';

interface QuoteStepProps {
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  data: OnboardingData;
  businessData: BusinessOnboardingData;
  onDecline: () => void;
}

const QuoteStep: React.FC<QuoteStepProps> = ({ onNext, onBack, data, businessData, onDecline }) => {
  const calculatePrices = () => {
    // Find the selected service offering
    const serviceOffering = businessData.services.offerings.find(
      offering => offering.id === data.service.type
    );

    if (!serviceOffering) return { basePrice: 0, additionalDogsCost: 0, treatsCost: 0, total: 0 };

    const basePrice = serviceOffering.price;
    const additionalDogsCost = data.dogs.count > 2 ? (data.dogs.count - 2) * 10 : 0;
    const treatsCost = data.dogs.details.filter(dog => dog.treats).length * 5;
    
    return {
      basePrice,
      additionalDogsCost,
      treatsCost,
      total: basePrice + additionalDogsCost + treatsCost
    };
  };

  const prices = calculatePrices();

  return (
    <div>
      <DollarSign size={48} className="mx-auto mb-6 text-primary-600" />
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
        Your Custom Quote
      </h2>
      
      <p className="text-lg text-gray-600 mb-8 text-center">
        Here's a breakdown of your monthly service
      </p>

      <div className="space-y-6 mb-8">
        {/* Base Service */}
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <div>
            <h3 className="font-medium text-gray-900">
              {data.service.type.charAt(0).toUpperCase() + data.service.type.slice(1)} Service
            </h3>
            <p className="text-sm text-gray-500">Base service (includes up to 2 dogs)</p>
          </div>
          <span className="font-medium text-gray-900">
            ${prices.basePrice.toFixed(2)}
          </span>
        </div>

        {/* Additional Dogs */}
        {data.dogs.count > 2 && (
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <div>
              <h3 className="font-medium text-gray-900">
                Additional Dogs
              </h3>
              <p className="text-sm text-gray-500">
                {data.dogs.count - 2} additional {data.dogs.count - 2 === 1 ? 'dog' : 'dogs'} ($10 each)
              </p>
            </div>
            <span className="font-medium text-gray-900">
              ${prices.additionalDogsCost.toFixed(2)}
            </span>
          </div>
        )}

        {/* Treats */}
        {data.dogs.details.some(dog => dog.treats) && (
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <div>
              <h3 className="font-medium text-gray-900">
                Treats
              </h3>
              <p className="text-sm text-gray-500">
                For {data.dogs.details.filter(dog => dog.treats).length} {
                  data.dogs.details.filter(dog => dog.treats).length === 1 ? 'dog' : 'dogs'
                } ($5 each)
              </p>
            </div>
            <span className="font-medium text-gray-900">
              ${prices.treatsCost.toFixed(2)}
            </span>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between items-center py-4 border-t-2 border-gray-200">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Monthly Total
            </h3>
          </div>
          <span className="text-2xl font-bold text-primary-600">
            ${prices.total.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onBack}
          className="w-full sm:w-1/3 px-6 py-3 text-lg font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all order-2 sm:order-1"
        >
          Back
        </button>
        <button
          onClick={() => onNext({})}
          className="w-full sm:w-1/3 px-6 py-3 text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all flex items-center justify-center order-1 sm:order-2"
        >
          <Check size={20} className="mr-2" />
          Approve
        </button>
        <button
          onClick={onDecline}
          className="w-full sm:w-1/3 px-6 py-3 text-lg font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all flex items-center justify-center order-3"
        >
          <X size={20} className="mr-2" />
          Decline
        </button>
      </div>
    </div>
  );
};

export default QuoteStep;