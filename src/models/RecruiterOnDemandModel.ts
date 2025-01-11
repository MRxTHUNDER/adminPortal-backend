import mongoose, { Schema, Document } from "mongoose";

export interface Candidate {
  candidateFullName: string;
  companyName: string;
  phoneNumber: string;
  email: string;
  resume: string;
}

export interface RecruiterOnDemand extends Document {
  userId:string,
  jobDescription: string;
  jobProfile: string;
  lastDate: string;
  numberOfPositions: string;
  jobLocation:string,
  rubricsJobProfile: string[];
  seniorityLevel: string;
  candidates: Candidate[];// Array of candidates (required)
  feedback?:string; 
}


const CandidateSchema = new Schema<Candidate>({
  candidateFullName: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => /^\d{10}$/.test(value),
      message: "Phone number must be 10 digits",
    },
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: "Invalid email format",
    },
  },
  resume: {
    type: String,
    required: true,
  }
});


const RecruiterOnDemandSchema = new Schema<RecruiterOnDemand>({
  userId:{
   type:String
  },
  jobDescription: {
    type: String,
    required: true,
  },
  jobProfile: {
    type: String,
    required: true,
  },
  lastDate: {
    type: String,
    required: true,
  },
  numberOfPositions: {
    type: String,
    required: true,
  },
  jobLocation:{
   type:String,
   required:true,
  },
  rubricsJobProfile: {
    type: [String],
    required: true,
  },
  seniorityLevel: {
    type: String,
    required: true,
  },
  feedback:{
    type:String,
    required:false,
    default:""
},
  candidates: {
    type: [CandidateSchema],
    required: true, // Make candidates field required
    validate: {
      validator: (value: Candidate[]) => value.length > 0,
      message: "At least one candidate is required",
    },
  },
});


const RecruiterOnDemandModel=mongoose.model("RecruiterOnDemand",RecruiterOnDemandSchema);

export default RecruiterOnDemandModel;