// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./lib/mongodb');

const app = express();

// ── Security & Middleware ─────────────────────────────────────────────────────
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS — only allow your frontend
app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:3001',
    ];
    // Also allow www. variant automatically
    if (!origin) return callback(null, true);
    const withWww    = allowed.map(u => u?.replace('https://', 'https://www.'));
    const withoutWww = allowed.map(u => u?.replace('https://www.', 'https://'));
    const allAllowed = [...new Set([...allowed, ...withWww, ...withoutWww])].filter(Boolean);
    if (allAllowed.includes(origin)) return callback(null, true);
    console.warn('CORS blocked:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Rate limiting — public routes
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, error: 'Too many requests, please try again later.' },
});

// Stricter limit for contact form (prevent spam)
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { success: false, error: 'Too many messages sent. Please try again later.' },
});

app.use('/api/', publicLimiter);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/projects',       require('./routes/projects'));
app.use('/api/experience',     require('./routes/experience'));
app.use('/api/skills',         require('./routes/skills'));
app.use('/api/education',      require('./routes/education'));
app.use('/api/certifications', require('./routes/certifications'));
app.use('/api/volunteering',   require('./routes/volunteering'));
app.use('/api/contact',        contactLimiter, require('./routes/contact'));
app.use('/api/resume',         require('./routes/resume'));
app.use('/api/upload',         require('./routes/upload'));
app.use('/api/profile',        require('./routes/profile'));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'MaDycloud API is running 🚀', timestamp: new Date() });
});

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found` });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📦 MongoDB connected`);
    console.log(`🌍 CORS allowed for: ${process.env.FRONTEND_URL}`);
  });
}).catch(err => {
  console.error('❌ Failed to connect to MongoDB:', err);
  process.exit(1);
});