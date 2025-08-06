require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const customerAuthRoutes = require('./routes/authCustomer');
const pharmacyAuthRoutes = require('./routes/authPharmacy');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // allow 1000 requests per 15 minutes for development
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/customer', authLimiter, customerAuthRoutes);
app.use('/api/pharmacy', authLimiter, pharmacyAuthRoutes);

mongoose.connect('mongodb://localhost:27017/pharmacydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  app.listen(5000, () => console.log('Server running on port 5000'));
}).catch(err => console.error(err)); 