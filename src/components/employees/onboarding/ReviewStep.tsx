import React, { useState } from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { Employee } from '../types';

interface ReviewStepProps {
  data: Employee;
  onBack: () => void;
  onComplete: (password: string) => void;
  loading: boolean;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ 
  data, 
  onBack, 
  onComplete,
  loading,
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    onComplete(password);
  };

  const sections = [
    {
      title: 'Personal Information',
      content: [
        ['Full Name', data.fullName],
        ['Email', data.email],
        ['Phone', data.phone],
        ['Address', data.address],
        ['Date of Birth', new Date(data.dateOfBirth || '').toLocaleDateString()],
      ],
    },
    {
      title: 'Emergency Contact',
      content: [
        ['Name', data.emergencyContact?.name],
        ['Relationship', data.emergencyContact?.relationship],
        ['Phone', data.emergencyContact?.phone],
      ],
    },
    {
      title: 'Availability',
      content: Object.entries(data.availability || {}).map(([day, { available }]) => [
        day.charAt(0).toUpperCase() + day.slice(1),
        available ? 'Available' : 'Not Available',
      ]),
    },
    {
      title: 'About You',
      content: [
        ['Favorite Food', data.personalityProfile?.favoriteFood],
        ['Appreciation Style', data.personalityProfile?.appreciationStyle],
        ['Work Style', data.personalityProfile?.workStyle],
        ['Hobbies', data.personalityProfile?.hobbies],
      ],
    },
  ];

  return (
    <div>
      <div className="mx-auto mb-6 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
        <Check size={24} className="text-primary-600" />
      </div>
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
        Review Your Information
      </h2>
      
      <p className="text-lg text-gray-600 mb-8 text-center">
        Please review all the information before finalizing your onboarding
      </p>

      <div className="space-y-6 mb-8">
        {sections.map((section) => (
          <div
            key={section.title}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {section.title}
              </h3>
            </div>
            <div className="p-4">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {section.content.map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-sm font-medium text-gray-500">{label}</dt>
                    <dd className="mt-1 text-sm text-gray-900">{value || 'Not provided'}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        ))}
      </div>

      {/* Password Setup */}
      <div className="mt-8 border-t border-gray-200 pt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Set Your Password</h3>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg"
              required
              minLength={8}
            />
            <p className="mt-1 text-sm text-gray-500">Must be at least 8 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg"
              required
            />
          </div>

          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onBack}
              disabled={loading}
              className="flex-1 px-6 py-3 text-lg font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                'Creating Account...'
              ) : (
                <>
                  Complete Setup
                  <ChevronRight size={20} className="ml-2" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewStep;