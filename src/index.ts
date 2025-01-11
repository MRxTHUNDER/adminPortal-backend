import express,{Application,Request,Response} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import { PORT } from './config/config';
import mongoConnect from './db/db';

dotenv.config();

const app:Application = express();

mongoConnect();

const corsOptions={
    origin: process.env.NODE_ENV === 'dev'?'http://localhost:5173':'https://firstlist.in',
    method:['GET','POST','PUT','DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-VERIFY', 'X-MERCHANT-ID'],
    credentials:true
}

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.urlencoded({
    extended:false
}));

app.get("/",(_req:Request,res:Response)=>{
    res.json({
        msg:"Application Running"
    })
    return;
})

app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`)
})