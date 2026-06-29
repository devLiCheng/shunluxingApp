import { apiClient } from './client';
import type { Chat, Message } from '@/types';

export const chatsApi = {
  getMyChats() {
    return apiClient.get<Chat[]>('/chats');
  },

  getMessages(chatId: string) {
    return apiClient.get<{ chat: Chat; messages: Message[] }>(`/chats/${chatId}/messages`);
  },

  sendMessage(chatId: string, content: string) {
    return apiClient.post<Message>(`/chats/${chatId}/messages`, { content });
  },

  getOrCreate(targetUserId: string, tripId?: string) {
    return apiClient.post<Chat>('/chats/get-or-create', { targetUserId, tripId });
  },
};
