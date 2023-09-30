INSERT INTO Departments (Department)
VALUES ("Sales"), 
        ("Finance"), 
        ("HR"), 
        ("Management");

INSERT INTO Roles (Job_Title, Department_ID, Salary)
VALUES ("Inside Sales Representative", 1, 50000),
        ("Outside Sales Representative", 1, 40000),
        ("Budget Specialist", 2, 60000),
        ("Regional Manager", 4, 80000),
        ("HR Generalist", 3, 50000),
        ("Office Manager", 4, 70000),
        ("Finance Associate", 2, 50000);

INSERT INTO Employees (First_Name, Last_Name, Role_ID, Manager_ID)
Values ("John", "Doe", 4, NULL),
        ("Justin", "Scott", 1, 1),
        ("Xander", "Nelson", 2, 1),
        ("Raegan", "Berry", 2, 1),
        ("Jane", "Doe", 6, NULL),
        ("Carson", "Bennet", 3, 2),
        ("Paul", "Klein", 7, 2),
        ("Hudson", "Davis", 5, 2),
        ("Caroline", "Waters", 1, 1);

use jz_employee_db;

select * from Departments;
select * from Roles;
select * from Employees;