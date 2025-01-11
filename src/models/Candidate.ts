import mongoose, { Document,Schema } from "mongoose";

export interface RegisteredCandidates extends Document {
name:string,
email:string,
phoneNumber:string,
qualifications:string,
location:string,
currentCtc:string,
expectedCtc:string,
currentOrg:string,
numberofYOE:string,
experiencedDomain:string,
resume:string,
referralCode?:string
}

const RegisteredCandidatesSchema = new Schema<RegisteredCandidates>({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    qualifications:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    currentCtc:{
        type:String,
        required:true
    },
    expectedCtc:{
        type:String,
        required:true
    },
    currentOrg:{
        type:String,
        required:true
    },
    numberofYOE:{
        type:String,
        required:true
    },
    experiencedDomain:{
        type:String,
        required:true
    },
    resume:{
        type:String,
        required:true
    },
    referralCode:{
        type:String,
        required:false
    },
})

const RegisteredCandidatesModel = mongoose.model<RegisteredCandidates>("Candidate",RegisteredCandidatesSchema)
export default RegisteredCandidatesModel