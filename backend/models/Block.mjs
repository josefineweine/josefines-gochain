import hexToBinary from 'hex-to-binary';
import { createHash } from '../utilities/crypto-lib.mjs';
import { GENESIS_DATA } from '../utilities/settings.mjs';
import dontenv from 'dotenv';

dontenv.config({ path: './config/config.env' });

const mineRate = parseInt(process.env.MINE_RATE);

export default class Block {
  constructor({ timestamp, hash, lastHash, data, nonce, difficulty }) {
    this.timestamp = timestamp;
    this.hash = hash;
    this.lastHash = lastHash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  static createGenesis() {
    return new this(GENESIS_DATA);
  }

  static mineBlock({ lastBlock, data }) {
    let timestamp, hash;
    let nonce = 512;
    let lastHash = lastBlock.hash;
    let { difficulty } = lastBlock;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficultyLevel(lastBlock, timestamp);
      const stringToHash = timestamp
        .toString()
        .concat(lastHash, JSON.stringify(data), nonce, difficulty);

      hash = createHash(stringToHash);
    } while (
      hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty)
    );

    return new this({ timestamp, hash, lastHash, data, nonce, difficulty });
  }

  static adjustDifficultyLevel(lastBlock, currentTimestamp) {
    let { difficulty } = lastBlock;
    let { timestamp } = lastBlock;
    const elapsedTime = currentTimestamp - timestamp;

    if (difficulty < 1) return 1;

    return elapsedTime > mineRate ? +difficulty - 1 : +difficulty + 1;
  }
}
