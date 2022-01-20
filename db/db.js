const mysql = require('mysql2');
// Connect to database
const db = mysql.createConnection(
  {
    host: '127.0.0.1',
    user: 'root',
    password: 'myrootsql',
    database: 'company_employees_db'
  },
  console.log(`Connected to the company_employees_db database.`)
);

module.exports = db