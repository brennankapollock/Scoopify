import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { OnboardingData } from '../../onboarding/types';
import { BusinessOnboardingData } from '../../business-onboarding/types';

interface ZipStepProps {
  onNext: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
  businessData: BusinessOnboardingData;
}

const ZipStep: React.FC<ZipStepProps> = ({ onNext, data, businessData }) => {
  const [zipCode, setZipCode] = useState(data.zipCode);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if ZIP code is in business's service area
    if (businessData.serviceArea.zipCodes.includes(zipCode)) {
      onNext({ zipCode });
    } else {
      setError(`We're sorry, but ${businessData.businessName} doesn't service this area yet.`);
    }
  };

  return (
    <div className="text-center">
      <MapPin size={48} className="mx-auto mb-6 text-primary-600" />
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Let's get started!
      </h2>
      
      <p className="text-lg text-gray-600 mb-8">
        Enter your ZIP code to see if we service your area
      </p>

      <form onSubmit={handleSubmit} className="max-w-xs mx-auto">
        <div className="mb-6">
          <input
            type="text"
            value={zipCode}
            onChange={(e) => {
              setZipCode(e.target.value);
              setError('');
            }}
            pattern="[0-9]*"
            maxLength={5}
            className="w-full px-4 py-3 text-2xl text-center font-medium rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
            placeholder="Enter ZIP"
            required
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full px-6 py-3 text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all"
        >
          Check Availability
        </button>
      </form>
    </div>
  );
};

export default ZipStep;