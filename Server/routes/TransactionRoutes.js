import express from 'express';
import { AddTransaction, GetTransaction } from '../controllers/TransactionController.js';



const TransactionRoutes = express.Router();

TransactionRoutes.post('/add-transaction', AddTransaction)
TransactionRoutes.get('/get-transaction', GetTransaction);

export default TransactionRoutes;