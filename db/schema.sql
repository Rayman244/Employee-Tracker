DROP DATABASE IF EXISTS company_employees_db;
CREATE DATABASE company_employees_db;
use company_employees_db;
CREATE TABLE departments (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL
);
CREATE TABLE role (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY (department_id)
  REFERENCES departments(id)
  ON DELETE SET NULL
);

CREATE TABLE employees (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager VARCHAR(30),
  FOREIGN KEY (role_id)
  REFERENCES role(id)
  ON DELETE SET NULL
);
