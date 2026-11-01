var mongoose = require('mongoose');

// 127.0.0.1 instead of "localhost" avoids IPv6 connection problems on newer Node versions.
mongoose.set('strictQuery', true);

var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hospital_queue';

function connect() {
  return mongoose.connect(MONGODB_URI)
    .then(function () {
      console.log('MongoDB connected: ' + MONGODB_URI);
    })
    .catch(function (err) {
      console.error('MongoDB connection error. Is MongoDB running?\n', err.message);
      process.exit(1);
    });
}

module.exports = { connect: connect };
