import React, { useState } from 'react';
import { PartyPopper, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/auth';
import { OnboardingData } from '../../../types/onboarding';
import { BusinessOnboardingData } from '../../../types/business';

interface ThanksStepProps {
  data: OnboardingData;
  businessData: BusinessOnboardingData;
}

const ThanksStep: React.FC<ThanksStepProps> = ({ data, businessData }) => {
  const navigate = useNavigate();
  const { businessId } = useParams();
  const { signUp } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signUp(data.email, password, 'customer');
      setAccountCreated(true);
    } catch (err) {
      console.error('Error creating account:', err);
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    navigate(`/businesses/${businessId}/login`, { 
      state: { 
        email: data.email,
        message: 'Account created successfully! Please log in to access your dashboard.' 
      }
    });
  };

  return (
    <div className="text-center">
      <PartyPopper size={48} className="mx-auto mb-6 text-primary-600" />
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Welcome to {businessData.businessName}!
      </h2>
      
      <p className="text-lg text-gray-600 mb-8">
        Your service is scheduled to begin soon. Let's create your account so you can manage everything online.
      </p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {!accountCreated ? (
        <form onSubmit={handleCreateAccount} className="space-y-6 max-w-md mx-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={data.email}
              disabled
              className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-300 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Create Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Choose a password"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Confirm your password"
                required
                minLength={8}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all flex items-center justify-center disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      ) : (
        <>
          <div className="bg-primary-50 rounded-lg p-6 mb-8">
            <h3 className="font-medium text-gray-900 mb-4">
              What's Next?
            </h3>
            <ul className="text-left space-y-4">
              <li className="flex items-start">
                <span className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">1</span>
                <span>Log in to access your customer dashboard</span>
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">2</span>
                <span>Our team will contact you to confirm your first service date</span>
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">3</span>
                <span>Set up your payment information in the dashboard</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleGoToDashboard}
            className="w-full px-6 py-3 text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all flex items-center justify-center"
          >
            Go to Dashboard
            <ArrowRight size={20} className="ml-2" />
          </button>

          <p className="mt-4 text-sm text-gray-500">
            Questions? Contact us at:
            <br />
            <a href={`mailto:${businessData.email}`} className="font-medium text-primary-600">
              {businessData.email}
            </a>
            <br />
            <a href={`tel:${businessData.phone}`} className="font-medium text-primary-600">
              {businessData.phone}
            </a>
          </p>
        </>
      )}
    </div>
  );
};

export default ThanksStep;