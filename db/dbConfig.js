require('dotenv').config();
const mysql2 = require('mysql2');

const dbConnection = mysql2.createPool({
  host: process.env.DB_HOST,     
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT || 3306,
  connectionLimit: 10
});

module.exports = dbConnection.promise();