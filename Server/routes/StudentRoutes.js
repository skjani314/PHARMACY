import express from 'express';
import { AddStudent, DeleteStudent, GetStudent } from '../controllers/StudentController.js';


const StudentRoutes = express.Router();

StudentRoutes.post('/add-student',AddStudent);
StudentRoutes.get('/get-student', GetStudent);
StudentRoutes.delete('/delete-student', DeleteStudent);


export default StudentRoutes;