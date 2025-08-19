const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  request: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
  pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  medicines: [{
    name: String,
    type: String,
    strength: String,
    quantity: Number,
    pricePerUnit: { type: Number, required: true },
    totalPrice: { type: Number, required: true }
  }],
  subtotal: { type: Number, required: true },
  deliveryCharges: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  deliveryTime: { type: String, required: true }, // e.g., "2-3 hours", "Same day"
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bill', billSchema);
