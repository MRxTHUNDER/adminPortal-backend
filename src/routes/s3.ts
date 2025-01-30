import express from "express";
import { authenticate } from "../auth/auth";
import { generatePutURLController, getObjectController } from "../controllers/s3";


const router = express.Router();


router.post("/getUploadUrl",authenticate,generatePutURLController);
router.post("/getObject",authenticate,getObjectController);

export default router;