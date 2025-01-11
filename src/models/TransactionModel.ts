import mongoose, {Schema,Document} from "mongoose";


export interface Transaction extends Document{
    transactionId:string,
    merchantId:string,
    orderId:string,
    amount:string,
    initiatedAt:string,
    completedAt:string,
    payername:string,
    userId:string,
    email:string
}

const TransactionSchema=new Schema<Transaction>({
    transactionId:{
        type:String,
        required:true
    },
    merchantId:{
        type:String,
        required:true
    },
    orderId:{
        type:String,
        required:true
    },
    amount:{
        type:String,
        required:true
    },
    initiatedAt:{
        type:String,
        required:true
    },
    completedAt:{
        type:String,
        required:true
    },
    payername:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    }
})

const TransactionModel=mongoose.model("Transaction",TransactionSchema) 

export default TransactionModel