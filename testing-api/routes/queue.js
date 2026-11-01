var express = require('express');
var router = express.Router();
var Counter = require('../models/Counter');
var Queue = require('../models/Queue');
var util = require('./util');

var PREFIX = 'A';

/* POST /api/queue  -> take the next queue number for today */
router.post('/', async function (req, res, next) {
  try {
    var date = util.today();
    // Atomic increment, so two people pressing the button at once never get the same number.
    var counter = await Counter.findOneAndUpdate(
      { _id: date },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    var queueNumber = PREFIX + String(counter.seq).padStart(3, '0');
    var queue = await Queue.create({ queueNumber: queueNumber, queueDate: date });
    res.status(201).json(queue);
  } catch (err) {
    next(err);
  }
});

/* GET /api/queue?status=waiting  -> today's queue numbers */
router.get('/', async function (req, res, next) {
  try {
    var filter = { queueDate: req.query.date || util.today() };
    if (req.query.status) filter.status = req.query.status;
    var items = await Queue.find(filter).sort({ createdAt: 1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
