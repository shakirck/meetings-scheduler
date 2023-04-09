import authRouter from './auth/auth';
import scheduleRouter from './schedule/schedules.routes';
import {Router} from 'express';

const router = Router();

router.use("/auth",  authRouter);
router.use("/schedule", scheduleRouter);
 
  

export default router;