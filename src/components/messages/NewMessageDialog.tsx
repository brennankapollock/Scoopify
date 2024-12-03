import React, { useState } from 'react';
import { X, Search, Mail, MessageCircle } from 'lucide-react';
import { MessageType } from './types';

interface NewMessageDialogProps {
  isOpen: boolean;
  type: MessageType | null;
  onClose: () => void;
  onSend: (to: string, content: string, subject?: string) => void;
}

const NewMessageDialog: React.FC<NewMessageDialogProps> = ({
  isOpen,
  type,
  onClose,
  onSend,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  if (!isOpen || !type) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend(recipient, content, type === 'email' ? subject : undefined);
    // Reset form
    setSearchQuery('');
    setRecipient('');
    setSubject('');
    setContent('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                {type === 'email' ? (
                  <>
                    <Mail size={20} />
                    New Email
                  </>
                ) : (
                  <>
                    <MessageCircle size={20} />
                    New Text Message
                  </>
                )}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Send a message to your customer
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Customer Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Find Customer
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Search by name or contact info..."
                />
              </div>
            </div>

            {/* Manual Recipient Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Or Enter {type === 'email' ? 'Email' : 'Phone Number'}
              </label>
              <input
                type={type === 'email' ? 'email' : 'tel'}
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder={type === 'email' ? 'email@example.com' : '(555) 123-4567'}
                required
              />
            </div>

            {/* Subject Line (Email Only) */}
            {type === 'email' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter subject..."
                  required
                />
              </div>
            )}

            {/* Message Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Type your message..."
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
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewMessageDialog;