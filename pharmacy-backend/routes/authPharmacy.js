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

// Get all buyer requests for the logged-in pharmacy
router.get('/requests', auth('pharmacy'), async (req, res) => {
  try {
    // Only get requests that are sent to this pharmacy
    const requests = await Request.find({
      selectedPharmacies: req.user.id.toString()
    }).populate('customer', 'email');
    
    // For each request, also fetch bills to show pharmacy-specific status
    const requestsWithBills = await Promise.all(requests.map(async (request) => {
      const bills = await Bill.find({ request: request._id })
        .populate('pharmacy', 'pharmacyName _id');
      
      return {
        ...request.toObject(),
        bills: bills
      };
    }));
    
    res.json(requestsWithBills);
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

    // Ensure this pharmacy is among the selected pharmacies for the request
    const isSelected = Array.isArray(request.selectedPharmacies) && request.selectedPharmacies.includes(req.user.id.toString());
    if (!isSelected) {
      return res.status(403).json({ message: 'You are not authorized to generate a bill for this request' });
    }

    // Check if this pharmacy has already generated a bill for this request
    const existingBill = await Bill.findOne({ 
      request: requestId, 
      pharmacy: req.user.id 
    });
    if (existingBill) {
      return res.status(400).json({ message: 'You have already generated a bill for this request' });
    }

    // Validate input data
    if (!medicinesArr || !Array.isArray(medicinesArr) || medicinesArr.length === 0) {
      return res.status(400).json({ message: 'Medicines array is required' });
    }

    if (!deliveryTime || deliveryTime.trim() === '') {
      return res.status(400).json({ message: 'Delivery time is required' });
    }

    // Calculate totals
    let subtotal = 0;
    const medicinesWithPrices = medicinesArr.map(med => {
      const pricePerUnit = Number(med.pricePerUnit);
      const quantity = Number(med.quantity);
      
      if (isNaN(pricePerUnit) || pricePerUnit <= 0) {
        throw new Error(`Invalid price for medicine: ${med.name}`);
      }
      if (isNaN(quantity) || quantity <= 0) {
        throw new Error(`Invalid quantity for medicine: ${med.name}`);
      }
      
      const totalPrice = pricePerUnit * quantity;
      subtotal += totalPrice;
      return {
        name: med.name || '',
        type: med.type || '',
        strength: med.strength || '',
        quantity,
        pricePerUnit,
        totalPrice
      };
    });

    const deliveryChargesNum = Number(deliveryCharges) || 0;
    if (isNaN(deliveryChargesNum) || deliveryChargesNum < 0) {
      return res.status(400).json({ message: 'Invalid delivery charges' });
    }
    
    const totalAmount = subtotal + deliveryChargesNum;

    // Create bill data
    const billData = {
      request: requestId,
      pharmacy: req.user.id,
      medicines: medicinesWithPrices,
      subtotal,
      deliveryCharges: deliveryChargesNum,
      totalAmount,
      deliveryTime: deliveryTime.trim(),
      status: 'generated' // Set bill status as generated, not accepted
    };

    // Only add customer if it exists
    if (request.customer) {
      billData.customer = request.customer;
    }

    // Create bill
    const bill = new Bill(billData);
    await bill.save();

    // Don't update request status - keep it pending so other pharmacies can also generate bills
    // The request status will only change when customer accepts a specific bill

    // Fetch the updated request with bills populated to return to frontend
    const updatedRequest = await Request.findById(requestId)
      .populate('customer', 'email');
    
    // Get all bills for this request to include in response
    const allBills = await Bill.find({ request: requestId })
      .populate('pharmacy', 'pharmacyName _id');
    
    const requestWithBills = {
      ...updatedRequest.toObject(),
      bills: allBills
    };

    res.status(201).json({ 
      message: 'Bill generated successfully', 
      bill,
      request: requestWithBills
    });
  } catch (err) {
    console.error('Error generating bill:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Reject request (pharmacy declines to bid). Do not change global request status.
router.post('/reject-request/:requestId', auth('pharmacy'), async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // In the new model, a pharmacy "rejecting" simply means they won't bid.
    // We intentionally do NOT change the global request status here
    // to allow other pharmacies to continue bidding.

    return res.json({ message: 'You have declined to bid on this request' });
  } catch (err) {
    console.error('Error declining request:', err);
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

// Get a single bill by ID for the logged-in pharmacy
router.get('/bills/:billId', auth('pharmacy'), async (req, res) => {
  try {
    const { billId } = req.params;
    const bill = await Bill.findById(billId)
      .populate('request')
      .populate('customer', 'email name')
      .populate('pharmacy', 'pharmacyName address phone');
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    // Ensure the bill belongs to the logged-in pharmacy
    if (bill.pharmacy._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this bill' });
    }
    res.json({ bill });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 