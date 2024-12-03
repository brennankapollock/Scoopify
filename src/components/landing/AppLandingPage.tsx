import React from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Navbar from './Navbar';
import HeroSection from './sections/app/HeroSection';
import FeaturesSection from './sections/app/FeaturesSection';
import TestimonialsSection from './sections/app/TestimonialsSection';
import PricingSection from './sections/app/PricingSection';
import CTASection from './sections/app/CTASection';
import AppFooter from './sections/app/AppFooter';

const AppLandingPage = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Scoopify - Pet Waste Removal Business Software</title>
        <meta 
          name="description" 
          content="Streamline your pet waste removal business with Scoopify's all-in-one management platform."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-white">
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
        <AppFooter />
      </div>
    </HelmetProvider>
  );
};

export default AppLandingPage;