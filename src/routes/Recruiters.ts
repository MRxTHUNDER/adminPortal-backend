import express from 'express'
import { authenticate } from '../auth/auth';
import { getRecruiters, getRecruitmentsByUserId, updateRecruitmentDetailsByInterviewId } from '../controllers/recruiters';

const router = express.Router();


router.get("/getAllRecruiters",authenticate,getRecruiters);
router.get("/getRecruitments/:userId",authenticate,getRecruitmentsByUserId);
router.put("/updateRecruitments/:interviewId",authenticate,updateRecruitmentDetailsByInterviewId);

export default router;