const express = require('express');
const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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
const getDepartments = ()=>{
  // Query Departents
  db.query('SELECT * FROM departments', function (err, results) {
  console.log(results);
});
}
// getDepartments()

// // Query Roles
// db.query('SELECT * FROM role', function (err, results) {
//   console.log(results);
// });
// // Query employees
// db.query('SELECT * FROM employees', function (err, results) {
//   console.log(results);
// });

// // Default response for any other request (Not Found)
// app.use((req, res) => {
//   res.status(404).end();
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
module.exports = {
  getDepartments
}