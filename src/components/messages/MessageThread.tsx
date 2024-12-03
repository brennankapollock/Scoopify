import React, { useState } from 'react';
import { format } from 'date-fns';
import { ChevronLeft, Mail, MessageCircle, Send } from 'lucide-react';
import { Conversation, Message } from './types';

interface MessageThreadProps {
  conversation: Conversation;
  onBack: () => void;
}

// Mock messages for the thread
const mockMessages: Message[] = [
  {
    id: '1',
    type: 'sms',
    content: 'Thanks for the great service!',
    from: '(555) 123-4567',
    to: 'your-number',
    timestamp: '2024-03-20T14:30:00Z',
    status: 'delivered',
    isInbound: true,
  },
  {
    id: '2',
    type: 'sms',
    content: "You're welcome! Let us know if you need anything else.",
    from: 'your-number',
    to: '(555) 123-4567',
    timestamp: '2024-03-20T14:35:00Z',
    status: 'delivered',
    isInbound: false,
  },
];

const MessageThread: React.FC<MessageThreadProps> = ({ conversation, onBack }) => {
  const [messages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [messageType, setMessageType] = useState<'sms' | 'email'>('sms');
  const [subject, setSubject] = useState('');

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    // Here you would integrate with Twilio/Email API
    console.log('Sending message:', {
      type: messageType,
      content: newMessage,
      subject: messageType === 'email' ? subject : undefined,
    });

    // Clear the input
    setNewMessage('');
    setSubject('');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Thread Header */}
      <div className="p-4 border-b border-gray-200 flex items-center">
        <button
          onClick={onBack}
          className="md:hidden mr-2 text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {conversation.contact.name}
          </h2>
          <p className="text-sm text-gray-500">
            {conversation.contact.email || conversation.contact.phone}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isInbound ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.isInbound
                  ? 'bg-gray-100 text-gray-900'
                  : 'bg-primary-600 text-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {message.type === 'email' ? (
                  <Mail size={14} />
                ) : (
                  <MessageCircle size={14} />
                )}
                <span className="text-xs opacity-75">
                  {format(new Date(message.timestamp), 'MMM d, h:mm a')}
                </span>
              </div>
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Compose Message */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMessageType('sms')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              messageType === 'sms'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <MessageCircle size={16} className="inline mr-1" />
            Text
          </button>
          <button
            onClick={() => setMessageType('email')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              messageType === 'email'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Mail size={16} className="inline mr-1" />
            Email
          </button>
        </div>

        {messageType === 'email' && (
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        )}

        <div className="flex gap-2">
          <input
            type="text"
            placeholder={`Type your ${messageType === 'email' ? 'email' : 'message'}...`}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageThread;