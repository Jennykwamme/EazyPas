const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BECEQuestion = sequelize.define('BECEQuestion', {
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('objective', 'theory'),
    allowNull: false,
  },
  questionText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  options: { // For objective questions
    type: DataTypes.JSONB, // Stores an array of strings
    allowNull: true,
  },
  correctAnswer: { // For objective, this could be an index or the answer text. For theory, it's the model answer.
    type: DataTypes.TEXT,
    allowNull: false,
  },
  solution: { // Detailed explanation or steps for the solution
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = BECEQuestion;
