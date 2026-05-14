/**
 * KCE Connect — Resources Controller
 */
import { Request, Response } from 'express';
import prisma from '../db/prisma';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const getResources = async (req: Request, res: Response): Promise<void> => {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: { createdAt: 'desc' },
      include: { uploadedBy: { select: { id: true, name: true, role: true } } },
    });
    res.json({ success: true, resources });
  } catch { res.status(500).json({ success: false }); }
};

export const createResource = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) { res.status(401).json({ success: false }); return; }
  const { title, description, fileUrl, type, subject, semester, department } = req.body;
  if (!title || !fileUrl || !subject) { res.status(400).json({ success: false, message: 'Missing required fields' }); return; }
  try {
    const resource = await prisma.resource.create({
      data: {
        title, description: description ?? null, fileUrl, type: type ?? 'NOTES',
        subject, semester: semester ? parseInt(semester) : 0, department: department ?? 'General',
        uploadedById: userId,
      },
      include: { uploadedBy: { select: { id: true, name: true, role: true } } },
    });
    res.status(201).json({ success: true, resource });
  } catch { res.status(500).json({ success: false }); }
};

export const upvoteResource = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ success: false }); return; }
  try {
    await prisma.resource.update({ where: { id }, data: { upvotes: { increment: 1 } } });
    res.json({ success: true });
  } catch { res.status(500).json({ success: false }); }
};
