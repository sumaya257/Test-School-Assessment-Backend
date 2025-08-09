import { Router } from 'express';
import { startExam, submitExam } from '../controllers/exam.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/start', requireAuth, startExam);
router.post('/:examId/submit', requireAuth, submitExam);

export default router;
