import express from 'express';
import dotenv from 'dotenv';
import { connectDb } from './config/mongo.mjs';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cors from 'cors';
import authRouter from './routes/auth-routes.mjs';
import blockchainRouter from './routes/blockchain-routes.mjs';
import transactionRouter from './routes/transaction-routes.mjs';
import { errorHandler } from './middleware/errorHandler.mjs';
import Blockchain from './models/Blockchain.mjs';
import TransactionPool from './models/TransactionPool.mjs';
import Wallet from './models/Wallet.mjs';
import RedisServer from './redisServer.mjs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: './config/config.env' });

const fileName = fileURLToPath(import.meta.url);
const dirname = path.dirname(fileName);
global.__appdir = dirname;

export const blockchain = new Blockchain();
export const transactionPool = new TransactionPool();
export const wallet = new Wallet();
export const redisServer = new RedisServer({
  blockchain,
  transactionPool,
  wallet,
});

connectDb();

const app = express();
app.use(cors());
app.use(express.json());

app.use(mongoSanitize());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(xss());

const limit = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 100,
});

app.use(limit);
app.use(hpp());

app.use(express.static(path.join(__appdir, 'public')));

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 5000;

let NODE_PORT;

app.use(morgan('dev'));
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/blockchain', blockchainRouter);
app.use('/api/v1/wallet', transactionRouter);
app.use(errorHandler);

const synchronize = async () => {
  try {
    const blockchainResponse = await fetch(`${ROOT_NODE}/api/v1/blockchain`);
    if (blockchainResponse.ok) {
      const blockchainData = await blockchainResponse.json();
      redisServer.broadcast({
        channel: 'BLOCKCHAIN',
        message: JSON.stringify(blockchainData.data),
      });
    }

    const transactionResponse = await fetch(
      `${ROOT_NODE}/api/v1/wallet/transactions`,
    );
    if (transactionResponse.ok) {
      const transactionData = await transactionResponse.json();
      redisServer.broadcastTransaction(transactionData.data);
    }
  } catch (error) {
    console.error('Error synchronizing data:', error);
  }
};

if (process.env.GENERATE_NODE_PORT === 'true') {
  NODE_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = NODE_PORT || DEFAULT_PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);

  if (PORT !== DEFAULT_PORT) {
    synchronize();
  }
});
