import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../modals/User';


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