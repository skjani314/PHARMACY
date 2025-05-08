import express from 'express';

import { Forget, ForgetVerify, getUser, Login, PassChange, register } from '../controllers/AuthController';


const AuthRoutes = express.Router();


AuthRoutes.post('/login',Login);
AuthRoutes.post('/forget',Forget);
AuthRoutes.post('/forget/verify', ForgetVerify)
AuthRoutes.post('/passchange', PassChange)
AuthRoutes.post('/get-user', getUser)
// AuthRoutes.post('/register', register);

export default AuthRoutes;