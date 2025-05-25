require('dotenv').config()
const mysql2 = require('mysql2');

const dbConnection=mysql2.createPool({
user: process.env.DB_USER,
database: process.env.DB_DATABASE,
host: process.env.DB_HOST,
password: process.env.DB_PASSWORD,

connectionLimit: 10
});
module.exports = dbConnection.promise();