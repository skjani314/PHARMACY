import mongoose from 'mongoose';


const TransactionSchema=new mongoose.Schema({
  date:{type:Date,default:Date.now()},
  stu_id:{type:String,required:true},
  med_id:{type:String,required:true},
  reason:{type:String},
  quantity:{type:Number}
});
  
const Transactions=new mongoose.model("transaction",TransactionSchema);

export default Transactions;