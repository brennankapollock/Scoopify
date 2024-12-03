import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OnboardingData, OnboardingStep } from './types';
import ZipStep from './steps/ZipStep';
import InfoStep from './steps/InfoStep';
import ServiceStep from './steps/ServiceStep';
import DogStep from './steps/DogStep';
import QuoteStep from './steps/QuoteStep';
import ThanksStep from './steps/ThanksStep';

const initialData: OnboardingData = {
  zipCode: '',
  fullName: '',
  phone: '',
  email: '',
  address: '',
  service: {
    type: 'weekly',
    basePrice: 29.99
  },
  addOns: [],
  dogs: {
    count: 1,
    details: [{
      name: '',
      breed: '',
      treats: false
    }]
  }
};

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('zip');
  const [data, setData] = useState<OnboardingData>(initialData);

  const handleNext = (stepData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...stepData }));
    
    const steps: OnboardingStep[] = ['zip', 'info', 'service', 'dogs', 'quote', 'thanks'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: OnboardingStep[] = ['zip', 'info', 'service', 'dogs', 'quote', 'thanks'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-8"
        >
          {currentStep === 'zip' && (
            <ZipStep onNext={handleNext} data={data} />
          )}
          {currentStep === 'info' && (
            <InfoStep onNext={handleNext} onBack={handleBack} data={data} />
          )}
          {currentStep === 'service' && (
            <ServiceStep onNext={handleNext} onBack={handleBack} data={data} />
          )}
          {currentStep === 'dogs' && (
            <DogStep onNext={handleNext} onBack={handleBack} data={data} />
          )}
          {currentStep === 'quote' && (
            <QuoteStep onNext={handleNext} onBack={handleBack} data={data} />
          )}
          {currentStep === 'thanks' && (
            <ThanksStep data={data} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default OnboardingFlow;