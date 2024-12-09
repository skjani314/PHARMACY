import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import nodemailer from 'nodemailer';
import multer from 'multer';
import User from './modals/User.js';
import Medicine from './modals/Medicine.js';
import fs from 'fs';
import Stock from './modals/Stock.js';
import Student from './modals/Student.js';
import xlsx from 'xlsx';
import Transactions from './modals/Transaction.js';
import { promise } from 'bcrypt/promises.js';
import { scheduleJob } from 'node-schedule';

dotenv.config();
const app = express();
const upload_file = multer({ dest: 'uploads/' });
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: ['http://localhost:3000','https://pharmacy-psi-bice.vercel.app/'],
    methods:["POST","GET","PUT"],
    credentials: true,
  }))




mongoose.connect('mongodb+srv://pharmacyrgukt:' + process.env.MONGODB_PASSWORD + '@pharmacy.mgvnn.mongodb.net/pharmacy', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(upload_file.array('img'));


app.get('/',async (req,res)=>{
  res.json("APP is working")
})

app.post('/get-user', async (req, res, next) => {


  const accessToken = req.cookies.accessToken;
  if (!accessToken) next(new Error("jwt token not found"));
  await jwt.verify(accessToken, process.env.KEY, async (err, decode) => {

    if (err) {
      next(err);
    }
    else {

      const email = decode.email;
      console.log(email);
      const user = await User.findOne({ email })
      res.json(user);
    }

  })


})


app.post('/logout', (req, res) => {

  try {
    res.clearCookie('accessToken');

    return res.json("Logout sccessfully");
  }
  catch (error) {
    next(error);
  }

})

app.post('/stock', async (req, res, next) => {


  try {

    if (req.files.length>0) {
      const workbook = xlsx.readFile(req.files[0].path, { cellDates: true });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);
      fs.unlinkSync(req.files[0].path);
    
      const st_data=await Promise.all(
        data.map(async (each)=>{

          const med_data=await Medicine.findOne({name:each.med_id})
          

          const total_quantity = parseInt(each.imported_quantity, 10) + med_data.available;
          console.log(total_quantity);
    
          const up_result = await Medicine.findByIdAndUpdate(med_data._id, { available: total_quantity }, { new: true });

          return {...each,left_quantity:each.imported_quantity}


        })
      )

      const response = await Stock.insertMany(st_data);
      res.json(response);

    }
    else {
      const { med_id, imported_quantity, expery } = req.body;
      console.log(req.body);

      const date = new Date(expery);
      date.setDate(date.getDate()+1);
      const result = await Stock.create({ med_id, imported_quantity, left_quantity: imported_quantity, expery: date.toLocaleDateString() });


      const med_data = await Medicine.findOne({name:med_id});
      const total_quantity = parseInt(imported_quantity, 10) + med_data.available;
      console.log(total_quantity);

      const up_result = await Medicine.findOneAndUpdate({name:med_id}, { available: total_quantity }, { new: true });
      res.json(up_result);
    }

  }
  catch (err) {
    next(err);
  }

});


app.get('/stock', async (req, res, next) => {

  try {
    const { med_id, start, end, flag } = req.query;
    if (flag == 'true') {
      const result = await Stock.find({ med_id }).sort({ date: 1 });
      res.json(result);
    }
    else if(start!=null){
      const startDate = new Date(start);
      const endDate = new Date(end + 'T23:59:59.999Z');
      console.log(endDate);
      const result = await Stock.find({ date: { $gte: startDate, $lte: endDate } }).sort({ date: 1 })
      res.json(result);
    }
    else{
      const result=await Stock.find({med_id:{ $regex: new RegExp("", 'i') }}).sort({date:-1}).limit(30);
      res.json(result);
      console.log(result)

    }


  }
  catch (err) {
    next(err);
  }

});


app.post('/register', async (req, res, next) => {


  try {
    const { name, phone, email, password, } = req.body;


    const hashpassword = await bcrypt.hash(password, 10);

    await User.create({ name, phone, email, password: hashpassword, img: { data: fs.readFileSync(req.file.path), contentType: req.file.mimetype } })

    console.log("created succesfully");
    res.status(200).send("created succesfully");
    fs.unlinkSync(req.file.path);

  }
  catch (err) {
    next(err);
  }


});

app.post('/medicine', async (req, res, next) => {


  try {

    const { name, useage } = req.body;

if(name && useage){
    await Medicine.create({ name, available: 0, useage, img: { data: fs.readFileSync(req.files[0].path), contentType: req.files[0].mimetype } })
    console.log("medicine added");
    res.status(200).send("medicine added succesfully");
    fs.unlinkSync(req.files[0].path);
  }
else{
  const workbook = xlsx.readFile(req.files[0].path);

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet);
  let i=1;
  data.forEach((each)=>{
    each.available=0;
    each.img={ data: fs.readFileSync(req.files[i].path), contentType: req.files[i].mimetype }
    i++;
  })

const bulk_response=await Medicine.insertMany(data);
console.log(bulk_response);
for(i=0;i<req.files.length;i++){ fs.unlinkSync(req.files[i].path);
}
res.json(bulk_response);

}
  }
  catch (err) {
    next(err);
  }



});


app.get('/medicine', async (req, res, next) => {

  try {
    const { name } = req.query;
    console.log(name);

    const result = await Medicine.find({ name: { $regex: new RegExp(name, 'i') } });

    const data=result.map((each)=>({
      name:each.name,
      available:each.available,
      useage:each.useage,
      img:{
        data: each.img.data.toString('base64'),
        contentType: each.img.contentType,
      },
      id:each._id
    }))
    if(result.length>0){
res.set('Content-Type', result[0].img.contentType);}
console.log(data);
    res.json(data);
  }
  catch (err) {
    next(err);
  }


});

app.delete('/medicine', async (req, res, next) => {

  try {

    const { id } = req.query;
    console.log(req.query)
    const data=await Medicine.findOne({name:id});
    console.log(data);
    if(data.available===0){
    const result = await Medicine.deleteOne({name:id});

    if (result) {
      res.status(200).json({ message: 'Record deleted successfully', data: result });
    } else {
      res.status(404).json({ message: 'Record not found' });
    }
  }
    else{
      next(new Error('Available should be 0'))
    }
  }
  catch (err) {
    next(err);
  }


});


app.put('/medicine',async (req,res,next)=>{

const {useage,name}=req.body;

if(req.files.length>0 && useage!=null){
await Medicine.findOneAndUpdate({name},{useage, img: { data: fs.readFileSync(req.files[0].path), contentType: req.files[0].mimetype } })
fs.unlinkSync(req.files[0].path);

}
else if(useage!=null){
  await Medicine.findOneAndUpdate({name},{useage})

}
else if(req.files.length>0){
  await Medicine.findOneAndUpdate({name},{ img: { data: fs.readFileSync(req.files[0].path), contentType: req.files[0].mimetype } })
  fs.unlinkSync(req.files[0].path);

}
else{
  next(new Error("no item to update"));
}
console.log("medicine updated");
res.status(200).send("medicine updated succesfully");


})



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

    const { stu_id, med_id, reason, quantity } = req.body;
    const med_data=await Medicine.findOne({name:med_id});
    const left=med_data.available-quantity;

    if(left<0)next(new Error("unable to process request"));
    const up_result = await Medicine.findOneAndUpdate({name:med_id}, { available: left }, { new: true });


    const transactions=await Stock.find({med_id}).sort({expery:1});
    
  let x=quantity;
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


    const result = await Transactions.create({ stu_id, med_id, reason, quantity });
    res.json(result);
   

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

   
    const student = await Student.find({ stu_id })

    res.json({ student, response });
    }
    else if(start!=null){
      
      const startDate = new Date(start);
      const endDate = new Date(end + 'T23:59:59.999Z');
      const response = await Transactions.find({ date: { $gte: startDate, $lte: endDate } }).sort({ date: 1 })
      const result=await Promise.all(
        response.map(async (each)=>{
          const stu_data=await Student.findOne({stu_id:each.stu_id});
          return {...each,name:stu_data.name}
        })
      )
      res.json(result);

     }
    else{
      const response=await Transactions.find({stu_id:{ $regex: new RegExp("", 'i') }}).sort({date:-1}).limit(30);

      const result=await Promise.all(
        response.map(async (each)=>{
          const stu_data=await Student.findOne({stu_id:each.stu_id});
          return {...each,name:stu_data.name}
        })
      )
      res.json(result);


    }
  }
  catch (err) {
    next(err);
  }


})


app.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;


    const user = await User.findOne({ email });
    console.log(user)

    if (!user) {
      next(new Error("User Not Found"));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const accessToken = jwt.sign({ email }, process.env.KEY, { expiresIn: '7d' });

      res.cookie('accessToken ', accessToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: true,
        sameSite: 'none',
        path: '/',

      });

      return res.status(200).json("logged in sucessfully");
    } else {
      return res.status(401).json({ message: "Password incorrect" });
    }
  } catch (error) {
    next(error)
  }
});


app.post('/logout', (req, res) => {

  try {
    res.clearCookie('accessToken');

    return res.json("Logout sccessfully");
  }
  catch (error) {
    next(error);
  }

})



app.post('/forget', async (req, res, next) => {

  try {

    const { email } = req.body;
    console.log(email);
    const user = await User.findOne({ email });

    if (!user) {
      next(new Error("User Not Found"));
    }
    else {


      const token = jwt.sign({ email }, process.env.KEY, { expiresIn: '5m' });

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'pharmacyrgukt@gmail.com',
          pass: process.env.EMAIL_APPCODE
        }
      });

      const mailOptions = {
        from: 'pharmacyrgukt@gmail.com',
        to: email,
        subject: 'Forget Password',
        text: 'Your Password reset link is provided here and \n it will work only for 5 minuetes\n' + 'http://192.168.245.207:3000/forgot/' + token
      };

      await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      res.sendStatus(200);

    }
  }
  catch (err) {

    next(err);

  }


})




app.post('/forget/verify', async (req, res, next) => {


  try {

    const token = req.body.token;
    await jwt.verify(token, process.env.KEY, (err, decode) => {

      if (err) {
        next(err);
      }
      else {
        res.json({ verified: true, email: decode.email });
        console.log(decode);

      }

    })
  }
  catch (err) {

    next(err);

  }

});


app.post('/passchange', async (req, res, next) => {

  console.log(req.body);
   const { token} = req.body;
   const pass=req.body.data.password;
 
   try {
  
     await jwt.verify(token, process.env.KEY, async (err, decode) => {
 
       if (err) {
         next(err)
       }
       else {
 
         const email = decode.email;
         const hashpassword=await bcrypt.hash(pass,10);
         console.log(hashpassword)
         const result = await User.findOneAndUpdate({ email }, { password: hashpassword }, { new: true, runValidators: true });
         res.status(200).json("Password changed");
 
       }
 
 
     })
   }
   catch (err) {
     next(err);
   }
 
 })
 
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
const expiringMedicines = await Stock.find({ expery: { $lte: oneWeekLater } });
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
          const medicine = await Medicine.findOne({ _id: expiredMedicine.med_id });
          if (medicine) {
              medicine.available -= expiredMedicine.left_quantity;
              await medicine.save();
          }
      }
  } catch (error) {
      console.error('Error updating medicine stock:', error);
  }
}



const job = scheduleJob('0 0 * * *', () => {
  updateMedicineStock();
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  return res.status(500).json({ error: true });
});



app.listen(process.env.PORT, () => { console.log("server is running") });

