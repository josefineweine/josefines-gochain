import dontenv from 'dotenv';

dontenv.config({ path: './config/config.env' });

export const INITIAL_BALANCE = 1000;

export const REWARD_ADDRESS = {
  address: 'MINING_REWARD',
};
export const MINING_REWARD = 50;

export const GENESIS_DATA = {
  timestamp: 1,
  hash: 'genesis',
  lastHash: '0',
  data: [],
  nonce: '0',
  difficulty: process.env.DIFFICULTY,
};
