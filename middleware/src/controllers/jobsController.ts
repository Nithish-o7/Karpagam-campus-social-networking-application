/**
 * KCE Connect — Jobs Controller
 */
import { Response } from 'express';
import prisma from '../db/prisma';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const getJobs = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const jobs = await prisma.jobPost.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      include: { postedBy: { select: { id: true, name: true, role: true, department: true } } },
    });
    res.json({ success: true, jobs });
  } catch { res.status(500).json({ success: false, message: 'Failed to fetch jobs' }); }
};

export const createJob = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) { res.status(401).json({ success: false }); return; }
  const { title, company, location, type, description, requirements, applyUrl, salary, deadline } = req.body;
  if (!title || !company || !location || !type || !description) {
    res.status(400).json({ success: false, message: 'Missing required fields' }); return;
  }
  try {
    const job = await prisma.jobPost.create({
      data: {
        title, company, location, type, description,
        requirements: requirements ?? null,
        applyUrl: applyUrl ?? null,
        salary: salary ?? null,
        deadline: deadline ? new Date(deadline) : null,
        postedById: userId,
      },
      include: { postedBy: { select: { id: true, name: true, role: true, department: true } } },
    });
    res.status(201).json({ success: true, job });
  } catch { res.status(500).json({ success: false, message: 'Failed to create job' }); }
};
