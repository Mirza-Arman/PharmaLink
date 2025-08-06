const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/customerAuthController');
const auth = require('../middleware/auth');
const Customer = require('../models/Customer');
const Request = require('../models/Request');

router.post('/signup', signup);
router.post('/login', login);

// Create a new request (order)
router.post('/request', async (req, res) => {
  try {
    const { medicines, address, phone, city, selectedPharmacies, customer } = req.body;
    const request = new Request({
      medicines,
      address,
      phone,
      city,
      selectedPharmacies,
      customer: customer || null // can be null/undefined for guest
    });
    await request.save();
    res.status(201).json({ message: 'Request created', request });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get customer profile
router.get('/profile', auth('customer'), async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id).select('-password');
    if (!customer) return res.status(404).json({ message: 'Not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update customer profile
router.put('/profile', auth('customer'), async (req, res) => {
  try {
    const updates = (({ email, phone }) => ({ email, phone }))(req.body);
    const customer = await Customer.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select('-password');
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 