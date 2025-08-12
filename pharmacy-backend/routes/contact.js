const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const saved = await ContactMessage.create({ name, email, subject, message });
    return res.status(201).json({ message: 'Your message has been received. We will get back to you soon.', id: saved._id });
  } catch (error) {
    console.error('Contact create error:', error);
    return res.status(500).json({ error: 'Failed to submit message' });
  }
});

module.exports = router;


