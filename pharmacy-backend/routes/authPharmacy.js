const express = require('express');
const router = express.Router();
const { signup, login, getPharmacies } = require('../controllers/pharmacyAuthController');
const auth = require('../middleware/auth');
const Pharmacy = require('../models/Pharmacy');
const Request = require('../models/Request');

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

module.exports = router; 