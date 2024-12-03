import React, { useState } from 'react';
import { ArrowLeft, Download, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Navbar from '../../landing/Navbar';
import AgreementForm from './AgreementForm';
import AgreementPreview from './AgreementPreview';
import { ServiceAgreement } from './types';
import { collection, addDoc } from 'firebase/firestore';
import { trackToolUsage } from '../../../lib/analytics';
import { db } from '../../../lib/firebase';

const initialAgreement: ServiceAgreement = {
  businessInfo: {
    businessName: '',
    ownerName: '',
    address: '',
    phone: '',
    email: '',
    website: '',
  },
  serviceDetails: {
    serviceFrequency: 'weekly',
    servicePrice: '',
    paymentSchedule: 'monthly',
    includedServices: [],
    customServices: [],
  },
  cancellationPolicy: {
    noticePeriod: '24hours',
    refundPolicy: 'none',
    cancellationFee: '',
  },
  liabilityTerms: {
    insuranceCoverage: '',
    propertyDamage: true,
    petInjury: true,
    customTerms: '',
  },
  useDefaultTerms: true,
  state: '',
  effectiveDate: new Date().toISOString().split('T')[0],
};

const ServiceAgreementGenerator = () => {
  const [agreement, setAgreement] = useState<ServiceAgreement>(initialAgreement);
  const [step, setStep] = useState<'form' | 'preview' | 'submit'>('form');
  const [submissionData, setSubmissionData] = useState({
    name: '',
    email: '',
    agreeToTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePreview = (data: ServiceAgreement) => {
    setAgreement(data);
    setStep('preview');
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
      // Track tool usage
      await trackToolUsage({
        name: submissionData.name,
        email: submissionData.email,
        toolId: 'service-agreement',
        userAgent: navigator.userAgent,
        referrer: document.referrer,
      });

      // Clean the agreement data before saving
      const cleanedAgreement = {
        ...agreement,
        businessInfo: Object.fromEntries(
          Object.entries(agreement.businessInfo).filter(([key]) => key !== 'logo')
        ),
        serviceDetails: {
          ...agreement.serviceDetails,
          servicePrice: parseFloat(agreement.serviceDetails.servicePrice.replace(/[^0-9.]/g, '')) || 0,
        },
        cancellationPolicy: {
          ...agreement.cancellationPolicy,
          cancellationFee: parseFloat(agreement.cancellationPolicy.cancellationFee.replace(/[^0-9.]/g, '')) || 0,
        }
      };
      
      // Create analytics data document
      const agreementsRef = collection(db, 'analytics', 'tools', 'service-agreements');
      await addDoc(agreementsRef, {
        userData: {
          name: submissionData.name,
          email: submissionData.email,
          agreeToTerms: true
        },
        agreementData: cleanedAgreement,
        createdAt: new Date().toISOString(),
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'direct',
        toolId: 'service-agreement',
        version: '1.0.0'
      });

      // Allow download
      setStep('download');
    } catch (err) {
      console.error('Error saving agreement data:', err);
      setError('There was an error processing your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Service Agreement Generator | Scoopify</title>
        <meta 
          name="description" 
          content="Create professional service agreements for your pet waste removal business with our easy-to-use generator."
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
                Service Agreement Generator
              </h1>
              <p className="text-gray-500 mt-1">
                Create professional service agreements for your business
              </p>
            </div>
          </div>

          {step === 'form' ? (
            <AgreementForm
              initialAgreement={initialAgreement}
              onGenerate={handleGeneratePreview}
            />
          ) : step === 'preview' ? (
            <div className="space-y-8">              
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
                    {loading ? 'Processing...' : 'Continue to Download'}
                  </button>
                </form>
              </div>
            </div>
          ) : step === 'download' ? (
            <AgreementPreview
              agreement={agreement}
              onBack={() => setStep('form')}
            />
          ) : null}
        </div>
      </div>
    </HelmetProvider>
  );
};

export default ServiceAgreementGenerator;