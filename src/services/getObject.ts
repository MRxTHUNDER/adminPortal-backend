import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from 'dotenv'
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

const url = getSignedUrl(s3Client,command,{expiresIn:180});
return url;
}