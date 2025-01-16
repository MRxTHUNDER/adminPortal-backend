import mongoose,{Schema,Document} from "mongoose";


export interface InterviewerSlot extends Document{
    userId:mongoose.Schema.Types.ObjectId,
    date:string,
    time:string,
    meetLink:string,
    feedback:string,
    isVerified?:boolean,
    candidateName?:string
}

const InterviewerSlotSchema=new Schema<InterviewerSlot>({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    date:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    meetLink:{
        type:String,
        default:""
    },
    feedback:{
        type:String,
        default:""
    },
    candidateName:{
        type:String,
        default:"",
        required:false
    },
    isVerified:{
        type:Boolean,
        default:false,
        required:false
    }
})

const InterviewerSet=mongoose.model<InterviewerSlot>("InterrviewerSet",InterviewerSlotSchema);

export default InterviewerSet;