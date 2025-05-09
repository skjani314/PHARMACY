import express from 'express';
import { AddMedicine, deleteMedicine, getMedicines, updateMedicine } from '../controllers/MedicineController.js';
import { authenticate } from '../middlewares/AdminVerify.js';
import { upload_file } from '../middlewares/multer.js';

const MedicineRoutes = express.Router();

MedicineRoutes.get('/get-medicine',getMedicines);
MedicineRoutes.post('/add-medicine',authenticate,upload_file.array('img'),AddMedicine);
MedicineRoutes.delete('/delete-medicine',authenticate,deleteMedicine);
MedicineRoutes.put('/update-medicine',authenticate,updateMedicine);


export default MedicineRoutes;