import React, { useState } from 'react';
import { X, ArrowLeft, Check } from 'lucide-react';
import { OnboardingData } from '../../onboarding/types';
import { BusinessOnboardingData } from '../../business-onboarding/types';

interface DeclineStepProps {
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  data: OnboardingData;
  businessData: BusinessOnboardingData;
  onFinalDecline: () => void;
  onAcceptOffer: (offer: any) => void;
}

interface DeclineReason {
  id: string;
  label: string;
  offer?: {
    type: 'discount' | 'promotion' | 'special';
    description: string;
    value: number;
  };
}

const declineReasons: DeclineReason[] = [
  {
    id: 'too_expensive',
    label: 'Service is too expensive',
    offer: {
      type: 'discount',
      description: 'First month 50% off!',
      value: 50
    }
  },
  {
    id: 'wrong_day',
    label: 'Service days don\'t work for me',
    offer: {
      type: 'promotion',
      description: 'Flexible scheduling - pick your preferred day!',
      value: 0
    }
  },
  {
    id: 'not_ready',
    label: 'Not ready to commit',
    offer: {
      type: 'special',
      description: 'Try us once for 50% off!',
      value: 50
    }
  },
  {
    id: 'comparing',
    label: 'Still comparing services',
    offer: {
      type: 'discount',
      description: 'Price match guarantee + 10% off first 3 months!',
      value: 10
    }
  },
  {
    id: 'other',
    label: 'Other reason'
  }
];

const DeclineStep: React.FC<DeclineStepProps> = ({ 
  onNext, 
  onBack, 
  data, 
  businessData,
  onFinalDecline,
  onAcceptOffer
}) => {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [showOffer, setShowOffer] = useState(false);
  const [otherReason, setOtherReason] = useState('');

  const handleReasonSelect = (reasonId: string) => {
    setSelectedReason(reasonId);
    const reason = declineReasons.find(r => r.id === reasonId);
    setShowOffer(!!reason?.offer);
  };

  const selectedReasonData = declineReasons.find(r => r.id === selectedReason);

  return (
    <div>
      <X size={48} className="mx-auto mb-6 text-gray-400" />
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
        We're Sorry to See You Go
      </h2>
      
      <p className="text-lg text-gray-600 mb-8 text-center">
        Would you mind letting us know why you're declining?
      </p>

      <div className="space-y-4 mb-8">
        {declineReasons.map((reason) => (
          <label
            key={reason.id}
            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedReason === reason.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-primary-200'
            }`}
          >
            <input
              type="radio"
              name="decline_reason"
              value={reason.id}
              checked={selectedReason === reason.id}
              onChange={() => handleReasonSelect(reason.id)}
              className="sr-only"
            />
            <span className={`text-base ${
              selectedReason === reason.id ? 'text-primary-700' : 'text-gray-700'
            }`}>
              {reason.label}
            </span>
          </label>
        ))}

        {selectedReason === 'other' && (
          <textarea
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
            placeholder="Please tell us more..."
            className="w-full mt-2 px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
            rows={3}
          />
        )}
      </div>

      {showOffer && selectedReasonData?.offer && (
        <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-primary-800 mb-2">
            Wait! We Have a Special Offer for You
          </h3>
          <p className="text-primary-700 mb-4">
            {selectedReasonData.offer.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onAcceptOffer(selectedReasonData.offer)}
              className="w-full sm:w-1/2 px-6 py-3 text-base font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all flex items-center justify-center"
            >
              <Check size={18} className="mr-2" />
              Accept Offer
            </button>
            <button
              onClick={onFinalDecline}
              className="w-full sm:w-1/2 px-6 py-3 text-base font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all flex items-center justify-center"
            >
              <X size={18} className="mr-2" />
              No Thanks
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onBack}
          className="w-full sm:w-1/2 px-6 py-3 text-lg font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all flex items-center justify-center"
        >
          <ArrowLeft size={20} className="mr-2" />
          Go Back
        </button>
        {!showOffer && (
          <button
            onClick={onFinalDecline}
            className="w-full sm:w-1/2 px-6 py-3 text-lg font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all flex items-center justify-center"
          >
            <X size={20} className="mr-2" />
            Confirm Decline
          </button>
        )}
      </div>
    </div>
  );
};

export default DeclineStep;