import mongoose from 'mongoose';


const UserSchema=new mongoose.Schema({name:String,email:String,password:String,phone:Number,  img: {
    data: Buffer,
    contentType: String
  },});
  
const User=new mongoose.model("users",UserSchema);

export default User;