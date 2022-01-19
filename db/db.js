const mysql = require('mysql2');
// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'myrootsql',
    database: 'company_employees_db'
  },
  console.log(`Connected to the company_employees_db database.`)
);

module.exports = db