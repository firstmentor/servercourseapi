const express = require("express");
const ProductController = require("../controllers/ProductController");
const CourseController = require("../controllers/courseController");
const BookingController = require("../controllers/bookingController");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { isAuthenticated } = require("../middlewares/authMiddleware");




//user
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);
router.get("/profile", isAuthenticated, UserController.getProfile);



//course
router.post('/addCourse', CourseController.createCourse);
router.get('/course', CourseController.getAllCourses);
router.get('/courseView/:id', CourseController.getCourseById);
router.put('/courseupdate/:id', CourseController.updateCourse);
router.delete('/coursedelete/:id', CourseController.deleteCourse);



//bookign
router.post('/addBooking', BookingController.createBooking);
router.get('/booking', BookingController.getBookings);




module.exports = router;
