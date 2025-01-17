import express from 'express'
import { authenticate } from '../auth/auth';
import { getCandidateById, getRegisteredCandidates } from '../controllers/registeredCandidates';

const router = express.Router();


router.get("/getAllCandidates",authenticate,getRegisteredCandidates);
router.get("/getCandidate/:id",authenticate,getCandidateById);

export default router;