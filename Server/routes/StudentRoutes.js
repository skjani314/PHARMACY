import express from 'express';
import { AddStudent, DeleteStudent, GetStudent } from '../controllers/StudentController.js';
import { authenticate } from '../middlewares/AdminVerify.js';
import { upload_file } from '../middlewares/multer.js';

const StudentRoutes = express.Router();

StudentRoutes.post('/add-student',upload_file.array("img"),AddStudent);
StudentRoutes.get('/get-student', GetStudent);
StudentRoutes.delete('/delete-student', DeleteStudent);


export default StudentRoutes;