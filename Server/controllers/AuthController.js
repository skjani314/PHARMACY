import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../modals/User.js';
import nodemailer from 'nodemailer';
import Transactions from '../modals/Transaction.js';
import Student from '../modals/Student.js';
import Stock from '../modals/Stock.js';
import Medicine from '../modals/Medicine.js';

export const Login= async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
  
      const user = await User.findOne({ email });
  
      if (!user) {
        next(new Error("User Not Found"));
      }
      else{
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (isMatch) {
        const accessToken = jwt.sign({ email }, process.env.KEY, { expiresIn: '7d' });
  
        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
          secure: true,
          sameSite: 'None',
          path: '/',
  
        });
  
        return res.status(200).json("logged in sucessfully");
      } else {
        return res.status(401).json({ message: "Password incorrect" });
      }
  
    }
    } catch (error) {
      next(error)
    }
}

export const Forget = async (req, res, next) => {

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
          text: 'Your Password reset link is provided here and \n it will work only for 5 minuetes\n' + 'https://pharmacy-xi-one.vercel.app/forgot/' + token
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
  
  
  }

export const ForgetVerify = async (req, res, next) => {


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
  
  }

export const PassChange = async (req, res, next) => {

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
   
   }
   
 export const getUser = async (req, res, next) => {


    const accessToken = req.cookies.accessToken;
    if (!accessToken){ next(new Error("jwt token not found"))}
    else{
    await jwt.verify(accessToken, process.env.KEY, async (err, decode) => {
  
      if (err) {
        console.log(err);
  
        next(err);
      }
      else {
  
        const email = decode.email;
        console.log(email);
        const user = await User.findOne({ email })
        res.json(user);
      }
  
    })
  
    }
  }  

  export const register = async (req, res, next) => {


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
  
  
  }


 export const Logout=async (req, res) => {
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
}

export const getDashboardData = async (req,res,next)=>{


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




}