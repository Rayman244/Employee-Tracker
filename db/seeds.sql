INSERT INTO departments (id,name)
VALUES
    (001,'Sales'),
    (002,'Media'),
    (003,'Finance'),
    (004,'Fabrication');

INSERT INTO role (id,name, department_id)
VALUES
    (001,'Salesperson',001),
    (002,'Social Media',002),
    (003,'Lawyer',003),
    (004,'Welder',004);

INSERT INTO employees (id, first_name,last_name, role_id)
VALUES
    (001,'Kevin','spades',001),
    (002,'El','Woods',003),
    (003,'Mike','Ross',004),
    (004,'Ray','Hewitt',002),
    (005,"John",'Jones',003);