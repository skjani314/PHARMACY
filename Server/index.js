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

dotenv.config();
const app = express();
const upload_file = multer({ dest: 'uploads/' });
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// app.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true,
//   }))

app.use(cors());

<<<<<<< HEAD

mongoose.connect('mongodb+srv://pharmacyrgukt:' + process.env.MONGODB_PASSWORD + '@pharmacy.mgvnn.mongodb.net/pharmacy', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(upload_file.single('img'));


app.post('/stock', async (req, res, next) => {


  try {


    const { med_id, imported_quantity, expery } = req.body;
    console.log(req.body);

    const date = new Date(expery);
    const result = await Stock.create({ med_id, imported_quantity, left_quantity: imported_quantity, expery: date.toLocaleDateString() });

    const objectId = new mongoose.Types.ObjectId(med_id);

    const med_data = await Medicine.findById(objectId);
    const total_quantity = parseInt(imported_quantity, 10) + med_data.available;
    console.log(total_quantity);

    const up_result = await Medicine.findByIdAndUpdate(objectId, { available: total_quantity }, { new: true });
    res.json(up_result);

  }
  catch (err) {
    next(err);
  }

});


app.get('/stock', async (req, res, next) => {

  try {
    const { med_id, start, end, flag } = req.query;
    if (flag == 'true') {
      const result = await Stock.find({ med_id }).sort({ date: -1 });
      res.json(result);
    }
    else {
      const startDate = new Date(start);
      const endDate = new Date(end + 'T23:59:59.999Z');
      console.log(endDate);
      const result = await Stock.find({ date: { $gte: startDate, $lte: endDate } }).sort({ date: -1 })
      res.json(result);
    }


  }
  catch (err) {
    next(err);
  }

});


app.post('/register', upload_file.single('img'), async (req, res, next) => {


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

app.post('/medicine', upload_file.single('img'), async (req, res, next) => {


  try {

    const { name, useage } = req.body;


    await Medicine.create({ name, available: 0, useage, img: { data: fs.readFileSync(req.file.path), contentType: req.file.mimetype } })
    console.log("medicine added");
    res.status(200).send("medicine added succesfully");
    fs.unlinkSync(req.file.path);

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

    res.json(result);
  }
  catch (err) {
    next(err);
  }


});

app.delete('/medicine', async (req, res, next) => {

  try {

    const { id } = req.query;
    console.log(req.query)
    const result = await Medicine.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: 'Record deleted successfully', data: result });
    } else {
      res.status(404).json({ message: 'Record not found' });
    }
  }
  catch (err) {
    next(err);
  }


});


app.post('/student', async (req, res, next) => {


  try {


    const file = req.file;
    const { stu_id, name, class_name, dorm } = req.body;

    if (!file) {

      if (stu_id) {
        const result = await Student.create({ stu_id, name, class_name, dorm });
        return res.json(result);
      }
      else {
        next(new Error("no file or data found to upload"));
      }
    } else {
      const workbook = xlsx.readFile(file.path);

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);
      fs.unlinkSync(file.path);
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

    const { batch,stu_id,flag } = req.query;
    if (flag=='true') {
      
    const result= await Student.deleteOne({stu_id});
   
   res.json(result);

    }
    else {
      if (!batch || batch.length < 4 || batch[0] != 'r' || batch[1] != 'o') next(new Error("batch is empty"));
      else {

        const studentsToDelete = await Student.find({ stu_id: { $regex: new RegExp(`^.*${batch}.*$`, 'i') } });
        const studentIds = studentsToDelete.map(student => student._id);

        // await Transaction.deleteMany({ studentId: { $in: studentIds } });

        const stu_res = await Student.deleteMany({ _id: { $in: studentIds } });
        res.json(stu_res);
      }
    }
  }
  catch (err) {
    next(err);
  }

})

app.post('/transaction',async (req,res,next)=>{

try{

const {stu_id,med_id,reason,quantity}=req.body;

const result=await Transactions.create({stu_id,med_id,reason,quantity});
res.json(result);

}
catch(err)
{

next(err);

}


})


app.get('/transaction',async (req,res,next)=>{


try{
  
const {stu_id}=req.query;

const response=await Transactions.find({stu_id});

const data=await Promise.all( response.map(async (each)=>{
  const objectId = new mongoose.Types.ObjectId(each.med_id);
   const med_data=await Medicine.findById(objectId);
   
   return {...each,med_name:med_data.name};


}))

console.log(data);
const student=await Student.find({stu_id})

res.json({student,data});
}
catch(err)
{
  next(err);
}


})




app.use((err, req, res, next) => {
  console.error(err.stack);
  return res.status(500).json({ error: true });
});
=======
  app.use((err, req, res, next) => {
    console.error(err.stack);
    return res.status(500).json({ error: true });
  });
>>>>>>> 5a31ce4bdc91dc5a0c3457554fab1cd9b3457464


app.listen(process.env.PORT, () => { console.log("server is running") });