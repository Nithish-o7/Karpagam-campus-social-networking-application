import apiClient from './apiClient';

export interface Message {
  id: number;
  content: string;
  senderId: number;
  conversationId: number;
  createdAt: string;
  sender: {
    id: number;
    name: string;
    avatarUrl: string | null;
  };
}

export interface Conversation {
  id: number;
  isGroup: boolean;
  name: string | null;
  updatedAt: string;
  participants: {
    user: {
      id: number;
      name: string;
      avatarUrl: string | null;
      role: string;
    };
  }[];
  messages: Message[];
}

export const messagingService = {
  getConversations: async (): Promise<Conversation[]> => {
    const res = await apiClient.get('/messages/conversations');
    return res.data.conversations;
  },

  getMessages: async (conversationId: number): Promise<Message[]> => {
    const res = await apiClient.get(`/messages/${conversationId}`);
    return res.data.messages;
  },

  sendMessage: async (conversationId: number, content: string): Promise<Message> => {
    const res = await apiClient.post(`/messages/${conversationId}`, { content });
    return res.data.message;
  },

  startConversation: async (targetUserId: number): Promise<number> => {
    const res = await apiClient.post('/messages/start', { targetUserId });
    return res.data.conversationId;
  }
};
