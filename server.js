const express = require('express');
const { port } = require('./config/config');
const { connectDB, sequelize } = require('./config/database'); // Import sequelize for syncing
const authRoutes = require('./routes/authRoutes');
const questionRoutes = require('./routes/questionRoutes');

// Connect to database
connectDB();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);

// Basic Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const APP_PORT = port || 3000;

// Sync database models and start server
const startServer = async () => {
  try {
    // You can choose to sync specific models or all of them.
    // 'alter: true' tries to update tables to match model definitions.
    // 'force: true' would drop tables first - use with caution.
    await sequelize.sync({ alter: true });
    console.log("All models were synchronized successfully.");

    app.listen(APP_PORT, () => {
      console.log(`Server running on port ${APP_PORT}`);
    });
  } catch (error) {
    console.error('Failed to sync database or start server:', error);
    process.exit(1);
  }
};

startServer();
