import React, { useState } from 'react';
import { Smile } from 'lucide-react';
import { Employee } from '../types';

interface PersonalityStepProps {
  onNext: (data: Partial<Employee>) => void;
  onBack: () => void;
  data: Employee;
}

const appreciationStyles = [
  'Words of Affirmation',
  'Acts of Service',
  'Quality Time',
  'Tangible Rewards',
  'Recognition',
];

const workStyles = [
  'Independent Worker',
  'Team Player',
  'Detail-Oriented',
  'Fast-Paced',
  'Methodical',
];

const PersonalityStep: React.FC<PersonalityStepProps> = ({ onNext, onBack, data }) => {
  const [formData, setFormData] = useState({
    personalityProfile: {
      favoriteFood: data.personalityProfile?.favoriteFood || '',
      appreciationStyle: data.personalityProfile?.appreciationStyle || '',
      workStyle: data.personalityProfile?.workStyle || '',
      hobbies: data.personalityProfile?.hobbies || '',
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <div>
      <Smile size={48} className="mx-auto mb-6 text-primary-600" />
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
        Get to Know You
      </h2>
      
      <p className="text-lg text-gray-600 mb-8 text-center">
        Help us understand how to make your work experience great!
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            What's your favorite food? 🍕
          </label>
          <input
            type="text"
            value={formData.personalityProfile.favoriteFood}
            onChange={(e) => setFormData({
              ...formData,
              personalityProfile: {
                ...formData.personalityProfile,
                favoriteFood: e.target.value,
              },
            })}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
            required
            placeholder="e.g., Pizza, Sushi, Tacos..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How do you prefer to be appreciated? 🌟
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {appreciationStyles.map((style) => (
              <label
                key={style}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.personalityProfile.appreciationStyle === style
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-200'
                }`}
              >
                <input
                  type="radio"
                  name="appreciationStyle"
                  value={style}
                  checked={formData.personalityProfile.appreciationStyle === style}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalityProfile: {
                      ...formData.personalityProfile,
                      appreciationStyle: e.target.value,
                    },
                  })}
                  className="sr-only"
                />
                <span className="text-sm">{style}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What's your work style? 💪
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {workStyles.map((style) => (
              <label
                key={style}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.personalityProfile.workStyle === style
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-200'
                }`}
              >
                <input
                  type="radio"
                  name="workStyle"
                  value={style}
                  checked={formData.personalityProfile.workStyle === style}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalityProfile: {
                      ...formData.personalityProfile,
                      workStyle: e.target.value,
                    },
                  })}
                  className="sr-only"
                />
                <span className="text-sm">{style}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            What are your hobbies? 🎨
          </label>
          <textarea
            value={formData.personalityProfile.hobbies}
            onChange={(e) => setFormData({
              ...formData,
              personalityProfile: {
                ...formData.personalityProfile,
                hobbies: e.target.value,
              },
            })}
            rows={3}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
            required
            placeholder="Tell us what you like to do in your free time..."
          />
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

export default PersonalityStep;