DROP DATABASE IF EXISTS company_employees_db;
CREATE DATABASE company_employees_db;
use company_employees_db;
CREATE TABLE departments (
  id INT NOT NULL PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);
CREATE TABLE role (
  id INT NOT NULL PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  department_id INT,
  FOREIGN KEY (department_id)
  REFERENCES departments(id)
);

CREATE TABLE employees (
  id INT NOT NULL PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  FOREIGN KEY (role_id)
  REFERENCES role(id)
    -- FOREIGN KEY (manager_id)
    -- REFERENCES employees(id)
);
