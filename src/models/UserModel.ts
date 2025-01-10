import mongoose, { Schema, Document } from "mongoose";

// Define the User schema with "candidate", "recruiter", and "interviewer" roles
export interface User extends Document {
  role: "candidate" | "recruiter" | "interviewer",
  name: string,
  email: string,
  password: string,
  dob?: string,
  companyname?: string,
  loginType: "password" | "OAuth",
  
  // Interviewer-specific fields
  full_name?: string,
  phoneNumber?: number,
  linkedin?: string,
  regions?: string,
  interviewerType?: string,
  mainIndustry?: string,
  experience?: string,
  currentJobTitle?: string,
  currentOrganization?: string,
  lastJobTitle?: string,
  sets?: Array<{
    date: string,
    time: string
  }>;
}

const userSchema = new Schema<User>({
  role: {
    type: String,
    required: true,
    enum: ["candidate", "recruiter", "interviewer"], // Updated to include "interviewer"
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  dob: {
    type: String,
    validate: {
      validator: function (this: User, value: string | undefined) {
        if (this.role === "candidate" && !value) {
          return false; // DOB is required for candidates
        }
        if ((this.role === "recruiter" || this.role === "interviewer") && value) {
          return true; // DOB is optional for recruiters and interviewers
        }
        return true;
      },
      message: "DOB is required for candidates but not for recruiters or interviewers.",
    },
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
    unique: true
  },
  password: {
    type: String,
    validate: {
      validator: function (this: User, value: string | undefined) {
        if (this.role === "candidate" && !value) {
          return false; // Password is required for candidates
        }
        if ((this.role === "recruiter" || this.role === "interviewer") && value) {
          return true; // Password is optional for recruiters and interviewers
        }
        return true; // Valid in other cases
      },
      message: "Password is required for candidates but optional for recruiters and interviewers.",
    },
  },
  companyname: {
    type: String,
    validate: {
      validator: function (this: User, value: string | undefined) {
        if (this.role === "recruiter" && !value) {
          return false; // Recruiters must have a company name
        }
        if (this.role === "candidate" && value) {
          return false; // Candidates must not have a company name
        }
        return true; // Valid for interviewers as well
      },
      message: "Company name is required for recruiters and not allowed for candidates or interviewers.",
    },
  },
  loginType: {
    type: String,
    required: true
  },
  
  // Interviewer-specific fields
  full_name: {
    type: String,
    required: function(this: User) { return this.role === "interviewer"; }, // Only required if role is interviewer
  },
  phoneNumber: {
    type: Number,
    required: function(this: User) { return this.role === "interviewer"; }, // Only required if role is interviewer
  },
  linkedin: {
    type: String,
    required: function(this: User) { return this.role === "interviewer"; }, // Only required if role is interviewer
  },
  regions: {
    type: String,
    required: function(this: User) { return this.role === "interviewer"; }, // Only required if role is interviewer
  },
  interviewerType: {
    type: String,
    required: function(this: User) { return this.role === "interviewer"; }, // Only required if role is interviewer
  },
  mainIndustry: {
    type: String,
    required: function(this: User) { return this.role === "interviewer"; }, // Only required if role is interviewer
  },
  experience: {
    type: String,
    required: function(this: User) { return this.role === "interviewer"; }, // Only required if role is interviewer
  },
  currentJobTitle: {
    type: String,
    required: function(this: User) { return this.role === "interviewer"; }, // Only required if role is interviewer
  },
  currentOrganization: {
    type: String,
    required: function(this: User) { return this.role === "interviewer"; }, // Only required if role is interviewer
  },
  lastJobTitle: {
    type: String,
    required: function(this: User) { return this.role === "interviewer"; }, // Only required if role is interviewer
  }
});

const UserModel = mongoose.model<User>("User", userSchema);

export default UserModel;