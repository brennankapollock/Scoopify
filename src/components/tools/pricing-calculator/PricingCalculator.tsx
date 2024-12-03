import React, { useState } from 'react';
import { ArrowLeft, Download, ChevronRight, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Navbar from '../../landing/Navbar';
import { trackToolUsage } from '../../../lib/analytics';
import PricingForm from './PricingForm';
import PricingPreview from './PricingPreview';
import { PricingCalculatorData, Service } from './types';

const initialData: PricingCalculatorData = {
  businessInfo: {
    businessName: '',
    ownerName: '',
    address: '',
    phone: '',
    email: '',
    website: '',
  },
  services: [
    {
      id: 'weekly',
      name: 'Weekly Service',
      description: 'Regular weekly cleaning service',
      frequency: 'weekly',
      basePrice: 29.99,
      timePerYard: 15,
    },
    {
      id: 'biweekly',
      name: 'Bi-Weekly Service',
      description: 'Every other week cleaning service',
      frequency: 'bi-weekly',
      basePrice: 39.99,
      timePerYard: 20,
    },
    {
      id: 'deodorizer',
      name: 'Yard Deodorizer',
      description: 'Keep your yard fresh and clean',
      frequency: 'add-on',
      basePrice: 9.99,
      timePerYard: 5,
      isAddOn: true,
    },
  ],
  operatingCosts: {
    laborRate: 15,
    fuelCost: 3.50,
    vehicleMileage: 15,
    averageDriveDistance: 5,
    supplies: 2,
    insurance: 200,
    marketing: 300,
    overhead: 500,
  },
  profitTargets: {
    minimumProfit: 20,
    targetProfit: 30,
    maximumProfit: 40,
  },
};

// Rest of imports...

const PricingCalculator = () => {
  const [calculatorData, setCalculatorData] = useState<PricingCalculatorData>(initialData);
  const [step, setStep] = useState<'form' | 'preview'>('form');
  const [submissionData, setSubmissionData] = useState({
    name: '',
    email: '',
    agreeToTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePreview = (data: PricingCalculatorData) => {
    setCalculatorData(data);
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
        toolId: 'pricing-calculator',
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
        <title>Service Pricing Calculator | Scoopify</title>
        <meta 
          name="description" 
          content="Calculate optimal pricing for your pet waste removal services with our easy-to-use calculator."
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
                Service Pricing Calculator
              </h1>
              <p className="text-gray-500 mt-1">
                Calculate optimal pricing for your services
              </p>
            </div>
          </div>

          {step === 'form' ? (
            <PricingForm
              initialData={initialData}
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
                  {loading ? 'Processing...' : 'Continue to Results'}
                </button>
              </form>
            </div>
          ) : (
            <PricingPreview
              data={calculatorData}
              onBack={() => setStep('form')}
            />
          )}
        </div>
      </div>
    </HelmetProvider>
  );
};

export default PricingCalculator;