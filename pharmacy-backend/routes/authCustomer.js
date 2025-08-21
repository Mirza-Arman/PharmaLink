const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/customerAuthController');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const Customer = require('../models/Customer');
const Request = require('../models/Request');
const Bill = require('../models/Bill');

router.post('/signup', signup);
router.post('/login', login);

// Create a new request (order)
router.post('/request', async (req, res) => {
  try {
    const { medicines, address, phone, city, selectedPharmacies, customerName } = req.body;

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
    
    console.log('Creating request with data:', {
      medicines,
      customerName,
      address,
      phone,
      city,
      selectedPharmacies,
      customer: customerId
    });
    
    const request = new Request({
      medicines,
      customerName,
      address,
      phone,
      city,
      selectedPharmacies,
      customer: customerId // can be null for guest
    });
    await request.save();
    res.status(201).json({ message: 'Request created', request });
  } catch (err) {
    console.error('Error creating request:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
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

// Get bills for a specific logged-in customer
router.get('/bills', auth('customer'), async (req, res) => {
  try {
    // First, get all requests for this customer
    const customerRequests = await Request.find({ customer: req.user.id });
    const requestIds = customerRequests.map(req => req._id);
    
    console.log(`Customer ${req.user.id} has ${customerRequests.length} requests:`, requestIds);
    
    // Then, get all bills that are either:
    // 1. Directly associated with this customer, OR
    // 2. Associated with requests that belong to this customer
    const bills = await Bill.find({
      $or: [
        { customer: req.user.id },
        { request: { $in: requestIds } }
      ]
    })
    .populate('pharmacy', 'pharmacyName address phone')
    .populate('request')
    .sort({ createdAt: -1 });
    
    console.log(`Found ${bills.length} bills for customer ${req.user.id}`);
    console.log('Bills structure:', bills.map(bill => ({
      id: bill._id,
      request: bill.request,
      customer: bill.customer,
      pharmacy: bill.pharmacy
    })));
    
    res.json(bills);
  } catch (err) {
    console.error('Error fetching bills:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Debug endpoint to check all bills (remove in production)
router.get('/debug/bills', auth('customer'), async (req, res) => {
  try {
    const allBills = await Bill.find()
      .populate('pharmacy', 'pharmacyName address phone')
      .populate('request')
      .populate('customer', 'email');
    
    res.json({
      totalBills: allBills.length,
      bills: allBills.map(bill => ({
        id: bill._id,
        request: bill.request,
        customer: bill.customer,
        pharmacy: bill.pharmacy,
        status: bill.status,
        createdAt: bill.createdAt
      }))
    });
  } catch (err) {
    console.error('Error in debug endpoint:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept a specific bill from a pharmacy
router.post('/accept-bill/:billId', auth('customer'), async (req, res) => {
  try {
    const { billId } = req.params;
    
    // Find the bill
    const bill = await Bill.findById(billId)
      .populate('request')
      .populate('pharmacy', 'pharmacyName');
    
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    
    // Verify this bill belongs to a request from this customer
    if (bill.request.customer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to accept this bill' });
    }
    
    // Check if bill is in generated status
    if (!['generated', 'pending'].includes(bill.status)) {
      return res.status(400).json({ message: 'Bill is not available for acceptance' });
    }
    
    // Update bill status to accepted
    bill.status = 'accepted';
    await bill.save();
    
    // Update request status to accepted and set the accepted bill
    const request = bill.request;
    request.status = 'accepted';
    request.acceptedBy = bill.pharmacy._id;
    request.bill = bill._id;
    await request.save();
    
    // Reject all other bills for this request
    await Bill.updateMany(
      { 
        request: request._id, 
        _id: { $ne: bill._id },
        status: 'generated'
      },
      { status: 'rejected' }
    );
    
    res.json({ 
      message: 'Bill accepted successfully', 
      bill,
      request 
    });
  } catch (err) {
    console.error('Error accepting bill:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 