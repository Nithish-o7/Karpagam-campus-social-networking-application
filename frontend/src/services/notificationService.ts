import apiClient from './apiClient';

export interface NotificationItem {
  id: number;
  recipientId: number;
  type: 'LIKE' | 'COMMENT' | 'FOLLOW' | 'MENTION' | 'SYSTEM';
  actorId?: number;
  postId?: number;
  content: string;
  isRead: boolean;
  createdAt: string;
  post?: {
    content: string;
  };
}

export const notificationService = {
  async getAll(): Promise<NotificationItem[]> {
    const { data } = await apiClient.get<{ success: boolean; notifications: NotificationItem[] }>('/auth/notifications');
    return data.notifications;
  },

  async markAsRead(id: number): Promise<void> {
    await apiClient.patch(`/auth/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.patch('/auth/notifications/read-all');
  }
};
