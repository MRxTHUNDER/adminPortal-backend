import mongoose,{ Document, Schema } from 'mongoose';

export interface Interview extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  organization: string[]; 
  jobType: string;
  jobProfile: string;
  jobLocation?: string; // Optional
  date: string;
  timeSlots: string;
  specialArea?: string; // Optional
  pricingPlans: string;
  resume: string;
  will: string;
  plan: string;
  reffered: string;
  meetLink: string;
  feedbackReport: string;
  isVerified?:boolean;
}


const interviewSchemaNo = new Schema<Interview>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  organization: {
    type: [String], 
    required: true
  },
  jobType: {
    type: String, 
    required: true
  },
  jobProfile: {
    type: String, 
    required: true
  },
  jobLocation: {
    type: String, 
    required: false
  },
  date: {
    type: String, 
    required: true
  },
  timeSlots: {
    type: String,
    required: true
  },
  specialArea: {
    type: String, 
    required: false
  },
  pricingPlans: {
    type: String, 
    required: true
  },
  resume: {
    type: String, 
    required: true
  },
  will: {
    type: String,
    required: true
  },
  plan: {
    type: String,
    required: true
  },
  reffered: {
    type: String, 
    required: true
  },
  meetLink:{
    type:String,
    default:""
  },
  feedbackReport:{
    type:String,
    default:""
  },
  isVerified:{
    type:Boolean,
    default:false,
    required:false
  }
});

const InterviewModelNo = mongoose.model<Interview>('InterviewNo', interviewSchemaNo);

export default InterviewModelNo;