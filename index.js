const inquirer = require("inquirer");
const db = require("./db/db");

const startQ = () => {
  console.log(`
  Welcome to Employee Tracker
  `);
  inquirer
    .prompt([
      {
        type: "list",
        name: "startQ",
        message: "Select an option",
        choices: [
          "View ALL Employees",
          "View Departments",
          "View Roles",
          "Add Employee",
          "Add Department",
          "Add Role",
          "Update Employee Role",
          "Update Employee Manager",
          "View By Manager",
          "View By Department",
          "Delete Employee",
          "Delete Role",
          "Delete Department",
          "View Department Budget",
          "Exit",
        ],
      },
    ])
    .then((answers) => {
      // Use user feedback for... whatever!!
      switch (answers.startQ) {
        case "View Departments":
          viewDepartment();
          break;
        case `View ALL Employees`:
          viewEmployees();
          break;
        case `View Roles`:
          viewRoles();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Add Role":
          addRole();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        case "Update Employee Manager":
          updateEmployeeManager();
          break;
        case "View By Manager":
          viewByManager();
          break;
        case "View By Department":
          viewByDepartment();
          break;
        case "Delete Employee":
          deleteEmployee();
          break;
        case "Delete Role":
          deleteRole();
          break;
        case "Delete Department":
          deleteDepartment();
          break;
        case "View Department Budget":
          departmentBudget();
          break;
        default:
          console.log("Goodbye");
      }
    })
    .catch((error) => console.log(error));
};
// VIEW TABLES
const viewDepartment = () => {
  console.log("Viewing all departments");
  db.query(`SELECT id AS ID,name as Name FROM departments;`, (err, result) => {
    console.table(result);
    startQ();
  });
};
const viewRoles = () => {
  console.log("Viewing all Roles");
  db.query(
    `
  SELECT 
  role.id as ID,
  role.name as Title,
  role.salary as Salary ,
  departments.name AS Department
  FROM role
  LEFT JOIN departments ON role.department_id = departments.id;`,
    (err, result) => {
      console.table(result);
      startQ();
    }
  );
};
const viewEmployees = () => {
  console.log("Viewing all Employees");
  db.query(
    `
  SELECT 
  employees.id AS ID,
  employees.first_name AS FirstName,
  employees.last_name AS LastName,
  employees.manager AS Manager,
  role.name AS Role, 
  role.salary AS Salary,
  departments.name AS Department
  FROM employees
  LEFT JOIN role ON employees.role_id = role.id
  LEFT JOIN departments ON role.department_id = departments.id
  `,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.table(result);
        startQ();
      }
    }
  );
};
// ADD TO TABLES
const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "deptName",
        message: "Enter a new department name",
        validate: (input) => {
          if (input) {
            return true;
          } else {
            console.log("Please enter a valad name");
            return false;
          }
        },
      },
    ])
    .then((answers) => {
      const newDept = answers.deptName;
      console.log(`Updating Departments`);
      const sql = `INSERT INTO departments (name) VALUES (?)`;
      const params = [newDept];
      db.query(sql, params, function (err, res) {
        if (err) {
          console.log(err);
        }
        console.log(`
         Successfully added Department
        `);
      });
      startQ();
    });
};
const addRole = () => {
  db.promise()
    .query("SELECT departments.name, departments.id FROM departments")
    .then(([rows]) => {
      // console.log(rows);
      let depts = rows.map(({ name, id }) => ({
        name: name,
        value: id,
      }));
      return inquirer
        .prompt([
          {
            type: "input",
            name: "roleName",
            message: "Enter a new role name",
            validate: (input) => {
              if (input) {
                return true;
              } else {
                console.log("Please enter a valad name");
                return false;
              }
            },
          },
          {
            type: "input",
            name: "roleSalary",
            message: "Enter roles salary",
            validate: (input) => {
              if (input) {
                return true;
              } else {
                console.log("Please enter a valad name");
                return false;
              }
            },
          },
          {
            type: "list",
            name: "roleDpt",
            message: "Select department",
            choices: depts,
          },
        ])
        .then(({ roleName, roleSalary, roleDpt }) => {
          console.log(roleDpt);
          console.log("updating Roles");
          const sql = `INSERT INTO role (name,salary,department_id) VALUES (?,?,?)`;
          const params = [roleName, roleSalary, roleDpt];
          console.log(params);
          db.query(sql, params, function (err, res) {
            if (err) {
              console.log(err);
            }
            console.log(roleDpt);
            console.log(`
            Successfully added Role
            `);
          });
          startQ();
        });
    });
};
const addEmployee = () => {
  db.promise()
    .query(
      `
SELECT employees.first_name, employees.id, role.id, role.name 
FROM employees
LEFT JOIN role ON employees.role_id = role.id
`
    )
    .then(([rows]) => {
      let employees = rows.map(({ first_name }) => ({
        name: first_name,
        value: first_name,
      }));
      let roles = rows.map(({ id, name }) => ({
        name: name,
        value: id,
      }));
      return inquirer
        .prompt([
          {
            type: "input",
            name: "firstName",
            message: "Provide employee first name",
            validate: (firstNameInput) => {
              if (firstNameInput) {
                return true;
              } else {
                console.log("Please enter valad first name");
                return false;
              }
            },
          },
          {
            type: "input",
            name: "lastName",
            message: "Provide employee last name",
            validate: (lastNameInput) => {
              if (lastNameInput) {
                return true;
              } else {
                console.log("Please enter valad last name");
              }
            },
          },
          {
            type: "list",
            name: "roleSelect",
            message: "Provide select a ROLE",
            choices: roles,
          },
          {
            type: "list",
            name: "managerSelect",
            message: "Provide select the manager of this employee",
            choices: employees,
          },
        ])
        .then(({ firstName, lastName, managerSelect, roleSelect }) => {
          console.log("updating employees");
          const sql = `INSERT INTO employees (first_name, last_name, manager, role_id) VALUES (?, ?, ?, ?)`;
          const params = [firstName, lastName, managerSelect, roleSelect];
          db.query(sql, params, function (err, res) {
            if (err) {
              console.log(err);
            }
            console.log(`
            Successfully added employee
            `);
          });
          startQ();
        });
    });
};
// UPDATE TABLES
const updateEmployeeRole = () => {
  db.promise()
    .query(
      `
  SELECT employees.first_name, employees.id, role.id, role.name 
  FROM employees
  LEFT JOIN role ON employees.role_id = role.id
  `
    )
    .then(([rows]) => {
      
      let employees = rows.map(({ id, first_name }) => ({
        name: first_name,
        value: id,
      }));
      let roles = rows.map(({ id, name }) => ({
        name: name,
        value: id,
      }));
      return inquirer
        .prompt([
          {
            type: "list",
            name: "employeeList",
            message: "Select an Employee",
            choices: employees,
          },
          {
            type: "list",
            name: "roleList",
            message: "Select Role",
            choices: roles,
          },
        ])
        .then(({ employeeList, roleList }) => {
          const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
          const params = [roleList, employeeList];
          db.query(sql, params, function (err, res) {
            if (err) {
              console.log(err);
            }
            console.log(`
            Successfully updated employee
            `);
          });
          startQ();
        });
    });
};
const updateEmployeeManager = () => {
  db.promise()
    .query(
      `
  SELECT employees.first_name,employees.last_name, employees.id 
  FROM employees
  `
    )
    .then(([rows]) => {
      let employees = rows.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      }));
      let employees2 = rows.map(({ first_name }) => ({
        name: first_name,
        value: first_name,
      }));

      return inquirer
        .prompt([
          {
            type: "list",
            name: "employeeList",
            message: "Select an employee",
            choices: employees,
          },
          {
            type: "list",
            name: "managerList",
            message: "Select manager",
            choices: employees2,
          },
        ])
        .then(({ employeeList, managerList }) => {
          const sql = `UPDATE employees SET manager = ? WHERE id = ?`;
          const params = [managerList, employeeList];
          db.query(sql, params, function (err, res) {
            if (err) {
              console.log(err);
            }
            console.log(`
            Successfully updated employee
            `);
          });
          startQ();
        });
    });
};
// View BY
const viewByManager = () => {
  db.promise()
    .query(
      `
  SELECT employees.first_name,employees.last_name, employees.id 
  FROM employees
  `
    )
    .then(([rows]) => {
      let employees = rows.map(({ first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: first_name,
      }));

      return inquirer
        .prompt([
          {
            type: "list",
            name: "employeeList",
            message: "Select a manager",
            choices: employees,
          },
        ])
        .then(({ employeeList }) => {
          const sql = `SELECT first_name,employees.last_name FROM employees WHERE manager = ?`;
          db.query(sql, employeeList, function (err, res) {
            if (err) {
              console.log(err);
            }
            console.log(`
            Viewing by the manager ${employeeList}`);
            console.table(res);
          });
          startQ();
        });
    });
};
const viewByDepartment = () => {
  db.promise()
    .query(
      `
  SELECT role.id, role.name 
  FROM role
  `
    )
    .then(([rows]) => {
      let roles = rows.map(({ id, name }) => ({
        name: name,
        value: id,
      }));

      return inquirer
        .prompt([
          {
            type: "list",
            name: "roleList",
            message: "Select a department",
            choices: roles,
          },
        ])
        .then(({ roleList }) => {
          const sql = `SELECT first_name,employees.last_name FROM employees WHERE role_id = ?`;
          db.query(sql, roleList, function (err, res) {
            if (err) {
              console.log(err);
            }
            console.log(`
            Viewing by the department`);
            console.table(res);
          });
          startQ();
        });
    });
};
// Delete Queries
const deleteEmployee = () => {
  db.promise()
    .query(
      `
SELECT first_name, last_name
FROM employees
`
    )
    .then(([rows]) => {
      let employees = rows.map(({ first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: [first_name, last_name],
      }));
      return inquirer
        .prompt([
          {
            type: "list",
            name: "employeeSelect",
            message: "What employee would you like to delete?",
            choices: employees,
          },
        ])
        .then(({ employeeSelect }) => {
          console.log(employeeSelect);
          console.log("updating employees");
          const sql = `
        DELETE
        FROM employees
        WHERE first_name = ? AND last_name = ?
        `;
          db.query(sql, employeeSelect, function (err, res) {
            if (err) {
              console.log(err);
            }
            console.log(`
          Successfully removed Employee
          `);
          });
          startQ();
        });
    });
};
const deleteRole = () => {
  db.promise()
    .query(
      `
SELECT id, name
FROM role
`
    )
    .then(([rows]) => {
      let roles = rows.map(({ id, name }) => ({
        name: name,
        value: id,
      }));
      return inquirer
        .prompt([
          {
            type: "list",
            name: "roleSelect",
            message: "What role would you like to delete?",
            choices: roles,
          },
        ])
        .then(({ roleSelect }) => {
          console.log("updating roles");
          const sql = `
        DELETE
        FROM role
        WHERE id = ?
        `;
          db.query(sql, roleSelect, function (err, res) {
            if (err) {
              console.log(err);
            }
            console.log(`Successfully removed Role`);
          });
          startQ();
        });
    });
};
const deleteDepartment = () => {
  db.promise()
    .query(
      `
SELECT id, name
FROM departments
`
    )
    .then(([rows]) => {
      let departents = rows.map(({ id, name }) => ({
        name: name,
        value: id,
      }));
      return inquirer
        .prompt([
          {
            type: "list",
            name: "departentSelect",
            message: "What role would you like to delete?",
            choices: departents,
          },
        ])
        .then(({ departentSelect }) => {
          console.log("updating departments");
          const sql = `
        DELETE
        FROM departments
        WHERE id = ?
        `;
          db.query(sql, departentSelect, function (err, res) {
            if (err) {
              console.log(err);
            }
            console.log(`
          Successfully removed Department
          `);
          });
          startQ();
        });
    });
};
const departmentBudget = () => {
  db.promise()
    .query(
      `
SELECT id, name
FROM departments
`
    )
    .then(([rows]) => {
      let departents = rows.map(({ id, name }) => ({
        name: name,
        value: id,
      }));
      return inquirer
        .prompt([
          {
            type: "list",
            name: "departentSelect",
            message: "What role would you like to delete?",
            choices: departents,
          },
        ])
        .then(({ departentSelect }) => {
          const sql = `
        SELECT 
  SUM(role.salary) AS Salary
  FROM employees
  LEFT JOIN role ON employees.role_id = role.id
        WHERE role.department_id = ?
        `;
          db.query(sql, departentSelect, function (err, res) {
            if (err) {
              console.log(err);
            }
            console.log(`
            Viewing Department's Budget
            `);
            console.table(res);
          });
          startQ();
        });
    });
};

startQ();
module.exports = { startQ };
