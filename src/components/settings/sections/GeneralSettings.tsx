import React from 'react';
import SettingSection from '../SettingSection';

const GeneralSettings = () => {
  return (
    <SettingSection title="General Settings" description="Manage your basic account preferences">
      <div className="space-y-6">
        {/* Language Preferences */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Language
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="en">English (US)</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
        </div>

        {/* Timezone Settings */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Timezone
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="UTC-8">Pacific Time (PT)</option>
            <option value="UTC-7">Mountain Time (MT)</option>
            <option value="UTC-6">Central Time (CT)</option>
            <option value="UTC-5">Eastern Time (ET)</option>
          </select>
        </div>

        {/* Date Format */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date Format
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
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

export default GeneralSettings;