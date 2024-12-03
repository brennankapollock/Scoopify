import React from 'react';
import { format } from 'date-fns';
import { Mail, MessageCircle } from 'lucide-react';
import { Conversation } from './types';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (conversation: Conversation) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedId,
  onSelect,
}) => {
  return (
    <div className="h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
      </div>
      <div className="overflow-y-auto h-[calc(100%-65px)]">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelect(conversation)}
            className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
              selectedId === conversation.id ? 'bg-primary-50' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-medium text-gray-900">
                {conversation.contact.name}
              </span>
              <span className="text-xs text-gray-500">
                {format(new Date(conversation.updatedAt), 'MMM d, h:mm a')}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              {conversation.lastMessage.type === 'email' ? (
                <Mail size={14} />
              ) : (
                <MessageCircle size={14} />
              )}
              <span>{conversation.contact.email || conversation.contact.phone}</span>
            </div>
            
            <p className="text-sm text-gray-600 truncate text-left">
              {conversation.lastMessage.content}
            </p>
            
            {conversation.unreadCount > 0 && (
              <div className="mt-2 flex justify-end">
                <span className="bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {conversation.unreadCount}
                </span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;