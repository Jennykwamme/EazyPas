
const express = require('express');
const { port } = require('./config/config'); // Assuming this path is correct from previous setup
const { connectDB, sequelize } = require('./config/database'); // Assuming this path

// Import routes
const authRoutes = require('./routes/authRoutes');
const questionRoutes = require('./routes/questionRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Import admin routes

// Connect to database
connectDB();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/admin', adminRoutes); // Mount admin routes

// Basic Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const APP_PORT = port || 3000;

// Sync database models and start server
const startServer = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');

    app.listen(APP_PORT, () => {
      console.log(`Server running on port ${APP_PORT}`);
    });
  } catch (error) {
    console.error('Failed to sync database or start server:', error);
    process.exit(1);
  }
};

startServer();
