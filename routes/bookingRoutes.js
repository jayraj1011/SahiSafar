const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const {
  createBooking,
  getBookings,
  getBookingById,
} = require('../controllers/bookingController');

// ─── Validation Middleware ─────────────────────────────────────────────────────
const validateBooking = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('phone')
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Enter a valid 10-digit Indian mobile number'),
  body('pickupLocation')
    .trim()
    .notEmpty()
    .withMessage('Pickup location is required'),
  body('dropLocation')
    .trim()
    .notEmpty()
    .withMessage('Drop location is required'),
  body('date')
    .isISO8601()
    .withMessage('Enter a valid date')
    .custom((value) => {
      if (new Date(value) < new Date().setHours(0, 0, 0, 0)) {
        throw new Error('Travel date cannot be in the past');
      }
      return true;
    }),
  body('vehicleType')
    .isIn(['Dzire', 'Etios', 'Ertiga', 'Innova', 'Innova Crysta', 'Tempo Traveller'])
    .withMessage('Select a valid vehicle type'),
  body('tripType')
    .isIn(['one-way', 'round-trip'])
    .withMessage('Select a valid trip type'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Message cannot exceed 500 characters'),

  // Process validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }
    next();
  },
];

// ─── Routes ────────────────────────────────────────────────────────────────────
router.post('/book', validateBooking, createBooking);
router.get('/bookings', getBookings);
router.get('/bookings/:id', getBookingById);

module.exports = router;
