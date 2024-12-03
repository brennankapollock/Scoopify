import React from 'react';
import { DollarSign, Check, X } from 'lucide-react';
import { OnboardingData } from '../types';

interface QuoteStepProps {
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  data: OnboardingData;
}

const addOns = {
  deodorizer: { name: 'Yard Deodorizer', price: 9.99 },
  sanitizer: { name: 'Sanitizer Treatment', price: 14.99 },
  inspection: { name: 'Yard Inspection Report', price: 4.99 },
};

const QuoteStep: React.FC<QuoteStepProps> = ({ onNext, onBack, data }) => {
  const calculateTotal = () => {
    let total = data.service.basePrice;
    
    // Additional dogs ($10 per extra dog)
    total += (data.dogs.count - 1) * 10;
    
    // Treats ($5 per dog that wants treats)
    total += data.dogs.details.filter(dog => dog.treats).length * 5;
    
    // Add-ons
    data.addOns.forEach(addon => {
      total += addOns[addon as keyof typeof addOns].price;
    });

    return total;
  };

  const monthlyTotal = calculateTotal();

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
            <p className="text-sm text-gray-500">Base service for one dog</p>
          </div>
          <span className="font-medium text-gray-900">
            ${data.service.basePrice.toFixed(2)}
          </span>
        </div>

        {/* Additional Dogs */}
        {data.dogs.count > 1 && (
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <div>
              <h3 className="font-medium text-gray-900">
                Additional Dogs
              </h3>
              <p className="text-sm text-gray-500">
                {data.dogs.count - 1} additional {data.dogs.count - 1 === 1 ? 'dog' : 'dogs'} ($10 each)
              </p>
            </div>
            <span className="font-medium text-gray-900">
              ${((data.dogs.count - 1) * 10).toFixed(2)}
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
              ${(data.dogs.details.filter(dog => dog.treats).length * 5).toFixed(2)}
            </span>
          </div>
        )}

        {/* Add-ons */}
        {data.addOns.map((addon) => (
          <div key={addon} className="flex justify-between items-center py-3 border-b border-gray-200">
            <div>
              <h3 className="font-medium text-gray-900">
                {addOns[addon as keyof typeof addOns].name}
              </h3>
            </div>
            <span className="font-medium text-gray-900">
              ${addOns[addon as keyof typeof addOns].price.toFixed(2)}
            </span>
          </div>
        ))}

        {/* Total */}
        <div className="flex justify-between items-center py-4 border-t-2 border-gray-200">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Monthly Total
            </h3>
          </div>
          <span className="text-2xl font-bold text-primary-600">
            ${monthlyTotal.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3 text-lg font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all"
        >
          Back
        </button>
        <button
          onClick={() => onNext({})}
          className="flex-1 px-6 py-3 text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all flex items-center justify-center"
        >
          <Check size={20} className="mr-2" />
          Approve Quote
        </button>
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3 text-lg font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all flex items-center justify-center"
        >
          <X size={20} className="mr-2" />
          Decline
        </button>
      </div>
    </div>
  );
};

export default QuoteStep;