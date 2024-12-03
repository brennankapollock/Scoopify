import React, { useState } from 'react';
import { ArrowLeft, Download, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Navbar from '../../landing/Navbar';
import { trackToolUsage } from '../../../lib/analytics';
import LetterForm from './LetterForm';
import LetterPreview from './LetterPreview';
import { BusinessInfo, LetterOptions } from './types';

// Rest of imports...

const initialBusinessInfo: BusinessInfo = {
  businessName: '',
  ownerName: '',
  address: '',
  phone: '',
  email: '',
  website: '',
  priceChangeType: 'fixed',
  currentPrice: '',
  newPrice: '',
  percentageIncrease: '',
  effectiveDate: new Date().toISOString().split('T')[0],
};

const initialLetterOptions: LetterOptions = {
  tone: 'professional',
  includeThankYou: true,
  includeMarketFactors: true,
  includeValueProposition: true,
  includeEffectiveDate: true,
  includeContact: true,
};

const PriceIncreaseGenerator = () => {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(initialBusinessInfo);
  const [letterOptions, setLetterOptions] = useState<LetterOptions>(initialLetterOptions);
  const [step, setStep] = useState<'form' | 'preview'>('form');
  const [submissionData, setSubmissionData] = useState({
    name: '',
    email: '',
    agreeToTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePreview = (info: BusinessInfo, options: LetterOptions) => {
    setBusinessInfo(info);
    setLetterOptions(options);
    setStep('submit');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionData.agreeToTerms) {
      setError('You must agree to the terms to continue');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await trackToolUsage({
        name: submissionData.name,
        email: submissionData.email,
        toolId: 'price-increase',
        userAgent: navigator.userAgent,
        referrer: document.referrer,
      });
      setStep('preview');
    } catch (err) {
      console.error('Error saving user data:', err);
      setError('There was an error processing your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Price Increase Letter Generator | Scoopify</title>
        <meta 
          name="description" 
          content="Create professional price increase letters for your pet waste removal customers with our easy-to-use generator."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-white">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="flex items-center gap-4 mb-8">
            <Link
              to="/tools"
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              Back to Tools
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Price Increase Letter Generator
              </h1>
              <p className="text-gray-500 mt-1">
                Create professional price increase letters for your customers
              </p>
            </div>
          </div>

          {step === 'form' ? (
            <LetterForm
              initialBusinessInfo={initialBusinessInfo}
              initialLetterOptions={initialLetterOptions}
              onGenerate={handleGeneratePreview}
            />
          ) : step === 'submit' ? (
            <div className="max-w-2xl mx-auto bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Almost there! Please provide your information to continue
              </h3>

              {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={submissionData.name}
                    onChange={(e) => setSubmissionData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={submissionData.email}
                    onChange={(e) => setSubmissionData(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1 block w-full"
                  />
                </div>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={submissionData.agreeToTerms}
                    onChange={(e) => setSubmissionData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    I agree to allow Scoopify to collect this information for analytics purposes
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Continue to Preview'}
                </button>
              </form>
            </div>
          ) : (
            <LetterPreview
              businessInfo={businessInfo}
              letterOptions={letterOptions}
              onBack={() => setStep('form')}
            />
          )}
        </div>
      </div>
    </HelmetProvider>
  );
};

export default PriceIncreaseGenerator;