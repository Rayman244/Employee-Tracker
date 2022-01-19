const inquirer = require("inquirer");
const db = require("./db/db");

const startQ = () => {
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
      }
    })
    .catch((error) => console.log(error));
};

const viewDepartment = () => {
  console.log("Viewing all departments");
  db.query(`SELECT id AS ID,name as Name FROM departments;`, (err, result) => {
    console.table(result);
    startQ();
  });
};
const viewRoles = () => {
  console.log("Viewing all Roles");
  db.query(`
  SELECT 
  role.id as ID,
  role.name as Title,
  role.salary as Salary ,
  departments.name AS Department
  FROM role
  LEFT JOIN departments ON role.department_id = departments.id;`, (err, result) => {
    console.table(result);
    startQ();
  });
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
        console.log(`Department added`);
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
        id: id,
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
          db.query(sql, params, function (err, res) {
            if (err) {
              console.log(err);
            }
            console.log(roleDpt);
            console.log(`
                           SUCCESSFULLY added Role`);
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
    let employees = rows.map(({first_name, lastName}) => ({
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
            console.log(`Successfully added employee`);
          });
          startQ();
        });
    });
}
const updateEmployeeRole = () => {
  db
    .promise()
    .query(
      `
  SELECT employees.first_name, employees.id, role.id, role.name 
  FROM employees
  LEFT JOIN role ON employees.role_id = role.id
  `
    )
    .then(([rows]) => {
      let employees = rows.map(({first_name, id }) => ({
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
        .then(({ employeelist, rolelist }) => {
          const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
          const params = [employeelist, rolelist];
          db.query(sql, params, function (err, res) {
            if (err) {
              console.log(err);
            }
            console.log(`Successfully updated employee`);
          });
          startQ();
        });
    });
}

startQ();
