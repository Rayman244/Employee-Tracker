INSERT INTO departments (name)
VALUES
    ('Sales'),
    ('Media'),
    ('Finance'),
    ('Fabrication');

INSERT INTO role (name,salary, department_id)
VALUES
    ('Salesperson',25000, 1),
    ('Social Media',50000,2),
    ('Lawyer',100000,3),
    ('Welder',75000,4);

INSERT INTO employees (first_name,last_name, role_id)
VALUES
    ('Kevin','spades',1),
    ('El','Woods',3),
    ('Mike','Ross',4),
    ('Ray','Hewitt',2),
    ("John",'Jones',3);