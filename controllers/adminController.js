
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const BECEQuestion = require('../models/BECEQuestion'); // Adjust path if necessary
const { Readable } = require('stream');
const { Op } = require('sequelize'); // For search/filtering if needed

// Configure Multer for CSV file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only .csv files are allowed!'), false);
    }
  }
}).single('questionsCsv');

exports.uploadCsvQuestions = (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: 'Multer error: ' + err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No CSV file uploaded.' });
    }

    const results = [];
    const errors = [];
    const warnings = [];
    let rowCount = 0;

    const readable = new Readable();
    readable._read = () => {};
    readable.push(req.file.buffer);
    readable.push(null);

    readable
      .pipe(csv())
      .on('data', (data) => {
        rowCount++;
        const { subject, year, type, questionText, correctAnswer } = data;
        if (!subject || !year || !type || !questionText || !correctAnswer) {
          errors.push({ row: rowCount, message: 'Missing required fields (subject, year, type, questionText, correctAnswer).', data });
          return;
        }
        if (type !== 'objective' && type !== 'theory') {
            errors.push({ row: rowCount, message: `Invalid type: '${type}'. Must be 'objective' or 'theory'.`, data });
            return;
        }
        if (isNaN(parseInt(year))) {
            errors.push({ row: rowCount, message: `Invalid year: '${year}'. Must be a number.`, data });
            return;
        }

        let optionsArray = null;
        if (data.options) {
            try {
                optionsArray = JSON.parse(data.options);
                if (!Array.isArray(optionsArray)) {
                    warnings.push({row: rowCount, message: 'Options field was not a valid JSON array, storing as null.', originalValue: data.options});
                    optionsArray = null;
                }
            } catch (parseError) {
                warnings.push({row: rowCount, message: 'Options field was not valid JSON, storing as null.', originalValue: data.options, error: parseError.message});
                optionsArray = null;
            }
        }

        results.push({
          subject: data.subject,
          year: parseInt(year),
          type: data.type,
          questionText: data.questionText,
          options: optionsArray,
          correctAnswer: data.correctAnswer,
          solution: data.solution || null,
        });
      })
      .on('end', async () => {
        if (errors.length > 0 && results.length === 0) {
            return res.status(400).json({
                message: 'CSV processing failed. No valid questions to import.',
                errors: errors,
                warnings: warnings,
                rowsProcessed: rowCount
            });
        }

        let successfullySaved = 0;
        let dbErrors = [];

        try {
          for (const questionData of results) {
            try {
              await BECEQuestion.create(questionData);
              successfullySaved++;
            } catch (dbErr) {
              dbErrors.push({ message: dbErr.message, data: questionData });
            }
          }
        } catch (bulkErr) {
            dbErrors.push({message: 'Bulk creation error: ' + bulkErr.message});
        }

        if (dbErrors.length > 0 && successfullySaved === 0) {
            return res.status(500).json({
                message: 'Database import failed for all processed questions.',
                csvValidationErrors: errors,
                dbErrors: dbErrors,
                warnings: warnings,
                rowsProcessed: rowCount,
                successfullySaved: successfullySaved
            });
        }

        res.status(201).json({
          message: 'CSV processed. Check status for details.',
          successfullySaved: successfullySaved,
          totalCsvRowsProcessed: rowCount,
          csvValidationErrors: errors,
          databaseSaveErrors: dbErrors,
          warnings: warnings,
        });
      })
      .on('error', (streamError) => {
        if (!res.headersSent) {
            res.status(500).json({ message: 'Error processing CSV stream: ' + streamError.message });
        }
      });
  });
};

// New function to list questions for admin
exports.listAdminQuestions = async (req, res) => {
  const { page = 1, limit = 10, subject, year, type, sort_by = 'createdAt', order = 'DESC' } = req.query;

  const offset = (page - 1) * limit;
  const whereClause = {};

  if (subject) whereClause.subject = { [Op.iLike]: `%${subject}%` }; // Case-insensitive search
  if (year) whereClause.year = year;
  if (type) whereClause.type = type;

  try {
    const { count, rows } = await BECEQuestion.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sort_by, order.toUpperCase()]],
    });

    res.json({
      totalQuestions: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      questions: rows,
    });
  } catch (error) {
    console.error('Error fetching questions for admin:', error);
    res.status(500).json({ message: 'Error fetching questions.', error: error.message });
  }
};
