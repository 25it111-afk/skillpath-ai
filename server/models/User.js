
import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  targetRole: String,
  scores: Object,
  roadmap: Array,
  done: { type: [String], default: [] },
  weak: { type: [String], default: [] }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', schema);