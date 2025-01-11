import mongoose, { Schema, Document } from "mongoose";

export interface Interview extends Document {
  organization?: string;
  userId: mongoose.Schema.Types.ObjectId;
  description: string;
  jobProfile: string;
  seniorityLevel: string;
  date: string;
  timeSlots: string;
  specialArea?: string;
  pricingPlans: string;
  meetLink: string;
  feedbackReport: string;
  resume: string;
  isVerified?:boolean,
}

const InterviewSchema = new Schema<Interview>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  organization: {
    type: [String],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  jobProfile: {
    type: String,
    required: true,
  },
  seniorityLevel: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  timeSlots: {
    type: String,
    required: true,
  },
  specialArea: {
    type: String,
    required: false,
  },
  pricingPlans: {
    type: String,
    required: true,
  },
  meetLink: {
    type: String,
    default: "",
  },
  feedbackReport: {
    type: String,
    default: "",
  },
  resume: {
    type: String,
    default: "",
  },
  isVerified:{
     type: Boolean,
    default:false,
    required:false
  }
});

const InterviewModel = mongoose.model<Interview>("Interview", InterviewSchema);

export default InterviewModel;