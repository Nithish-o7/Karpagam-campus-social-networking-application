import { Response } from 'express';
import axios from 'axios';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import prisma from '../db/prisma';
import { broadcast } from '../sockets/socket';
import { 
  SNOW_API_PATH, 
  getSnowCredentials, 
  logSnowError 
} from '../config/snow';

/**
 * Phase 13 — Critical Emergency Trigger (Hybrid Persistence)
 */
export const triggerEmergency = async (req: AuthenticatedRequest, res: Response) => {
  const { location } = req.body as { location: string };
  const user = req.user;

  if (!user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  if (!location) {
    return res.status(400).json({ success: false, message: 'Location is required for emergency dispatch.' });
  }

  const creds = getSnowCredentials();
  if (!creds) {
    return res.status(500).json({
      success: false,
      message: 'Middleware is not configured with ServiceNow credentials.',
    });
  }

  const { snowUrl, authHeader } = creds;

  // Build Priority 1 (Critical) payload
  const emergencyPayload = {
    urgency: '1',
    impact: '1',
    u_service_category: 'Emergency / Dispatch',
    short_description: `!!! URGENT: EMERGENCY AT ${location} !!!`,
    description: `🚨 TRIGGERED BY: ${user.name} (${user.rollNumber})`,
    block: location,
    name: user.name,
  };

  try {
    // 1. Submit to ServiceNow
    const response = await axios.post(`${snowUrl}${SNOW_API_PATH}`, emergencyPayload, {
      headers: {
        Authorization: `Basic ${authHeader}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 15_000,
    });

    const { number } = response.data.result;

    // 2. Persist to local DB
    const emergency = await prisma.emergency.create({
      data: {
        userId: user.id,
        location,
        snowIncidentId: number,
        status: 'DISPATCHED'
      }
    });

    // 3. Global Broadcast (Real-time Alert)
    broadcast('emergency-alert', {
      id: emergency.id,
      location,
      user: user.name,
      timestamp: emergency.createdAt
    });

    res.status(201).json({
      success: true,
      incidentId: number,
      message: 'ALERT SENT. Security has been dispatched.',
      meta: {
        location,
        createdAt: emergency.createdAt,
      }
    });

  } catch (error: any) {
    logSnowError('POST /api/emergency', error);
    res.status(error.response?.status || 502).json({
      success: false,
      message: 'Failed to notify ServiceNow. PLEASE CALL CAMPUS SECURITY DIRECTLY.',
    });
  }
};
