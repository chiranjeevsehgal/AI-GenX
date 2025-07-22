const express = require('express');
const cors = require('cors');
require('dotenv').config();
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT;

// Import routes
const geminiRoutes = require('./routes/gemini');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' })); 

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too Many Requests',
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.round(15 * 60) // 15 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', limiter);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// API routes
app.use('/api/gemini', geminiRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});