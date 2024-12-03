import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import CustomerHeader from './CustomerHeader';
import StatisticsCards from './StatisticsCards';
import DogProfiles from './DogProfiles';
import ServiceOverview from './ServiceOverview';
import ReferralSection from './ReferralSection';
import RewardsProgress from './RewardsProgress';

const CustomerDashboard = () => {
  const { businessId } = useParams();
  const { user, getBusiness } = useAuth();
  const [businessData, setBusinessData] = React.useState<any>(null);

  React.useEffect(() => {
    const loadBusinessData = async () => {
      if (businessId) {
        const business = await getBusiness(businessId);
        if (business) {
          setBusinessData(business);
          updateBrandColors(business.branding.colors);
        }
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
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Stats Cards - Full Width on Mobile */}
          <div className="lg:col-span-12">
            <StatisticsCards />
          </div>

          {/* Rewards Section - Moves up on Mobile */}
          <div className="lg:col-span-4 lg:order-2">
            <div className="space-y-8 sticky top-8">
              <RewardsProgress />
              <ReferralSection />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8 lg:order-1">
            <DogProfiles />
            <ServiceOverview />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;