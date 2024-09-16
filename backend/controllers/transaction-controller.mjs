import { transactionPool, wallet, blockchain } from '../server.mjs';
import Wallet from '../models/Wallet.mjs';
import Miner from '../models/Miner.mjs';

export const addTransaction = (req, res, next) => {
  try {
    let { amount, recipient } = req.body;

    amount = parseInt(amount);

    let transaction = transactionPool.transactionExist({
      address: wallet.publicKey,
    });

    if (transaction) {
      transaction.update({ sender: wallet, recipient, amount });
    } else {
      transaction = wallet.createTransaction({
        recipient,
        amount,
        chain: blockchain.chain,
      });
    }

    transactionPool.addTransaction(transaction);

    res.status(201).json({ success: true, statusCode: 201, data: transaction });
  } catch (error) {
    next(error);
  }
};

export const getWalletBalance = (req, res, next) => {
  try {
    const address = wallet.publicKey;
    const balance = Wallet.calculateBalance({ chain: blockchain.chain, address });

    res
      .status(200)
      .json({ success: true, statusCode: 200, data: { address, balance } });
  } catch (error) {
    next(error);
  }
};

export const getTransactionPool = (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: transactionPool.transactionMap,
    });
  } catch (error) {
    next(error);
  }
};

export const mineTransactions = (req, res, next) => {
  try {
    const miner = new Miner({
      blockchain,
      transactionPool,
      wallet,
    });

    const minedBlock = miner.mineTransaction();

    res.status(200).json({ success: true, statusCode: 200, data: minedBlock });
  } catch (error) {
    next(error);
  }
};
