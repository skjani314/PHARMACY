import express from 'express';
import multer from 'multer';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { upload_file } from './middlewares/multer.js';





const app = express();


app.use(cors({
    origin: (origin, callback) => {
      const allowedOrigins = ['https://pharmacy-xi-one.vercel.app','http://localhost:3000'];
      if (origin && (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app'))) {
          callback(null, true); 
      } else {
          callback(new Error('Not allowed by CORS')); 
      }
  },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
allowedHeaders: ['Content-Type', 'Authorization'],
credentials: true,

    }))


app.options('*', cors()); 

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(cookieParser());
app.use(upload_file.array("img"));

app.set("trust proxy",1);

app.use((req, res, next) => {
    req.setTimeout(60000); 
    next();
});

export default app;