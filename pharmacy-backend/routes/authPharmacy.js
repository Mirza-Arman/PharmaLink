const express = require('express');
const router = express.Router();
const { signup, login, getPharmacies } = require('../controllers/pharmacyAuthController');
const auth = require('../middleware/auth');
const Pharmacy = require('../models/Pharmacy');
const Request = require('../models/Request');
const Bill = require('../models/Bill');

router.post('/signup', signup);
router.post('/login', login);

// Get pharmacy profile
router.get('/profile', auth('pharmacy'), async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.user.id).select('-password');
    if (!pharmacy) return res.status(404).json({ message: 'Not found' });
    res.json(pharmacy);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update pharmacy profile
router.put('/profile', auth('pharmacy'), async (req, res) => {
  try {
    const updates = (({ email, phone, pharmacyName, address, licence }) => ({ email, phone, pharmacyName, address, licence }))(req.body);
    const pharmacy = await Pharmacy.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select('-password');
    res.json(pharmacy);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/pharmacies', getPharmacies);

// Get all buyer requests
router.get('/requests', async (req, res) => {
  try {
    const requests = await Request.find().populate('customer', 'email');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept request and generate bill
router.post('/accept-request/:requestId', auth('pharmacy'), async (req, res) => {
  try {
    const { requestId } = req.params;
    let { medicines, deliveryCharges, deliveryTime } = req.body;

    // Parse medicines if it's a string (handle frontend sending JSON string)
    let medicinesArr = medicines;
    if (typeof medicines === 'string') {
      try {
        medicinesArr = JSON.parse(medicines);
      } catch (e) {
        return res.status(400).json({ message: 'Invalid medicines format' });
      }
    }

    // Validate request exists and is pending
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request is not pending' });
    }

    // Calculate totals
    let subtotal = 0;
    const medicinesWithPrices = medicinesArr.map(med => {
      const pricePerUnit = Number(med.pricePerUnit);
      const quantity = Number(med.quantity);
      const totalPrice = pricePerUnit * quantity;
      subtotal += totalPrice;
      return {
        name: med.name,
        type: med.type,
        strength: med.strength,
        quantity,
        pricePerUnit,
        totalPrice
      };
    });

    const deliveryChargesNum = Number(deliveryCharges);
    const totalAmount = subtotal + deliveryChargesNum;

    // Create bill
    const bill = new Bill({
      request: requestId,
      pharmacy: req.user.id,
      customer: request.customer,
      medicines: medicinesWithPrices,
      subtotal,
      deliveryCharges: deliveryChargesNum,
      totalAmount,
      deliveryTime
    });

    await bill.save();

    // Update request status
    request.status = 'accepted';
    request.acceptedBy = req.user.id;
    request.bill = bill._id;
    await request.save();

    res.status(201).json({ 
      message: 'Request accepted and bill generated', 
      bill,
      request 
    });
  } catch (err) {
    console.error('Error accepting request:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Reject request
router.post('/reject-request/:requestId', auth('pharmacy'), async (req, res) => {
  try {
    const { requestId } = req.params;
    
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request is not pending' });
    }

    request.status = 'rejected';
    request.acceptedBy = req.user.id;
    await request.save();

    res.json({ message: 'Request rejected', request });
  } catch (err) {
    console.error('Error rejecting request:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get bills for pharmacy
router.get('/bills', auth('pharmacy'), async (req, res) => {
  try {
    const bills = await Bill.find({ pharmacy: req.user.id })
      .populate('request')
      .populate('customer', 'email name')
      .sort({ createdAt: -1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 