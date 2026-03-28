const Booking = require('../models/Booking');
const transporter = require('../config/mailer');

// ─── Create Booking ────────────────────────────────────────────────────────────
exports.createBooking = async (req, res) => {
  try {
    const {
      fullName, phone, pickupLocation,
      dropLocation, date, vehicleType, tripType, message,
    } = req.body;

    // Save to DB
    const booking = await Booking.create({
      fullName, phone, pickupLocation,
      dropLocation, date, vehicleType, tripType, message,
    });

    // ── Send email to admin ──
    const adminMailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `🚖 New Booking: ${booking.bookingId} — ${fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background: #FF6B35; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🚖 City Yatra</h1>
            <p style="color: #ffe0d0; margin: 4px 0 0;">New Booking Received</p>
          </div>
          <div style="padding: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background: #f9f9f9;">
                <td style="padding: 10px 14px; font-weight: bold; width: 40%;">Booking ID</td>
                <td style="padding: 10px 14px; color: #FF6B35; font-weight: bold;">${booking.bookingId}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; font-weight: bold;">Customer Name</td>
                <td style="padding: 10px 14px;">${fullName}</td>
              </tr>
              <tr style="background: #f9f9f9;">
                <td style="padding: 10px 14px; font-weight: bold;">Phone</td>
                <td style="padding: 10px 14px;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; font-weight: bold;">Pickup</td>
                <td style="padding: 10px 14px;">${pickupLocation}</td>
              </tr>
              <tr style="background: #f9f9f9;">
                <td style="padding: 10px 14px; font-weight: bold;">Drop</td>
                <td style="padding: 10px 14px;">${dropLocation}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; font-weight: bold;">Date</td>
                <td style="padding: 10px 14px;">${new Date(date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
              </tr>
              <tr style="background: #f9f9f9;">
                <td style="padding: 10px 14px; font-weight: bold;">Vehicle</td>
                <td style="padding: 10px 14px;">${vehicleType}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; font-weight: bold;">Trip Type</td>
                <td style="padding: 10px 14px; text-transform: capitalize;">${tripType.replace('-', ' ')}</td>
              </tr>
              ${message ? `<tr style="background: #f9f9f9;"><td style="padding: 10px 14px; font-weight: bold;">Message</td><td style="padding: 10px 14px;">${message}</td></tr>` : ''}
            </table>
          </div>
          <div style="background: #f0f0f0; padding: 12px; text-align: center; font-size: 12px; color: #888;">
            City Yatra Booking System • ${new Date().toLocaleString('en-IN')}
          </div>
        </div>
      `,
    };

    // ── Send confirmation email to customer ──
    const customerMailOptions = {
      from: process.env.EMAIL_FROM,
      to: `${phone}@placeholder.com`, // Replace with customer email field if added
      subject: `✅ Booking Confirmed — ${booking.bookingId} | City Yatra`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #FF6B35, #f7931e); padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🚖 City Yatra</h1>
            <p style="color: #ffe0d0; margin: 8px 0 0; font-size: 18px;">Booking Confirmed!</p>
          </div>
          <div style="padding: 24px;">
            <p style="font-size: 16px;">Dear <strong>${fullName}</strong>,</p>
            <p>Thank you for choosing City Yatra! Your booking has been received and our team will contact you shortly to confirm the details.</p>
            <div style="background: #fff8f5; border-left: 4px solid #FF6B35; padding: 16px; border-radius: 4px; margin: 20px 0;">
              <strong style="color: #FF6B35; font-size: 18px;">Booking ID: ${booking.bookingId}</strong>
            </div>
            <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
              <tr><td style="padding: 8px 0; color: #666;">📍 From</td><td style="padding: 8px 0; font-weight: bold;">${pickupLocation}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;">📍 To</td><td style="padding: 8px 0; font-weight: bold;">${dropLocation}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;">📅 Date</td><td style="padding: 8px 0; font-weight: bold;">${new Date(date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;">🚗 Vehicle</td><td style="padding: 8px 0; font-weight: bold;">${vehicleType}</td></tr>
            </table>
            <p style="margin-top: 20px;">For any queries, call us at: <strong>${process.env.BUSINESS_PHONE || '+91-9876543210'}</strong></p>
          </div>
          <div style="background: #FF6B35; padding: 12px; text-align: center;">
            <p style="color: white; margin: 0; font-size: 13px;">© ${new Date().getFullYear()} City Yatra. Safe & Comfortable Journeys.</p>
          </div>
        </div>
      `,
    };

    // Send emails (non-blocking — don't fail booking if email fails)
    try {
      await transporter.sendMail(adminMailOptions);
      // await transporter.sendMail(customerMailOptions); // Enable when you have customer email field
    } catch (emailErr) {
      console.warn('⚠️  Email send failed (booking still saved):', emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Booking received successfully!',
      bookingId: booking.bookingId,
    });

  } catch (error) {
    console.error('Booking error:', error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }

    res.status(500).json({ success: false, message: 'Server error. Please try again or call us directly.' });
  }
};

// ─── Get All Bookings (Admin) ──────────────────────────────────────────────────
exports.getBookings = async (req, res) => {
  try {
    // Simple password protection via query param — replace with proper auth in production
    const { adminKey } = req.query;
    if (adminKey !== (process.env.ADMIN_KEY || 'cityyatra2024')) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      Booking.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Booking.countDocuments(),
    ]);

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── Get Single Booking ────────────────────────────────────────────────────────
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
