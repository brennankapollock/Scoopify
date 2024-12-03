import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BusinessOnboardingData, BusinessOnboardingStep } from './types';
import { useAuth } from '../../contexts/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import WelcomeStep from './steps/WelcomeStep';
import BusinessInfoStep from './steps/BusinessInfoStep';
import ServiceAreaStep from './steps/ServiceAreaStep';
import ServicesStep from './steps/ServicesStep';
import EmployeesStep from './steps/EmployeesStep';
import CustomersStep from './steps/CustomersStep';
import SchedulingStep from './steps/SchedulingStep';
import BillingStep from './steps/BillingStep';
import NotificationsStep from './steps/NotificationsStep';
import BrandingStep from './steps/BrandingStep';
import ReviewStep from './steps/ReviewStep';
import ThanksStep from './steps/ThanksStep';

const initialData: BusinessOnboardingData = {
  businessName: '',
  contactName: '',
  phone: '',
  email: '',
  password: '',
  address: '',
  businessHours: {
    monday: { isOpen: true, open: '09:00', close: '17:00' },
    tuesday: { isOpen: true, open: '09:00', close: '17:00' },
    wednesday: { isOpen: true, open: '09:00', close: '17:00' },
    thursday: { isOpen: true, open: '09:00', close: '17:00' },
    friday: { isOpen: true, open: '09:00', close: '17:00' },
    saturday: { isOpen: false, open: '09:00', close: '17:00' },
    sunday: { isOpen: false, open: '09:00', close: '17:00' },
  },
  timezone: 'America/Chicago',
  serviceArea: {
    neighborhoods: [],
    zipCodes: [],
    cities: [],
  },
  services: {
    types: [],
    offerings: [],
    additionalFees: [],
  },
  employees: [],
  customerFields: {
    required: ['name', 'email', 'phone', 'address'],
    optional: ['notes', 'gate_code'],
  },
  schedulingPreferences: {
    availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    timeWindows: [{ start: '09:00', end: '17:00' }],
    serviceIntervals: { min: 1, max: 4 },
    dayZones: {},
  },
  billing: {
    paymentInterval: 'monthly',
    paymentMethods: ['credit_card', 'bank_transfer'],
    autoInvoicing: true,
  },
  notifications: {
    templates: {},
    channels: {
      email: true,
      sms: false,
      push: false,
    },
  },
  branding: {
    colors: {
      primary: '#5f5ad1',
      secondary: '#1e293b',
    },
    companyTerms: '',
    privacyPolicy: false,
  },
};

const BusinessOnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState<BusinessOnboardingStep>('welcome');
  const [data, setData] = useState<BusinessOnboardingData>(initialData);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNext = async (stepData: Partial<BusinessOnboardingData>) => {
    const updatedData = { ...data, ...stepData };
    setData(updatedData);
    
    const steps: BusinessOnboardingStep[] = [
      'welcome',
      'business-info',
      'service-area',
      'services',
      'employees',
      'customers',
      'scheduling',
      'billing',
      'notifications',
      'branding',
      'review',
      'thanks',
    ];
    const currentIndex = steps.indexOf(currentStep);

    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: BusinessOnboardingStep[] = [
      'welcome',
      'business-info',
      'service-area',
      'services',
      'employees',
      'customers',
      'scheduling',
      'billing',
      'notifications',
      'branding',
      'review',
      'thanks',
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleComplete = async () => {
    if (loading || !data.password) return;

    try {
      setError(null);
      setLoading(true);

      // Create user account with provided password
      const { user } = await signUp(data.email, data.password, 'business_owner');
      if (!user) throw new Error('Failed to create user account');

      // Create business document
      const businessRef = doc(db, 'businesses', user.uid);
      const businessData = {
        ...data,
        ownerId: user.uid,
        password: undefined, // Remove password from business doc
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Remove any undefined or function values
      const cleanedData = JSON.parse(JSON.stringify(businessData));
      await setDoc(businessRef, cleanedData);

      // Create user document
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        email: data.email,
        businessId: user.uid,
        role: 'business_owner',
        createdAt: new Date().toISOString(),
      });

      setCurrentStep('thanks');
    } catch (error: any) {
      console.error('Error completing business setup:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please use a different email address or login to your existing account.');
      } else {
        setError('Failed to complete business setup. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-8"
          >
            {currentStep === 'welcome' && (
              <WelcomeStep onNext={handleNext} data={data} />
            )}
            {currentStep === 'business-info' && (
              <BusinessInfoStep onNext={handleNext} onBack={handleBack} data={data} />
            )}
            {currentStep === 'service-area' && (
              <ServiceAreaStep onNext={handleNext} onBack={handleBack} data={data} />
            )}
            {currentStep === 'services' && (
              <ServicesStep onNext={handleNext} onBack={handleBack} data={data} />
            )}
            {currentStep === 'employees' && (
              <EmployeesStep onNext={handleNext} onBack={handleBack} data={data} />
            )}
            {currentStep === 'customers' && (
              <CustomersStep onNext={handleNext} onBack={handleBack} data={data} />
            )}
            {currentStep === 'scheduling' && (
              <SchedulingStep onNext={handleNext} onBack={handleBack} data={data} />
            )}
            {currentStep === 'billing' && (
              <BillingStep onNext={handleNext} onBack={handleBack} data={data} />
            )}
            {currentStep === 'notifications' && (
              <NotificationsStep onNext={handleNext} onBack={handleBack} data={data} />
            )}
            {currentStep === 'branding' && (
              <BrandingStep onNext={handleNext} onBack={handleBack} data={data} />
            )}
            {currentStep === 'review' && (
              <ReviewStep 
                data={data} 
                onBack={handleBack} 
                onComplete={handleComplete}
                loading={loading}
              />
            )}
            {currentStep === 'thanks' && (
              <ThanksStep data={data} onComplete={() => navigate('/dashboard')} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Progress Indicator */}
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index <= ['welcome', 'business-info', 'service-area', 'services', 'employees', 'customers', 'scheduling', 'billing', 'notifications', 'branding', 'review', 'thanks'].indexOf(currentStep)
                    ? 'bg-primary-600'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessOnboardingFlow;