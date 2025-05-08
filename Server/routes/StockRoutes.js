import express from 'express';
import { authenticate } from '../middlewares/AdminVerify';
import { upload_file } from '../middlewares/multer';
import { addStock, getStock } from '../controllers/StockController';



const StockRoutes= express.Router();

app.post('/add-stock',upload_file.array('img'),addStock);
app.get('/get-stock',getStock);


export default StockRoutes;