export type MessageType = 'sms' | 'email';

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  subject?: string;
  from: string;
  to: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'failed';
  isInbound: boolean;
}

export interface Conversation {
  id: string;
  contact: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    avatar?: string;
  };
  lastMessage: Message;
  unreadCount: number;
  updatedAt: string;
}