var mongoose = require('mongoose');

var queueSchema = new mongoose.Schema({
  queueNumber: { type: String, required: true },   // e.g. A001
  queueDate: { type: String, required: true },     // YYYY-MM-DD
  status: { type: String, enum: ['waiting', 'registered'], default: 'waiting' }
}, { timestamps: true });

queueSchema.index({ queueDate: 1, queueNumber: 1 }, { unique: true });

module.exports = mongoose.model('Queue', queueSchema);
