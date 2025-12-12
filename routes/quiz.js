/*
    MIT License
    Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
*/

import express from 'express';
import quizController from '../controllers/quizcontroller.js';

const router = express.Router();

// Auth middleware
const checkAuth = (req, res, next) => {
  if (!req.session.userId) return res.redirect('/login');
  next();
};

// Default route - redirect to quiz select
router.get('/', checkAuth, (req, res) => res.redirect('/quiz/select'));

// Quiz routes
router.get('/select', checkAuth, quizController.getQuizSelect);
router.get('/calm-trivia', checkAuth, quizController.getCalmTrivia);
router.get('/paper-cards', checkAuth, quizController.getPaperCards);
router.post('/save', checkAuth, quizController.saveQuizSession);

export default router;
