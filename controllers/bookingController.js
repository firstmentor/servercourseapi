const Booking = require('../models/Booking');

class BookingController {
  static async createBooking(req, res) {
    try {
      const { userName, userEmail, courseId } = req.body;
      const booking = new Booking({ userName, userEmail, courseId });
      await booking.save();
      res.status(201).json(booking);
    } catch (error) {
      res.status(500).json({ message: 'Booking failed' });
    }
  }

  static async getBookings(req, res) {
    try {
      const bookings = await Booking.find().populate('courseId');
      res.status(200).json(bookings);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch bookings' });
    }
  }
}

module.exports = BookingController;
    