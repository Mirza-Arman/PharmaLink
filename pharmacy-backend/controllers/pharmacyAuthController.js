const Pharmacy = require('../models/Pharmacy');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

exports.signup = async (req, res) => {
  try {
    const { email, phone, password, pharmacyName, address, licence } = req.body;
    // Validate email and phone
    if (!validator.isEmail(email)) return res.status(400).json({ message: 'Invalid email format' });
    if (!/^03[0-9]{9}$/.test(phone)) return res.status(400).json({ message: 'Invalid phone format' });
    if (!validator.isStrongPassword(password, { minLength: 6 })) return res.status(400).json({ message: 'Password too weak' });
    if (!pharmacyName || !address || !licence) return res.status(400).json({ message: 'All fields are required' });

    const existing = await Pharmacy.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hash = await bcrypt.hash(password, 10);
    const pharmacy = new Pharmacy({ email, phone, password: hash, pharmacyName, address, licence });
    await pharmacy.save();
    res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check for existing customer token in headers
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          if (decoded.type === 'customer') {
            return res.status(403).json({ 
              message: 'A customer is currently logged in. Please logout the customer first.' 
            });
          }
        } catch (err) {
          // Token is invalid, continue with login
        }
      }
    }
    
    const pharmacy = await Pharmacy.findOne({ email });
    if (!pharmacy) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, pharmacy.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: pharmacy._id, type: 'pharmacy' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { _id: pharmacy._id, email: pharmacy.email, phone: pharmacy.phone, pharmacyName: pharmacy.pharmacyName } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all pharmacies, optionally filter by city (address contains city)
exports.getPharmacies = async (req, res) => {
  try {
    const { city } = req.query;
    let query = {};
    if (city) {
      // Case-insensitive search for city in address
      query.address = { $regex: city, $options: 'i' };
    }
    const pharmacies = await Pharmacy.find(query).select('-password');
    res.json(pharmacies);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 