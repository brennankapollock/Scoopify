import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import LoadingScreen from '../customer-onboarding/LoadingScreen';
import ErrorScreen from '../customer-onboarding/ErrorScreen';
import HeroSection from './sections/business/HeroSection';
import ServicesSection from './sections/business/ServicesSection';
import AboutSection from './sections/business/AboutSection';
import { useEffect } from 'react';
import TestimonialsSection from './sections/business/TestimonialsSection';
import CTASection from './sections/business/CTASection';
import BusinessFooter from './sections/business/BusinessFooter';
import BusinessNav from './sections/business/BusinessNav';

const BusinessLandingPageContent = () => {
  const { businessId } = useParams();
  const { getBusiness, user } = useAuth();
  const [businessData, setBusinessData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Update document title with business name
  useEffect(() => {
    if (businessData?.businessName) {
      document.title = `${businessData.businessName} | Pet Waste Removal`;
    }
  }, [businessData?.businessName]);

  React.useEffect(() => {
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
          // Update CSS variables with business colors
          updateBrandColors(business);
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

  // Helper function to convert hex to RGB
  const hexToRGB = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  // Helper function to adjust color brightness
  const adjustColor = (hex: string, factor: number) => {
    const rgb = hexToRGB(hex);
    const adjusted = {
      r: Math.round(rgb.r + (255 - rgb.r) * factor),
      g: Math.round(rgb.g + (255 - rgb.g) * factor),
      b: Math.round(rgb.b + (255 - rgb.b) * factor),
    };
    return `rgb(${adjusted.r}, ${adjusted.g}, ${adjusted.b})`;
  };

  // Helper function to darken color
  const darkenColor = (hex: string, factor: number) => {
    const rgb = hexToRGB(hex);
    const darkened = {
      r: Math.round(rgb.r * (1 - factor)),
      g: Math.round(rgb.g * (1 - factor)),
      b: Math.round(rgb.b * (1 - factor)),
    };
    return `rgb(${darkened.r}, ${darkened.g}, ${darkened.b})`;
  };

  // Update CSS variables with business colors
  const updateBrandColors = (business: any) => {
    const primary = business.branding?.colors?.primary || '#5f5ad1';
    const root = document.documentElement;

    // Set lighter shades
    root.style.setProperty('--color-primary-50', adjustColor(primary, 0.95));
    root.style.setProperty('--color-primary-100', adjustColor(primary, 0.9));
    root.style.setProperty('--color-primary-200', adjustColor(primary, 0.8));
    root.style.setProperty('--color-primary-300', adjustColor(primary, 0.6));
    root.style.setProperty('--color-primary-400', adjustColor(primary, 0.4));
    
    // Set base color
    root.style.setProperty('--color-primary-500', primary);
    
    // Set darker shades
    root.style.setProperty('--color-primary-600', darkenColor(primary, 0.1));
    root.style.setProperty('--color-primary-700', darkenColor(primary, 0.2));
    root.style.setProperty('--color-primary-800', darkenColor(primary, 0.3));
    root.style.setProperty('--color-primary-900', darkenColor(primary, 0.4));
    root.style.setProperty('--color-primary-950', darkenColor(primary, 0.5));
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !businessData) {
    return <ErrorScreen error={error || 'Business data not available'} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <BusinessNav business={businessData} />
      <div className="pt-8">
        <HeroSection business={businessData} />
        <ServicesSection business={businessData} />
        <AboutSection business={businessData} />
        <TestimonialsSection business={businessData} />
        <CTASection business={businessData} />
        <BusinessFooter business={businessData} />
      </div>
    </div>
  );
};

// Wrapper component that doesn't use any hooks
const BusinessLandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <BusinessLandingPageContent />
    </div>
  );
};

export default BusinessLandingPage;