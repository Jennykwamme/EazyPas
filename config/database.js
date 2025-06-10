const { Sequelize } = require('sequelize');
const { databaseUrl } = require('./config');

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false, // Set to console.log to see SQL queries
  dialectOptions: {
    // Add SSL options here if your PostgreSQL server requires SSL
    // ssl: {
    //   require: true,
    //   rejectUnauthorized: false // Note: Setting to false is insecure for production
    // }
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected using Sequelize...');
    // Sync all models (optional, can be done elsewhere or with migrations)
    // await sequelize.sync({ alter: true }); // Use { force: true } to drop and recreate tables
    // console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = { sequelize, connectDB };
