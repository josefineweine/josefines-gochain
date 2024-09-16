import Transaction from './Transaction.mjs';

export default class Miner {
  constructor({ blockchain, wallet, transactionPool }) {
    this.blockchain = blockchain;
    this.wallet = wallet;
    this.transactionPool = transactionPool;
  }

  mineTransaction() {
    const validTransactions = this.transactionPool.validateTransactions();
    validTransactions.push(
      Transaction.transactionReward({ miner: this.wallet }),
    );
    const minedBlock = this.blockchain.createBlock({ data: validTransactions });
    this.transactionPool.clearTransactions();

    return minedBlock;
  }
}
