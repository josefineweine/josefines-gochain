import mongoose from 'mongoose';

const blockSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    required: [true],
  },
  hash: {
    type: String,
    required: [true],
  },
  lastHash: {
    type: String,
    required: [true],
  },
  tx: {
    type: Array,
    required: [true],
  },
  nonce: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
});

export default mongoose.model('block', blockSchema);
