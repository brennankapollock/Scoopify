import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/auth';
import SettingSection from '../SettingSection';
import { BusinessOnboardingData } from '../../../types/business';
import { ChevronDown, ChevronUp, Building2, MapPin, Clock, Users, DollarSign, Bell, Palette } from 'lucide-react';
import BusinessInfoSection from './business/BusinessInfoSection';
import ServiceAreaSection from './business/ServiceAreaSection';
import BusinessHoursSection from './business/BusinessHoursSection';
import ServicesSection from './business/ServicesSection';
import EmployeesSection from './business/EmployeesSection';
import NotificationsSection from './business/NotificationsSection';
import BrandingSection from './business/BrandingSection';

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  component: React.ComponentType<{
    data: BusinessOnboardingData;
    onChange: (data: BusinessOnboardingData) => void;
  }>;
}

const sections: SettingsSection[] = [
  {
    id: 'business-info',
    title: 'Business Information',
    icon: Building2,
    description: 'Basic business details and contact information',
    component: BusinessInfoSection
  },
  {
    id: 'service-area',
    title: 'Service Area',
    icon: MapPin,
    description: 'Manage your service locations and coverage',
    component: ServiceAreaSection
  },
  {
    id: 'business-hours',
    title: 'Business Hours',
    icon: Clock,
    description: 'Set your operating hours and availability',
    component: BusinessHoursSection
  },
  {
    id: 'services',
    title: 'Services & Pricing',
    icon: DollarSign,
    description: 'Configure your service offerings and rates',
    component: ServicesSection
  },
  {
    id: 'employees',
    title: 'Employee Management',
    icon: Users,
    description: 'Manage your team and roles',
    component: EmployeesSection
  },
  {
    id: 'notifications',
    title: 'Notification Templates',
    icon: Bell,
    description: 'Customize your customer communication',
    component: NotificationsSection
  },
  {
    id: 'branding',
    title: 'Branding',
    icon: Palette,
    description: 'Manage your brand appearance and assets',
    component: BrandingSection
  }
];

const BusinessSettings = () => {
  const { user, getBusiness, updateBusiness } = useAuth();
  const [businessData, setBusinessData] = useState<BusinessOnboardingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [savingSection, setSavingSection] = useState<string | null>(null);

  useEffect(() => {
    const loadBusinessData = async () => {
      if (user?.businessId) {
        try {
          const data = await getBusiness(user.businessId);
          if (data) {
            setBusinessData(data);
          }
        } catch (error) {
          console.error('Error loading business data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadBusinessData();
  }, [user, getBusiness]);

  const handleSaveSection = async (sectionId: string) => {
    if (!user?.businessId || !businessData) return;

    setSavingSection(sectionId);
    try {
      await updateBusiness(user.businessId, businessData);
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successMessage.textContent = 'Changes saved successfully';
      document.body.appendChild(successMessage);
      setTimeout(() => {
        document.body.removeChild(successMessage);
      }, 3000);
    } catch (error) {
      console.error('Error saving business settings:', error);
      // Show error message
      const errorMessage = document.createElement('div');
      errorMessage.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorMessage.textContent = 'Failed to save changes';
      document.body.appendChild(errorMessage);
      setTimeout(() => {
        document.body.removeChild(errorMessage);
      }, 3000);
    } finally {
      setSavingSection(null);
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!businessData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No business data found</p>
      </div>
    );
  }

  return (
    <SettingSection 
      title="Business Settings" 
      description="Manage your business information and preferences"
    >
      <div className="space-y-4">
        {sections.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSection === section.id;
          const isSaving = savingSection === section.id;
          const SectionComponent = section.component;

          return (
            <div 
              key={section.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className="text-primary-600" size={24} />
                  <div className="text-left">
                    <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                    <p className="text-sm text-gray-500">{section.description}</p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="text-gray-400" size={20} />
                ) : (
                  <ChevronDown className="text-gray-400" size={20} />
                )}
              </button>

              {isExpanded && (
                <div className="px-6 pb-6 border-t border-gray-200">
                  <div className="mt-6">
                    <SectionComponent 
                      data={businessData}
                      onChange={setBusinessData}
                    />
                    <div className="flex justify-end mt-6">
                      <button
                        type="button"
                        onClick={() => handleSaveSection(section.id)}
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50"
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </SettingSection>
  );
};

export default BusinessSettings;