import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './config/.env' });

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export { connectDb };
