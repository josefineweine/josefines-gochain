import { transactionPool, wallet, blockchain } from '../server.mjs';
import Miner from '../models/Miner.mjs';

export const addTransaction = (req, res, next) => {
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
};

export const getWalletBalance = (req, res, next) => {
  const address = wallet.publicKey;
  const balance = Wallet.calculateBalance({ chain: blockchain.chain, address });

  res
    .status(200)
    .json({ success: true, statusCode: 200, data: { address, balance } });
};

export const getTransactionPool = (req, res, next) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    data: transactionPool.transactionMap,
  });
};

export const mineTransactions = (req, res, next) => {
  const miner = new Miner({
    blockchain,
    transactionPool,
    wallet,
  });

  const minedBlock = miner.mineTransaction();

  res.status(200).json({ success: true, statusCode: 200, data: minedBlock });
};
