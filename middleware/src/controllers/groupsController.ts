/**
 * KCE Connect — Groups Controller (Study Groups + Group Posts)
 */
import { Request, Response } from 'express';
import prisma from '../db/prisma';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

/* GET /api/groups — list all groups with membership status */
export const getGroups = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  try {
    const groups = await prisma.studyGroup.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { members: true } },
        members: userId ? { where: { userId } } : false,
      },
    });
    res.json({
      success: true,
      groups: groups.map(g => ({
        id: g.id, name: g.name, subject: g.subject, department: g.department,
        description: g.description, isPrivate: g.isPrivate, adminId: g.adminId,
        _count: g._count,
        isMember: userId ? g.members.length > 0 : false,
      })),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch groups' });
  }
};

/* POST /api/groups — create a group */
export const createGroup = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) { res.status(401).json({ success: false, message: 'Unauthorized' }); return; }
  const { name, subject, department, description, isPrivate } = req.body;
  if (!name?.trim() || !subject?.trim()) { res.status(400).json({ success: false, message: 'Name and subject required' }); return; }
  try {
    const group = await prisma.studyGroup.create({
      data: { name: name.trim(), subject: subject.trim(), department: department ?? 'General', description: description ?? null, isPrivate: !!isPrivate, adminId: userId },
    });
    // Auto-add admin as member
    await prisma.groupMember.create({ data: { groupId: group.id, userId, role: 'ADMIN' } });
    res.status(201).json({ success: true, group: { ...group, _count: { members: 1 }, isMember: true } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to create group' });
  }
};

/* POST /api/groups/:id/join */
export const joinGroup = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const groupId = parseInt(req.params.id);
  if (!userId || isNaN(groupId)) { res.status(400).json({ success: false }); return; }
  try {
    await prisma.groupMember.upsert({
      where: { groupId_userId: { groupId, userId } },
      create: { groupId, userId, role: 'MEMBER' },
      update: {},
    });
    res.json({ success: true });
  } catch { res.status(500).json({ success: false }); }
};

/* DELETE /api/groups/:id/leave */
export const leaveGroup = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const groupId = parseInt(req.params.id);
  if (!userId || isNaN(groupId)) { res.status(400).json({ success: false }); return; }
  try {
    await prisma.groupMember.delete({ where: { groupId_userId: { groupId, userId } } });
    res.json({ success: true });
  } catch { res.status(500).json({ success: false }); }
};

/* GET /api/groups/:id/posts */
export const getGroupPosts = async (req: Request, res: Response): Promise<void> => {
  const groupId = parseInt(req.params.id);
  if (isNaN(groupId)) { res.status(400).json({ success: false }); return; }
  try {
    const posts = await prisma.groupPost.findMany({
      where: { groupId },
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { id: true, name: true, role: true, avatarUrl: true } } },
    });
    res.json({ success: true, posts });
  } catch { res.status(500).json({ success: false }); }
};

/* POST /api/groups/:id/posts */
export const createGroupPost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const groupId = parseInt(req.params.id);
  const { content } = req.body;
  if (!userId || isNaN(groupId) || !content?.trim()) { res.status(400).json({ success: false }); return; }
  try {
    const post = await prisma.groupPost.create({
      data: { groupId, authorId: userId, content: content.trim() },
      include: { author: { select: { id: true, name: true, role: true, avatarUrl: true } } },
    });
    res.status(201).json({ success: true, post });
  } catch { res.status(500).json({ success: false }); }
};
