const Course = require("../models/Course");
const Booking = require("../models/Booking");
const User = require("../models/User"); // Add this line
const sendEmail = require("../utils/sendEmail"); // Your helper path

class bookingController {
  static async bookCourse(req, res) {
    try {
      const courseId = req.params.id;
      const userId = req.user._id;

      // Check if already booked
      const exists = await Booking.findOne({ course: courseId, user: userId });
      if (exists) return res.status(400).json({ message: "Already booked!" });

      const course = await Course.findById(courseId);
      if (!course) return res.status(404).json({ message: "Course not found" });

      const booking = new Booking({
        user: userId,
        course: courseId,
        price: course.price,
      });

      await booking.save();

      // Fetch user details
      const user = await User.findById(userId);

      // 📧 Send email to User
      const userHtml = `
        <h2>Course Booking Confirmation</h2>
        <p>Hi ${user.name},</p>
        <p>You have successfully booked the course: <strong>${course.title}</strong>.</p>
        <p>Price: ₹${course.price}</p>
      `;
      await sendEmail(user.email, "Course Booking Confirmation", userHtml);

      // 📧 Send email to Admin
      const adminHtml = `
        <h2>New Course Booking</h2>
        <p>User <strong>${user.name}</strong> (${user.email}) booked the course: <strong>${course.title}</strong>.</p>
        <p>Price: ₹${course.price}</p>
      `;
      await sendEmail(
        process.env.ADMIN_EMAIL,
        "New Course Booking Notification",
        adminHtml
      );

      res.status(201).json({ message: "Course booked successfully", booking });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Booking failed", error: err.message });
    }
  }

  static async getMyBookings(req, res) {
    try {
      const bookings = await Booking.find({ user: req.user._id }).populate(
        "course"
      );
      res.status(200).json({ bookings });
    } catch (err) {
      res.status(500).json({ message: "Failed to get bookings" });
    }
  }
  // In bookingController.js
  static async cancelBooking(req, res) {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking)
        return res.status(404).json({ message: "Booking not found" });
      // console.log(booking.user.toString())
      // console.log(req.user._id)

      // Check if user is owner
      if (booking.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      booking.status = "Cancelled";
      await booking.save();

      res.status(200).json({ message: "Booking cancelled successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  }

  static async deleteBooking(req, res) {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    await booking.deleteOne();
    res.json({ message: "Booking deleted successfully" });
  }
  static async getAllBookings(req, res) {
    try {
      const bookings = await Booking.find()
        .populate('user', 'name email')
        .populate('course', 'title image')
        .sort({ bookedAt: -1 });
        // console.log(bookings)

      res.status(200).json({ bookings });
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch bookings', error: err.message });
    }
  }
}

module.exports = bookingController;
