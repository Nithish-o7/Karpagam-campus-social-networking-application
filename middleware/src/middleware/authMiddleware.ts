import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import prisma from '../db/prisma';
import { JwtPayload } from '../controllers/authController';

/**
 * Universal Auth Middleware — Hybrid Era
 * 
 * Verifies the custom KCE Connect JWT issued by either:
 * - authController.login (Email/Password)
 * - authController.syncUser (Google SSO)
 */

export interface AuthenticatedRequest extends Request {
  user?: {
    id:          number;
    email:       string;
    role:        string;
    name:        string;
    department:  string;
    rollNumber:  string;
    bio?:        string | null;
    avatarUrl?:  string | null;
  };
}

export const requireAuth = async (
  req:  AuthenticatedRequest,
  res:  Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({
      error:   'Unauthorized',
      message: 'Authentication token required (Bearer).',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    // ── 1. Verify standard KCE JWT ───────────────────────────
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;

    // ── 2. Attach user to request ────────────────────────────
    req.user = {
      id:          decoded.id,
      email:       decoded.email,
      role:        decoded.role,
      name:        decoded.name,
      department:  decoded.department,
      rollNumber:  decoded.rollNumber,
    };

    next();
  } catch (err: any) {
    console.warn(`⚠️  [requireAuth] JWT verify failed: ${err.message}`);
    res.status(401).json({
      error:   'INVALID_TOKEN',
      message: 'Your session is invalid or has expired. Please sign in again.',
    });
  }
};
