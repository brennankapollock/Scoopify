import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import { BusinessOnboardingData } from '../../types/business';
import { OnboardingData } from '../../types/onboarding';
import BusinessNav from '../landing/sections/business/BusinessNav';
import ErrorScreen from './ErrorScreen';
import LoadingScreen from './LoadingScreen';
import DeclineStep from './steps/DeclineStep';
import DogStep from './steps/DogStep';
import InfoStep from './steps/InfoStep';
import QuoteStep from './steps/QuoteStep';
import ServiceStep from './steps/ServiceStep';
import ThanksStep from './steps/ThanksStep';
import ZipStep from './steps/ZipStep';

type OnboardingStep =
  | 'zip'
  | 'info'
  | 'service'
  | 'dogs'
  | 'quote'
  | 'decline'
  | 'thanks';

const initialData: OnboardingData = {
  zipCode: '',
  fullName: '',
  phone: '',
  email: '',
  address: '',
  service: {
    type: 'weekly',
    basePrice: 29.99,
  },
  addOns: [],
  dogs: {
    count: 1,
    details: [
      {
        name: '',
        breed: '',
        treats: false,
      },
    ],
  },
};

const CustomerOnboardingFlow = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const { getBusiness, createCustomer } = useAuth();

  const [currentStep, setCurrentStep] = useState<OnboardingStep>('zip');
  const [data, setData] = useState<OnboardingData>(initialData);
  const [businessData, setBusinessData] =
    useState<BusinessOnboardingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBusinessData = async () => {
      if (!businessId) {
        setError('Business ID is required');
        setLoading(false);
        return;
      }

      try {
        const business = await getBusiness(businessId);
        if (!business) {
          setError('Business not found');
        } else {
          setBusinessData(business);
          updateBrandColors(business.branding.colors);
        }
      } catch (err) {
        setError('Failed to load business data');
        console.error('Error loading business:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBusinessData();
  }, [businessId, getBusiness]);

  const handleNext = async (stepData: Partial<OnboardingData>) => {
    const updatedData = { ...data, ...stepData };
    setData(updatedData);

    // If we're on the quote step and moving forward, it means the quote was approved
    if (currentStep === 'quote') {
      try {
        if (!businessId) throw new Error('Business ID is required');

        // Create the customer in Firebase
        await createCustomer(businessId, updatedData);

        // Calculate total quote amount
        const serviceOffering = businessData?.services.offerings.find(
          (offering) => offering.id === updatedData.service.type
        );
        const basePrice = serviceOffering?.price || 0;
        const additionalDogsCost =
          updatedData.dogs.count > 2 ? (updatedData.dogs.count - 2) * 10 : 0;
        const treatsCost =
          updatedData.dogs.details.filter((dog) => dog.treats).length * 5;
        const quoteTotal = basePrice + additionalDogsCost + treatsCost;

        // Send email notification
        try {
          await sendNewCustomerNotification({
            businessEmail: businessData?.email || '',
            businessName: businessData?.businessName || '',
            customerName: updatedData.fullName,
            customerEmail: updatedData.email,
            customerPhone: updatedData.phone,
            numberOfDogs: updatedData.dogs.count,
            serviceType: updatedData.service.type,
            quoteTotal: quoteTotal,
          });
        } catch (emailError) {
          console.error('Error sending notification email:', emailError);
          // Don't block the flow if email fails
        }

        setCurrentStep('thanks');
        return;
      } catch (err) {
        console.error('Error creating customer:', err);
        setError('Failed to save your information. Please try again.');
        return;
      }
    }

    // For all other steps, move to the next step
    const steps: OnboardingStep[] = [
      'zip',
      'info',
      'service',
      'dogs',
      'quote',
      'decline',
      'thanks',
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: OnboardingStep[] = [
      'zip',
      'info',
      'service',
      'dogs',
      'quote',
      'decline',
      'thanks',
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleDecline = () => {
    setCurrentStep('decline');
  };

  const handleAcceptOffer = async (offer: any) => {
    try {
      if (!businessId) throw new Error('Business ID is required');

      // Add the offer to the customer data
      const updatedData = {
        ...data,
        offer: offer,
      };

      await createCustomer(businessId, updatedData);
      setCurrentStep('thanks');
    } catch (err) {
      console.error('Error creating customer:', err);
      setError('Failed to save your information. Please try again.');
    }
  };

  const handleFinalDecline = () => {
    // Here you could log the decline reason or take other actions
    navigate('/');
  };

  const updateBrandColors = (colors: {
    primary: string;
    secondary: string;
  }) => {
    const root = document.documentElement;
    const primary = colors.primary;

    root.style.setProperty('--color-primary-50', adjustColor(primary, 0.95));
    root.style.setProperty('--color-primary-100', adjustColor(primary, 0.9));
    root.style.setProperty('--color-primary-200', adjustColor(primary, 0.8));
    root.style.setProperty('--color-primary-300', adjustColor(primary, 0.6));
    root.style.setProperty('--color-primary-400', adjustColor(primary, 0.4));
    root.style.setProperty('--color-primary-500', primary);
    root.style.setProperty('--color-primary-600', darkenColor(primary, 0.1));
    root.style.setProperty('--color-primary-700', darkenColor(primary, 0.2));
    root.style.setProperty('--color-primary-800', darkenColor(primary, 0.3));
    root.style.setProperty('--color-primary-900', darkenColor(primary, 0.4));
    root.style.setProperty('--color-primary-950', darkenColor(primary, 0.5));
  };

  const hexToRGB = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const adjustColor = (hex: string, factor: number) => {
    const rgb = hexToRGB(hex);
    const adjusted = {
      r: Math.round(rgb.r + (255 - rgb.r) * factor),
      g: Math.round(rgb.g + (255 - rgb.g) * factor),
      b: Math.round(rgb.b + (255 - rgb.b) * factor),
    };
    return `rgb(${adjusted.r}, ${adjusted.g}, ${adjusted.b})`;
  };

  const darkenColor = (hex: string, factor: number) => {
    const rgb = hexToRGB(hex);
    const darkened = {
      r: Math.round(rgb.r * (1 - factor)),
      g: Math.round(rgb.g * (1 - factor)),
      b: Math.round(rgb.b * (1 - factor)),
    };
    return `rgb(${darkened.r}, ${darkened.g}, ${darkened.b})`;
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !businessData) {
    return <ErrorScreen error={error || 'Business data not available'} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700">
      <BusinessNav business={businessData} />

      <div className="pt-20 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome to {businessData.businessName}!
            </h1>
            <p className="text-primary-100">
              Complete the form below to get a free instant quote
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20"
            >
              {currentStep === 'zip' && (
                <ZipStep
                  onNext={handleNext}
                  data={data}
                  businessData={businessData}
                />
              )}
              {currentStep === 'info' && (
                <InfoStep
                  onNext={handleNext}
                  onBack={handleBack}
                  data={data}
                  businessData={businessData}
                />
              )}
              {currentStep === 'service' && (
                <ServiceStep
                  onNext={handleNext}
                  onBack={handleBack}
                  data={data}
                  businessData={businessData}
                />
              )}
              {currentStep === 'dogs' && (
                <DogStep
                  onNext={handleNext}
                  onBack={handleBack}
                  data={data}
                  businessData={businessData}
                />
              )}
              {currentStep === 'quote' && (
                <QuoteStep
                  onNext={handleNext}
                  onBack={handleBack}
                  data={data}
                  businessData={businessData}
                  onDecline={handleDecline}
                />
              )}
              {currentStep === 'decline' && (
                <DeclineStep
                  onNext={handleNext}
                  onBack={handleBack}
                  data={data}
                  businessData={businessData}
                  onFinalDecline={handleFinalDecline}
                  onAcceptOffer={handleAcceptOffer}
                />
              )}
              {currentStep === 'thanks' && (
                <ThanksStep data={data} businessData={businessData} />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Progress Indicator */}
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              {[
                'zip',
                'info',
                'service',
                'dogs',
                'quote',
                'decline',
                'thanks',
              ].map((step, index) => (
                <div
                  key={step}
                  className={`w-2 h-2 rounded-full ${
                    index <=
                    [
                      'zip',
                      'info',
                      'service',
                      'dogs',
                      'quote',
                      'decline',
                      'thanks',
                    ].indexOf(currentStep)
                      ? 'bg-white'
                      : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-400/20 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default CustomerOnboardingFlow;
