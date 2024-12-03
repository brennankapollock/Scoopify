import React, { useState } from 'react';
import { X, Mail, MessageSquare } from 'lucide-react';

interface MessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
  businessEmail: string;
}

const MessageDialog: React.FC<MessageDialogProps> = ({
  isOpen,
  onClose,
  businessName,
  businessEmail,
}) => {
  const [messageType, setMessageType] = useState<'email' | 'sms'>('email');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission
    console.log('Sending message:', { messageType, subject, message });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Message {businessName}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{businessEmail}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4 mb-4">
              <button
                type="button"
                onClick={() => setMessageType('email')}
                className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg ${
                  messageType === 'email'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Mail size={20} className="mr-2" />
                Email
              </button>
              <button
                type="button"
                onClick={() => setMessageType('sms')}
                className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg ${
                  messageType === 'sms'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <MessageSquare size={20} className="mr-2" />
                SMS
              </button>
            </div>

            {messageType === 'email' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1 block w-full"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="mt-1 block w-full"
                required
              />
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MessageDialog;