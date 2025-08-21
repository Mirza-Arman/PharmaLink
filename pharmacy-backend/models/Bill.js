const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  request: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
  pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', default: null },
  medicines: [{
    name: { type: String, required: true },
    type: { type: String, default: '' },
    strength: { type: String, default: '' },
    quantity: { type: Number, required: true, min: 1 },
    pricePerUnit: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 }
  }],
  subtotal: { type: Number, required: true, min: 0 },
  deliveryCharges: { type: Number, required: true, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  deliveryTime: { type: String, required: true, trim: true },
  status: { type: String, enum: ['pending', 'generated', 'accepted', 'rejected', 'completed'], default: 'generated' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bill', billSchema);
