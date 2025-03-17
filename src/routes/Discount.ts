import express from "express";
import { createDiscount, disableDiscount } from "../controllers/discount";

const router = express.Router();

router.post("/create", createDiscount as express.RequestHandler);

router.put("/disable/:discountCode", disableDiscount as express.RequestHandler);

export default router;
