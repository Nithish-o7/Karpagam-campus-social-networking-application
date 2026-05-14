/**
 * KCE Connect — Campus Controller (Phase 12: Real-time Widgets)
 */
import { Request, Response } from 'express';
import prisma from '../db/prisma';

/* ── GET /api/campus/events ─────────────────────────────────── */
export const getEvents = async (_req: Request, res: Response) => {
  try {
    const events = await prisma.campusEvent.findMany({
      orderBy: { date: 'asc' },
      take: 10,
    });
    
    // Auto-seed if empty
    if (events.length === 0) {
      const seedData = [
        { 
          title: 'National Tech Fest 2026', 
          description: 'A grand celebration of technology and innovation at Karpagam College of Engineering.',
          date: new Date('2026-05-15T09:00:00Z'), 
          venue: 'Main Auditorium', 
          category: 'Technical' 
        },
        { 
          title: 'KCE Alumni Meet', 
          description: 'Reconnect with your batchmates and the faculty.',
          date: new Date('2026-05-17T10:30:00Z'), 
          venue: 'Convention Centre', 
          category: 'Social' 
        },
        { 
          title: 'Smart India Hackathon', 
          description: '36 hours of non-stop coding to solve real-world problems.',
          date: new Date('2026-05-19T08:00:00Z'), 
          venue: 'IT Lab Block', 
          category: 'Coding' 
        },
      ];
      await prisma.campusEvent.createMany({ data: seedData });
      const newEvents = await prisma.campusEvent.findMany();
      res.json({ success: true, events: newEvents });
      return;
    }

    res.json({ success: true, events });
  } catch (error: any) {
    console.error('❌ [GET /api/campus/events] Error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch events.' });
  }
};

/* ── GET /api/campus/trending ────────────────────────────────── */
export const getTrending = async (_req: Request, res: Response) => {
  try {
    const trending = await prisma.trendingTopic.findMany({
      orderBy: { posts: 'desc' },
      take: 15,
    });

    if (trending.length === 0) {
      const seedData = [
        { tag: 'KCEConnect', posts: 1250 },
        { tag: 'CST_IA2', posts: 840 },
        { tag: 'Placement2026', posts: 620 },
        { tag: 'OverhaulComplete', posts: 410 },
      ];
      await prisma.trendingTopic.createMany({ data: seedData });
      res.json({ success: true, topics: seedData });
      return;
    }

    res.json({ success: true, topics: trending });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch trending topics.' });
  }
};
