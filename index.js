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
          "View by Manager",
          "Add Employee",
          "Add Department",
          "Add Role",
          "Update Role",
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
      }
    })
    .catch((error) => console.log(error));
};

const viewDepartment = () => {
  console.log("Viewing all departments");
  db.query(`SELECt * FROM departments;`, (err, result) => {
    console.table(result);
    startQ();
  });
};
const viewRoles = () => {
  console.log("Viewing all Roles");
  db.query(`SELECt * FROM role;`, (err, result) => {
    console.table(result);
    startQ();
  });
};
const viewEmployees = () => {
  console.log("Viewing all Employees");
  db.query(`SELECt * FROM employees;`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.table(result);
      startQ();
    }
  });
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

      console.log("updating Department");
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
    
      let depts = rows.map(({ name, id }) => ({
        name: name,
        id: id,
      }));
      console.log(depts);
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
            console.log("updating Roles");
          const sql = `INSERT INTO role (name,salary,department_id) VALUES (?,?,?)`;
          const params = [roleName, roleSalary, roleDpt.id];
          db.query(sql, params, function (err, res) {
            if (err) {
              console.log(err);
            }
            console.log(roleDpt);
            console.log(`
        ================
          SUCCESSFULLY added Role
        =============================`);
          });
          startQ();
        }
        );
    });
};
const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "empName",
        message: "Enter a new employees name",
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
    .then((storeDept) => {
      const newDept = storeDept.deptName;

      console.log("updating Department");
      const sql = `INSERT INTO departments (name) VALUES (?)`;
      const params = [newDept];
      db.query(sql, params, function (err, res) {
        if (err) {
          console.log(err);
        }
        console.log(`
        ================
          SUCCESSFULLY added Department
        =============================`);
      });
      startQ();
    });
};
// const addEmployee =() =>{
//   db.query(``,(err,results)=>{
//     if(err){
//       console.log(err);
//     }else{
//       console.table(results);
//       startQ()
//     }
//   })
// }
startQ();
