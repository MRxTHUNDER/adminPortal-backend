import express from 'express'
import { authenticate } from '../auth/auth';
import { getInterviewers } from '../controllers/interviewers';

const router = express.Router();


router.get("/getAllInterviewers",authenticate,getInterviewers);

export default router;