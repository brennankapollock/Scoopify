import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, Smartphone } from 'lucide-react';
import { BusinessOnboardingData } from '../types';

interface NotificationsStepProps {
  onNext: (data: Partial<BusinessOnboardingData>) => void;
  onBack: () => void;
  data: BusinessOnboardingData;
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

const NotificationsStep: React.FC<NotificationsStepProps> = ({ onNext, onBack, data }) => {
  const [formData, setFormData] = useState({
    notifications: {
      ...data.notifications,
      templates: {
        ...notificationTemplates.reduce((acc, template) => ({
          ...acc,
          [template.id]: data.notifications.templates[template.id] || template.defaultTemplate,
        }), {}),
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  const toggleChannel = (channel: keyof typeof formData.notifications.channels) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        channels: {
          ...prev.notifications.channels,
          [channel]: !prev.notifications.channels[channel],
        },
      },
    }));
  };

  const updateTemplate = (templateId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        templates: {
          ...prev.notifications.templates,
          [templateId]: value,
        },
      },
    }));
  };

  const resetTemplate = (templateId: string) => {
    const defaultTemplate = notificationTemplates.find(t => t.id === templateId)?.defaultTemplate || '';
    updateTemplate(templateId, defaultTemplate);
  };

  return (
    <div>
      <Bell size={48} className="mx-auto mb-6 text-primary-600" />
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
        Notification Settings
      </h2>
      
      <p className="text-lg text-gray-600 mb-8 text-center">
        Configure how you'll communicate with your customers
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Communication Channels */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Communication Channels
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary-200">
              <input
                type="checkbox"
                checked={formData.notifications.channels.email}
                onChange={() => toggleChannel('email')}
                className="sr-only"
              />
              <div className={`flex items-center ${
                formData.notifications.channels.email ? 'text-primary-600' : 'text-gray-400'
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
                checked={formData.notifications.channels.sms}
                onChange={() => toggleChannel('sms')}
                className="sr-only"
              />
              <div className={`flex items-center ${
                formData.notifications.channels.sms ? 'text-primary-600' : 'text-gray-400'
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
                checked={formData.notifications.channels.push}
                onChange={() => toggleChannel('push')}
                className="sr-only"
              />
              <div className={`flex items-center ${
                formData.notifications.channels.push ? 'text-primary-600' : 'text-gray-400'
              }`}>
                <Smartphone size={20} className="mr-3" />
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
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Message Templates
          </h3>
          <div className="space-y-6">
            {notificationTemplates.map((template) => (
              <div key={template.id}>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {template.name}
                  </label>
                  <button
                    type="button"
                    onClick={() => resetTemplate(template.id)}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Reset to Default
                  </button>
                </div>
                <textarea
                  value={formData.notifications.templates[template.id]}
                  onChange={(e) => updateTemplate(template.id, e.target.value)}
                  rows={3}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Available variables: {template.defaultTemplate.match(/{{([^}]+)}}/g)?.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-6">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-6 py-3 text-lg font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all"
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotificationsStep;