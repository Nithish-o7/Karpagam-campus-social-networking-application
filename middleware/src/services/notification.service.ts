import prisma from '../db/prisma';
import { emitToUser } from '../sockets/socket';

export class NotificationService {
  static async createNotification({
    recipientId,
    actorId,
    type,
    postId,
    content,
  }: {
    recipientId: number;
    actorId?: number;
    type: 'LIKE' | 'COMMENT' | 'FOLLOW' | 'MENTION' | 'SYSTEM';
    postId?: number;
    content?: string;
  }) {
    try {
      // Don't notify yourself
      if (recipientId === actorId) return;

      const notification = await prisma.notification.create({
        data: {
          recipientId,
          actorId,
          type,
          postId,
          content,
        },
        include: {
          post: true,
        },
      });

      // Emit real-time socket event
      emitToUser(recipientId, 'new-notification', notification);

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }

  static async markAsRead(notificationId: number) {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  static async getUserNotifications(userId: number) {
    return await prisma.notification.findMany({
      where: { recipientId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        post: true,
      },
    });
  }
}
