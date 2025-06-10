const express = require('express');
const router = express.Router();
const {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/questionController');
const { protect, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', getQuestions); // Get all questions, possibly filtered
router.get('/:id', getQuestionById); // Get single question by ID

// Protected admin routes
router.post('/', protect, isAdmin, createQuestion); // Create a new question
router.put('/:id', protect, isAdmin, updateQuestion); // Update a question
router.delete('/:id', protect, isAdmin, deleteQuestion); // Delete a question

module.exports = router;
