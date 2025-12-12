
      /*
    MIT License
    
    Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
    Mindoro State University - Philippines
*/

import bcrypt from "bcrypt";
import { User, UserProgress, Activity, sequelize } from "../models/index.js";

await sequelize.sync();

export const loginPage = (req, res) => res.render("login", { title: "Login" });
export const registerPage = (req, res) => res.render("register", { title: "Register" });
export const forgotPasswordPage = (req, res) => res.render("forgotpassword", { title: "Forgot Password" });

export const dashboardPage = async (req, res) => {
  try {
    if (!req.session.userId) return res.redirect("/login");
    
    const user = await User.findByPk(req.session.userId);
    if (!user) return res.redirect("/login");
    
    // Redirect based on role
    if (user.role === 'admin') {
      return res.redirect("/admin/dashboard");
    }
    
    const progress = await UserProgress.findOne({ where: { userId: req.session.userId } });
    res.render("user/userdashboard", { 
      title: "Dashboard",
      user,
      progress: progress || { totalPoints: 0, level: 'beginner', currentStreak: 0 },
      todayActivities: 0,
      recentActivities: [],
      recentGames: []
    });
  } catch (error) {
    console.error(error);
    res.redirect("/login");
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).render("login", { error_msg: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log(`🔍 User not found: ${email}`);
      return res.status(401).render("login", { error_msg: "Email or password is incorrect" });
    }

    console.log(`🔍 User found: ${email}, comparing passwords...`);
    const match = await bcrypt.compare(password, user.password);
    console.log(`✅ Password match result: ${match}`);
    
    if (!match) {
      console.log(`❌ Password mismatch for user: ${email}`);
      return res.status(401).render("login", { error_msg: "Email or password is incorrect" });
    }

    req.session.userId = user.id;
    
    // Save session before redirecting
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).render("login", { error_msg: "Session error occurred" });
      }

      // Log activity
      Activity.create({
        userId: user.id,
        type: 'login',
        description: `${user.name} logged in`,
        metadata: { ipAddress: req.ip }
      }).catch(err => console.error("Activity log error:", err));

      // Update last active
      user.update({ lastActive: new Date() })
        .catch(err => console.error("Update lastActive error:", err));

      // Redirect based on role
      if (user.role === 'admin') {
        res.redirect("/admin/dashboard");
      } else {
        res.redirect("/user/dashboard");
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).render("login", { error_msg: "An error occurred during login" });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).render("register", { error_msg: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).render("register", { error_msg: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res.status(400).render("register", { error_msg: "Password must be at least 6 characters" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).render("register", { error_msg: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    
    // Create user progress record with all fields
    await UserProgress.create({ 
      userId: user.id,
      totalGamesPlayed: 0,
      totalQuizzesTaken: 0,
      totalJournalEntries: 0,
      totalPoints: 0,
      currentStreak: 0,
      longestStreak: 0,
      level: 'beginner',
      breathingBubbleStats: {},
      colorTapStats: {},
      gridMemoryStats: {},
      stressBallStats: {},
      calmTriviaStats: {},
      paperCardsStats: {},
      achievements: []
    });

    // Log activity
    await Activity.create({
      userId: user.id,
      type: 'registration',
      description: `${name} registered`,
      metadata: { ipAddress: req.ip }
    });

    // Redirect to login page with success message
    res.render("login", { 
      success_msg: "Account created successfully! Please log in with your credentials." 
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).render("register", { error_msg: "An error occurred during registration" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (userId) {
      const user = await User.findByPk(userId);
      if (user) {
        await user.update({ lastActive: new Date() });
      }
    }
    req.session.destroy((err) => {
      if (err) console.error(err);
      res.redirect("/login");
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.redirect("/login");
  }
};
