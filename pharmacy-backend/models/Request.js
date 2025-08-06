const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  medicines: [{ name: String, quantity: Number }],
  address: String,
  phone: String,
  city: String,
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  selectedPharmacies: [String], // Array of pharmacy IDs as strings
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Request', requestSchema); 