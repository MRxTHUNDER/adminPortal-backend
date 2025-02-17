import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import dotenv from 'dotenv'
import { CLOUDFRONT_URL } from "../config/config";
dotenv.config();

const s3Client = new S3Client({
    region:process.env.AWS_REGION || '',
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY || ''
    },
})

export async function getObjectURL (key:string){
const command = new GetObjectCommand({
    Bucket:process.env.S3_BUCKET_NAME || "",
    Key:key
})

if (!command){
    throw new Error("Object doesnt exists")
}

const url = `${CLOUDFRONT_URL}/${key}`
return url;
}