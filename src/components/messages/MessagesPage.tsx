import React, { useState } from 'react';
import { Search, Mail, MessageCircle } from 'lucide-react';
import ConversationList from './ConversationList';
import MessageThread from './MessageThread';
import NewMessageDialog from './NewMessageDialog';
import { Conversation, MessageType } from './types';

// Mock data
const mockConversations: Conversation[] = [
  {
    id: '1',
    contact: {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '(555) 123-4567',
    },
    lastMessage: {
      id: '1',
      type: 'sms',
      content: 'Thanks for the great service!',
      from: '(555) 123-4567',
      to: 'your-number',
      timestamp: '2024-03-20T14:30:00Z',
      status: 'delivered',
      isInbound: true,
    },
    unreadCount: 2,
    updatedAt: '2024-03-20T14:30:00Z',
  },
  // Add more mock conversations as needed
];

const MessagesPage = () => {
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [newMessageType, setNewMessageType] = useState<MessageType | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleNewMessage = (type: MessageType) => {
    setNewMessageType(type);
    setIsNewMessageOpen(true);
  };

  const handleSendMessage = async (to: string, content: string, subject?: string) => {
    // Here you would integrate with Twilio/Email API
    console.log('Sending message:', { to, content, subject, type: newMessageType });
    // Mock success
    alert('Message sent successfully!');
    setIsNewMessageOpen(false);
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.contact.phone?.includes(searchQuery)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
          Messages
        </h1>
        <p className="text-sm sm:text-base text-gray-500">
          Manage all your customer communications in one place
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleNewMessage('sms')}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            <MessageCircle size={20} className="mr-2" />
            New Text
          </button>
          <button
            onClick={() => handleNewMessage('email')}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            <Mail size={20} className="mr-2" />
            New Email
          </button>
        </div>
      </div>

      {/* Messages Interface */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[600px] flex">
        {/* Conversations List */}
        <div className={`w-full md:w-96 border-r border-gray-200 ${
          selectedConversation ? 'hidden md:block' : ''
        }`}>
          <ConversationList
            conversations={filteredConversations}
            selectedId={selectedConversation?.id}
            onSelect={setSelectedConversation}
          />
        </div>

        {/* Message Thread */}
        <div className={`flex-1 ${!selectedConversation ? 'hidden md:block' : ''}`}>
          {selectedConversation ? (
            <MessageThread
              conversation={selectedConversation}
              onBack={() => setSelectedConversation(null)}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a conversation to view messages
            </div>
          )}
        </div>
      </div>

      {/* New Message Dialog */}
      <NewMessageDialog
        isOpen={isNewMessageOpen}
        type={newMessageType}
        onClose={() => {
          setIsNewMessageOpen(false);
          setNewMessageType(null);
        }}
        onSend={handleSendMessage}
      />
    </div>
  );
};

export default MessagesPage;