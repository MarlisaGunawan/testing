var mongoose = require('mongoose');

var visitorSchema = new mongoose.Schema({
  queueNumber: { type: String, trim: true },
  queueDate: { type: String },
  name: { type: String, required: true, trim: true },
  idNumber: { type: String, trim: true },          // NIK / KTP
  gender: { type: String, enum: ['Male', 'Female', ''], default: '' },
  birthDate: { type: Date },
  phone: { type: String, required: true, trim: true },
  email: { type: String, trim: true },
  address: { type: String, trim: true },
  city: { type: String, trim: true },
  department: { type: String, required: true, trim: true }, // poli / clinic
  doctor: { type: String, trim: true },
  visitType: { type: String, enum: ['General', 'BPJS', 'Insurance'], default: 'General' },
  complaint: { type: String, trim: true },
  remark: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Visitor', visitorSchema);
