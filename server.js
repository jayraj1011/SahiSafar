require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
// const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Connect Database ──────────────────────────────────────────────────────────
// connectDB();

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api', require('./routes/bookingRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Serve Frontend (SPA fallback) ────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚖 City Yatra Server running at http://localhost:${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`\nAPI Endpoints:`);
  console.log(`  POST http://localhost:${PORT}/api/book`);
  console.log(`  GET  http://localhost:${PORT}/api/bookings?adminKey=cityyatra2024`);
});
