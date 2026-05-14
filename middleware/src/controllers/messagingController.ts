/**
 * KCE Connect — Messaging Controller (Phase 12: Real-time Chat)
 */
import { Response } from 'express';
import prisma from '../db/prisma';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { emitToUser } from '../sockets/socket';

/* ── GET /api/messages/conversations ────────────────────────── */
export const getConversations = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: { some: { userId } }
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, name: true, avatarUrl: true, role: true }
            }
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    res.json({ success: true, conversations });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ── GET /api/messages/:id ───────────────────────────────────── */
export const getMessages = async (req: AuthenticatedRequest, res: Response) => {
  const conversationId = parseInt(req.params.id);
  if (isNaN(conversationId)) return res.status(400).json({ success: false, message: 'Invalid ID' });

  try {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: { id: true, name: true, avatarUrl: true }
        }
      }
    });

    res.json({ success: true, messages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ── POST /api/messages/:id ──────────────────────────────────── */
export const sendMessage = async (req: AuthenticatedRequest, res: Response) => {
  const conversationId = parseInt(req.params.id);
  const userId = req.user?.id;
  const { content } = req.body;

  if (isNaN(conversationId) || !userId || !content) {
    return res.status(400).json({ success: false, message: 'Invalid request' });
  }

  try {
    const message = await prisma.message.create({
      data: {
        content,
        conversationId,
        senderId: userId
      },
      include: {
        sender: {
          select: { id: true, name: true, avatarUrl: true }
        }
      }
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    });

    // Notify participants via socket
    const participants = await prisma.conversationParticipant.findMany({
      where: { conversationId }
    });

    participants.forEach(p => {
      if (p.userId !== userId) {
        emitToUser(p.userId, 'new-message', message);
      }
    });

    res.status(201).json({ success: true, message });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ── POST /api/messages/start ───────────────────────────────── */
export const startConversation = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const { targetUserId } = req.body;

  if (!userId || !targetUserId) return res.status(400).json({ success: false, message: 'Missing fields' });

  try {
    // Check if direct conversation already exists
    const existing = await prisma.conversation.findFirst({
      where: {
        isGroup: false,
        AND: [
          { participants: { some: { userId } } },
          { participants: { some: { userId: targetUserId } } }
        ]
      }
    });

    if (existing) return res.json({ success: true, conversationId: existing.id });

    // Create new
    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: [
            { userId },
            { userId: targetUserId }
          ]
        }
      }
    });

    res.status(201).json({ success: true, conversationId: conversation.id });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
