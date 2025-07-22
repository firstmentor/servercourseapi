const Course = require('../models/Course');
const cloudinary = require('../config/cloudinary');
console.log(process.env.CLOUDINARY_API_KEY)

class CourseController {
  // 🔹 CREATE Course
  static async createCourse(req, res) {
    try {
      console.log(req.files)
      const { title, description, price, duration } = req.body;
      let imageUrl = '';
      let public_id = '';

      if (req.files && req.files.image) {
        const file = req.files.image;
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: 'courses',
        });
        console.log(result)
        imageUrl = result.secure_url;
        public_id = result.public_id;
      }

      const course = new Course({ title, description, price, duration, image: imageUrl, cloudinary_id: public_id });
      await course.save();

      res.status(201).json(course);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to create course' });
    }
  }

  // 🔹 READ All Courses
  static async getAllCourses(req, res) {
    try {
      const courses = await Course.find();
      // console.log(courses)
      res.status(200).json(courses);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching courses' });
    }
  }

  // 🔹 UPDATE Course
  static async updateCourse(req, res) {
    try {
      const { id } = req.params;
      const course = await Course.findById(id);
      if (!course) return res.status(404).json({ message: 'Course not found' });

      const { title, description, price, duration } = req.body;

      // 🔸 If new image uploaded → delete old from Cloudinary
      if (req.files && req.files.image) {
        if (course.cloudinary_id) {
          await cloudinary.uploader.destroy(course.cloudinary_id);
        }

        const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
          folder: 'courses',
        });

        course.image = result.secure_url;
        course.cloudinary_id = result.public_id;
      }

      course.title = title || course.title;
      course.description = description || course.description;
      course.price = price || course.price;
      course.duration = duration || course.duration;

      await course.save();
      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ message: 'Error updating course' });
    }
  }

  // 🔹 DELETE Course
  static async deleteCourse(req, res) {
    try {
      const { id } = req.params;
      const course = await Course.findById(id);
      if (!course) return res.status(404).json({ message: 'Course not found' });

      // 🔸 Delete image from Cloudinary
      if (course.cloudinary_id) {
        await cloudinary.uploader.destroy(course.cloudinary_id);
      }

      await course.deleteOne();
      res.status(200).json({ message: 'Course deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting course' });
    }
  }

  // 🔹 GET Single Course
  static async getCourseById(req, res) {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) return res.status(404).json({ message: 'Course not found' });
      res.status(200).json({ course });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching course' });
    }
  }
}

module.exports = CourseController;
