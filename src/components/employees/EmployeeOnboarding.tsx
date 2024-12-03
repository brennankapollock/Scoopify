import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/auth';
import { Employee } from './types';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import BusinessHeader from '../customer-onboarding/BusinessHeader';
import WelcomeStep from './onboarding/WelcomeStep';
import PersonalInfoStep from './onboarding/PersonalInfoStep';
import EmergencyContactStep from './onboarding/EmergencyContactStep';
import AvailabilityStep from './onboarding/AvailabilityStep';
import PersonalityStep from './onboarding/PersonalityStep';
import DocumentsStep from './onboarding/DocumentsStep';
import ReviewStep from './onboarding/ReviewStep';

type OnboardingStep = 
  | 'welcome'
  | 'personal'
  | 'emergency'
  | 'availability'
  | 'personality'
  | 'documents'
  | 'review';

const initialEmployeeData: Omit<Employee, 'id'> = {
  fullName: '',
  email: '',
  phone: '',
  position: 'Yard Technician',
  teamSince: new Date().toISOString().split('T')[0],
  status: 'pending',
  certifications: [],
  startDate: new Date().toISOString().split('T')[0],
  address: '',
  dateOfBirth: '',
  emergencyContact: {
    name: '',
    relationship: '',
    phone: '',
  },
  availability: {
    monday: { available: true },
    tuesday: { available: true },
    wednesday: { available: true },
    thursday: { available: true },
    friday: { available: true },
    saturday: { available: false },
    sunday: { available: false },
  },
  documents: {
    w4: false,
    i9: false,
    driversLicense: false,
    directDeposit: false,
  },
  personalityProfile: {
    favoriteFood: '',
    appreciationStyle: '',
    workStyle: '',
    hobbies: '',
  },
};

const EmployeeOnboarding = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const { getBusiness, createEmployee } = useAuth();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [formData, setFormData] = useState(initialEmployeeData);
  const [businessData, setBusinessData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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

  const updateBrandColors = (colors: { primary: string; secondary: string }) => {
    const root = document.documentElement;
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

    root.style.setProperty('--color-primary-50', adjustColor(colors.primary, 0.95));
    root.style.setProperty('--color-primary-100', adjustColor(colors.primary, 0.9));
    root.style.setProperty('--color-primary-200', adjustColor(colors.primary, 0.8));
    root.style.setProperty('--color-primary-300', adjustColor(colors.primary, 0.6));
    root.style.setProperty('--color-primary-400', adjustColor(colors.primary, 0.4));
    root.style.setProperty('--color-primary-500', colors.primary);
    root.style.setProperty('--color-primary-600', darkenColor(colors.primary, 0.1));
    root.style.setProperty('--color-primary-700', darkenColor(colors.primary, 0.2));
    root.style.setProperty('--color-primary-800', darkenColor(colors.primary, 0.3));
    root.style.setProperty('--color-primary-900', darkenColor(colors.primary, 0.4));
    root.style.setProperty('--color-primary-950', darkenColor(colors.primary, 0.5));
  };

  const handleNext = (stepData: Partial<Employee>) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);

    const steps: OnboardingStep[] = [
      'welcome',
      'personal',
      'emergency',
      'availability',
      'personality',
      'documents',
      'review',
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: OnboardingStep[] = [
      'welcome',
      'personal',
      'emergency',
      'availability',
      'personality',
      'documents',
      'review',
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleComplete = async (password: string) => {
    if (!businessId || saving) return;

    try {
      setSaving(true);
      setError(null);

      await createEmployee(businessId, formData, password);

      // Redirect to success page or login
      navigate(`/businesses/${businessId}/login`, {
        state: { 
          email: formData.email,
          message: 'Employee account created successfully! Please log in with your email and password.' 
        }
      });
    } catch (err) {
      console.error('Error during employee onboarding:', err);
      setError('Failed to complete onboarding. Please try again.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !businessData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600">{error || 'Business data not available'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700">
      <BusinessHeader business={businessData} />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20"
          >
            {currentStep === 'welcome' && (
              <WelcomeStep onNext={handleNext} businessData={businessData} />
            )}
            {currentStep === 'personal' && (
              <PersonalInfoStep onNext={handleNext} onBack={handleBack} data={formData} />
            )}
            {currentStep === 'emergency' && (
              <EmergencyContactStep onNext={handleNext} onBack={handleBack} data={formData} />
            )}
            {currentStep === 'availability' && (
              <AvailabilityStep onNext={handleNext} onBack={handleBack} data={formData} />
            )}
            {currentStep === 'personality' && (
              <PersonalityStep onNext={handleNext} onBack={handleBack} data={formData} />
            )}
            {currentStep === 'documents' && (
              <DocumentsStep onNext={handleNext} onBack={handleBack} data={formData} />
            )}
            {currentStep === 'review' && (
              <ReviewStep
                data={formData}
                onBack={handleBack}
                onComplete={handleComplete}
                loading={saving}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Progress Indicator */}
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            {['welcome', 'personal', 'emergency', 'availability', 'personality', 'documents', 'review'].map((step, index) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full ${
                  index <= ['welcome', 'personal', 'emergency', 'availability', 'personality', 'documents', 'review'].indexOf(currentStep)
                    ? 'bg-white'
                    : 'bg-white/30'
                }`}
              />
            ))}
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

export default EmployeeOnboarding;