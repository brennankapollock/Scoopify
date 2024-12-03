import React from 'react';
import SettingSection from '../SettingSection';

const NotificationSettings = () => {
  return (
    <SettingSection title="Notification Preferences" description="Choose how you want to receive notifications">
      <div className="space-y-6">
        {/* Email Notifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
          <div className="space-y-3">
            {[
              { id: 'new-customer', label: 'New customer sign-ups' },
              { id: 'service-completed', label: 'Service completion reports' },
              { id: 'route-changes', label: 'Route changes and updates' },
              { id: 'maintenance-alerts', label: 'Vehicle maintenance alerts' },
              { id: 'inventory-alerts', label: 'Low inventory alerts' },
            ].map((item) => (
              <label key={item.id} className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* SMS Notifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">SMS Notifications</h3>
          <div className="space-y-3">
            {[
              { id: 'urgent-updates', label: 'Urgent service updates' },
              { id: 'schedule-changes', label: 'Schedule changes' },
              { id: 'emergency-alerts', label: 'Emergency alerts' },
            ].map((item) => (
              <label key={item.id} className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{item.label}</span>
              </label>
            ))}
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

export default NotificationSettings;