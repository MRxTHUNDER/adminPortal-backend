import { Request, Response } from "express";
import DiscountModel from "../models/DiscountModel";



export const createDiscount = async (req: Request, res: Response) => {
    try {
        const { discountCode, discountAmount, expiresAt } = req.body;

        if (!discountCode || !discountAmount || !expiresAt) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingDiscount = await DiscountModel.findOne({ discountCode });
        if (existingDiscount) {
            return res.status(400).json({ message: "Discount code already exists" });
        }

        const newDiscount = new DiscountModel({
            discountCode,
            discountAmount,
            expiresAt,
            isActive: true
        });

        await newDiscount.save();

        return res.status(201).json({
            message: "Discount code created successfully",
            discount: newDiscount
        });
    } catch (error) {
        console.error("Error creating discount:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const disableDiscount = async (req: Request, res: Response) => {
    try {
        const { discountCode } = req.params;

        const discount = await DiscountModel.findOneAndUpdate(
            { discountCode },
            { isActive: false },
            { new: true }
        );

        if (!discount) {
            return res.status(404).json({ message: "Discount code not found" });
        }

        return res.status(200).json({ message: "Discount code disabled successfully" });
    } catch (error) {
        console.error("Error disabling discount:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
