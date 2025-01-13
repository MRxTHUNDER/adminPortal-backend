import express from 'express'
import { getCandidateInterviews, getCandidates } from '../controllers/candidates';
import { authenticate } from '../auth/auth';

const router = express.Router();


router.get("/getAllCandidates",authenticate,getCandidates);
router.get("/getCandidateInfo/:id",authenticate,getCandidateInterviews);

export default router;