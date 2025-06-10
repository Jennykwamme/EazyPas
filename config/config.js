require('dotenv').config();

module.exports = {
  databaseUrl: process.env.DB_URL,
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 3000,
};
