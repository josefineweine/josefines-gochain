import { createClient } from 'redis';

const CHANNELS = {
  BLOCKCHAIN: 'BLOCKCHAIN',
  TRANSACTION: 'TRANSACTION',
};

export default class RedisServer {
  constructor({ blockchain, transactionPool, wallet }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;

    // Initialize Redis clients
    this.publisher = createClient();
    this.subscriber = createClient();

    // Handle errors
    this.publisher.on('error', (err) =>
      console.error('Publisher Redis Client Error:', err),
    );
    this.subscriber.on('error', (err) =>
      console.error('Subscriber Redis Client Error:', err),
    );

    // Connect to Redis
    this.publisher
      .connect()
      .then(() => console.log('Publisher connected to Redis'));
    this.subscriber
      .connect()
      .then(() => {
        console.log('Subscriber connected to Redis');
        this.loadChannels();
      })
      .catch((err) => console.error('Subscriber connection error:', err));

    // Ensure that the message handler is a function
    this.subscriber.on('message', (channel, message) =>
      this.messageHandler(channel, message),
    );
  }

  broadcast() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    });
  }

  broadcastTransaction(transaction) {
    this.publish({
      channel: CHANNELS.TRANSACTION,
      message: JSON.stringify(transaction),
    });
  }

  loadChannels() {
    Object.values(CHANNELS).forEach((channel) => {
      this.subscriber
        .subscribe(channel)
        .then(() => {
          console.log(`Subscribed to channel: ${channel}`);
        })
        .catch((err) =>
          console.error(`Failed to subscribe to channel: ${channel}`, err),
        );
    });
  }

  messageHandler(channel, message) {
    try {
      const msg = JSON.parse(message);

      if (channel === CHANNELS.BLOCKCHAIN) {
        console.log('Received blockchain message');
        this.blockchain.replaceChain(msg, true, () => {
          this.transactionPool.clearBlockTransactions({ chain: msg });
        });
      }

      if (channel === CHANNELS.TRANSACTION) {
        if (
          !this.transactionPool.transactionExists({
            address: this.wallet.publicKey,
          })
        ) {
          this.transactionPool.addTransaction(msg);
        }
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  publish({ channel, message }) {
    this.publisher
      .publish(channel, message)
      .catch((err) => console.error('Publish Error:', err));
  }
}
