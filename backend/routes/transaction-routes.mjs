import express from 'express';
import {
  addTransaction,
  getTransactionPool,
  getWalletBalance,
  mineTransactions,
} from '../controllers/transaction-controller.mjs';
import { protect } from '../middleware/authorization.mjs';

const router = express.Router();

router.post('/transaction', protect, addTransaction);
router.get('/transactions', getTransactionPool);
router.get('/mine', protect, mineTransactions);
router.get('/info', getWalletBalance);

export default router;
