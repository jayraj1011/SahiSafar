const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number'],
    },
    pickupLocation: {
      type: String,
      required: [true, 'Pickup location is required'],
      trim: true,
    },
    dropLocation: {
      type: String,
      required: [true, 'Drop location is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Travel date is required'],
    },
    vehicleType: {
      type: String,
      required: [true, 'Vehicle type is required'],
      enum: ['Dzire', 'Etios', 'Ertiga', 'Innova', 'Innova Crysta', 'Tempo Traveller'],
    },
    tripType: {
      type: String,
      required: [true, 'Trip type is required'],
      enum: ['one-way', 'round-trip'],
    },
    message: {
      type: String,
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    bookingId: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

// Auto-generate booking ID before save
bookingSchema.pre('save', function (next) {
  if (!this.bookingId) {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
    this.bookingId = `CY-${ts}-${rand}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
