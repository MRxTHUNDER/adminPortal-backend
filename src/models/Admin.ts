import mongoose, { Schema, Document } from "mongoose";

export interface Admin extends Document {
  name:string;
  email:string;
  password:string;
}

const adminSchema = new Schema<Admin>({
 name:{
  type:String,
  required:true
 },
 email:{
  type:String,
  required:true
 },
 password:{
  type:String,
  required:true
 }
});

const AdminModel = mongoose.model<Admin>("Admin", adminSchema);

export default AdminModel;