import express from 'express';
import { AddTransaction, GetTransaction } from '../controllers/TransactionController.js';



const TransactionRoutes = express.Router();

TransactionRoutes.post('/transaction', AddTransaction)
TransactionRoutes.get('/transaction', GetTransaction);

export default TransactionRoutes;