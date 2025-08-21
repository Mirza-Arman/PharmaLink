const mongoose = require('mongoose');

const pharmacyBidSchema = new mongoose.Schema({
  request: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
  pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
  medicines: [
    {
      name: String,
      quantity: Number,
      price: Number,
    }
  ],
  deliveryCharges: { type: Number, required: true },
  deliveryTime: { type: String, required: true },
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('PharmacyBid', pharmacyBidSchema);
