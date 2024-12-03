import React, { useState } from 'react';
import { Dog } from 'lucide-react';
import { OnboardingData } from '../../onboarding/types';
import { BusinessOnboardingData } from '../../business-onboarding/types';

interface DogStepProps {
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  data: OnboardingData;
  businessData: BusinessOnboardingData;
}

const DogStep: React.FC<DogStepProps> = ({ onNext, onBack, data, businessData }) => {
  const [dogCount, setDogCount] = useState(data.dogs.count);
  const [dogDetails, setDogDetails] = useState(data.dogs.details);

  const handleDogCountChange = (count: number) => {
    setDogCount(count);
    if (count > dogDetails.length) {
      // Add new dogs
      setDogDetails([
        ...dogDetails,
        ...Array(count - dogDetails.length).fill(null).map(() => ({
          name: '',
          breed: '',
          treats: false,
        })),
      ]);
    } else {
      // Remove excess dogs
      setDogDetails(dogDetails.slice(0, count));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      dogs: {
        count: dogCount,
        details: dogDetails,
      },
    });
  };

  const updateDogDetail = (index: number, field: keyof typeof dogDetails[0], value: string | boolean) => {
    const newDetails = [...dogDetails];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setDogDetails(newDetails);
  };

  return (
    <div>
      <Dog size={48} className="mx-auto mb-6 text-primary-600" />
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
        Tell us about your dogs
      </h2>
      
      <p className="text-lg text-gray-600 mb-8 text-center">
        We'll customize our service based on your pets
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How many dogs do you have?
          </label>
          <select
            value={dogCount}
            onChange={(e) => handleDogCountChange(parseInt(e.target.value))}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Dog' : 'Dogs'}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-6">
          {dogDetails.map((dog, index) => (
            <div
              key={index}
              className="p-6 border-2 border-gray-200 rounded-lg space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                Dog #{index + 1}
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={dog.name}
                  onChange={(e) => updateDogDetail(index, 'name', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Breed
                </label>
                <input
                  type="text"
                  value={dog.breed}
                  onChange={(e) => updateDogDetail(index, 'breed', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
                  required
                />
              </div>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={dog.treats}
                  onChange={(e) => updateDogDetail(index, 'treats', e.target.checked)}
                  className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">
                  Would you like us to leave treats? (+$5/mo)
                </span>
              </label>
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
            className="flex-1 px-6 py-3 text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default DogStep;