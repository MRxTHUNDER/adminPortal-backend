import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import dotenv from 'dotenv'
dotenv.config();

const s3Client = new S3Client({
    region:process.env.AWS_REGION || '',
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY || ''
    },
})

export async function putObject (fileName:string,contentType:string) {
const command = new PutObjectCommand({
    Bucket:process.env.S3_BUCKET_NAME || "",
    Key: `/uploads/admin-uploads/${fileName}`,
    ContentType:contentType
})

const url = await getSignedUrl(s3Client,command,{expiresIn:180})
return { url, key: `/uploads/admin-uploads/${fileName}` };
}
