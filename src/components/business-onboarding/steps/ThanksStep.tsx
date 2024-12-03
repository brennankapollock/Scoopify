import React from 'react';
import { PartyPopper, ChevronRight } from 'lucide-react';
import { BusinessOnboardingData } from '../types';

interface ThanksStepProps {
  data: BusinessOnboardingData;
  onComplete: () => void;
}

const ThanksStep: React.FC<ThanksStepProps> = ({ data, onComplete }) => {
  return (
    <div className="text-center">
      <PartyPopper size={48} className="mx-auto mb-6 text-primary-600" />
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Welcome to Scoopify!
      </h2>
      
      <p className="text-lg text-gray-600 mb-8">
        Your business setup is complete. Let's get started managing your pet waste removal service!
      </p>

      <div className="bg-primary-50 rounded-lg p-6 mb-8">
        <h3 className="font-medium text-gray-900 mb-4">
          What's Next?
        </h3>
        <ul className="text-left space-y-4">
          <li className="flex items-start">
            <span className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">1</span>
            <span>Review your dashboard to familiarize yourself with the available features</span>
          </li>
          <li className="flex items-start">
            <span className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">2</span>
            <span>Set up your team members and assign their roles</span>
          </li>
          <li className="flex items-start">
            <span className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">3</span>
            <span>Start adding your customers and creating service routes</span>
          </li>
          <li className="flex items-start">
            <span className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">4</span>
            <span>Configure your notification preferences and message templates</span>
          </li>
        </ul>
      </div>

      <button
        onClick={onComplete}
        className="w-full px-6 py-3 text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all flex items-center justify-center"
      >
        Go to Dashboard
        <ChevronRight size={20} className="ml-2" />
      </button>
    </div>
  );
};

export default ThanksStep;