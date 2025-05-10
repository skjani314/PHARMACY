import express from 'express';

import { Forget, ForgetVerify, getDashboardData, getUser, Login, Logout, PassChange, register } from '../controllers/AuthController.js';
import { authenticate } from '../middlewares/AdminVerify.js';


const AuthRoutes = express.Router();
 

AuthRoutes.post('/login',Login);
AuthRoutes.post('/forget',Forget);
AuthRoutes.post('/forget/verify', ForgetVerify)
AuthRoutes.post('/passchange', PassChange)
AuthRoutes.post('/get-user', getUser)
// AuthRoutes.post('/register', register);
// AuthRoutes.post('/logout',Logout);
AuthRoutes.get('/dashboarddata',authenticate,getDashboardData);

export default AuthRoutes;