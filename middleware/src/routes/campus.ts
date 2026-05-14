import { Router } from 'express';
import { getEvents, getTrending } from '../controllers/campusController';

const router = Router();

router.get('/events',   getEvents);
router.get('/trending', getTrending);

export default router;
