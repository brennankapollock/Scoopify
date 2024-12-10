import React, { useEffect } from 'react';
import { useAuth } from '../contexts/auth';
import Header from './Header';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, getBusiness } = useAuth();
  const isEmployee = user?.role === 'employee';

  useEffect(() => {
    const loadBusinessData = async () => {
      if (user?.businessId) {
        try {
          const business = await getBusiness(user.businessId);
          if (business?.branding?.colors?.primary) {
            updateBrandColors(business.branding.colors.primary);
          }
        } catch (error) {
          console.error('Error loading business data:', error);
        }
      }
    };

    loadBusinessData();
  }, [user, getBusiness]);

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

  const updateBrandColors = (primaryColor: string) => {
    const root = document.documentElement;

    // Set lighter shades
    root.style.setProperty(
      '--color-primary-50',
      adjustColor(primaryColor, 0.95)
    );
    root.style.setProperty(
      '--color-primary-100',
      adjustColor(primaryColor, 0.9)
    );
    root.style.setProperty(
      '--color-primary-200',
      adjustColor(primaryColor, 0.8)
    );
    root.style.setProperty(
      '--color-primary-300',
      adjustColor(primaryColor, 0.6)
    );
    root.style.setProperty(
      '--color-primary-400',
      adjustColor(primaryColor, 0.4)
    );

    // Set base color
    root.style.setProperty('--color-primary-500', primaryColor);

    // Set darker shades
    root.style.setProperty(
      '--color-primary-600',
      darkenColor(primaryColor, 0.1)
    );
    root.style.setProperty(
      '--color-primary-700',
      darkenColor(primaryColor, 0.2)
    );
    root.style.setProperty(
      '--color-primary-800',
      darkenColor(primaryColor, 0.3)
    );
    root.style.setProperty(
      '--color-primary-900',
      darkenColor(primaryColor, 0.4)
    );
    root.style.setProperty(
      '--color-primary-950',
      darkenColor(primaryColor, 0.5)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      <Header showFullNav={!isEmployee} />
      <div className="flex">
        <Sidebar isEmployee={isEmployee} />
        <main className="flex-1 lg:ml-0 pt-24 px-2 pb-12">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
