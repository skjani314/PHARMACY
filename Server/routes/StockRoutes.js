import express from 'express';
import { authenticate } from '../middlewares/AdminVerify.js';
import { upload_file } from '../middlewares/multer.js';
import { addStock, getStock } from '../controllers/StockController.js';



const StockRoutes= express.Router();

StockRoutes.post('/add-stock',addStock);
StockRoutes.get('/get-stock',getStock);


export default StockRoutes;