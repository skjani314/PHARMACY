import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import nodemailer from 'nodemailer';
import multer from 'multer';


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

  app.use((err, req, res, next) => {
    console.error(err.stack);
    return res.status(500).json({ error: true });
  });


app.listen(process.env.PORT, () => { console.log("server is running") });