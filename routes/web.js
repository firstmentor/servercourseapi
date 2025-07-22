const express = require("express");
const ProductController = require("../controllers/ProductController");
const CourseController = require("../controllers/courseController");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { isAuthenticated,isAdmin } = require("../middlewares/authMiddleware");
const bookingController = require("../controllers/bookingController");




//user
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);
router.get("/profile", isAuthenticated, UserController.getProfile);
router.post ("/change-password", isAuthenticated,UserController.changePassword);




//course
router.post('/addCourse', CourseController.createCourse);
router.get('/course', CourseController.getAllCourses);
router.get('/courseView/:id', CourseController.getCourseById);
router.put('/courseupdate/:id', CourseController.updateCourse);
router.delete('/coursedelete/:id', CourseController.deleteCourse);

    

//bookign
router.get('/admin-all', isAuthenticated, isAdmin, bookingController.getAllBookings);

router.post('/book-course/:id', isAuthenticated, bookingController.bookCourse);
router.get('/my-bookings', isAuthenticated, bookingController.getMyBookings);
router.put('/booking/cancel/:id', isAuthenticated, bookingController.cancelBooking);
router.delete('/booking/delete/:id', isAuthenticated, bookingController.deleteBooking);




module.exports = router;
