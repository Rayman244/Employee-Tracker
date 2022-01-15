DROP TABLE IF EXISTS company_employees_db;
CREATE DATABASE company_employees_db;
use register_db;

CREATE TABLE department (
    id INT NOT NULL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
);
CREATE TABLE role (
    id INT NOT NULL PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
);
CREATE TABLE employee (
    id INT NOT NULL PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    FOREIGN KEY (role_id)
    REFERENCES role(id),
    FOREIGN KEY (manager_id)
    REFERENCES employee(id)

)