import dotenv from 'dotenv'
dotenv.config();

export const PORT = process.env.PORT;
export const MONGO_URI:string = process.env.MONGO_URI ||'';
export const JWT_SECRET = process.env.JWT_SECRET
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD