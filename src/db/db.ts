import mongoose from "mongoose";
import dotenv from 'dotenv'


dotenv.config();

const mongoURI = process.env.MONGO_URI
console.log(mongoURI)


if(!mongoURI){
    console.error("MONGO URI is not defined");
    process.exit(1);
}


const mongoConnect = ():void=>{
    mongoose.connect(mongoURI).then(()=>{
        console.log("Database connected");
    }).catch((error)=>{
        console.error('Error connecting to Database: ',error)
    });
}

export default mongoConnect;