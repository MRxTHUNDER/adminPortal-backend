import mongoose,{Schema,Document} from "mongoose";



export interface Interviewer extends Document{
    role:string,
    full_name:string,
    email:string,
    phoneNumber:string,
    linkedin:string,
    regions:string,
    interviewerType:string,
    mainIndustry:string,
    experience:string,
    currentJobTitle:string,
    currentOrganization:string,
    lastJobTitle:string,
    password:string
}


const InterviewerSchema=new Schema<Interviewer>({
    role:{
        type:String,
        default:"interviewer"
    },
    full_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true,
    },
    linkedin:{
        type:String,
        required:true,
    },
    regions:{
        type:String,
        required:true,
    },
    interviewerType:{
        type:String,
        required:true
    },
    mainIndustry:{
        type:String,
        required:true,
    },
    experience:{
        type:String,
        required:true,
    },
    currentJobTitle:{
        type:String,
        required:true,
    },
    currentOrganization:{
        type:String,
        required:true
    },
    lastJobTitle:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})


const InterviewerModel=mongoose.model<Interviewer>("Interviewer",InterviewerSchema)

export default InterviewerModel