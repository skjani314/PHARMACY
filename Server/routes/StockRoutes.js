import express from 'express';
import { addStock, getStock } from '../controllers/StockController.js';
import { upload_file } from '../middlewares/multer.js';


const StockRoutes= express.Router();

StockRoutes.post('/add-stock',upload_file.array("img"),addStock);
StockRoutes.get('/get-stock',getStock);


export default StockRoutes;