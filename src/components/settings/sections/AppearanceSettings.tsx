import React from 'react';
import SettingSection from '../SettingSection';

const AppearanceSettings = () => {
  return (
    <SettingSection title="Appearance Settings" description="Customize the look and feel of your dashboard">
      <div className="space-y-6">
        {/* Theme Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Color Theme
          </label>
          <div className="mt-2 grid grid-cols-3 gap-3">
            {[
              { id: 'purple', color: 'bg-primary-600', label: 'Purple (Default)' },
              { id: 'blue', color: 'bg-blue-600', label: 'Blue' },
              { id: 'green', color: 'bg-emerald-600', label: 'Green' },
            ].map((theme) => (
              <div
                key={theme.id}
                className={`relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer ${
                  theme.id === 'purple' ? 'border-primary-600' : 'border-gray-200'
                }`}
              >
                <div className="text-center">
                  <div className={`w-8 h-8 rounded-full mx-auto mb-2 ${theme.color}`} />
                  <span className="text-sm text-gray-700">{theme.label}</span>
                </div>
                {theme.id === 'purple' && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Layout Density */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Layout Density
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="comfortable">Comfortable</option>
            <option value="compact">Compact</option>
            <option value="relaxed">Relaxed</option>
          </select>
        </div>

        {/* Font Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Font Size
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="normal">Normal</option>
            <option value="large">Large</option>
            <option value="larger">Larger</option>
          </select>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </SettingSection>
  );
};

export default AppearanceSettings;