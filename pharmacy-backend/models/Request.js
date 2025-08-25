const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  medicines: [{ 
    name: String, 
    type: { type: String, default: '' },
    strength: { type: String, default: '' },
    quantity: Number 
  }],
  customerName: { type: String, default: '' },
  address: String,
  phone: String,
  city: String,
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  selectedPharmacies: [String], // Array of pharmacy IDs as strings
  pharmacyNames: [String], // Array of pharmacy names (order matches selectedPharmacies)
  rejectedPharmacies: { type: [String], default: [] }, // Pharmacies that declined the request (keep them visible to customer)
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'completed'], default: 'pending' },
  acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy' },
  bill: { type: mongoose.Schema.Types.ObjectId, ref: 'Bill' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Request', requestSchema); 