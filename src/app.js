require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect DB (important)
connectDB().catch((err) => {
  console.log('MongoDB connection failed', err);
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

app.use(express.static('public'));

const userRouter = require('./routers/user.routes');
const paymentRouter = require('./routers/payment.routes');

app.get('/', (req, res) => {
  res.send('API is running');
});

app.use('/api/users', userRouter);
app.use('/api/payment', paymentRouter);

module.exports = app; // ✅ MUST export directly
