var express = require('express');
var router = express.Router();
var Visitor = require('../models/Visitor');
var Queue = require('../models/Queue');
var util = require('./util');

/* POST /api/visitors  -> save visitor details */
router.post('/', async function (req, res, next) {
  try {
    var data = req.body || {};
    data.queueDate = data.queueDate || util.today();
    var visitor = await Visitor.create(data);
    if (visitor.queueNumber) {
      await Queue.updateOne(
        { queueDate: visitor.queueDate, queueNumber: visitor.queueNumber },
        { status: 'registered' }
      );
    }
    res.status(201).json(visitor);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
});

/* GET /api/visitors?search=&department=&from=&to=&page=1&limit=10&sort=createdAt&order=desc */
router.get('/', async function (req, res, next) {
  try {
    var q = req.query;
    var filter = {};

    if (q.search) {
      var rx = new RegExp(util.escapeRegex(q.search), 'i');
      filter.$or = [
        { name: rx }, { queueNumber: rx }, { idNumber: rx },
        { phone: rx }, { doctor: rx }, { city: rx }
      ];
    }
    if (q.department) filter.department = q.department;
    if (q.from || q.to) {
      filter.createdAt = {};
      if (q.from) filter.createdAt.$gte = new Date(q.from + 'T00:00:00');
      if (q.to) filter.createdAt.$lte = new Date(q.to + 'T23:59:59.999');
    }

    var page = Math.max(parseInt(q.page, 10) || 1, 1);
    var limit = Math.min(Math.max(parseInt(q.limit, 10) || 10, 1), 1000);
    var allowedSort = ['createdAt', 'queueNumber', 'name', 'department', 'doctor', 'visitType'];
    var sortField = allowedSort.indexOf(q.sort) >= 0 ? q.sort : 'createdAt';
    var sort = {};
    sort[sortField] = q.order === 'asc' ? 1 : -1;

    var results = await Promise.all([
      Visitor.find(filter).sort(sort).skip((page - 1) * limit).limit(limit),
      Visitor.countDocuments(filter)
    ]);
    res.json({ items: results[0], total: results[1], page: page, limit: limit });
  } catch (err) {
    next(err);
  }
});

/* GET /api/visitors/:id */
router.get('/:id', async function (req, res, next) {
  try {
    var visitor = await Visitor.findById(req.params.id);
    if (!visitor) return res.status(404).json({ message: 'Visitor not found' });
    res.json(visitor);
  } catch (err) {
    next(err);
  }
});

/* DELETE /api/visitors/:id */
router.delete('/:id', async function (req, res, next) {
  try {
    var visitor = await Visitor.findByIdAndDelete(req.params.id);
    if (!visitor) return res.status(404).json({ message: 'Visitor not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
