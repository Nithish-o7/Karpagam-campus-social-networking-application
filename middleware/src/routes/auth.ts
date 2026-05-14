import { Router } from 'express';
import { 
  syncUser, login, register, updateProfile, getProfile,
  getNotifications, markNotificationRead, markAllNotificationsRead,
  followUser, unfollowUser, getPeople
} from '../controllers/authController';
import { requireAuth } from '../middleware/authMiddleware';

/**
 * Auth Routes — Hybrid Era (Password + Google)
 */

const router = Router();

router.post('/register',             register);
router.post('/login',                login);
router.post('/sync',                 syncUser);
router.patch('/profile',              requireAuth, updateProfile);
router.get('/profile/:id',           getProfile);

// Notifications
router.get('/notifications',         requireAuth, getNotifications);
router.patch('/notifications/:id/read', requireAuth, markNotificationRead);
router.patch('/notifications/read-all', requireAuth, markAllNotificationsRead);

// Social Graph
router.post('/follow/:id',           requireAuth, followUser);
router.delete('/follow/:id',         requireAuth, unfollowUser);

// People Directory
router.get('/people',                requireAuth, getPeople);

export default router;

