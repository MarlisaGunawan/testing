var mongoose = require('mongoose');

// One counter document per day, e.g. { _id: '2026-11-01', seq: 12 }
// so queue numbers start again from A001 every morning.
var counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

module.exports = mongoose.model('Counter', counterSchema);
