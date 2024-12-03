import React from 'react';
import { BusinessOnboardingData } from '../../../../types/business';
import { Mail, MessageSquare, Bell } from 'lucide-react';

interface NotificationsSectionProps {
  data: BusinessOnboardingData;
  onChange: (data: BusinessOnboardingData) => void;
}

const notificationTemplates = [
  {
    id: 'appointment_confirmation',
    name: 'Appointment Confirmation',
    defaultTemplate: 'Your appointment is confirmed for {{appointment_date}} at {{appointment_time}}. We look forward to serving you!',
  },
  {
    id: 'service_reminder',
    name: 'Service Reminder',
    defaultTemplate: 'Reminder: We\'ll be visiting your property tomorrow between {{time_window}}.',
  },
  {
    id: 'service_completed',
    name: 'Service Completed',
    defaultTemplate: 'Your yard has been cleaned! If you have any questions, please don\'t hesitate to contact us.',
  },
  {
    id: 'payment_receipt',
    name: 'Payment Receipt',
    defaultTemplate: 'Thank you for your payment of {{payment_amount}}. Your next service is scheduled for {{next_service_date}}.',
  },
];

const NotificationsSection: React.FC<NotificationsSectionProps> = ({ data, onChange }) => {
  const toggleChannel = (channel: keyof typeof data.notifications.channels) => {
    onChange({
      ...data,
      notifications: {
        ...data.notifications,
        channels: {
          ...data.notifications.channels,
          [channel]: !data.notifications.channels[channel]
        }
      }
    });
  };

  const updateTemplate = (templateId: string, value: string) => {
    onChange({
      ...data,
      notifications: {
        ...data.notifications,
        templates: {
          ...data.notifications.templates,
          [templateId]: value
        }
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Communication Channels */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">Communication Channels</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary-200">
            <input
              type="checkbox"
              checked={data.notifications.channels.email}
              onChange={() => toggleChannel('email')}
              className="sr-only"
            />
            <div className={`flex items-center ${
              data.notifications.channels.email ? 'text-primary-600' : 'text-gray-400'
            }`}>
              <Mail size={20} className="mr-3" />
              <div>
                <p className="font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-500">Send email notifications</p>
              </div>
            </div>
          </label>

          <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary-200">
            <input
              type="checkbox"
              checked={data.notifications.channels.sms}
              onChange={() => toggleChannel('sms')}
              className="sr-only"
            />
            <div className={`flex items-center ${
              data.notifications.channels.sms ? 'text-primary-600' : 'text-gray-400'
            }`}>
              <MessageSquare size={20} className="mr-3" />
              <div>
                <p className="font-medium text-gray-900">SMS</p>
                <p className="text-sm text-gray-500">Send text messages</p>
              </div>
            </div>
          </label>

          <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary-200">
            <input
              type="checkbox"
              checked={data.notifications.channels.push}
              onChange={() => toggleChannel('push')}
              className="sr-only"
            />
            <div className={`flex items-center ${
              data.notifications.channels.push ? 'text-primary-600' : 'text-gray-400'
            }`}>
              <Bell size={20} className="mr-3" />
              <div>
                <p className="font-medium text-gray-900">Push</p>
                <p className="text-sm text-gray-500">Send push notifications</p>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Message Templates */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">Message Templates</h4>
        <div className="space-y-6">
          {notificationTemplates.map((template) => (
            <div key={template.id}>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  {template.name}
                </label>
                <button
                  type="button"
                  onClick={() => updateTemplate(template.id, template.defaultTemplate)}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Reset to Default
                </button>
              </div>
              <textarea
                value={data.notifications.templates[template.id] || template.defaultTemplate}
                onChange={(e) => updateTemplate(template.id, e.target.value)}
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Available variables: {template.defaultTemplate.match(/{{([^}]+)}}/g)?.join(', ')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsSection;