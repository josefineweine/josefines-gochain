import { v4 as uuid4 } from 'uuid';
import { verifySignature } from '../utilities/crypto-lib.mjs';
import { REWARD_ADDRESS, MINING_REWARD } from '../utilities/settings.mjs';

export default class Transaction {
  constructor({ sender, recipient, amount, input, output }) {
    this.id = uuid4().replaceAll('-', '');
    this.outputMap =
      output || this.createOutputMap({ sender, recipient, amount });
    this.inputMap =
      input || this.createInputMap({ sender, outputMap: this.outputMap });
  }

  static transactionReward({ miner }) {
    return new this({
      input: REWARD_ADDRESS,
      output: { [miner.publicKey]: MINING_REWARD },
    });
  }

  static validate(transaction) {
    const {
      inputMap: { address, amount, signature },
      outputMap,
    } = transaction;

    const valueArray = Object.values(outputMap);

    const valueArrayNumber = valueArray.map((a) => parseInt(a));

    const outputTotal = valueArrayNumber.reduce((total, amount) => {
      return total + amount;
    });

    if (amount !== outputTotal) return false;

    if (!verifySignature({ publicKey: address, data: outputMap, signature }))
      return false;

    return true;
  }

  createOutputMap({ sender, recipient, amount }) {
    const outputMap = {};
    outputMap[recipient] = amount;
    outputMap[sender.publicKey] = sender.balance - amount;

    return outputMap;
  }

  createInputMap({ sender, outputMap }) {
    return {
      timestamp: Date.now(),
      amount: sender.balance,
      address: sender.publicKey,
      signature: sender.sign(outputMap),
    };
  }

  update({ sender, recipient, amount }) {
    console.log('AMOUNT UPDATE', amount);

    if (amount > this.outputMap[sender.publicKey])
      throw new Error('Not enough funds!');

    if (!this.outputMap[recipient]) {
      this.outputMap[recipient] = amount;
    } else {
      this.outputMap[recipient] =
        Number(this.outputMap[recipient]) + Number(amount);
    }

    this.outputMap[sender.publicKey] =
      this.outputMap[sender.publicKey] - amount;

    this.inputMap = this.createInputMap({ sender, outputMap: this.outputMap });
  }
}
