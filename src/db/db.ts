import mongoose from "mongoose";
import dotenv from 'dotenv'
import { MONGO_URI } from "../config/config";


dotenv.config();

console.log(MONGO_URI)


if(!MONGO_URI){
    console.error("MONGO URI is not defined");
    process.exit(1);
}


const mongoConnect = ():void=>{
    mongoose.connect(MONGO_URI).then(()=>{
        console.log("Database connected");
    }).catch((error)=>{
        console.error('Error connecting to Database: ',error)
    });
}

export default mongoConnect;