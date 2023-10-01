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

INSERT INTO Employees (First_Name, Last_Name, Role_ID, Department_ID, Manager_Name)
Values ("John", "Doe", 4, 4, "None"),
        ("Justin", "Scott", 1, 1, "John Doe"),
        ("Xander", "Nelson", 2, 1, "John Doe"),
        ("Raegan", "Berry", 2, 1, "John Doe"),
        ("Jane", "Doe", 6, 4, "None"),
        ("Carson", "Bennet", 3, 2, "Jane Doe"),
        ("Paul", "Klein", 7, 2, "Jane Doe"),
        ("Hudson", "Davis", 5, 3, "Jane Doe"),
        ("Caroline", "Waters", 1, 1, "John Doe");

use jz_employee_db;

select * from Departments;
select * from Roles;
select * from Employees;