import BlockSchema from '../models/BlockModel.mjs';
import { blockchain, redisServer } from '../server.mjs';

export const addBlock = async (req, res, next) => {
  const data = req.body;

  const block = blockchain.createBlock({ data });

  redisServer.broadcast();

  const { hash, lastHash, nonce, difficulty } = block;
  const timestamp = Date.now(block.timestamp);
  const tx = Object.entries(block.data);

  await BlockSchema.create({
    hash,
    lastHash,
    nonce,
    difficulty,
    timestamp,
    tx,
  });

  res.status(201).json({ success: true, statusCode: 201, data: block });
};
