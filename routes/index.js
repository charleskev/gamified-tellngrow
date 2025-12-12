/*
  MIT License
  Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
  Mindoro State University - Philippines
*/

// ==========================================
// ROUTES/INDEX.JS (UPDATED)
// ==========================================

import express from "express";
import { homePage } from "../controllers/homeController.js";
import { loginPage, registerPage, forgotPasswordPage, dashboardPage, loginUser, registerUser, logoutUser } from "../controllers/authController.js";

// Import new routes
import adminRoutes from "./admin.js";
import userRoutes from "./user.js";
import gameRoutes from "./games.js";
import quizRoutes from "./quiz.js";
import journalRoutes from "./journal.js";
import historyRoutes from "./history.js";

const router = express.Router();

// Public routes
router.get("/", homePage);
router.get("/login", loginPage);
router.post("/login", loginUser);
router.get("/register", registerPage);
router.post("/register", registerUser);
router.get("/forgot-password", forgotPasswordPage);
router.get("/dashboard", dashboardPage);
router.get("/logout", logoutUser);

// Protected routes
router.use("/admin", adminRoutes);
router.use("/user", userRoutes);
router.use("/games", gameRoutes);
router.use("/quiz", quizRoutes);
router.use("/journal", journalRoutes);
router.use("/history", historyRoutes);

export default router;
