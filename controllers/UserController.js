const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class UserController {
  // 🔐 Register user (admin or student)
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });

      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }

  // 🔐 Login user (set token in cookie)
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Send token in HTTP-Only cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: true, // ✅ Netlify (HTTPS) के लिए true
        sameSite: "None", // ✅ Netlify और Render अलग domain हैं, तो "None" जरूरी
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
      });

      res
        .status(200)
        .json({
          message: "Login successful",
          role: user.role,
          name: user.name,
          email: user.email,
        });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }

  // 🚪 Logout
  static async logout(req, res) {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  }

  // 👤 Get profile
  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user._id).select("-password");
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching profile", error });
    }
  }

  static changePassword = async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
  
      const user = await User.findById(req.user._id);
      if (!user || !user.password) {
        return res.status(404).json({ message: "User not found or password missing" });
      }
  
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Old password is incorrect" });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
      await user.save();
  
      return res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  };
  
  
}

module.exports = UserController;
