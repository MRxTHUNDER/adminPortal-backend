import express from 'express'
import { authenticate } from '../auth/auth';
import { updateInterviewerSlot } from '../controllers/interviewers';
import { getRecruiters, getRecruitmentsByUserId } from '../controllers/recruiters';

const router = express.Router();


router.get("/getAllRecruiters",authenticate,getRecruiters);
router.get("/getRecruitments/:userId",authenticate,getRecruitmentsByUserId);
router.put("/updateInterviewSlots/:slotId",authenticate,updateInterviewerSlot);

export default router;