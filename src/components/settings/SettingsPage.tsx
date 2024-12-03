import React, { useState } from 'react';
import { Bell, Globe, Lock, Palette, Shield, User, Wallet, Building2 } from 'lucide-react';
import GeneralSettings from './sections/GeneralSettings';
import NotificationSettings from './sections/NotificationSettings';
import SecuritySettings from './sections/SecuritySettings';
import AppearanceSettings from './sections/AppearanceSettings';
import BillingSettings from './sections/BillingSettings';
import BusinessSettings from './sections/BusinessSettings';

type SettingSection = 'general' | 'notifications' | 'security' | 'appearance' | 'billing' | 'business';

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState<SettingSection>('general');

  const sections = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'billing', label: 'Billing', icon: Wallet },
    { id: 'business', label: 'Business', icon: Building2 },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
          Settings
        </h1>
        <p className="text-sm sm:text-base text-gray-500">
          Manage your account and application preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navigation Sidebar */}
        <nav className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as SettingSection)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{section.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {activeSection === 'general' && <GeneralSettings />}
            {activeSection === 'notifications' && <NotificationSettings />}
            {activeSection === 'security' && <SecuritySettings />}
            {activeSection === 'appearance' && <AppearanceSettings />}
            {activeSection === 'billing' && <BillingSettings />}
            {activeSection === 'business' && <BusinessSettings />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;