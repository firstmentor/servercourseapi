const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  bookingDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Booking', bookingSchema);
