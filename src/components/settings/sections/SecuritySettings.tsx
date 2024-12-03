import React from 'react';
import SettingSection from '../SettingSection';

const SecuritySettings = () => {
  return (
    <SettingSection title="Security Settings" description="Manage your account security preferences">
      <div className="space-y-6">
        {/* Change Password */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              <p className="text-xs text-gray-400 mt-1">Currently disabled</p>
            </div>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100"
            >
              Enable 2FA
            </button>
          </div>
        </div>

        {/* Login History */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Login Activity</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">Chrome on Windows</p>
                <p className="text-xs text-gray-500">Dallas, TX • March 20, 2024 10:30 AM</p>
              </div>
              <span className="text-xs text-primary-600 font-medium">Current</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">Safari on iPhone</p>
                <p className="text-xs text-gray-500">Dallas, TX • March 19, 2024 3:45 PM</p>
              </div>
            </div>
          </div>
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

export default SecuritySettings;