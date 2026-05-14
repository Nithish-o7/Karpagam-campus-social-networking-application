import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import admin from '../config/firebaseAdmin';
import prisma from '../db/prisma';
import config from '../config/config';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { NotificationService } from '../services/notification.service';

/**
 * Auth Controller — Hybrid Era
 * 
 * Supports two authentication paths:
 * 1. Legacy Email/Password (bcrypt/JWT)
 * 2. Modern Google SSO (Firebase ID Token verification)
 * 
 * Both paths result in a custom KCE Connect JWT for session management.
 */

export interface JwtPayload {
  id:          number;
  email:       string;
  role:        string;
  name:        string;
  department:  string;
  rollNumber:  string;
}

/**
 * Helper: Generates a custom KCE Connect JWT for a user.
 */
/**
 * Strip sensitive fields before sending user to client.
 */
function safeUser(user: any) {
  const { passwordHash: _ph, snowTicketRef: _sr, ...safe } = user;
  return safe;
}

function generateToken(user: any): string {
  const payload: JwtPayload = {
    id:          user.id,
    email:       user.email,
    role:        user.role,
    name:        user.name,
    department:  user.department,
    rollNumber:  user.rollNumber,
  };

  return jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
}

/* ── POST /api/auth/register — Legacy Email/Password Registration ── */
export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role, department, rollNumber } = req.body;

  if (!email || !password || !name || !rollNumber) {
    res.status(400).json({ success: false, message: 'Missing required registration fields.' });
    return;
  }

  // Domain enforcement
  if (!email.toLowerCase().endsWith('@kce.ac.in')) {
    res.status(400).json({ success: false, message: 'Email must be a valid @kce.ac.in address.' });
    return;
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email: email.toLowerCase() }, { rollNumber }] },
    });

    if (existingUser) {
      res.status(409).json({ success: false, message: 'User with this email or roll number already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        rollNumber,
        passwordHash,
        role: role || 'student',
        department: department || 'Karpagam College of Engineering',
      },
    });

    const token = generateToken(user);
    res.status(201).json({ success: true, token, user: safeUser(user) });

  } catch (error: any) {
    console.error('❌ [POST /api/auth/register] Error:', error.message);
    res.status(500).json({ success: false, message: 'Registration failed.' });
  }
};

/* ── POST /api/auth/login — Legacy Email/Password Login ── */
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, message: 'Email and password required.' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.passwordHash) {
      res.status(401).json({ success: false, message: 'Invalid credentials or user not registered with password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials.' });
      return;
    }

    const token = generateToken(user);
    res.json({ success: true, token, user: safeUser(user) });

  } catch (error: any) {
    console.error('❌ [POST /api/auth/login] Error:', error.message);
    res.status(500).json({ success: false, message: 'Login server error.' });
  }
};

/* ── POST /api/auth/sync — Google Sign-In Sync ── */
export const syncUser = async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized', message: 'Firebase ID Token required.' });
    return;
  }

  const idToken = authHeader.split(' ')[1];

  try {
    // ── 1. Verify Firebase token ──────────────────────────────
    const decoded = await admin.auth().verifyIdToken(idToken);
    const { email, name } = decoded;

    if (!email) {
      res.status(400).json({ error: 'NO_EMAIL', message: 'Firebase account has no email address.' });
      return;
    }

    // ── 2. Enforce @kce.ac.in domain ─────────────────────────
    if (!email.endsWith('@kce.ac.in')) {
      res.status(403).json({ error: 'DOMAIN_RESTRICTED', message: 'Access restricted to @kce.ac.in accounts.' });
      return;
    }

    const rollNumber = email.split('@')[0].toLowerCase();

    // ── 3. Upsert user in Postgres ────────────────────────────
    const user = await prisma.user.upsert({
      where:  { email: email.toLowerCase() },
      update: { name: name ?? email.split('@')[0] },
      create: {
        email:       email.toLowerCase(),
        name:        name ?? email.split('@')[0],
        rollNumber,
        role:        'student',
        department:  'Karpagam College of Engineering',
      },
    });

    console.log(`✅ [POST /api/auth/sync] User synced: ${user.email} (ID: ${user.id})`);

    // ── 4. Generate local JWT for the session ────────────────
    const token = generateToken(user);

    res.json({ success: true, token, user: safeUser(user) });

  } catch (err: any) {
    console.error('❌ [POST /api/auth/sync] Error:', err.message);
    res.status(401).json({ error: 'INVALID_TOKEN', message: 'Firebase token verification failed.' });
  }
};

/* ── PATCH /api/auth/profile — Update Profile ── */
export const updateProfile = async (req: any, res: Response): Promise<void> => {
  const userId = req.user.id;
  const { bio, avatarUrl, bannerUrl } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        bio,
        avatarUrl,
        bannerUrl,
      },
    });

    res.json({ success: true, user: safeUser(updatedUser) });
  } catch (error: any) {
    console.error('❌ [PATCH /api/auth/profile] Error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};

/* ── GET /api/auth/profile/:id — Get Profile ── */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const numId = parseInt(id);

  if (isNaN(numId)) {
    res.status(400).json({ success: false, message: 'Invalid user ID.' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: numId },
      include: {
        _count: {
          select: { posts: true, followers: true, following: true }
        }
      }
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    res.json({ success: true, user: safeUser(user) });
  } catch (error: any) {
    console.error('❌ [GET /api/auth/profile/:id] Error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch profile.' });
  }
};
/* ── Notifications ───────────────────────────────────────────── */
export const getNotifications = async (req: any, res: Response): Promise<void> => {
  const userId = req.user.id;
  try {
    const notifications = await prisma.notification.findMany({
      where: { recipientId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        post: { select: { content: true } }
      }
    });
    res.json({ success: true, notifications });
  } catch (error: any) {
    console.error('❌ [GET /api/auth/notifications] Error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications.' });
  }
};

export const markNotificationRead = async (req: any, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    await prisma.notification.update({
      where: { id: parseInt(id) },
      data: { isRead: true }
    });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to mark notification as read.' });
  }
};

export const markAllNotificationsRead = async (req: any, res: Response): Promise<void> => {
  const userId = req.user.id;
  try {
    await prisma.notification.updateMany({
      where: { recipientId: userId, isRead: false },
      data: { isRead: true }
    });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to mark all as read.' });
  }
};

/* ── POST /api/auth/follow/:id — Follow User ── */
export const followUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const targetId = parseInt(req.params.id);
  const followerId = req.user?.id;

  if (!followerId || isNaN(targetId) || followerId === targetId) {
    res.status(400).json({ success: false, message: 'Invalid follow request.' });
    return;
  }

  try {
    await prisma.follow.create({
      data: {
        followerId,
        followingId: targetId
      }
    });

    // Create notification
    await NotificationService.createNotification({
      recipientId: targetId,
      actorId: followerId,
      type: 'FOLLOW',
      content: `${req.user?.name} started following you`
    });

    res.json({ success: true, message: 'Followed successfully.' });
  } catch (error: any) {
    if (error.code === 'P2002') {
       res.status(400).json({ success: false, message: 'Already following.' });
       return;
    }
    res.status(500).json({ success: false, message: 'Failed to follow.' });
  }
};

/* ── DELETE /api/auth/follow/:id — Unfollow User ── */
export const unfollowUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const targetId = parseInt(req.params.id);
  const followerId = req.user?.id;

  if (!followerId || isNaN(targetId)) {
    res.status(400).json({ success: false, message: 'Invalid request.' });
    return;
  }

  try {
    await prisma.follow.delete({
      where: { followerId_followingId: { followerId, followingId: targetId } }
    });
    res.json({ success: true, message: 'Unfollowed successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to unfollow.' });
  }
};

/* ── GET /api/auth/people — Campus Directory ── */
export const getPeople = async (req: any, res: Response): Promise<void> => {
  const requesterId = req.user?.id;
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, name: true, email: true, role: true,
        department: true, rollNumber: true, avatarUrl: true, bio: true,
        _count: { select: { posts: true, followers: true, following: true } },
        followers: requesterId
          ? { where: { followerId: requesterId }, select: { followerId: true } }
          : false,
      },
      orderBy: { name: 'asc' },
    });

    const people = users.map(u => ({
      ...u,
      isFollowing: requesterId ? u.followers.length > 0 : false,
      followers: undefined,
    }));

    res.json({ success: true, people });
  } catch (error: any) {
    console.error('❌ [GET /api/auth/people] Error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch people.' });
  }
};

