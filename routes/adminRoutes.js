
const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

router.use(protect);
router.use(isAdmin);

// CSV upload route
router.post('/upload-questions-csv', adminController.uploadCsvQuestions);

// List questions for admin review
router.get('/questions', adminController.listAdminQuestions); // Added this line

router.get('/test', (req, res) => {
  res.json({ message: 'Admin route test successful. User is admin.', user: req.user });
});

module.exports = router;
