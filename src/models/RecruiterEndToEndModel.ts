import mongoose,{Schema,Document} from "mongoose";

export interface RecruiterEndToEnd extends Document{
    userId:string,
    jobDescription:string,
    jobProfile:string,
    lastDate:string,
    numberOfPositions:string,
    jobLocation:string,
    rubricsJobProfile:string[],
    seniorityLevel:string,
    jobDescriptionFILE?:string,
    progress?:string,
    feedback?:string
}

const RecruiterEndToEndSchema=new Schema<RecruiterEndToEnd>({
    userId:{
    type:String
    },
    jobDescription:{
        type:String,
        required:true,
    },
    jobProfile:{
        type:String,
        required:true
    },
    lastDate:{
        type:String,
        required:true,
    },
    numberOfPositions:{
        type:String,
        required:true
    },
    jobLocation: {
      type:String,
      required:true
    },
    rubricsJobProfile:{
        type:[String],
        required:true
    },
    seniorityLevel:{
        type:String,
        required:true
    },
    jobDescriptionFILE:{
        type:String
    },
    progress:{
        type:String
    },
    feedback:{
        type:String,
        required:false,
        default:""
    }
})

const RecruiterEndToEndModel=mongoose.model("RecruiterEndToEnd",RecruiterEndToEndSchema);

export default RecruiterEndToEndModel;