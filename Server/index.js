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

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }))




mongoose.connect('mongodb+srv://pharmacyrgukt:' + process.env.MONGODB_PASSWORD + '@pharmacy.mgvnn.mongodb.net/pharmacy', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(upload_file.single('img'));


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



    if (req.file != null) {
      const workbook = xlsx.readFile(req.file.path, { cellDates: true });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);
      fs.unlinkSync(req.file.path);
    
      const st_data=await Promise.all(
        data.map(async (each)=>{

          const med_data=await Medicine.findOne({name:each.med_id})
          

          const total_quantity = parseInt(each.imported_quantity, 10) + med_data.available;
    
          const up_result = await Medicine.findByIdAndUpdate(med_data._id, { available: total_quantity }, { new: true });

          return {...each,med_id:med_data._id,left_quantity:each.imported_quantity}


        })
      )

      const response = await Stock.insertMany(st_data);
      res.json(response);

    }
    else {
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
    const data=result.map((each)=>({
      name:each.name,
      available:each.available,
      useage:each.useage,
      img:{
        data: each.img.data.toString('base64'),
        contentType: each.img.contentType,
      }
    }))
res.set('Content-Type', result[0].img.contentType);

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

    const result = await Transactions.create({ stu_id, med_id, reason, quantity });
    res.json(result);

  }
  catch (err) {

    next(err);

  }


})


app.get('/transaction', async (req, res, next) => {


  try {

    const { stu_id } = req.query;

    const response = await Transactions.find({ stu_id });

    const data = await Promise.all(response.map(async (each) => {
      const objectId = new mongoose.Types.ObjectId(each.med_id);
      const med_data = await Medicine.findById(objectId);

      return { ...each, med_name: med_data.name };


    }))

    console.log(data);
    const student = await Student.find({ stu_id })

    res.json({ student, data });
  }
  catch (err) {
    next(err);
  }


})


app.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;


    const user = await User.findOne({ email });

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
 


app.use((err, req, res, next) => {
  console.error(err.stack);
  return res.status(500).json({ error: true });
});



app.listen(process.env.PORT, () => { console.log("server is running") });