import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from './modals/User.js';
import Medicine from './modals/Medicine.js';
import fs from 'fs';
import Stock from './modals/Stock.js';
import Student from './modals/Student.js';
import xlsx from 'xlsx';
import Transactions from './modals/Transaction.js';
import { promise } from 'bcrypt/promises.js';
import { scheduleJob } from 'node-schedule';
import path from 'path';
import 'dotenv/config'
import ConnectDb from './config/ConnectDb.js';
import app from './app.js';
import AuthRoutes from './routes/AuthRoutes.js';
import authenticate from './middleware/auth.js';
import MedicineRoutes from './routes/MedicineRoutes.js';
import StockRoutes from './routes/StockRoutes.js';

ConnectDb();



app.use("/api/auth/",AuthRoutes);
app.use('/api/medicine', MedicineRoutes);
app.use("/api/stock",authenticate, StockRoutes);



app.post('/student', async (req, res, next) => {


  try {


    const files = req.files;
    const { stu_id, name, class_name, dorm } = req.body;

    if (files.length<=0) {

      if (stu_id) {
        const result = await Student.create({ stu_id, name, class_name, dorm });
        return res.json(result);
      }
      else {
        next(new Error("no file or data found to upload"));
      }
    } else {
      const workbook = xlsx.readFile(files[0].path);

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);
      fs.unlinkSync(files[0].path);
      const response = await Student.insertMany(data);
      res.json(response);
    }
  }
  catch (err) {
    next(err);
  }



})


app.get('/student', async (req, res, next) => {

  try {
    const { stu_id } = req.query;

    const response = await Student.find({ stu_id: { $regex: new RegExp(stu_id, 'i') } });
    res.json(response);
  }
  catch (err) {
    next(err);
  }
})


app.delete('/student', async (req, res, next) => {

  try {

    const { batch, stu_id, flag } = req.query;
    if (flag == 'true') {

      const result = await Student.deleteOne({ stu_id });
      await Transactions.deleteMany({ stu_id });

      res.json(result);

    }
    else {
      if (!batch || batch.length < 4 || batch[0] != 'r' || batch[1] != 'o') next(new Error("batch is empty"));
      else {

        const studentsToDelete = await Student.find({ stu_id: { $regex: new RegExp(`^.*${batch}.*$`, 'i') } });
        console.log(batch)

        const studentIds = studentsToDelete.map(student => student._id);
        const stu_ro_ids = studentsToDelete.map(student => student.stu_id);
        const trans_res = await Transactions.deleteMany({ stu_id: { $in: stu_ro_ids } });

        const stu_res = await Student.deleteMany({ _id: { $in: studentIds } });
        res.json({ stu_res, trans_res });
      }
    }
  }
  catch (err) {
    next(err);
  }

})

app.post('/transaction', async (req, res, next) => {

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


})


app.get('/transaction', async (req, res, next) => {


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


})




app.post('/logout', (req, res) => {
    try {
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: true, 
            sameSite: 'None', 
            path: '/', 
        });
        return res.json({ message: "Logout successfully" });
    } catch (error) {
        next(error);
    }
});









app.get('/dashboarddata',async (req,res,next)=>{


try{


const data={total_students:0,benfited_students:0,stock:0,graph_data:[],shortage_list:[],expiring_list:[]}



const benfited_stu=await Transactions.aggregate([
  {
      $group: {
          _id: "$stu_id",
          count: { $sum: 1 }
      }
  },
  {
      $match: {
          count: { $gte: 1 }
      }
  }
]);
data.benfited_students=benfited_stu.length;
const total_stu=await Student.find()
data.total_students=total_stu.length


const graph_data=await Transactions.aggregate([
  {
      $match: {
          date: {
              $gte: new Date(new Date().getFullYear() - 1, 0, 1), // Start of last year
              $lt: new Date() // Current date
          }
      }
  },
  {
      $group: {
          _id: {
              $month: "$date" // Group by month
          },
          count: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" }
      }
  }
])
data.graph_data=graph_data;
const allStock = await Stock.find();
let totalImported = 0;
let totalLeft = 0;

allStock.forEach(stockItem => {
    totalImported += stockItem.imported_quantity;
    totalLeft += stockItem.left_quantity;
});
const overallPercentage = (totalLeft / totalImported) * 100;
data.stock=overallPercentage;

const lowStockMedicines = await Medicine.find({ available: { $lt: 50 } });
const currentDate = new Date();
const oneWeekLater = new Date(currentDate);
oneWeekLater.setDate(currentDate.getDate() + 7);
const expiringMedicines = await Stock.find({ expery: { $lte: oneWeekLater,$gte: currentDate, } });
data.expiring_list=expiringMedicines;


const low_med_data=lowStockMedicines.map((each)=>({
  name:each.name,
  available:each.available,
  img:{
    data: each.img.data.toString('base64'),
    contentType: each.img.contentType,
  },
  id:each._id
}))
if(lowStockMedicines.length>0){
res.set('Content-Type', lowStockMedicines[0].img.contentType);}

data.shortage_list=low_med_data;

const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);

const endOfDay = new Date();
endOfDay.setHours(23, 59, 59, 999); 

const day_count = await Transactions.find({
  date: {
    $gte: startOfDay,  
    $lte: endOfDay    
  }
});

data.daily_count=day_count.length;
const inventory = await Medicine.aggregate([
  {
      $group: {
          _id: "$category", // Group by category
          totalAvailable: { $sum: "$available" }, // Sum the 'available' field
      },
  },
]);
data.inventory=inventory;
res.json(data);


}
catch(err)
{
  next(err);
}




})




async function updateMedicineStock() {
  const currentDate = new Date();

  try {
      const expiredMedicines = await Stock.find({ expery: { $lt: currentDate } });
      for (const expiredMedicine of expiredMedicines) {
          const medicine = await Medicine.findOne( {name:expiredMedicine.med_id} );
          console.log(medicine)
          if (medicine) {
              medicine.available -= expiredMedicine.left_quantity;
              if(medicine.available<0)medicine.available=0;
             let x = await medicine.save();
             console.log(x);
          }
      }
  } catch (error) {
      console.error('Error updating medicine stock:', error);
  }
}




setInterval(updateMedicineStock, 86400000);




app.use((err, req, res, next) => {
  console.error(err.stack);
  return res.status(500).json({ error: err });
});



app.listen(process.env.PORT, () => { console.log("server is running") });

