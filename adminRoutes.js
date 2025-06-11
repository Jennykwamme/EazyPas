
const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth'); // Adjust path if necessary
// const adminController = require('../controllers/adminController'); // Will be created next

// All routes in this file will be protected by 'protect' and 'isAdmin' middleware
router.use(protect);
router.use(isAdmin);

// Placeholder for CSV upload route - to be fully implemented in the next steps
// router.post('/upload-questions-csv', adminController.uploadCsvQuestions);

// Placeholder for listing questions route - to be fully implemented in later steps
// router.get('/questions', adminController.listAdminQuestions);

router.get('/test', (req, res) => {
  res.json({ message: 'Admin route test successful. User is admin.', user: req.user });
});

module.exports = router;
