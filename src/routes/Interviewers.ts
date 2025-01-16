import express from 'express'
import { authenticate } from '../auth/auth';
import { getInterviewers, getInterviewerSlots } from '../controllers/interviewers';

const router = express.Router();


router.get("/getAllInterviewers",authenticate,getInterviewers);
router.get("/getInterviewSlots/:userId",authenticate,getInterviewerSlots);

export default router;