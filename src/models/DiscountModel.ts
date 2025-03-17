import mongoose, { Document, Schema } from "mongoose";

export interface IDiscount extends Document {
    discountCode: string;
    discountAmount: number; // Percentage or Fixed amount
    expiresAt: Date;
    isActive: boolean;
}

const DiscountSchema = new Schema<IDiscount>({
    discountCode: { type: String, required: true, unique: true },
    discountAmount: { type: Number, required: true },
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const DiscountModel = mongoose.model<IDiscount>("Discount", DiscountSchema);

export default DiscountModel;
