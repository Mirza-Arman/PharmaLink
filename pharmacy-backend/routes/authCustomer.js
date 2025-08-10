const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/customerAuthController');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const Customer = require('../models/Customer');
const Request = require('../models/Request');

router.post('/signup', signup);
router.post('/login', login);

// Create a new request (order)
router.post('/request', async (req, res) => {
  try {
    const { medicines, address, phone, city, selectedPharmacies } = req.body;

    let customerId = req.body.customer || null;
    // If not provided, try to extract from Authorization header
    if (!customerId) {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          if (decoded?.type === 'customer') {
            customerId = decoded.id;
          }
        } catch (e) {
          // Ignore token errors for this public endpoint
        }
      }
    }
    const request = new Request({
      medicines,
      address,
      phone,
      city,
      selectedPharmacies,
      customer: customerId // can be null for guest
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

// Get requests for a specific logged-in customer
router.get('/requests', auth('customer'), async (req, res) => {
  try {
    const requests = await Request.find({ customer: req.user.id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 