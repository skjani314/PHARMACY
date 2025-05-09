import Transactions from "../modals/Transaction.js";
import { promise } from 'bcrypt/promises.js';


export const AddTransaction = async (req, res, next) => {

  try {

    const { stu_id, reason } = req.body;

const med_id=JSON.parse(req.body.med_id);
let f=0;

await Promise.all(med_id.map(async (each)=>{

  const med_data=await Medicine.findOne({name:each.med_id});
  const left=med_data.available-each.quantity;

  if(left>=0){f++;each.left=left;}

}))

if(f==med_id.length){
const bulk_result=await Promise.all(med_id.map(async (each)=>{
  
    const up_result = await Medicine.findOneAndUpdate({name:each.med_id}, { available: each.left }, { new: true });


    const transactions=await Stock.find({med_id:each.med_id}).sort({expery:1});
    
  let x=each.quantity;
  let temp=0;
  console.log(transactions);
console.log(x);
    for(let i=0;i<transactions.length && x>0;i++)
      {
        if(transactions[i].left_quantity>0){
        
            temp=transactions[i].left_quantity-x;
            if(temp>=0){
             const up_res= await Stock.findByIdAndUpdate({_id:transactions[i]._id}, { left_quantity: temp }, { new: true });
            
             x=0;
            }
            else{
             const up_res= await Stock.findByIdAndUpdate(transactions[i]._id, { left_quantity: 0 }, { new: true });
             x=x-transactions[i].left_quantity;
            }
          }

      }
    

  }))


  const result = await Transactions.create({ stu_id, med_id, reason});
  res.json(result)
}
else{
  next(new Error("unable to process request"));
}
  } 
  catch (err) {

    next(err);

  }


}

export const GetTransaction = async (req, res, next) => {


  try {

    const { stu_id,end,start } = req.query;

    if(stu_id!=null){
    const response = await Transactions.find({ stu_id }).sort({date:-1});

   
    const student = await Student.findOne({ stu_id })

    res.json({ student, response });
    }
    else if(start!=null){
      
      const startDate = new Date(start);
      const endDate = new Date(end + 'T23:59:59.999Z');
      const response = await Transactions.find({ date: { $gte: startDate, $lte: endDate } }).sort({ date: 1 })
      const result=await Promise.all(
        response.map(async (each)=>{
          const stu_data=await Student.findOne({stu_id:each.stu_id});
          return {...each,stu_data:stu_data}
        })
      )
      res.json(result);

     }
    else{
      const response=await Transactions.find({stu_id:{ $regex: new RegExp("", 'i') }}).sort({date:-1}).limit(30);

      const result=await Promise.all(
        response.map(async (each)=>{
          const stu_data=await Student.findOne({stu_id:each.stu_id});
          return {...each,stu_data}
        })
      )
      res.json(result);


    }
  }
  catch (err) {
    next(err);
  }


}