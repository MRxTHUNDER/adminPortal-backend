import express from 'express'
import { authenticate } from '../auth/auth';
import { getInterviewers, getInterviewerSlots, updateInterviewerSlot } from '../controllers/interviewers';

const router = express.Router();


router.get("/getAllInterviewers",authenticate,getInterviewers);
router.get("/getInterviewSlots/:userId",authenticate,getInterviewerSlots);
router.put("/updateInterviewSlots/:slotId",authenticate,updateInterviewerSlot);

export default router;