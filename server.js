// app.use('/api/tutors', require('./routes/tutors'));
// app.use('/api/users', require('./routes/users'));
// app.use('/api/bookings', require('./routes/bookings'));
// app.use('/api/messages', require('./routes/messages'));require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Error:', err.message));

// Routes – Commented out temporarily for testing
// app.use('/api/tutors', require('./routes/tutors'));
// app.use('/api/users', require('./routes/users'));
// app.use('/api/bookings', require('./routes/bookings'));
// app.use('/api/messages', require('./routes/messages'));

// Test route – MUST be before any wildcard or error handler
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
