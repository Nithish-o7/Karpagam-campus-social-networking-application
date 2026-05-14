/**
 * KCE Connect — Search Controller (Global Full-Text Search)
 */
import { Request, Response } from 'express';
import prisma from '../db/prisma';

export const search = async (req: Request, res: Response): Promise<void> => {
  const q = (req.query.q as string ?? '').trim();
  const type = (req.query.type as string) || 'people';

  if (!q || q.length < 2) {
    res.json({ success: true, results: [] }); return;
  }

  try {
    if (type === 'people') {
      const results = await prisma.user.findMany({
        where: {
          OR: [
            { name:       { contains: q, mode: 'insensitive' } },
            { department: { contains: q, mode: 'insensitive' } },
            { rollNumber: { contains: q, mode: 'insensitive' } },
            { role:       { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 20,
        select: { id: true, name: true, role: true, department: true, avatarUrl: true, rollNumber: true },
      });
      res.json({ success: true, results });
    } else if (type === 'posts') {
      const results = await prisma.post.findMany({
        where: {
          isDeleted: false,
          OR: [
            { content:  { contains: q, mode: 'insensitive' } },
            { hashtags: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 20,
        orderBy: { timestamp: 'desc' },
        include: { author: { select: { name: true, role: true } } },
      });
      res.json({
        success: true,
        results: results.map(p => ({
          id: p.id, content: p.content,
          author_name: p.author.name, author_role: p.author.role,
          timestamp: p.timestamp, likes: p.likesCount,
        })),
      });
    } else if (type === 'events') {
      const results = await prisma.campusEvent.findMany({
        where: {
          OR: [
            { title:       { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
            { venue:       { contains: q, mode: 'insensitive' } },
            { category:    { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 20,
        orderBy: { date: 'asc' },
      });
      res.json({ success: true, results: results.map(e => ({ id: e.id, title: e.title, date: e.date, venue: e.venue, category: e.category })) });
    } else {
      res.json({ success: true, results: [] });
    }
  } catch (err: any) {
    console.error('[GET /api/search]', err.message);
    res.status(500).json({ success: false, message: 'Search failed' });
  }
};
