import { createHash } from '../utilities/crypto-lib.mjs';
import { MINING_REWARD, REWARD_ADDRESS } from '../utilities/settings.mjs';
import Block from './Block.mjs';
import Transaction from './Transaction.mjs';

export default class Blockchain {
  constructor() {
    this.chain = [Block.createGenesis()];
  }

  static isValid(chain) {
    if (JSON.stringify(chain.at(0)) !== JSON.stringify(Block.createGenesis())) {
      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      const { timestamp, hash, lastHash, data, nonce, difficulty } =
        chain.at(i);

      const prevHash = chain[i - 1].hash;
      const prevDifficulty = chain[i - 1].difficulty;

      if (lastHash !== prevHash) {
        return false;
      }

      if (Math.abs(prevDifficulty - difficulty) > 1) return false;

      const stringToHash = timestamp
        .toString()
        .concat(lastHash, JSON.stringify(data), nonce, difficulty);

      const validHash = createHash(stringToHash);

      if (hash !== validHash) {
        return false;
      }
    }

    return true;
  }

  createBlock({ data }) {
    const block = Block.mineBlock({ lastBlock: this.chain.at(-1), data });
    this.chain.push(block);
    return block;
  }

  replaceChain(chain, shouldValidate, onSuccess) {
    if (chain.length <= this.chain.length) return;

    if (!Blockchain.isValid(chain)) return;

    if (shouldValidate && !this.validateTransactionData({ chain })) return;

    if (onSuccess) onSuccess();

    this.chain = chain;
  }

  validateTransactionData({ chain }) {
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const transactionSet = new Set();
      let counter = 0;

      for (let transaction of block.data) {
        if (transaction.inputMap.address === REWARD_ADDRESS.address) {
          counter++;

          if (counter > 1) return false;

          if (Object.values(transaction.outputMap)[0] !== MINING_REWARD)
            return false;
        } else {
          if (!Transaction.validate(transaction)) {
            return false;
          }

          if (transactionSet.has(transaction)) {
            return false;
          } else {
            transactionSet.add(transaction);
          }
        }
      }
    }
    return true;
  }
}
