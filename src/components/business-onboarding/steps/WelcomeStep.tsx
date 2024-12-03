import React from 'react';
import { Building2 } from 'lucide-react';
import { BusinessOnboardingData } from '../types';

interface WelcomeStepProps {
  onNext: (data: Partial<BusinessOnboardingData>) => void;
  data: BusinessOnboardingData;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  return (
    <div className="text-center">
      <Building2 size={48} className="mx-auto mb-6 text-primary-600" />
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Welcome to Scoopify✨
      </h2>
      
      <p className="text-lg text-gray-600 mb-8">
        Our signup is stupid simple. This should take about 10-15 minutes. We are here to help you succeed. Should you need anything, reach out at contact@tryscoopify.com and we'll get back to you ASAP.
      </p>

      <div className="bg-primary-50 rounded-lg p-6 mb-8 text-left">
        <h3 className="font-medium text-gray-900 mb-4">
          Some of this you can figure out along the way, but we'll cover:
        </h3>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-primary-600 rounded-full mr-2" />
            Basic business information and contact details
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-primary-600 rounded-full mr-2" />
            Service area and pricing information
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-primary-600 rounded-full mr-2" />
            Employee details (if applicable)
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-primary-600 rounded-full mr-2" />
            Business logo and branding materials (optional)
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-primary-600 rounded-full mr-2" />
            Payment processing information
          </li>
        </ul>
      </div>

      <button
        onClick={() => onNext({})}
        className="w-full px-6 py-3 text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all"
      >
        Let's Get Started
      </button>
    </div>
  );
};

export default WelcomeStep;