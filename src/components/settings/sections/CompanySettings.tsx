import React from 'react';
import SettingSection from '../SettingSection';

const CompanySettings = () => {
  return (
    <SettingSection title="Company Settings" description="Manage your company information and branding">
      <div className="space-y-6">
        {/* Company Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Company Information</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                type="text"
                defaultValue="Scoopify"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Business Address
              </label>
              <textarea
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tax ID / EIN
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Support Email
              </label>
              <input
                type="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Support Phone
              </label>
              <input
                type="tel"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Business Hours</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Opening Time
              </label>
              <input
                type="time"
                defaultValue="09:00"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Closing Time
              </label>
              <input
                type="time"
                defaultValue="17:00"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="space-y-2">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
              <label key={day} className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked={day !== 'Sunday'}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{day}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Service Area */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Service Area</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Service Radius (miles)
            </label>
            <input
              type="number"
              defaultValue={25}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ZIP Codes Served
            </label>
            <textarea
              rows={3}
              placeholder="Enter ZIP codes separated by commas"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
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

export default CompanySettings;