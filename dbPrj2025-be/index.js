'use strict'
const express = require('express')
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Kết nối database
require('./databaseConnection');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

// Routes
try {
  const userRoutes = require('./routes/userRoutes');
  const examinationRoutes = require('./routes/examinationRoutes');
  const appointmentRoutes = require('./routes/appointmentRoutes');
  const paymentRoutes = require('./routes/paymentRoutes');

  app.use('/user', userRoutes);
  app.use('/examination', examinationRoutes);
  app.use('/appointment', appointmentRoutes);
  app.use('/payment', paymentRoutes);
} catch (err) {
  console.error('❌ Lỗi khi khởi tạo routes:', err);
  process.exit(1);
}

app.get('/', (req, res) => {
  res.send('Hello world');
});

const BE_PORT = process.env.BE_PORT || 5000;
app.listen(BE_PORT, () => {
  console.log('✅ Server running on http://localhost:' + BE_PORT);
});
