const BECEQuestion = require('../models/BECEQuestion');
const { Op } = require('sequelize'); // For complex queries

// @desc    Create a new BECE question
// @route   POST /api/questions
// @access  Private/Admin
const createQuestion = async (req, res) => {
  const { subject, year, type, questionText, options, correctAnswer, solution } = req.body;
  try {
    const question = await BECEQuestion.create({
      subject,
      year,
      type,
      questionText,
      options,
      correctAnswer,
      solution,
    });
    res.status(201).json(question);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error creating question', error: error.message });
  }
};

// @desc    Fetch all BECE questions or filter them
// @route   GET /api/questions
// @access  Public
const getQuestions = async (req, res) => {
  const { subject, year, type } = req.query;
  const filter = {};

  if (subject) filter.subject = subject;
  if (year) filter.year = year;
  if (type) filter.type = type;

  try {
    const questions = await BECEQuestion.findAll({ where: filter });
    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching questions', error: error.message });
  }
};

// @desc    Fetch a single BECE question by ID
// @route   GET /api/questions/:id
// @access  Public
const getQuestionById = async (req, res) => {
  try {
    const question = await BECEQuestion.findByPk(req.params.id);
    if (question) {
      res.json(question);
    } else {
      res.status(404).json({ message: 'Question not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching question', error: error.message });
  }
};

// @desc    Update a BECE question
// @route   PUT /api/questions/:id
// @access  Private/Admin
const updateQuestion = async (req, res) => {
  const { subject, year, type, questionText, options, correctAnswer, solution } = req.body;
  try {
    const question = await BECEQuestion.findByPk(req.params.id);
    if (question) {
      question.subject = subject || question.subject;
      question.year = year || question.year;
      question.type = type || question.type;
      question.questionText = questionText || question.questionText;
      question.options = options || question.options;
      question.correctAnswer = correctAnswer || question.correctAnswer;
      question.solution = solution || question.solution;

      const updatedQuestion = await question.save();
      res.json(updatedQuestion);
    } else {
      res.status(404).json({ message: 'Question not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error updating question', error: error.message });
  }
};

// @desc    Delete a BECE question
// @route   DELETE /api/questions/:id
// @access  Private/Admin
const deleteQuestion = async (req, res) => {
  try {
    const question = await BECEQuestion.findByPk(req.params.id);
    if (question) {
      await question.destroy();
      res.json({ message: 'Question removed' });
    } else {
      res.status(404).json({ message: 'Question not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting question', error: error.message });
  }
};

module.exports = {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};
